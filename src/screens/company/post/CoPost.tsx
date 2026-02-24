import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientButton, LinearContainer } from '../../../component';
import LinearGradient from 'react-native-linear-gradient';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../assets/Images';
import { AppStyles } from '../../../theme/appStyles';
import { navigateTo } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import { useGetCompanyPostsQuery, useGetProfileQuery } from '../../../api/dashboardApi';
import { useAppDispatch } from '../../../redux/hooks';
import { setCoPostSteps } from '../../../features/companySlice';
import FeedCard from '../../../component/employe/FeedCard';
import PostSkeleton from '../../../component/skeletons/PostSkeleton';
import BaseText from '../../../component/common/BaseText';

const CoPost = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  console.log("🔥 ~ CoPost ~ allPosts:", allPosts)
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data: profileData } = useGetProfileQuery();
  const currentCompanyId = profileData?.data?.company?._id;

  const {
    data: getPost,
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

  const handleCreatePost = () => {
    dispatch(setCoPostSteps(1));
    navigateTo(SCREENS.CreatePost);
  };

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      <View style={AppStyles.flex}>
        <View style={styles.header}>
          <View style={styles.customHeader}>
            <BaseText
              style={styles.centeredTitle}>
              {t('Posts')}
            </BaseText>
            <View style={styles.rightButtonContainer}>
              <LinearGradient
                colors={['#024AA1', '#041428']}
                style={styles.gradient}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={handleCreatePost}
                  style={styles.createPostButton}>
                  <View style={styles.plusIconContainer}>
                    <Image source={IMAGES.pluse} style={styles.plusIcon} />
                  </View>
                  <Text style={styles.createPostText}>{t('Create Post')}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
        {isFetching && currentPage === 1 ? (
          <PostSkeleton backgroundColor={colors._DADADA} />
        ) : (
          <FlatList
            data={allPosts}
            style={AppStyles.flex}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollcontainer}
            ItemSeparatorComponent={() => <View style={{ height: hp(15) }} />}
            renderItem={({ item }) => <FeedCard item={item} showMenu={true} hideLike={true} currentCompanyId={currentCompanyId} />}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            refreshing={isFetching && currentPage === 1}
            onRefresh={handleRefresh}
            keyExtractor={(_, index) => index.toString()}
            ListEmptyComponent={() => {
              return (
                <View style={styles.emptyContainer}>
                  <BaseText
                    style={{
                      textAlign: 'center',
                      ...commonFontStyle(400, 18, colors._0B3970),
                    }}>
                    {t('No posts yet. Start sharing by creating your first post!')}
                  </BaseText>
                  <GradientButton
                    type="Company"
                    title={t('Create Post')}
                    onPress={handleCreatePost}
                    // textStyle={{ ...commonFontStyle(600, 18, colors.white) }}
                    // gradientColors={[colors._2D5486, colors._0B3970, colors._051C38]}
                    style={{ marginTop: hp(20), width: '80%' }}
                  />
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
        )}
      </View>
    </LinearContainer>
  );
};

export default CoPost;

const styles = StyleSheet.create({
  header: {
    marginTop: hp(20),
    paddingBottom: hp(21),
    paddingHorizontal: wp(25),
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
  },
  centeredTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    ...commonFontStyle(600, 22, colors._0B3970),
    zIndex: 0,
  },
  rightButtonContainer: {
    marginLeft: 'auto',
    zIndex: 1,
  },
  headerContainer: {
    marginTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  gradient: {
    borderRadius: hp(100),
    overflow: 'hidden',
  },
  createPostButton: {
    gap: wp(10),
    padding: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(12),
  },
  plusIconContainer: {
    width: wp(18),
    height: hp(18),
    borderRadius: hp(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  plusIcon: {
    width: '50%',
    height: '50%',
  },
  createPostText: {
    ...commonFontStyle(500, 12, colors.white),
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
    paddingVertical: hp(50),
    gap: hp(20),
  },
});
