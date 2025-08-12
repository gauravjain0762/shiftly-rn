import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {ActivitiesCard, BackHeader, LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {AppStyles} from '../../../theme/appStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import NotificationCard from '../../../component/employe/NotificationCard';
import {IMAGES} from '../../../assets/Images';
import {navigationRef} from '../../../navigation/RootContainer';
import {SCREEN_NAMES, SCREENS} from '../../../navigation/screenNames';
import CustomPopup from '../../../component/common/CustomPopup';
import {
  errorToast,
  navigateTo,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import {logouts, setAuthToken} from '../../../features/authSlice';
import {useDispatch} from 'react-redux';
import {clearAsync} from '../../../utils/asyncStorage';
import {
  useEmployeeDeleteAccountMutation,
  useEmployeeLogoutMutation,
} from '../../../api/authApi';
import {persistor} from '../../../store';

const AccountScreen = () => {
  const dispatch = useDispatch();
  const [empLogout] = useEmployeeLogoutMutation({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [employeeDeleteAccount] = useEmployeeDeleteAccountMutation({});
  const [deletepopupVisible, setdeletePopupVisible] = useState(false);

  const settingsData = [
    {
      section: 'Personal Information',
      items: [
        {label: 'Account Info', icon: IMAGES.account},
        {
          label: 'Profile',
          icon: IMAGES.Profile,
          onPress: () => {
            // navigateTo(SCREENS.EmpProfile);
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
          onPress: () => {
            navigateTo(SCREENS.EmpChangePassword);
          },
        },
        {label: 'Security', icon: IMAGES.Security},
      ],
    },
    {
      section: 'General',
      items: [
        {label: 'Language', icon: IMAGES.Language},
        {label: 'Notifications', icon: IMAGES.Notifications},
      ],
    },
    {
      section: 'About',
      items: [
        {label: 'Privacy Policy', icon: IMAGES.PrivacyPolicy},
        {label: 'Terms of Use', icon: IMAGES.TermsUse},
        {label: 'Help & Support', icon: IMAGES.HelpSupport},
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

  const handleLogout = async () => {
    const res = await empLogout({}).unwrap();
    if (res.status) {
      successToast(res.message);
      resetNavigation(SCREENS.SelectRollScreen);
      dispatch(setAuthToken(''));
      await clearAsync();
      setPopupVisible(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await employeeDeleteAccount({}).unwrap();
      if (res?.status) {
        successToast(res?.message);
        clearAsync();
        dispatch({type: 'RESET_STORE'});
        resetNavigation(SCREEN_NAMES.WelcomeScreen);
        dispatch(logouts());
        persistor.purge();
      }
    } catch (error) {
      console.error('Error deleting account: ', error);
      errorToast('Something went wrong');
    }
  };

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <View style={styles.topConrainer}>
        <BackHeader
          containerStyle={styles.header}
          isRight={true}
          title={'Account'}
          RightIcon={
            <Image
              source={{uri: 'https://randomuser.me/api/portraits/women/44.jpg'}}
              style={styles.avatar}
            />
          }
        />
      </View>
      {settingsData.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          {section.items.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                item?.onPress && item?.onPress();
              }}
              style={styles.row}>
              {item.label == 'Logout' ? (
                <Image
                  source={item.icon}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    marginRight: 14,
                    tintColor: 'red',
                    marginLeft: 5,
                  }}
                />
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
                />
              )}
              {/* <Icon name={item.icon} size={20} color={colors.lightText} style={styles.icon} /> */}
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
                  style={{width: 12, height: 12, resizeMode: 'contain'}}
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
        onPressRight={async () => {
          handleLogout();
        }}
      />
      <CustomPopup
        onCloseModal={() => setdeletePopupVisible(false)}
        isVisible={deletepopupVisible}
        title={'Are you sure you want to delete your account?'}
        leftButton={'Cancel'}
        rightButton={'Delete'}
        onPressRight={() => {
          handleDeleteAccount();
          setdeletePopupVisible(false);
        }}
      />
    </LinearContainer>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: wp(51),
    height: wp(51),
    borderRadius: 51,
  },
  tab: {
    backgroundColor: colors.white,
    paddingVertical: hp(14),
    borderRadius: 10,
    alignItems: 'center',
    marginTop: hp(22),
  },
  activeTabText: {
    ...commonFontStyle(700, 20, colors._0B3B75),
  },
  topConrainer: {
    paddingHorizontal: wp(25),
    marginBottom: hp(28),
    // borderBottomWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  header: {
    // paddingLeft: wp(13),
    marginBottom: hp(1),
  },

  scrollContainer: {
    // paddingVertical: hp(22),
    paddingHorizontal: wp(25),
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: wp(25),
  },
  sectionTitle: {
    marginBottom: 29,
    ...commonFontStyle(600, 20, '#F4E2B8'),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 21,
  },
  icon: {
    marginRight: 12,
    width: 24,
  },
  label: {
    flex: 1,
    ...commonFontStyle(400, 18, '#D6D6D6'),
  },
  chevron: {
    marginLeft: 8,
  },
});
