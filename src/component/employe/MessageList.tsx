import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {commonFontStyle} from '../../theme/fonts';

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
      <Image source={{uri: item?.logo}} style={styles.logo} />
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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0E4C96',
    backgroundColor: '#002B64',
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...commonFontStyle(700, 14, '#FFFFFF'),
  },
  sender: {
    ...commonFontStyle(400, 12, '#D4D4D4'),
    marginTop: 2,
  },
  preview: {
    ...commonFontStyle(400, 12, '#AAAAAA'),
    marginTop: 2,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  date: {
    ...commonFontStyle(400, 12, '#FFFFFF'),
  },
  badge: {
    backgroundColor: '#F5C144',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  badgeText: {
    ...commonFontStyle(700, 12, '#002B64'),
  },
});
