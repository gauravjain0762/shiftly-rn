import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {BackHeader, LinearContainer, SearchBar} from '../../../component';
import {useTranslation} from 'react-i18next';
import {
  navigateTo,
  getInitials,
  hasValidImage,
} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {hp, wp, commonFontStyle} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {useGetCompanyChatsQuery} from '../../../api/dashboardApi';
import NoDataText from '../../../component/common/NoDataText';
import FastImage from 'react-native-fast-image';
import {onChatMessage, offChatMessage} from '../../../hooks/socketManager';

const CoMessage = () => {
  const {t} = useTranslation();
  const [value, setValue] = useState<string>('');
  const {data: chats, isLoading, refetch} = useGetCompanyChatsQuery({page: 1});
  const chatList = chats?.data?.chats || [];
  const isFocused = useIsFocused();

  useEffect(() => {
    if (chats) {
      console.log(
        '🔥 [CoMessage] getCompanyChats response:',
        JSON.stringify(chats, null, 2),
      );
    }
  }, [chats]);

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  // ----- Live updates via socket -----
  useEffect(() => {
    const handleNewMessage = (newMessage: any) => {
      console.log('📩 [CoMessage] chat_message event:', newMessage);
      if (isFocused) {
        refetch();
      }
    };

    onChatMessage(handleNewMessage);

    return () => {
      offChatMessage(handleNewMessage);
    };
  }, [isFocused, refetch]);

  const displayChats = chatList;

  const filteredChatList = displayChats.filter((item: any) =>
    item?.user_id?.name?.toLowerCase().includes(value.toLowerCase()),
  );

  const renderChatCard = ({item}: {item: any}) => {
    const userName = item?.user_id?.name || 'Unknown';
    const userAvatar = item?.user_id?.picture;
    const lastMessage = item?.last_message || '';
    console.log('🔥 ~ renderChatCard ~ lastMessage:', lastMessage);
    const rawJobCode = item?.job_id?.job_code || '';
    const jobCode = rawJobCode.replace(/^JOB-/, '');
    const updatedAt = item?.updatedAt || item?.createdAt;
    const timeLabel = updatedAt
      ? new Date(updatedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';
    const unreadCount = item?.unread_counter || 0;
    console.log(item, 'itemitemitem');

    return (
      <View style={styles.cardRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.card}
          onPress={() =>
            navigateTo(SCREENS.CoChat, {
              data: item,
              accessChatId: true,
              isFromJobDetail: false,
            })
          }>
          {hasValidImage(userAvatar) ? (
            <FastImage
              source={{uri: userAvatar}}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>{getInitials(userName)}</Text>
            </View>
          )}

          <View style={styles.info}>
            <View style={styles.infoTopRow}>
              <Text style={styles.name} numberOfLines={1}>
                {userName}
              </Text>
              {!!item?.job_id?.title && (
                <Text style={styles.jobCode} numberOfLines={1}>
                  {item?.job_id?.title}
                </Text>
              )}
            </View>
            <View style={styles.messageRow}>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {lastMessage || 'No messages yet'}
              </Text>
              {!!timeLabel && <Text style={styles.timeLabel}>{timeLabel}</Text>}
            </View>
          </View>

          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

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
          contentContainerStyle={{flexGrow: 1, paddingBottom: hp(10)}}
          keyExtractor={(item, index) => item?._id || index.toString()}
          renderItem={renderChatCard}
          ListEmptyComponent={() => (
            <NoDataText
              style={{paddingHorizontal: wp(22)}}
              text="You don't have any activity yet. Once you post jobs or content, updates will appear here."
            />
          )}
          onRefresh={refetch}
          refreshing={isLoading}
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
    paddingBottom: hp(18),
  },
  search: {
    marginTop: hp(10),
  },
  cardRow: {
    paddingHorizontal: wp(16),
    paddingTop: hp(10),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: wp(16),
    paddingVertical: hp(10),
    paddingHorizontal: wp(14),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  avatar: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    marginRight: wp(12),
    overflow: 'hidden',
  },
  avatarFallback: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    marginRight: wp(12),
    backgroundColor: colors._0B3970,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    ...commonFontStyle(600, 18, colors.white),
  },
  info: {
    flex: 1,
    gap: hp(4),
  },
  infoTopRow: {
    flexShrink:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex:1,
    ...commonFontStyle(600, 16, colors._0B3970),
    marginRight: wp(8),
    width:'50%'
  },
  timeLabel: {
    ...commonFontStyle(400, 11, '#999999'),
  },
  lastMessage: {
    ...commonFontStyle(400, 13, '#646464'),
    flex: 1,
    marginRight: wp(8),
  },
  jobCode: {
    ...commonFontStyle(400, 12, '#4A4A4A'),
    width:'50%',
    textAlign:'right'
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
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
