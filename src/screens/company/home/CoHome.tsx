import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientButton, HomeHeader, LinearContainer } from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { navigateTo } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import {
  useGetDashboardQuery,
  useGetProfileQuery,
} from '../../../api/dashboardApi';
import { colors } from '../../../theme/colors';
import { useAppDispatch } from '../../../redux/hooks';
import {
  setCompanyProfileAllData,
  setCompanyProfileData,
  setUserInfo,
} from '../../../features/authSlice';
import { resetJobFormState, setCoPostJobSteps } from '../../../features/companySlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { connectSocket } from '../../../hooks/socketManager';
import { IMAGES } from '../../../assets/Images';

const CoHome = () => {
  const dispatch = useAppDispatch();
  const { data: profileData } = useGetProfileQuery();
  const userdata = profileData?.data?.comnpany;

  const { data: dashboardData } = useGetDashboardQuery({});
  const job_stats = dashboardData?.data?.stats;

  const { userInfo }: any = useSelector((state: RootState) => state.auth);

  const [selectedMetricIndex, setSelectedMetricIndex] = useState<number>(3);

  const metricOptions = [
    { key: 'job_view', label: 'Total Job', subLabel: 'Views', icon: IMAGES.jobview },
    { key: 'applied', label: 'Total', subLabel: 'Applications', icon: IMAGES.appliedjob },
    { key: 'suggested', label: 'AI Suggested', subLabel: 'Talent', icon: IMAGES.suggested_candidate },
    { key: 'shortlisted', label: 'Shortlisted', subLabel: 'Talent', icon: IMAGES.shortlisted },
  ];

  useEffect(() => {
    if (userdata) {
      dispatch(setCompanyProfileAllData(userdata));
      dispatch(setCompanyProfileData(userdata));
      dispatch(setUserInfo(userdata));
    }
  }, [dispatch, userdata]);

  useEffect(() => {
    if (userInfo?._id) {
      connectSocket(userInfo?._id, 'company');
    }
  }, [userInfo]);

  const job_summary = [
    { id: "1", title: "Live Jobs", value: job_stats?.active_jobs, color: "#F3F3F3" },
    { id: "3", title: "Closed Jobs", value: job_stats?.expired_jobs, color: "#FFEFF0" },
  ];

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']} containerStyle={styles.containerStyle}>
      <View style={styles.header}>
        <HomeHeader
          type="company"
          companyProfile={userInfo}
          onPressAvatar={() => navigateTo(SCREENS.CoMyProfile)}
          onPressNotifi={() => navigateTo(SCREENS.CoNotification)}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        <View style={styles.jobSummaryContainer}>
          <Text style={styles.jobSummaryTitle}>{"Job Status Summary"}</Text>

          <View style={styles.jobSummaryRow}>
            {
              job_summary?.map((item, index) => {
                return (
                  <View key={index} style={[styles.jobSummaryCard, { backgroundColor: item?.color }]}>
                    <View style={styles.jobSummaryCardContent}>
                      <Image source={IMAGES.work} style={styles.workIcon} />
                      <Text style={styles.jobSummaryCardTitle}>{item.title}</Text>
                      <Text style={styles.jobSummaryCardValue}>{item.value}</Text>
                    </View>
                  </View>
                )
              })}
          </View>

        </View>

        <View style={styles.aiMatchBanner}>
          <View style={styles.aiMatchIconContainer}>
            <Image source={IMAGES.check} style={styles.checkIcon} />
          </View>
          <Text style={styles.aiMatchText}>
            {`${job_stats?.ai_matched_candidates || 0} new candidates matched by`}{" "}
            <Text style={styles.aiMatchHighlight}>{"AI"}</Text>
          </Text>
        </View>

        <View style={styles.combinedMetricsContainer}>
          <View style={styles.innerMetricsGrid}>
            {metricOptions.map((option, index) => {
              const isSelected = false;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  // onPress={() => setSelectedMetricIndex(index)}
                  style={[
                    styles.metricCard,
                    isSelected && styles.metricCardHighlighted,
                  ]}>
                  <Image
                    source={option.icon}
                    resizeMode="contain"
                    style={[
                      styles.metricIcon,
                      isSelected ? styles.metricIconSelected : styles.metricIconDefault
                    ]}
                  />
                  <View style={styles.metricTextContainer}>
                    <Text
                      numberOfLines={2}
                      style={
                        isSelected
                          ? styles.metricLabelBoldWhite
                          : styles.metricLabelBold
                      }>
                      {option.label}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={
                        isSelected
                          ? styles.metricLabelBoldWhite
                          : styles.metricLabelBold
                      }>
                      {option.subLabel}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <GradientButton
            type="Company"
            title="View Completed Interviews"
            onPress={() => navigateTo(SCREENS.CompletedInterviews)}
            gradientColors={['#CDA953', '#C8B380']}
            style={{ borderWidth: 0, borderRadius: 0, width: '100%' }}
            textStyle={{ color: colors.white, fontSize: 16 }}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <GradientButton
            type="Company"
            title="Create a Job"
            onPress={() => {
              dispatch(resetJobFormState());
              dispatch(setCoPostJobSteps(0));
              navigateTo(SCREENS.PostJob);
            }}
            textStyle={{ ...commonFontStyle(600, 18, colors.white) }}
            gradientColors={[colors._2D5486, colors._0B3970, colors._051C38]}
            style={{ flex: 1 }}
            textContainerStyle={{ paddingHorizontal: wp(5) }}
          />
          <GradientButton
            type="Company"
            title="Manage Job"
            onPress={() => navigateTo(SCREENS.CoJob)}
            gradientColors={[colors.white, colors.white]}
            textStyle={{ color: colors._0B3970 }}
            style={{ borderColor: colors._0B3970, borderWidth: 1.5, flex: 1 }}
            textContainerStyle={{ paddingHorizontal: wp(5) }}
          />
        </View>

      </ScrollView>
    </LinearContainer >
  );
};

export default CoHome;

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: wp(25),
  },
  header: {
    marginTop: hp(20),
    paddingBottom: hp(21),
    position: 'relative',
  },
  plusButton: {
    position: 'absolute',
    top: 0,
    right: wp(25),
    zIndex: 10,
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    width: wp(30),
    height: wp(30),
    tintColor: colors._0B3970,
  },
  scrollcontainer: {
    flexGrow: 1,
    paddingBottom: hp(21),
    paddingHorizontal: wp(25),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobSummaryContainer: {
    borderRadius: hp(15),
    borderColor: colors._E0C688,
    borderWidth: 1,
    paddingHorizontal: wp(16),
    paddingVertical: hp(20),
  },
  jobSummaryTitle: {
    ...commonFontStyle(600, 16, colors.black),
  },
  jobSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(10),
  },
  jobSummaryCard: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(10),
    paddingVertical: hp(15),
    marginTop: hp(18),
  },
  jobSummaryCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(8),
  },
  workIcon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  jobSummaryCardTitle: {
    ...commonFontStyle(500, 12, colors.black),
    textAlign: 'center',
  },
  jobSummaryCardValue: {
    ...commonFontStyle(600, 24, colors.black),
    marginTop: hp(4),
  },
  aiMatchBanner: {
    backgroundColor: colors._0B3970,
    width: '100%',
    height: hp(60),
    marginVertical: hp(18),
    borderRadius: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp(16),
  },
  aiMatchIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors._F3E1B7,
    width: wp(25),
    height: wp(25),
    borderRadius: wp(25),
  },
  checkIcon: {
    width: wp(15),
    height: hp(15),
  },
  aiMatchText: {
    ...commonFontStyle(500, 15, colors.white),
    textAlign: 'center',
  },
  aiMatchHighlight: {
    ...commonFontStyle(700, 17, colors._F3E1B7),
  },
  combinedMetricsContainer: {
    borderWidth: 1,
    borderColor: '#CDA953',
    borderRadius: wp(15),
    overflow: 'hidden',
    marginBottom: hp(20),
    backgroundColor: colors.white,
  },
  innerMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(12),
    padding: wp(15),
    justifyContent: 'center',
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: wp(15),
    padding: hp(12),
    paddingVertical: hp(18),
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: '#CDA953',
    justifyContent: 'flex-start',
    gap: wp(8),
    minHeight: hp(80),
  },
  metricCardHighlighted: {
    backgroundColor: colors._0B3970,
    borderColor: colors._0B3970,
  },
  metricIcon: {
    width: wp(30),
    height: hp(30),
  },
  metricIconDefault: {
    tintColor: '#CDA953',
  },
  metricIconSelected: {
    tintColor: colors.white,
  },
  metricTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  metricLabelBold: {
    ...commonFontStyle(700, 14, colors.black),
    marginBottom: hp(2),
  },
  metricLabel: {
    ...commonFontStyle(500, 16, colors.black),
  },
  metricLabelBoldWhite: {
    ...commonFontStyle(700, 14, colors.white),
    marginBottom: hp(2),
  },
  metricLabelWhite: {
    ...commonFontStyle(500, 12, colors.white),
  },
  buttonsContainer: {
    gap: hp(15),
    marginBottom: hp(30),
    flexDirection: 'row',
  },
});
