import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {colors} from '../../theme/colors';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {getInitials, hasValidImage} from '../../utils/commonFunction';

type MessageItem = {
  id: string;
  logo: string;
  title: string;
  sender: string;
  preview: string;
  date: string;
  unreadCount?: number;
};

type Props = {
  onPressMessage: (item: MessageItem) => void;
  item: MessageItem[] | any;
  type?: 'company' | 'employe';
};

const MessageList: FC<Props> = ({
  onPressMessage = () => {},
  item,
  type = 'employe',
}) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onPressMessage(item)}>
      {hasValidImage(item?.company_id?.logo || item?.user_id?.picture) ? (
        <FastImage
          source={{ uri: item?.company_id?.logo || item?.user_id?.picture }}
          style={styles.avatar}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarInitial}>
            {getInitials(item?.company_id?.company_name || item?.user_id?.name)}
          </Text>
        </View>
      )}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {color: type == 'employe' ? colors.white : colors._0B3970},
          ]}>
          {item?.company_id?.company_name || item?.user_id?.name || 'Unknown'}
        </Text>
        <Text
          style={[
            styles.sender,
            {color: type == 'employe' ? colors.white : colors._0B3970},
          ]}>
          {item?.last_message || ''}
        </Text>
        <Text
          style={[
            styles.preview,
            {color: type == 'employe' ? colors.white : colors._0B3970},
          ]}
          numberOfLines={1}>
          {item?.preview}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Text
          style={[
            styles.date,
            {color: type == 'employe' ? colors.white : colors._0B3970},
          ]}>
          {item?.date}
        </Text>
        {item?.unreadCount ? (
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  type == 'employe' ? colors.white : colors._0B3970,
              },
            ]}>
            <Text
              style={[
                styles.badgeText,
                {
                  color: type == 'employe' ? '#002B64' : colors.white,
                },
              ]}>
              {item?.unreadCount}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default MessageList;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(22),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: hp(20),
  },
  logo: {
    height: hp(28),
    resizeMode: 'contain',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: wp(14),
    gap: hp(7),
  },
  title: {
    ...commonFontStyle(600, 18, colors.white),
  },
  sender: {
    ...commonFontStyle(400, 13, colors.white),
  },
  preview: {
    ...commonFontStyle(400, 13, colors.white),
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  date: {
    ...commonFontStyle(400, 13, '#FFFFFF'),
  },
  badge: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  badgeText: {
    ...commonFontStyle(700, 12, '#002B64'),
  },
  logoBg: {
    width: wp(62),
    height: wp(62),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    overflow: 'hidden',
  },
  avatar: {
    width: wp(62),
    height: wp(62),
    borderRadius: wp(31),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  avatarFallback: {
    width: wp(62),
    height: wp(62),
    borderRadius: wp(31),
    backgroundColor: colors._0B3970,
    justifyContent: 'center',
    alignItems: 'center',
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
});
