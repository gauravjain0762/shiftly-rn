/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {BackHeader, LinearContainer} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {
  useEmployeeSendMessageMutation,
  useLazyEmployeeGetChatMessagesQuery,
} from '../../../api/dashboardApi';
import {
  errorToast,
  formatDateWithoutTime,
  navigateTo,
} from '../../../utils/commonFunction';
import {onChatMessage} from '../../../hooks/socketManager';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import MessageBubble from '../../../component/chat/MessageBubble';
import ChatInput from '../../../component/chat/ChatInput';
import CustomImage from '../../../component/common/CustomImage';
import {colors} from '../../../theme/colors';
import {SCREENS} from '../../../navigation/screenNames';

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
};

type LogoFile = {
  name: string;
  uri: string;
  type: string;
} | null;

const Chat = () => {
  const {params} = useRoute<any>();
  const jobdetail_chatData = params?.data ?? {};
  const chatId = params?.data?.chat_id;
  const flatListRef = useRef<FlatList>(null);

  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [logo, setLogo] = useState<LogoFile>(null);

  const [sendMessage] = useEmployeeSendMessageMutation();
  const [getEmployeeChatMessages, {data: chats}] =
    useLazyEmployeeGetChatMessagesQuery(chatId);
  const chatData = chats?.data?.chat;
  const [chatList, setChatList] = useState<Message[]>([]);
  const [showDownIcon, setShowDownIcon] = useState(false);
  const [showJobCard, setShowJobCard] = useState<boolean>(true);

  const handleChatScrollDown = () => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
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
  }, [chatId, getEmployeeChatMessages]);

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

    try {
      const res = await sendMessage(formData).unwrap();
      if (res?.status) {
        setChatList(prev => [res?.data?.message, ...prev]);
        setMessage('');
        setLogo(null);
      } else {
        errorToast(res?.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('❌ Error sending message:', err);
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

  return (
    <LinearContainer colors={['#EFEEF3', '#FFFFFF']}>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        {/* Header */}
        <View style={styles.container}>
          <BackHeader
            title={jobdetail_chatData?.company_name || 'Unknown'}
            RightIcon={
              <CustomImage
                onPress={() => {
                  setShowJobCard(prev => !prev);
                }}
                size={wp(24)}
                tintColor={colors._0B3970}
                source={showJobCard ? IMAGES.eye_on : IMAGES.eye}
              />
            }
            titleStyle={{
              flex: 1,
              paddingHorizontal: hp(10),
            }}
          />
        </View>

        {/* Chat body */}
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
          {/* Job card */}
          {showJobCard && (
            <View style={styles.card}>
              <Text style={styles.dateText}>
                You applied to this position on{' '}
                {formatDateWithoutTime(jobdetail_chatData?.created_at)}
              </Text>
              <Text style={styles.jobTitle}>
                {' '}
                {`${jobdetail_chatData?.job_title || 'N/A'} - ${
                  jobdetail_chatData?.job_type || 'N/A'
                }`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigateTo(SCREENS.JobDetail, {
                    item: jobdetail_chatData?.job_id,
                  });
                }}
                style={styles.button}>
                <Text style={styles.buttonText}>View Job</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={chatList}
            renderItem={({item}) => (
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

          {/* Input */}

          <ChatInput
            image={logo}
            setImage={setLogo}
            handleSendChat={handleSendChat}
            message={message}
            setMessage={setMessage}
            onPressAttachment={() => setImagePickerVisible(true)}
            type={'user'}
          />
        </KeyboardAvoidingView>

        {/* Image picker */}
        <ImagePickerModal
          actionSheet={isImagePickerVisible}
          setActionSheet={() => setImagePickerVisible(false)}
          onUpdate={handleImageSelected}
          allowDocument={true}
          isGalleryEnable={false}
        />
      </SafeAreaView>
    </LinearContainer>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: hp(18),
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
    bottom: hp(100),
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
});
