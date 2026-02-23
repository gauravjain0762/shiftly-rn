import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { BackHeader, LinearContainer } from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../assets/Images';
import { SCREEN_NAMES, SCREENS } from '../../../navigation/screenNames';
import CustomPopup from '../../../component/common/CustomPopup';
import {
  errorToast,
  getInitials,
  hasValidImage,
  navigateTo,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import {
  logouts,
} from '../../../features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { clearAsync } from '../../../utils/asyncStorage';
import {
  useEmployeeDeleteAccountMutation,
  useEmployeeLogoutMutation,
} from '../../../api/authApi';
import { AppDispatch, resetStore, RootState } from '../../../store';
import LanguageModal from '../../../component/common/LanguageModel';
import CustomImage from '../../../component/common/CustomImage';

const AccountScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [empLogout] = useEmployeeLogoutMutation({});
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [employeeDeleteAccount] = useEmployeeDeleteAccountMutation({});
  const [deletepopupVisible, setdeletePopupVisible] = useState<boolean>(false);
  const [isLanguageModalVisible, setLanguageModalVisible] =
    useState<boolean>(false);

  const settingsData = [
    {
      section: 'Personal Information',
      items: [
        {
          label: 'Account Info',
          icon: IMAGES.account,
          onPress: () => {
            navigateTo(SCREENS.ViewProfileScreen);
          },
        },
        {
          label: 'Profile',
          icon: IMAGES.Profile,
          onPress: () => {
            navigateTo(SCREENS.ProfileScreen);
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
        // {label: 'Security', icon: IMAGES.Security},
      ],
    },
    {
      section: 'General',
      items: [
        {
          label: 'Favorite Jobs',
          icon: IMAGES.Jobs_on,
          onPress: () => {
            navigateTo(SCREENS.FavoriteJobList);
          },
        },
        {
          label: 'Notifications',
          icon: IMAGES.Notifications,
          onPress: () => {
            navigateTo(SCREENS.NotificationScreen);
          },
        },
      ],
    },
    // {
    //   section: 'General',
    //   items: [
    //     {
    //       label: 'Language',
    //       icon: IMAGES.Language,
    //       onPress: () => {
    //         setLanguageModalVisible(true);
    //       },
    //     },
    //     {label: 'Notifications', icon: IMAGES.Notifications},
    //   ],
    // },
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
              type: 'employe',
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
              type: 'employe',
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
              type: 'employe',
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

  const handleLogout = async () => {
    const res = await empLogout({}).unwrap() as any;
    console.log("🔥 ~ handleLogout ~ res:", res)
    if (res.status) {
      successToast(res.message);
      dispatch(logouts());
      await clearAsync();
      await resetStore();
      resetNavigation(SCREENS.SelectRollScreen);
      setPopupVisible(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await employeeDeleteAccount({}).unwrap() as any;
      if (res?.status) {
        successToast(res?.message);
        dispatch(logouts());
        await clearAsync();
        await resetStore();
        resetNavigation(SCREEN_NAMES.SelectRollScreen);
      }
    } catch (error) {
      console.error('Error deleting account: ', error);
      errorToast('Something went wrong');
    }
  };

  return (
    <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
      <View style={styles.topConrainer}>
        <BackHeader
          containerStyle={styles.header}
          isRight={true}
          title={'Account'}
          titleStyle={styles.headerTitle}
          RightIcon={
            hasValidImage(userInfo?.picture) ? (
              <CustomImage
                source={{ uri: userInfo?.picture }}
                imageStyle={{ height: '100%', width: '100%' }}
                containerStyle={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {getInitials(userInfo?.name)}
                </Text>
              </View>
            )
          }
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
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
                      tintColor: colors._0B3970,
                    }}
                  />
                )}
                {/* <Icon name={item.icon} size={20} color={colors.lightText} style={styles.icon} /> */}
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
                    style={{
                      width: 12,
                      height: 12,
                      resizeMode: 'contain',
                      tintColor: colors._0B3970,
                    }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <CustomPopup
          type="Employee"
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

        {/* <LanguageModal
          type={'Employee'}
          visible={isLanguageModalVisible}
          onClose={() => setLanguageModalVisible(false)}
          onLanguageSelect={() => setLanguageModalVisible(false)}
        /> */}
      </ScrollView>
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
    overflow: 'hidden',
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
    ...commonFontStyle(600, 20, colors._0B3970),
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
    ...commonFontStyle(400, 18, colors._0B3970),
  },
  chevron: {
    marginLeft: 8,
  },
  headerTitle: {
    ...commonFontStyle(600, 22, colors._0B3970),
  },
  avatarPlaceholder: {
    backgroundColor: colors._0B3970,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: wp(22),
    fontWeight: '700',
  },
});
