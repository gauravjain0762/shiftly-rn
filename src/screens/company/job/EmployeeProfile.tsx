import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';
import { IMAGES } from '../../../assets/Images';
import { BackHeader, GradientButton, LinearContainer } from '../../../component';
import BaseText from '../../../component/common/BaseText';
import CustomImage from '../../../component/common/CustomImage';
import { SCREENS } from '../../../navigation/screenNames';
import { colors } from '../../../theme/colors';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { navigateTo } from '../../../utils/commonFunction';
import { useGetEmployeeProfileByIdQuery } from '../../../api/dashboardApi';

const EmployeeProfile = () => {
  const { params } = useRoute<any>();
  const userParam = params?.user;
  const userId = userParam?._id;

  const { data: profileResponse, isLoading } = useGetEmployeeProfileByIdQuery(
    { user_id: userId },
    { skip: !userId }
  );

  const userData = profileResponse?.data?.user;

  // Real data from API or fallback to userParam/placeholder
  const profileData = {
    name: userData?.name || userParam?.name || 'User',
    location: userData?.location || userParam?.location || userParam?.area || 'Location not available',
    picture: userData?.picture || userParam?.picture || null,
    about: userData?.about || 'No about information provided.',
    education: userData?.education || [],
    experience: userData?.experience || [],
    skills: userData?.skills?.map((s: any) => s.title) || [],
    languages: userData?.languages?.map((l: any) => l.name) || [],
  };

  const jobData = params?.jobData;
  const jobId = params?.jobId;

  const handleChat = () => {
    console.log("Chat button pressed", { userId, userData, userParam, jobData, jobId });
    if (!userId) {
      console.log("No userId, returning");
      return;
    }

    try {
      navigateTo(SCREENS.CoStack, {
        screen: SCREENS.CoChat,
        params: {
          isFromJobDetail: true,
          data: {
            user_id: userData || userParam
          },
          mainjob_data: jobData || { _id: jobId }
        }
      });
    } catch (e: any) {
      console.error("Navigation failed", e);
      Alert.alert("Error", `Nav failed: ${e.message}`);
    }
  };

  if (isLoading) {
    return (
      <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
        <BackHeader
          title="Employee Profile"
          containerStyle={styles.headerContainer}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors._0B3970} />
        </View>
      </LinearContainer>
    );
  }

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
              source={IMAGES.logoText}
              imageStyle={styles.profileImage}
              containerStyle={styles.profileImage}
              resizeMode={profileData.picture ? "cover" : "contain"}
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

        {(userData?.profile_completion || userParam?.profile_completion) && (
          <View style={styles.assessmentCard}>
            <View style={styles.iconCircle}>
              <Image
                source={Number(userData?.profile_completion || userParam?.profile_completion) === 100 ? IMAGES.check : IMAGES.document}
                style={[styles.assessmentIcon, Number(userData?.profile_completion || userParam?.profile_completion) === 100 && { tintColor: colors._0B3970 }]}
              />
            </View>
            <View style={styles.assessmentTextContainer}>
              <BaseText style={styles.assessmentTitle}>
                {Number(userData?.profile_completion || userParam?.profile_completion) === 100 ? 'Assessment Completed' : 'Complete Assessment'}
              </BaseText>
              <BaseText style={styles.assessmentSubtitle}>
                {profileData.name} {userData?.profile_completion || userParam?.profile_completion}% complete Assessment
              </BaseText>
            </View>
          </View>
        )}

        {/* About me Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About me</Text>
          <BaseText style={styles.cardText}>{profileData?.about}</BaseText>
        </View>

        {/* Education Card */}
        {profileData.education.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Education</Text>
            {profileData.education.map((edu: any, index: number) => (
              <View key={index} style={[styles.entryContainer, index > 0 && { marginTop: hp(15) }]}>
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
        )}

        {/* Recent Past Experience Card */}
        {profileData.experience.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Past Experience</Text>
            {profileData.experience.map((exp: any, index: number) => (
              <View key={index} style={[styles.entryContainer, index > 0 && { marginTop: hp(15) }]}>
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
        )}

        {/* Skills Card */}
        {profileData.skills.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Skills</Text>
            <View style={styles.pillsContainer}>
              {profileData.skills.map((skill: string, index: number) => (
                <View key={index} style={styles.pill}>
                  <Text style={styles.pillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Languages Card */}
        {profileData.languages.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Languages</Text>
            <View style={styles.pillsContainer}>
              {profileData.languages.map((language: string, index: number) => (
                <View key={index} style={styles.pill}>
                  <Text style={styles.pillText}>{language}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

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
    </LinearContainer >
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
    width: wp(22),
    height: wp(22),
    left: '39%',
    top: "32%",
    position: 'absolute',
    alignSelf: 'center',
    tintColor: colors.white,
  },
  chatButtonText: {
    ...commonFontStyle(600, 20, colors.white),
    marginLeft: wp(24),
  },
  assessmentCard: {
    backgroundColor: colors._0B3970,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(15),
    paddingHorizontal: wp(20),
    marginBottom: hp(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  iconCircle: {
    width: wp(45),
    height: wp(45),
    borderRadius: wp(22.5),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(15),
  },
  assessmentIcon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  assessmentTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  assessmentTitle: {
    ...commonFontStyle(700, 16, colors.white),
    marginBottom: hp(2),
  },
  assessmentSubtitle: {
    ...commonFontStyle(400, 12, 'rgba(255, 255, 255, 0.8)'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

