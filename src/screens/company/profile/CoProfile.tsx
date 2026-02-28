import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { LinearContainer } from '../../../component';
import { IMAGES } from '../../../assets/Images';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import CustomPopup from '../../../component/common/CustomPopup';
import { SCREEN_NAMES, SCREENS } from '../../../navigation/screenNames';
import {
  useCompanyDeleteAccountMutation,
  useCompanyLogoutMutation,
} from '../../../api/authApi';
import { clearAsync } from '../../../utils/asyncStorage';
import {
  errorToast,
  navigateTo,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import { logouts } from '../../../features/authSlice';
import { resetStore, RootState } from '../../../store';
import { useAppDispatch } from '../../../redux/hooks';
import { colors } from '../../../theme/colors';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CustomImage from '../../../component/common/CustomImage';
import { CircleUser, UserRound } from 'lucide-react-native';

const CoProfile = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [popupVisible, setPopupVisible] = useState(false);
  const [deletepopupVisible, setdeletePopupVisible] = useState(false);
  const [companyLogout] = useCompanyLogoutMutation({});
  const [companyDeleteAccount] = useCompanyDeleteAccountMutation({});
  const [isLanguageModalVisible, setLanguageModalVisible] =
    useState<boolean>(false);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const settingsData = [
    {
      section: 'Personal Information',
      items: [
        {
          label: 'Account Info',
          LucideIcon: CircleUser,
          onPress: () => navigateTo(SCREENS.CompanyProfile),
        },
        {
          label: 'Profile',
          LucideIcon: UserRound,
          onPress: () => {
            navigateTo(SCREEN_NAMES.CoMyProfile);
          },
        },
      ],
    },
    // {
    //   section: 'Security',
    //   items: [
    //     {
    //       label: 'Change Password',
    //       icon: IMAGES.ChangePassword,
    //       onPress: () => navigateTo(SCREENS.ChangePassword),
    //     },
    //     {label: 'Security', icon: IMAGES.Security},
    //   ],
    // },
    {
      section: 'General',
      items: [
        // {
        //   label: 'Language',
        //   icon: IMAGES.Language,
        //   onPress: () => setLanguageModalVisible(true),
        // },
        {
          label: 'Notifications',
          icon: IMAGES.Notifications,
          onPress: () => navigateTo(SCREENS.CoNotification),
        },
      ],
    },
    {
      section: 'About',
      items: [
        {
          label: 'Privacy Policy',
          icon: IMAGES.PrivacyPolicy,
          onPress: () => {
            navigateTo(SCREENS.WebviewScreen, {
              link: '',
              title: 'Privacy Policy',
              type: 'company',
            });
          },
        },
        {
          label: 'Terms of Use',
          icon: IMAGES.TermsUse,
          onPress: () => {
            navigateTo(SCREENS.WebviewScreen, {
              link: '',
              title: 'Terms of Use',
              type: 'company',
            });
          },
        },
        {
          label: 'Help & Support',
          icon: IMAGES.HelpSupport,
          onPress: () => {
            navigateTo(SCREENS.WebviewScreen, {
              link: '',
              title: 'Help & Support',
              type: 'company',
            });
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
    try {
      const response = await companyLogout({}).unwrap() as any;
      console.log("🔥 ~ onLogout ~ response:", response);

      if (response?.status) {
        // Clear async storage first
        await clearAsync();

        // Dispatch logout action to clear Redux state
        dispatch(logouts());

        // Reset store and purge persistor (async)
        await resetStore();

        // Sign out from Firebase/Google if logged in (async but no need to await)
        signOutIfLoggedIn().catch(err => {
          console.log('Error signing out from Firebase:', err);
        });

        // Navigate after all cleanup is complete
        resetNavigation(SCREEN_NAMES.SelectRollScreen);
      } else {
        errorToast(response?.message || 'Logout failed');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if API call fails, still perform logout locally
      try {
        await clearAsync();
        dispatch(logouts());
        await resetStore();
        signOutIfLoggedIn().catch(err => {
          console.log('Error signing out from Firebase:', err);
        });
        resetNavigation(SCREEN_NAMES.SelectRollScreen);
      } catch (localError) {
        console.error('Error during local logout:', localError);
        errorToast('An error occurred during logout');
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await companyDeleteAccount({}).unwrap() as any;
      if (res?.status) {
        successToast(res?.message);
        await clearAsync();
        dispatch(logouts());
        await resetStore();
        resetNavigation(SCREEN_NAMES.SelectRollScreen);
      }
    } catch (error) {
      console.error('Error deleting account: ', error);
      errorToast('Something went wrong');
    }
  };

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.sideWrapper} />
          <Text style={styles.headerTitle}>{t('Account')}</Text>
          <View style={styles.rightWrapper}>
            <CustomImage
              uri={userInfo?.logo || undefined}
              source={!userInfo?.logo ? IMAGES.logoText : undefined}
              imageStyle={{ height: '100%', width: '100%' }}
              containerStyle={{
                height: hp(51),
                width: wp(51),
                borderRadius: hp(51),
                overflow: 'hidden',
              }}
              resizeMode="cover"
            />
          </View>
        </View>

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
                ) : (item as any).LucideIcon ? (
                  <View style={styles.iconWrapper}>
                    {(() => {
                      const IconComponent = (item as any).LucideIcon;
                      return (
                        <IconComponent
                          size={22}
                          color={colors._555555}
                        />
                      );
                    })()}
                  </View>
                ) : (
                  <Image
                    source={item.icon}
                    style={styles.iconStyle}
                    tintColor={colors._555555}
                  />
                )}
                <Text
                  style={[
                    styles.label,
                    item.label == 'Logout' ? { color: 'red' } : {},
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
        {/* <LanguageModal
          type={'Company'}
          visible={isLanguageModalVisible}
          onClose={() => setLanguageModalVisible(false)}
          onLanguageSelect={() => setLanguageModalVisible(false)}
        /> */}
      </ScrollView>
    </LinearContainer>
  );
};

export default CoProfile;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp(24),
    marginBottom: hp(28),
    paddingHorizontal: wp(23),
  },
  sideWrapper: {
    width: wp(44),
  },
  headerTitle: {
    flex: 1,
    ...commonFontStyle(600, 22, colors._0B3970),
    textAlign: 'center',
  },
  rightWrapper: {
    width: wp(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: hp(24),
    paddingHorizontal: wp(23),
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
  iconWrapper: {
    marginRight: 14,
  },
  iconStyle: {
    width: 22,
    height: 22,
    marginRight: 14,
    resizeMode: 'contain',
    tintColor: '#D6D6D6',
  },
  loaderContainer: {
    width: wp(51),
    height: hp(51),
    borderRadius: hp(51),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
});
