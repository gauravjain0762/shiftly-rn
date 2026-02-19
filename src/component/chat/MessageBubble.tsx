/* eslint-disable react-native/no-inline-styles */
import React, { memo, useState } from 'react';
import moment from 'moment';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { colors } from '../../theme/colors';
import { Message } from '../../screens/employer/chat/Chat';
import { IMAGES } from '../../assets/Images';
import { navigateTo } from '../../utils/commonFunction';
import { SCREENS } from '../../navigation/screenNames';
import CustomImage from '../common/CustomImage';
import BaseText from '../common/BaseText';

type MessageProps = {
  isSending?: boolean;
} & Message;

const MessageBubble: React.FC<{
  item: MessageProps;
  recipientName: string;
  type: 'user' | 'company';
  chatData: any;
}> = ({ item, recipientName, type, chatData }) => {
  //   console.log('>>>>>>>> ~ MessageBubble ~ item:', item?.file);
  // Determine if the message belongs to the current viewer based on their role
  const isMyMessage = type === 'company' ? item.sender === 'company' : item.sender !== 'company';

  const openFile = () => {
    navigateTo(SCREENS.WebviewScreen, {
      link: item.file,
      title: '',
      type: 'employe',
    });
  };

  const isDocument =
    item.file?.includes('pdf') ||
    item.file?.includes('doc') ||
    item.file?.includes('docx');

  return (
    <View style={styles.messageContainer}>
      {!isMyMessage && (
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.avatarContainer}>
            <FastImage
              source={{
                uri: chatData?.company_id?.logo,
              }}
              style={styles.avatar}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View>
            <Text
              style={{
                ...styles.senderName,
                color: type === 'company' ? colors._0B3970 : colors._2F2F2F,
              }}>
              {recipientName}
            </Text>
            <Text
              style={{
                ...styles.timeText,
                color: type === 'company' ? colors._0B3970 : colors._2F2F2F,
              }}>
              {moment(item.createdAt).format('hh:mm A')}
            </Text>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }}>
        {isMyMessage && (
          <Text style={{ ...styles.timeText, alignSelf: 'flex-end', color: type === 'user' ? colors._2F2F2F : colors.white }}>
            {moment(item?.createdAt).format('hh:mm A')}
          </Text>
        )}

        {item?.message && (
          <View
            style={[
              styles.bubble,
              isMyMessage
                ? styles.userBubble
                : {
                  ...styles.otherBubble,
                  backgroundColor: colors._0B3970,
                },
            ]}>
            <BaseText
              style={[
                styles.messageText,
                isMyMessage ? styles.userText : styles.otherText,
              ]}>
              {item.message}
            </BaseText>
          </View>
        )}

        {item?.file && (
          <View
            style={[
              styles.attachmentContainer,
              { alignSelf: isMyMessage ? 'flex-end' : 'flex-start' },
            ]}>
            {isDocument ? (
              // Document attachment
              <TouchableOpacity onPress={openFile}>
                <FastImage
                  source={IMAGES.document}
                  style={styles.attachment}
                  defaultSource={IMAGES.document}
                  resizeMode={FastImage.resizeMode.contain}
                  tintColor={type === 'user' ? colors._E8CE92 : colors._0B3970}
                />
                <BaseText
                  style={{
                    marginTop: hp(2),
                    ...commonFontStyle(500, 13, type === 'user' ? colors._2F2F2F : colors.white),
                  }}>
                  {item?.file?.split('/').pop()}
                </BaseText>
              </TouchableOpacity>
            ) : (
              <>
                <CustomImage
                  source={{ uri: item?.file }}
                  onPress={() => {
                    if (item.isSending) return;
                    navigateTo(SCREENS.WebviewScreen, {
                      link: item.file,
                      title: '',
                      type: 'employe',
                    });
                  }}
                  imageStyle={{ width: '100%', height: '100%' }}
                  containerStyle={styles.imageContainer}
                  resizeMode="cover"
                />
                {item.isSending && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color={colors._0B3970} />
                    <Text style={styles.loadingText}>Sending...</Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}
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
    width: '100%',
    height: '100%',
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
    backgroundColor: colors.white,
    borderTopRightRadius: 0,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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

  // Enhanced attachment styles
  attachmentContainer: {
    marginTop: hp(10),
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
    width: wp(120),
    height: hp(120),
    borderRadius: hp(8),
    overflow: 'hidden',
    backgroundColor: '#f0f0f0', // Placeholder background
  },
  attachment: {
    width: wp(120),
    height: hp(120),
    borderRadius: hp(8),
    backgroundColor: '#f0f0f0', // Placeholder background
  },

  // Loading and error overlays
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.9)',
    borderRadius: hp(8),
  },
  loadingText: {
    marginTop: 5,
    fontSize: 10,
    color: '#666',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: hp(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
    borderStyle: 'dashed',
  },
  errorText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  retryCount: {
    fontSize: 9,
    color: '#999',
    marginTop: 2,
  },
  debugText: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
    opacity: 0.7,
  },
});
