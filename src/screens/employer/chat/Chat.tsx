/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { BackHeader, LinearContainer } from '../../../component';
import { IMAGES } from '../../../assets/Images';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import {
  useEmployeeSendMessageMutation,
  useLazyEmployeeGetChatMessagesQuery,
} from '../../../api/dashboardApi';
import {
  errorToast,
  formatDateWithoutTime,
  isAndroid,
  navigateTo,
} from '../../../utils/commonFunction';
import { onChatMessage } from '../../../hooks/socketManager';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import MessageBubble from '../../../component/chat/MessageBubble';
import ChatInput from '../../../component/chat/ChatInput';
import CustomImage from '../../../component/common/CustomImage';
import { colors } from '../../../theme/colors';
import { SCREENS } from '../../../navigation/screenNames';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { IS_IOS } from 'react-native-reanimated/lib/typescript/common';

// ---------- Types ----------
export type Message = {
  chat_id: string;
  createdAt: string;
  file: string | null;
  file_type: 'image' | null;
  message: string;
  sender: 'user' | 'company';
  updatedAt: string;
  __v: number;
  _id: string;
  isSending?: boolean;
};

type LogoFile = {
  name: string;
  uri: string;
  type: string;
} | null;

const quickReplies = ['I am interested', 'When is the interview?', 'I am available', 'Can we reschedule?'];

const Chat = () => {
  const insets = useSafeAreaInsets();
  const { params } = useRoute<any>();
  const jobdetail_chatData = params?.data;
  const chatId = params?.data?.chat_id;
  const flatListRef = useRef<FlatList>(null);

  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [logo, setLogo] = useState<LogoFile>(null);

  const [sendMessage] = useEmployeeSendMessageMutation();
  const [getEmployeeChatMessages, { data: chats }] =
    useLazyEmployeeGetChatMessagesQuery(chatId);
  const chatData = chats?.data?.chat;
  const [chatList, setChatList] = useState<Message[]>([]);
  const [showDownIcon, setShowDownIcon] = useState(false);
  const [showJobCard, setShowJobCard] = useState<boolean>(true);

  const handleChatScrollDown = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setShowDownIcon(false);
  };

  // ----- Detect scroll -----
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 200) {
      setShowDownIcon(true);
    } else {
      setShowDownIcon(false);
    }
  };

  // ----- Load messages -----
  useEffect(() => {
    if (chatId) {
      getEmployeeChatMessages(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    if (chats?.data?.messages) {
      let messages = chats?.data?.messages || [];
      if (messages.length > 0) {
        setChatList([...messages].reverse());
      }
    }
  }, [chats]);

  // ----- Socket listener -----
  useEffect(() => {
    onChatMessage((newMessage: any) => {
      console.log('📩 New chat message:', newMessage);
      setChatList(prev => [newMessage, ...prev]);
    });
  }, []);

  // ----- Send chat -----
  const handleSendChat = async () => {
    if (!message.trim() && !logo) return;

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('message', message);

    if (logo) {
      formData.append('file', logo as any);
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: any = {
      _id: tempId,
      chat_id: chatId,
      message: message,
      sender: 'user',
      createdAt: new Date().toISOString(),
      file: logo ? logo.uri : null,
      file_type: logo ? 'image' : null,
      isSending: true,
    };

    setChatList(prev => [optimisticMessage, ...prev]);
    setMessage('');
    setLogo(null);

    try {
      const res = await sendMessage(formData).unwrap();
      if (res?.status) {
        setChatList(prev =>
          prev.map(msg => (msg._id === tempId ? { ...res?.data?.message, isSending: false } : msg))
        );
      } else {
        setChatList(prev => prev.filter(msg => msg._id !== tempId));
        errorToast(res?.message || 'Failed to send message');
      }
    } catch (err) {
      setChatList(prev => prev.filter(msg => msg._id !== tempId));
      console.error('❌ Error sending message:', err);
      errorToast('Failed to send message');
    }
  };

  // ----- Image picker -----
  const handleImageSelected = useCallback((img: any) => {
    const uri = img?.sourceURL || img?.path || img?.uri;
    if (!uri) return;

    setLogo({
      name: img?.filename || img?.name || 'image.jpg',
      uri,
      type: img?.type || img?.mime || 'image/jpeg',
    });
  }, []);

  // ----- Quick reply handler -----
  const handleQuickReply = (reply: string) => {
    setMessage(reply);
  };

  return (
      <View style={{ flex: 1, paddingBottom: isAndroid ? 0 : hp(25), paddingTop: insets.top, backgroundColor: Colors.white}}>
        <View style={styles.container}>
          <BackHeader
            title={jobdetail_chatData?.company_name || 'Unknown'}
            // RightIcon={
            //   <CustomImage
            //     onPress={() => {
            //       setShowJobCard(prev => !prev);
            //     }}
            //     size={wp(24)}
            //     tintColor={colors._0B3970}
            //     source={showJobCard ? IMAGES.eye_on : IMAGES.eye}
            //   />
            // }
            titleStyle={{
              flex: 1,
              paddingHorizontal: hp(10),
            }}
          />
        </View>

        {/* {showJobCard && (
          <View style={styles.card}>
            <Text style={styles.dateText}>
              You applied to this position on{' '}
              {formatDateWithoutTime(jobdetail_chatData?.created_at)}
            </Text>
            <Text style={styles.jobTitle}>
              {' '}
              {`${jobdetail_chatData?.job_title || 'N/A'}`}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigateTo(SCREENS.JobDetail, {
                  jobId:
                    typeof jobdetail_chatData?.job_id === 'object'
                      ? jobdetail_chatData?.job_id?._id
                      : jobdetail_chatData?.job_id,
                });
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>View Job</Text>
            </TouchableOpacity>
          </View>
        )} */}

        <KeyboardAvoidingView
          style={{ flex: 1, }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
          <FlatList
            ref={flatListRef}
            data={chatList}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <MessageBubble
                item={item}
                recipientName={
                  chats?.data?.chat?.company_id?.company_name || ''
                }
                type={'user'}
                chatData={chatData}
              />
            )}
            keyExtractor={(item, index) => item._id ?? index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatContent}
            inverted
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />

          {showDownIcon && (
            <Pressable onPress={handleChatScrollDown} style={styles.downIcon}>
              <CustomImage source={IMAGES.down_arrow} size={wp(22)} tintColor={colors.white} />
            </Pressable>
          )}

          <View style={{ paddingBottom: hp(0) }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickRepliesContainer}
              style={styles.quickRepliesScrollView}>
              {quickReplies.map((reply, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickReplyButton}
                  onPress={() => handleQuickReply(reply)}>
                  <Text style={styles.quickReplyText}>{reply}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ChatInput
              image={logo}
              setImage={setLogo}
              handleSendChat={handleSendChat}
              message={message}
              setMessage={setMessage}
              onPressAttachment={() => setImagePickerVisible(true)}
              type={'user'}
            />
          </View>
        </KeyboardAvoidingView>

        <ImagePickerModal
          actionSheet={isImagePickerVisible}
          setActionSheet={() => setImagePickerVisible(false)}
          onUpdate={handleImageSelected}
          allowDocument={true}
          isGalleryEnable={false}
        />
      </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    paddingTop: hp(8),
    paddingHorizontal: wp(22),
  },

  dotIcon: {
    width: 3,
    height: 15,
    alignSelf: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: wp(14),
    alignItems: 'center',
    marginHorizontal: wp(22),
  },
  dateText: {
    ...commonFontStyle(400, 14, colors._2F2F2F),
    marginBottom: 5,
    textAlign: 'center',
  },
  jobTitle: {
    ...commonFontStyle(700, 14, colors._2F2F2F),
    marginBottom: hp(4),
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors._0B3970,
    paddingHorizontal: wp(19),
    paddingVertical: hp(9),
    borderRadius: 25,
    marginTop: 11,
  },
  buttonText: {
    ...commonFontStyle(600, 14, '#fff'),
  },

  chatContent: {
    paddingTop: hp(15),
    paddingBottom: hp(10),
    paddingHorizontal: wp(22),
  },
  downIcon: {
    position: 'absolute',
    bottom: hp(140),
    alignSelf: 'center',
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors._0B3970,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quickRepliesScrollView: {
    maxHeight: hp(50),
    flexShrink: 0,
    marginBottom: hp(8),
  },
  quickRepliesContainer: {
    paddingHorizontal: wp(22),
    gap: wp(10),
    alignItems: 'center',
  },
  quickReplyButton: {
    backgroundColor: colors._0B3970,
    paddingHorizontal: wp(16),
    paddingVertical: hp(10),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickReplyText: {
    ...commonFontStyle(600, 14, colors.white),
  },
});
