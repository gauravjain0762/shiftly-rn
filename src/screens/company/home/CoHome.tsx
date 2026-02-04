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
    { key: 'suggested', label: 'AI Suggested', subLabel: 'Candidates', icon: IMAGES.suggested_candidate },
    { key: 'shortlisted', label: 'Shortlisted', subLabel: 'Candidates', icon: IMAGES.shortlisted },
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
    { id: "1", title: "Active Jobs", value: job_stats?.active_jobs, color: "#F3F3F3" },
    { id: "2", title: "Pending Jobs", value: job_stats?.pending_jobs, color: "#E5F7FF" },
    { id: "3", title: "Expired Jobs", value: job_stats?.expired_jobs, color: "#FFEFF0" },
  ];

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']} containerStyle={{ paddingHorizontal: wp(25) }}>
      <View style={styles.header}>
        <HomeHeader
          type="company"
          companyProfile={userInfo}
          onPressAvatar={() => navigateTo(SCREENS.CoMyProfile)}
          onPressNotifi={() => navigateTo(SCREENS.CoNotification)}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={{ borderRadius: hp(15), borderColor: colors._E0C688, borderWidth: 1, paddingHorizontal: wp(16), paddingVertical: hp(20) }}>
          <Text style={{ ...commonFontStyle(600, 16, colors.black) }}>{"Job Status Summary"}</Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: wp(10) }}>
            {
              job_summary?.map((item, index) => {
                return (
                  <View key={index} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: hp(10), backgroundColor: item?.color, paddingVertical: hp(10), marginTop: hp(18) }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: wp(10) }}>
                      <Image source={IMAGES.work} style={{ width: wp(20), height: hp(20) }} />
                      <Text style={{ ...commonFontStyle(500, 14, colors.black) }}>{item.title}</Text>
                      <Text style={{ ...commonFontStyle(500, 20, colors.black) }}>{item.value}</Text>
                    </View>
                  </View>
                )
              })}
          </View>

        </View>

        <View style={{ backgroundColor: colors._0B3970, width: '100%', height: hp(60), marginVertical: hp(18), borderRadius: hp(10), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: wp(16), }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: colors._F3E1B7, width: wp(25), height: wp(25), borderRadius: wp(25) }}>
            <Image source={IMAGES.check} style={{ width: wp(15), height: hp(15) }} />
          </View>
          <Text style={{ ...commonFontStyle(500, 15, colors.white), textAlign: 'center' }}>
            {`${job_stats?.ai_matched_candidates} new candidates matched by`}{" "}
            <Text style={{ ...commonFontStyle(700, 17, colors._F3E1B7) }}>{"AI"}</Text>
          </Text>
        </View>

        <View style={styles.metricCardsContainer}>
          {metricOptions.map((option, index) => {
            const isSelected = selectedMetricIndex === index;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => setSelectedMetricIndex(index)}
                style={[
                  styles.metricCard,
                  isSelected && styles.metricCardHighlighted,
                ]}>
                <Image
                  source={option.icon}
                  resizeMode="contain"
                  style={[
                    styles.metricIcon,
                    { tintColor: isSelected ? colors.white : '#CDA953' }
                  ]}
                />
                <View style={styles.metricTextContainer}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={
                      isSelected
                        ? styles.metricLabelBoldWhite
                        : styles.metricLabelBold
                    }>
                    {option.label}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
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

        <View style={{ gap: hp(25), marginVertical: hp(30) }}>
          <GradientButton
            type="Company"
            title="Create a Job"
            onPress={() => {
              console.log("Create a Job >>>>>>>>>>>>..");
              navigateTo(SCREENS.PostJob)
            }}
            textStyle={{ ...commonFontStyle(600, 18, colors.white) }}
            gradientColors={[colors._2D5486, colors._0B3970, colors._051C38]}
          />
          <GradientButton
            type="Company"
            title="Manage Job"
            onPress={() => navigateTo(SCREENS.CoJob)}
          />
        </View>

      </ScrollView>
    </LinearContainer >
  );
};

export default CoHome;

const styles = StyleSheet.create({
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
  metricCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(12),
    marginBottom: hp(20),
  },
  metricCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: wp(15),
    padding: hp(15),
    paddingVertical: hp(20),
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: '#CDA953',
    justifyContent: 'flex-start',
    gap: wp(12),
    minHeight: hp(80),
  },
  metricCardHighlighted: {
    backgroundColor: colors._0B3970,
    borderColor: colors._0B3970,
  },
  metricIcon: {
    width: wp(34),
    height: hp(34),
  },
  metricTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexShrink: 1,
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
});
