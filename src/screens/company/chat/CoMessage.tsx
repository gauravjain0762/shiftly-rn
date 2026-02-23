import React, { useState, useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { BackHeader, LinearContainer, SearchBar } from '../../../component';
import { useTranslation } from 'react-i18next';
import MessageList from '../../../component/employe/MessageList';
import { navigateTo } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import { hp, wp, commonFontStyle } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { useGetCompanyChatsQuery, useLazyGetCompanyChatsQuery } from '../../../api/dashboardApi';
import NoDataText from '../../../component/common/NoDataText';

const CoMessage = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('');
  const { data: chats, isLoading, refetch } = useGetCompanyChatsQuery({ page: 1 });
  const chatList = chats?.data?.chats || [];

  const [fetchMoreChats, { isFetching }] = useLazyGetCompanyChatsQuery();
  const [extraChats, setExtraChats] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (chats?.data) {
      const pagination = chats?.data?.pagination;
      if (pagination) {
        setHasMore(pagination.current_page < pagination.total_pages);
      } else {
        setHasMore((chatList?.length || 0) >= 10);
      }
    }
  }, [chats, chatList]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isFetching) return;
    
    const nextPage = currentPage + 1;
    try {
      const result = await fetchMoreChats({ page: nextPage }).unwrap();
      const newChats = result?.data?.chats || [];
      
      if (newChats.length > 0) {
        setExtraChats(prev => [...prev, ...newChats]);
        setCurrentPage(nextPage);
        
        const pagination = result?.data?.pagination;
        if (pagination) {
          setHasMore(pagination.current_page < pagination.total_pages);
        } else {
          setHasMore(newChats.length >= 10);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log('Error loading more company chats:', error);
      setHasMore(false);
    }
  }, [hasMore, isFetching, currentPage, fetchMoreChats]);

  const displayChats = [...chatList, ...extraChats];

  const filteredChatList = displayChats.filter((item: any) =>
    item?.user_id?.name?.toLowerCase().includes(value.toLowerCase()),
  );

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      <View style={styles.headerContainer}>
        <BackHeader
          title={t('Messages')}
          type="company"
          isRight={false}
          containerStyle={styles.header}
        />
        <SearchBar
          value={value}
          type="company"
          containerStyle={styles.search}
          onChangeText={e => setValue(e)}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator size={'large'} color={colors._D5D5D5} />
      ) : (
        <FlatList
          data={filteredChatList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item, index) => item?._id || index.toString()}
          renderItem={({ item, index }: any) => {
            return (
              <MessageList
                key={index}
                item={item}
                type="company"
                onPressMessage={e => {
                  console.log('DEBUG: CoMessage onPressMessage item:', e);
                  navigateTo(SCREENS.CoChat, {
                    data: e,
                    accessChatId: true,
                    isFromJobDetail: false,
                  });
                }}
              />
            );
          }}
          ListEmptyComponent={() => {
            return <NoDataText text="You don't have any activity yet. Once you post jobs or content, updates will appear here." />;
          }}
          onRefresh={refetch}
          refreshing={isLoading}
          ListFooterComponent={
            isFetching && !value ? (
              <ActivityIndicator
                size="large"
                color={colors._0B3970}
                style={{marginVertical: hp(20)}}
              />
            ) : null
          }
          onEndReached={!value ? handleLoadMore : undefined}
          onEndReachedThreshold={0.5}
        />
      )}
    </LinearContainer>
  );
};

export default CoMessage;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'flex-start',
    gap: wp(20),
    paddingTop: hp(18),
  },
  headerContainer: {
    paddingHorizontal: wp(22),
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: hp(25),
  },
  search: {
    marginTop: hp(10),
  },
});
