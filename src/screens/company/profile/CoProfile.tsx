import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {LinearContainer} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {commonFontStyle, wp} from '../../../theme/fonts';
import CustomPopup from '../../../component/common/CustomPopup';
import {SCREENS} from '../../../navigation/screenNames';
import {navigationRef} from '../../../navigation/RootContainer';

const CoProfile = () => {
  const [popupVisible, setPopupVisible] = useState(false);

  const settingsData = [
    {
      section: 'About',
      items: [
        // {label: 'Privacy Policy', icon: IMAGES.PrivacyPolicy},
        // {label: 'Terms of Use', icon: IMAGES.TermsUse},
        // {label: 'Help & Support', icon: IMAGES.HelpSupport},
        {
          label: 'Logout',
          icon: IMAGES.logout,
          onPress: () => {
            setPopupVisible(true);
          },
        },
      ],
    },
  ];

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      {settingsData.map((section, index) => (
        <View key={index} style={styles.section}>
          {/* <Text style={styles.sectionTitle}>{section?.section}</Text> */}
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
        onPressRight={() => {
          navigationRef.navigate(SCREENS.WelcomeScreen);
          setPopupVisible(false);
        }}
      />
    </LinearContainer>
  );
};

export default CoProfile;

const styles = StyleSheet.create({
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
  label: {
    flex: 1,
    ...commonFontStyle(400, 18, '#D6D6D6'),
  },
});
