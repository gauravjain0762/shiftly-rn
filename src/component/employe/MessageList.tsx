import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';

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
  item: MessageItem[];
};

const MessageList: FC<Props> = ({onPressMessage = () => {}, item}) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onPressMessage(item)}>
      <View style={styles.logoBg}>
        <Image source={{uri: item?.logo}} style={styles.logo} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.preview} numberOfLines={1}>
          {item.preview}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.date}>{item.date}</Text>
        {item.unreadCount ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
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
    ...commonFontStyle(400, 12, colors.white),
  },
  preview: {
    ...commonFontStyle(400, 12, colors.white),
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  date: {
    ...commonFontStyle(400, 12, '#FFFFFF'),
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
  },
});
