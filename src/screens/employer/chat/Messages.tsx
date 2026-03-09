import React, { useState, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { hp, wp, commonFontStyle } from '../../../theme/fonts';
import { useEmployeeGetChatsQuery, useLazyEmployeeGetChatsQuery } from '../../../api/dashboardApi';
import { BackHeader, LinearContainer, SearchBar } from '../../../component';
import NoDataText from '../../../component/common/NoDataText';
import { colors } from '../../../theme/colors';
import { getInitials, hasValidImage, navigateTo } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import FastImage from 'react-native-fast-image';
import { onChatMessage, offChatMessage } from '../../../hooks/socketManager';

const Messages = () => {
  const [value, setValue] = useState('');
  const { data: chatsData, isLoading, refetch } = useEmployeeGetChatsQuery({ page: 1 });
  const chats: any[] = chatsData?.data?.chats || chatsData?.data || [];
  const isFocused = useIsFocused();

  const [fetchMoreChats, { isFetching }] = useLazyEmployeeGetChatsQuery();
  const [extraChats, setExtraChats] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (isFocused) {
      refetch();
      setCurrentPage(1);
      setExtraChats([]);
      setHasMore(true);
    }
  }, [isFocused, refetch]);

  // ----- Live updates via socket -----
  useEffect(() => {
    const handleNewMessage = (newMessage: any) => {
      console.log('📩 [Messages] chat_message event:', newMessage);
      if (isFocused) {
        refetch();
      }
    };

    onChatMessage(handleNewMessage);

    return () => {
      offChatMessage(handleNewMessage);
    };
  }, [isFocused, refetch]);

  useEffect(() => {
    if (chatsData?.data) {
      const pagination = chatsData?.data?.pagination;
      if (pagination) {
        setHasMore(pagination.current_page < pagination.total_pages);
      } else {
        setHasMore((chats?.length || 0) >= 10);
      }
    }
  }, [chatsData, chats]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isFetching) return;
    
    const nextPage = currentPage + 1;
    try {
      const result = await fetchMoreChats({ page: nextPage }).unwrap();
      const newChats = result?.data?.chats || result?.data || [];
      
      if (newChats.length > 0) {
        // Avoid duplicating chats when API returns already-loaded items (e.g. page 2 same as page 1)
        const existingIds = new Set(
          [...chats, ...extraChats].map(
            (c: any) => c?._id || c?.chat_id,
          ),
        );
        const filteredNewChats = newChats.filter((c: any) => {
          const id = c?._id || c?.chat_id;
          if (!id) return true;
          if (existingIds.has(id)) return false;
          existingIds.add(id);
          return true;
        });

        if (filteredNewChats.length === 0) {
          setHasMore(false);
          return;
        }

        setExtraChats(prev => [...prev, ...filteredNewChats]);
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
      console.log('Error loading more chats:', error);
      setHasMore(false);
    }
  }, [hasMore, isFetching, currentPage, fetchMoreChats]);

  const displayChats = [...chats, ...extraChats];

  const filteredChats = displayChats.filter((item: any) => {
    const companyName = item?.company_id?.company_name || item?.company_name || '';
    return companyName.toLowerCase().includes(value.toLowerCase());
  });

  const renderChatCard = ({ item }: { item: any }) => {
    const companyName =
      item?.company_id?.company_name || item?.company_name || 'Unknown Company';
    const companyLogo = item?.company_id?.logo || item?.company_logo;
    const jobTitle =
      item?.job_id?.title || item?.job_title || 'N/A';
    const lastMessage = item?.last_message || '';
    const updatedAt = item?.updatedAt || item?.createdAt;
    const timeLabel = updatedAt
      ? new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
    const unreadCount = item?.unread_counter || 0;

    return (
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() =>
          navigateTo(SCREENS.Chat, {
            data: {
              chat_id: item?._id || item?.chat_id,
              company_name: companyName,
              job_title: jobTitle,
              job_id: item?.job_id?._id || item?.job_id,
              created_at: item?.createdAt,
            },
          })
        }>
        {/* Avatar */}
        {hasValidImage(companyLogo) ? (
          <FastImage
            source={{ uri: companyLogo }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>{getInitials(companyName)}</Text>
          </View>
        )}

        {/* Text info */}
        <View style={styles.info}>
          <View style={styles.infoTopRow}>
            <Text style={styles.companyName} numberOfLines={1}>
              {companyName}
            </Text>
            {!!timeLabel && (
              <Text style={styles.timeLabel}>{timeLabel}</Text>
            )}
          </View>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {jobTitle}
          </Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage || 'No messages yet'}
          </Text>
        </View>

        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      <View style={styles.headerContainer}>
        <BackHeader
          title={'Messages'}
          isRight={false}
          type="company"
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
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors._0B3970} />
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item, index) => item?._id || index.toString()}
          renderItem={renderChatCard}
          contentContainerStyle={[styles.listContainer, { flexGrow: 1 }]}
          onRefresh={refetch}
          refreshing={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <NoDataText
              text="You don't have any chats yet."
              textStyle={{ color: colors._0B3970 }}
            />
          )}
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

export default Messages;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'flex-start',
    gap: wp(20),
    paddingTop: hp(18),
  },
  headerContainer: {
    paddingHorizontal: wp(22),
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  search: {
    marginTop: hp(10),
  },
  listContainer: {
    paddingBottom: hp(20),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp(14),
    padding: wp(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(14),
    paddingHorizontal: wp(22),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: wp(56),
    height: wp(56),
    borderRadius: wp(28),
    marginRight: wp(14),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  avatarFallback: {
    width: wp(56),
    height: wp(56),
    borderRadius: wp(28),
    backgroundColor: colors._0B3970,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(14),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  avatarInitial: {
    ...commonFontStyle(600, 20, '#fff'),
  },
  info: {
    flex: 1,
    gap: hp(3),
  },
  companyName: {
    ...commonFontStyle(600, 15, '#111'),
  },
  jobTitle: {
    ...commonFontStyle(400, 13, '#555'),
  },
  infoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLabel: {
    ...commonFontStyle(400, 11, '#999'),
    flexShrink: 0,
  },
  lastMessage: {
    ...commonFontStyle(400, 13, '#999'),
  },
  badge: {
    minWidth: wp(20),
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
    borderRadius: wp(10),
    backgroundColor: colors._0B3970,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(8),
  },
  badgeText: {
    ...commonFontStyle(600, 11, colors.white),
  },
});
