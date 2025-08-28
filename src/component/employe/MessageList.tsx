import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import CustomImage from '../common/CustomImage';

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
      <CustomImage
        uri={item?.company_id?.logo}
        imageStyle={{height: '100%', width: '100%'}}
        containerStyle={styles.logoBg}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {color: type == 'employe' ? colors.white : colors._0B3970},
          ]}>
          {item?.company_id?.company_name || 'Test Chat'}
        </Text>
        <Text
          style={[
            styles.sender,
            {color: type == 'employe' ? colors.white : colors._0B3970},
          ]}>
          {item?.last_message || 'last message'}
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
    overflow:'hidden'
  },
});
