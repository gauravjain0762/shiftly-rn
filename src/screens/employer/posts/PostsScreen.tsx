import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { LinearContainer } from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme/colors';
import { AppStyles } from '../../../theme/appStyles';
import { useGetEmployeePostsQuery } from '../../../api/dashboardApi';
import FeedCard from '../../../component/employe/FeedCard';
import PostSkeleton from '../../../component/skeletons/PostSkeleton';
import BaseText from '../../../component/common/BaseText';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '../../../navigation/screenNames';

const PostsScreen = () => {
    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState(1);
    const [allPosts, setAllPosts] = useState<any[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const handleScrollToTop = (index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 });
    };

    const {
        data: getPost,
        isFetching,
        refetch,
    } = useGetEmployeePostsQuery({ page: currentPage });

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
        refetch();
    };

    const navigation = useNavigation<any>();

    return (
        <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
            <View style={AppStyles.flex}>
                <View style={styles.header}>
                    <BaseText style={styles.centeredTitle}>
                        {t('Posts')}
                    </BaseText>
                </View>
                {isFetching && currentPage === 1 ? (
                    <PostSkeleton backgroundColor={colors._DADADA} />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={allPosts}
                        style={AppStyles.flex}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollcontainer}
                        ItemSeparatorComponent={() => <View style={{ height: hp(15) }} />}
                        renderItem={({ item, index }) => (
                            <FeedCard
                                item={item}
                                showMenu={false}
                                itemIndex={index}
                                onScrollToTop={() => handleScrollToTop(index)}
                                onPressLogo={() => {
                                    navigation.navigate(SCREENS.ViewCompanyProfile, {
                                        companyId: item?.company_id?._id,
                                    });
                                }}
                            />
                        )}
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
                                        {t('No posts available yet.')}
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
                )}
            </View>
        </LinearContainer>
    );
};

export default PostsScreen;

const styles = StyleSheet.create({
    header: {
        marginTop: hp(20),
        paddingBottom: hp(21),
        paddingHorizontal: wp(25),
        alignItems: 'center',
        justifyContent: 'center',
    },
    centeredTitle: {
        ...commonFontStyle(600, 22, colors._0B3970),
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
    },
});
