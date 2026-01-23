import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BackHeader, GradientButton, LinearContainer } from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../assets/Images';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SCREENS } from '../../../navigation/screenNames';
import { navigateTo } from '../../../utils/commonFunction';
import CustomImage from '../../../component/common/CustomImage';
import BaseText from '../../../component/common/BaseText';

const EmployeeProfile = () => {
  const navigation = useNavigation();
  const { params } = useRoute<any>();
  const user = params?.user;

  // Dummy data matching the image (will use real data from user param if available)
  const profileData = {
    name: user?.name || 'Smith Williamson',
    location: user?.location || user?.area || 'Dubai Marina, Dubai - U.A.E',
    picture: user?.picture || null, // Will use placeholder
    about: 'Sed ut perspiciatis unde omns iste natus error site voluptatem accusantum dolorem queitters lipsum lipslaudantiuml ipsum text.',
    education: [
      {
        degree: 'MBA Hotel Management',
        years: '2001 - 2004',
        institution: 'American Univversity',
        location: 'London, UK',
      },
    ],
    experience: [
      {
        title: 'Front Desk Manager',
        years: '2005 - 2009',
        company: 'Sofitel Hotel',
        location: 'Dubai, UAE',
      },
    ],
    skills: [
      'Guest Welcoming',
      'Inventory Reporting',
      'Customer Service',
      'Staff Management',
      'Emergency Management',
    ],
    languages: ['Arabic', 'English', 'Urdu', 'French', 'Russian', 'Spanish'],
  };

  const handleChat = () => {
    // Navigate to chat screen
    navigateTo(SCREENS.CoChat, {});
  };

  return (
    <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
      <BackHeader 
        title="Employee Profile" 
        containerStyle={styles.headerContainer}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <CustomImage
              uri={profileData.picture}
              source={IMAGES.avatar}
              containerStyle={styles.profileImage}
              imageStyle={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <View style={styles.locationContainer}>
            <Image
              source={IMAGES.location}
              style={styles.locationIcon}
              resizeMode="contain"
            />
            <Text style={styles.locationText}>{profileData.location}</Text>
          </View>
        </View>

        {/* About me Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About me</Text>
          <BaseText style={styles.cardText}>{profileData.about}</BaseText>
        </View>

        {/* Education Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Education</Text>
          {profileData.education.map((edu, index) => (
            <View key={index} style={styles.entryContainer}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{edu.degree}</Text>
                <Text style={styles.entryYears}>{edu.years}</Text>
              </View>
              <View style={styles.entryDetails}>
                <Text style={styles.entryLink}>{edu.institution}</Text>
                <View style={styles.entryLocation}>
                  <Image
                    source={IMAGES.location}
                    style={styles.smallLocationIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.entryLocationText}>{edu.location}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Past Experience Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Past Experience</Text>
          {profileData.experience.map((exp, index) => (
            <View key={index} style={styles.entryContainer}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{exp.title}</Text>
                <Text style={styles.entryYears}>{exp.years}</Text>
              </View>
              <View style={styles.entryDetails}>
                <Text style={styles.entryLink}>{exp.company}</Text>
                <View style={styles.entryLocation}>
                  <Image
                    source={IMAGES.location}
                    style={styles.smallLocationIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.entryLocationText}>{exp.location}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Skills Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Skills</Text>
          <View style={styles.pillsContainer}>
            {profileData.skills.map((skill, index) => (
              <View key={index} style={styles.pill}>
                <Text style={styles.pillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Languages Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Languages</Text>
          <View style={styles.pillsContainer}>
            {profileData.languages.map((language, index) => (
              <View key={index} style={styles.pill}>
                <Text style={styles.pillText}>{language}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom spacing for Chat button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Chat Button */}
      <View style={styles.chatButtonContainer}>
        <View style={styles.chatButtonWrapper}>
          <GradientButton
            title="Chat"
            onPress={handleChat}
            type="Company"
            style={styles.chatButton}
            textStyle={styles.chatButtonText}
            textContainerStyle={styles.chatButtonContent}
          />
          <Image
            source={IMAGES.ic_chat}
            style={styles.chatIcon}
            resizeMode="contain"
          />
        </View>
      </View>
    </LinearContainer>
  );
};

export default EmployeeProfile;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: hp(15),
    paddingHorizontal: wp(20),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(25),
    paddingTop: hp(20),
    paddingBottom: hp(50)
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: hp(30),
  },
  profileImageContainer: {
    width: wp(120),
    height: wp(120),
    borderRadius: wp(60),
    backgroundColor: '#E8F4FD', // Light blue-gray background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(16),
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(60),
  },
  profileName: {
    ...commonFontStyle(700, 24, colors._0B3970),
    marginBottom: hp(8),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  locationIcon: {
    width: wp(14),
    height: wp(14),
    tintColor: colors._0B3970,
  },
  locationText: {
    ...commonFontStyle(400, 14, colors._0B3970),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: wp(15),
    padding: hp(20),
    marginBottom: hp(20),
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  cardTitle: {
    ...commonFontStyle(700, 18, colors.black),
    marginBottom: hp(16),
  },
  cardText: {
    ...commonFontStyle(400, 14, colors._656464),
    lineHeight: hp(20),
  },
  entryContainer: {
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(8),
  },
  entryTitle: {
    ...commonFontStyle(700, 16, colors._0B3970),
    flex: 1,
    marginRight: wp(10),
  },
  entryYears: {
    ...commonFontStyle(400, 14, colors._656464),
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryLink: {
    ...commonFontStyle(500, 14, colors.empPrimary),
    flex: 1,
  },
  entryLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
  smallLocationIcon: {
    width: wp(12),
    height: wp(12),
    tintColor: colors._656464,
  },
  entryLocationText: {
    ...commonFontStyle(400, 12, colors._656464),
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
  },
  pill: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderRadius: wp(20),
    backgroundColor: '#E8F4FD',
    borderWidth: 1,
    borderColor: colors._E8E8E8,
  },
  pillText: {
    ...commonFontStyle(400, 14, colors._0B3970), // Dark blue text
  },
  bottomSpacing: {
    height: hp(100),
  },
  chatButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp(25),
    paddingBottom: hp(50),
    paddingTop: hp(20),
    backgroundColor: colors.white,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 5,
  },
  chatButtonWrapper: {
    width: '100%',
    position: 'relative',
  },
  chatButton: {
    width: '100%',
  },
  chatButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(12),
  },
  chatIcon: {
    width: wp(24),
    height: wp(24),
    left: '39%',
    top: "30%",
    position: 'absolute',
    alignSelf: 'center',
    tintColor: colors._0B3970,
  },
  chatButtonText: {
    ...commonFontStyle(600, 20, colors._0B3970),
    marginLeft: wp(24),
  },
});
