/* eslint-disable react-native/no-inline-styles */
import React, {memo} from 'react';
import moment from 'moment';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {Message} from '../../screens/employer/chat/Chat';
import {IMAGES} from '../../assets/Images';
import {navigateTo} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';

const MessageBubble: React.FC<{
  item: Message;
  recipientName: string;
  type: 'user' | 'company';
}> = ({item, recipientName, type}) => {
  const isUser = item.sender !== 'company';

  return (
    <View style={styles.messageContainer}>
      {!isUser && (
        <View style={{flexDirection: 'row'}}>
          <View style={styles.avatarContainer}>
            <FastImage
              source={{
                uri: 'https://content.presspage.com/templates/658/2042/729924/royal-atlantis-logo.png',
              }}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text
              style={{
                ...styles.senderName,
                color: type === 'company' ? colors._0B3970 : colors.white,
              }}>
              {recipientName}
            </Text>
            <Text
              style={{
                ...styles.timeText,
                color: type === 'company' ? colors._0B3970 : colors.white,
              }}>
              {moment(item.createdAt).format('hh:mm A')}
            </Text>
          </View>
        </View>
      )}

      <View style={{flex: 1}}>
        {isUser && (
          <Text style={{...styles.timeText, alignSelf: 'flex-end'}}>
            {moment(item?.createdAt).format('hh:mm A')}
          </Text>
        )}
        {item.message && (
          <View
            style={[
              styles.bubble,
              isUser
                ? styles.userBubble
                : {
                    ...styles.otherBubble,
                    backgroundColor:
                      type === 'user' ? '#234570' : colors?._0B3970,
                  },
            ]}>
            <Text
              style={[
                styles.messageText,
                isUser ? styles.userText : styles.otherText,
              ]}>
              {item.message}
            </Text>
          </View>
        )}
        {item.file ? (
          item.file?.includes('pdf') ||
          item.file?.includes('doc') ||
          item.file?.includes('docx') ? (
            <TouchableOpacity
              onPress={() => {
                navigateTo(SCREENS.WebviewScreen, {
                  link: item.file,
                  title: '',
                  type: 'employe',
                });
              }}>
              <FastImage
                source={IMAGES.document}
                defaultSource={IMAGES.document}
                tintColor={type === 'user' ? colors._E8CE92 : colors._0B3970}
                style={{
                  ...styles.attachment,
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigateTo(SCREENS.WebviewScreen, {
                  link: item.file,
                  title: '',
                  type: 'employe',
                });
              }}>
              <FastImage
                source={{uri: item.file}}
                style={{
                  ...styles.attachment,
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                }}
              />
            </TouchableOpacity>
          )
        ) : null}
      </View>
    </View>
  );
};

export default memo(MessageBubble);

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: hp(2),
    marginTop: 20,
  },

  avatarContainer: {
    width: wp(31),
    height: wp(31),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginRight: 15,
  },
  avatar: {
    width: 18,
    height: 19,
    borderRadius: 16,
  },
  senderName: {
    ...commonFontStyle(600, 16, colors.white),
    marginBottom: hp(4),
  },
  timeText: {
    ...commonFontStyle(400, 12, colors.white),
    marginBottom: hp(11),
  },
  bubble: {
    borderRadius: 25,
    paddingVertical: hp(12),
    paddingHorizontal: wp(18),
    maxWidth: '85%',
  },
  otherBubble: {
    backgroundColor: colors._0B3970,
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: colors._E8CE92,
    borderTopRightRadius: 0,
    alignSelf: 'flex-end',
  },
  messageText: {
    ...commonFontStyle(400, 14, '#000'),
  },
  userText: {
    color: '#000',
  },
  otherText: {
    color: '#fff',
  },
  attachment: {
    width: wp(120),
    height: hp(120),
    marginTop: hp(10),
    alignSelf: 'flex-end',
    borderRadius: hp(8)
  },
});
