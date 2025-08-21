import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {BackHeader, LinearContainer} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import CustomPopup from '../../../component/common/CustomPopup';
import {SCREEN_NAMES, SCREENS} from '../../../navigation/screenNames';
import {
  useCompanyDeleteAccountMutation,
  useCompanyLogoutMutation,
} from '../../../api/authApi';
import {clearAsync} from '../../../utils/asyncStorage';
import {
  errorToast,
  navigateTo,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import {logouts} from '../../../features/authSlice';
import {persistor, resetStore, RootState} from '../../../store';
import {useAppDispatch} from '../../../redux/hooks';
import {colors} from '../../../theme/colors';
import {useTranslation} from 'react-i18next';
import LanguageModal from '../../../component/common/LanguageModel';
import {useSelector} from 'react-redux';

const CoProfile = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [popupVisible, setPopupVisible] = useState(false);
  const [deletepopupVisible, setdeletePopupVisible] = useState(false);
  const [companyLogout] = useCompanyLogoutMutation();
  const [companyDeleteAccount] = useCompanyDeleteAccountMutation({});
  const [isLanguageModalVisible, setLanguageModalVisible] =
    useState<boolean>(false);
  const {userInfo} = useSelector((state: RootState) => state.auth);

  const settingsData = [
    {
      section: 'Personal Information',
      items: [
        {
          label: 'Account Info',
          icon: IMAGES.account,
          onPress: () => navigateTo(SCREENS.CompanyProfile),
        },
        {
          label: 'Profile',
          icon: IMAGES.Profile,
          onPress: () => {
            navigateTo(SCREEN_NAMES.CoMyProfile);
          },
        },
      ],
    },
    {
      section: 'Security',
      items: [
        {
          label: 'Change Password',
          icon: IMAGES.ChangePassword,
          onPress: () => navigateTo(SCREENS.ChangePassword),
        },
        {label: 'Security', icon: IMAGES.Security},
      ],
    },
    {
      section: 'General',
      items: [
        {
          label: 'Language',
          icon: IMAGES.Language,
          onPress: () => setLanguageModalVisible(true),
        },
        {label: 'Notifications', icon: IMAGES.Notifications},
      ],
    },
    {
      section: 'About',
      items: [
        {
          label: 'Privacy Policy',
          icon: IMAGES.PrivacyPolicy,
          onPress: () => {
            navigateTo(SCREENS.WebviewScreen, {link: ''});
          },
        },
        {
          label: 'Terms of Use',
          icon: IMAGES.TermsUse,
          onPress: () => {
            navigateTo(SCREENS.WebviewScreen, {link: ''});
          },
        },
        {
          label: 'Help & Support',
          icon: IMAGES.HelpSupport,
          onPress: () => {
            navigateTo(SCREENS.WebviewScreen, {link: ''});
          },
        },
        {
          label: 'Logout',
          icon: IMAGES.logout,
          onPress: () => {
            setPopupVisible(true);
          },
        },
        {
          label: 'Delete Account',
          icon: IMAGES.deleteAccount,
          onPress: () => setdeletePopupVisible(true),
        },
      ],
    },
  ];
  const signOutIfLoggedIn = async () => {
    //   try {
    //     const currentUser = auth().currentUser;
    //     if (currentUser) {
    //       const isGoogleSignedIn = GoogleSignin.getCurrentUser();
    //       if (isGoogleSignedIn) {
    //         await GoogleSignin.revokeAccess();
    //         await GoogleSignin.signOut();
    //       }
    //       await auth().signOut();
    //     }
    //   } catch (error) {
    //     console.error('Error signing out: ', error);
    //   }
  };
  const onLogout = async () => {
    let response = null;
    response = await companyLogout({}).unwrap();
    if (response?.status) {
      clearAsync();
      resetNavigation(SCREEN_NAMES.SelectRollScreen);
      dispatch(logouts());
      resetStore();
      signOutIfLoggedIn();
    } else {
      errorToast(response?.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await companyDeleteAccount({}).unwrap();
      if (res?.status) {
        successToast(res?.message);
        clearAsync();
        resetNavigation(SCREEN_NAMES.WelcomeScreen);
        dispatch(logouts());
        resetStore();
        // signOutIfLoggedIn();
      }
    } catch (error) {
      console.error('Error deleting account: ', error);
      errorToast('Something went wrong');
    }
  };

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <BackHeader
          type="company"
          isRight={false}
          title={t('Account')}
          titleStyle={styles.title}
          containerStyle={styles.header}
          RightIcon={
            <View style={{}}>
              <Image
                source={userInfo?.logo ? {uri: userInfo?.logo} : IMAGES.avatar}
                style={{height: hp(51), width: wp(51), borderRadius: hp(51)}}
              />
            </View>
          }
        />
        {settingsData.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section?.section}</Text>
            {section.items.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  item?.onPress && item?.onPress();
                }}
                style={styles.row}>
                {item.label == 'Logout' ? (
                  <Image source={item.icon} style={styles.logout} />
                ) : (
                  <Image
                    source={item.icon}
                    style={{
                      width: 22,
                      height: 22,
                      resizeMode: 'contain',
                      marginRight: 14,
                      tintColor: '#D6D6D6',
                    }}
                    tintColor={colors._555555}
                  />
                )}
                <Text
                  style={[
                    styles.label,
                    item.label == 'Logout' ? {color: 'red'} : {},
                  ]}>
                  {item.label}
                </Text>
                {item.label !== 'Logout' && (
                  <Image
                    source={IMAGES.right_icon}
                    tintColor={colors._555555}
                    style={styles.logo}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <CustomPopup
          onCloseModal={() => setPopupVisible(false)}
          isVisible={popupVisible}
          title={'Are you sure you want to log out?'}
          leftButton={'Cancel'}
          rightButton={'Log Out'}
          onPressRight={() => {
            // navigationRef.navigate(SCREENS.WelcomeScreen);
            onLogout();
            setPopupVisible(false);
          }}
        />
        <CustomPopup
          onCloseModal={() => setdeletePopupVisible(false)}
          isVisible={deletepopupVisible}
          title={'Are you sure you want to delete your account?'}
          leftButton={'Cancel'}
          rightButton={'Delete'}
          onPressRight={() => {
            // navigationRef.navigate(SCREENS.WelcomeScreen);
            handleDeleteAccount();
            setdeletePopupVisible(false);
          }}
        />
        <LanguageModal
          type={'Company'}
          visible={isLanguageModalVisible}
          onClose={() => setLanguageModalVisible(false)}
          onLanguageSelect={() => setLanguageModalVisible(false)}
        />
      </ScrollView>
    </LinearContainer>
  );
};

export default CoProfile;

const styles = StyleSheet.create({
  header: {
    paddingTop: hp(24),
    marginBottom: hp(28),
    paddingHorizontal: wp(35),
  },
  title: {
    right: '22%',
  },
  section: {
    marginBottom: hp(24),
    paddingHorizontal: wp(35),
  },
  sectionTitle: {
    marginBottom: hp(29),
    ...commonFontStyle(600, 20, colors._0B3970),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: hp(21),
  },
  label: {
    flex: 1,
    ...commonFontStyle(400, 18, colors._555555),
  },
  logout: {
    width: wp(18),
    height: hp(18),
    tintColor: 'red',
    marginLeft: wp(5),
    marginRight: wp(14),
    resizeMode: 'contain',
  },
  logo: {
    width: wp(12),
    height: hp(12),
    resizeMode: 'contain',
  },
});
