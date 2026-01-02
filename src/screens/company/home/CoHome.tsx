import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientButton, HomeHeader, LinearContainer } from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { navigateTo } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import {
  useGetCompanyPostsQuery,
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
  const { userInfo }: any = useSelector((state: RootState) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
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

  const {
    data: getPost,
    isLoading,
    isFetching,
  } = useGetCompanyPostsQuery({ page: currentPage });

  const totalPages = getPost?.data?.pagination?.total_pages ?? 1;

  useEffect(() => {
    if (!getPost) return;
    const posts = (getPost?.data?.posts as any[]) ?? [];

    if (currentPage === 1) {
      setAllPosts(posts);
    } else {
      setAllPosts(prev => [...prev, ...posts]);
    }
    setIsLoadingMore(false);
  }, [getPost, currentPage]);

  const handleLoadMore = () => {
    if (!isFetching && !isLoadingMore && currentPage < totalPages) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setAllPosts([]);
  };

  const job_summary = [{ id: "1", title: "Active Jobs", value: 12, color: "#F3F3F3" }, { id: "2", title: "Pending Jobs", value: 15, color: "#E5F7FF" }, { id: "3", title: "Expired Jobs", value: 10, color: "#FFEFF0" }];

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
      {/* {isLoading && currentPage === 1 ? (
        <PostSkeleton backgroundColor={colors._DADADA} />
      ) : (
        <FlatList
          data={allPosts}
          style={AppStyles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollcontainer}
          ItemSeparatorComponent={() => <View style={{ height: hp(15) }} />}
          renderItem={({ item }) => <FeedCard item={item} isFollow />}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          // refreshing={isLoading && currentPage === 1}
          // onRefresh={handleRefresh}
          keyExtractor={(_, index) => index.toString()}
          // ListHeaderComponent={renderHeader}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContainer}>
                <BaseText
                  style={{
                    textAlign: 'center',
                    ...commonFontStyle(400, 18, colors._0B3970),
                  }}>
                  {t('There is no post available')}
                </BaseText>
              </View>
            );
          }}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator
                size="large"
                color={colors._D5D5D5}
                style={{ marginVertical: hp(10) }}
              />
            ) : null
          }
        />
      )} */}

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
        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: colors._F3E1B7, width: wp(30), height: wp(30), borderRadius: wp(30) }}>
          <Image source={IMAGES.check} style={{ width: wp(20), height: hp(20) }} />
        </View>
        <Text style={{ ...commonFontStyle(500, 15, colors.white), textAlign: 'center' }}>
          {"12 new candidates matched by"}{" "}
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
                  style={
                    isSelected
                      ? styles.metricLabelBoldWhite
                      : styles.metricLabelBold
                  }>
                  {option.label}
                </Text>
                <Text
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
          onPress={() => navigateTo(SCREENS.CoJob)}
          textStyle={{ ...commonFontStyle(600, 18, colors.white) }}
          gradientColors={[colors._2D5486, colors._0B3970, colors._051C38]}
        />
        <GradientButton
          type="Company"
          title="Manage Job"
          onPress={() => navigateTo(SCREENS.CoJob)}
        />
      </View>

    </LinearContainer >
  );
};

export default CoHome;

const styles = StyleSheet.create({
  header: {
    marginTop: hp(20),
    paddingBottom: hp(21),

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
  },
  metricLabelBold: {
    ...commonFontStyle(700, 14, colors.black),
    marginBottom: hp(2),
  },
  metricLabel: {
    ...commonFontStyle(500, 16, colors.black),
  },
  metricLabelBoldWhite: {
    ...commonFontStyle(500, 16, colors.white),
    marginBottom: hp(2),
  },
  metricLabelWhite: {
    ...commonFontStyle(500, 12, colors.white),
  },
});
