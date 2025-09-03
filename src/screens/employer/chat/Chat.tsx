/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  FlatList,
  Image,
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
  useLazyGetCompanyChatMessagesQuery,
} from '../../../api/dashboardApi';
import {errorToast} from '../../../utils/commonFunction';
import {onChatMessage} from '../../../hooks/socketManager';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import MessageBubble from '../../../component/chat/MessageBubble';
import ChatInput from '../../../component/chat/ChatInput';
import CustomImage from '../../../component/common/CustomImage';
import {colors} from '../../../theme/colors';

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
  const chatId = params?.data?._id;
  const flatListRef = useRef<FlatList>(null);

  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [logo, setLogo] = useState<LogoFile>(null);

  const [sendMessage] = useEmployeeSendMessageMutation();
  // const {data: chats, refetch} = useEmployeeGetChatMessagesQuery(chatId);
  const [getCompanyChatMessages, {data: chats}] =
    useLazyGetCompanyChatMessagesQuery();
  const [chatList, setChatList] = useState<Message[]>([]);
  const [showDownIcon, setShowDownIcon] = useState(false);

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
      getCompanyChatMessages(chatId);
    }
  }, [chatId, getCompanyChatMessages]);

  useEffect(() => {
    if (chats?.data?.messages) {
      let messages = chats?.data?.messages || [];
      if (messages.length > 0) {
        setChatList([...messages].reverse()); // newest first
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
    <LinearContainer colors={['#0D468C', '#041326']}>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        {/* Header */}
        <View style={styles.container}>
          <BackHeader
            title={chats?.data?.chat?.company_id?.company_name || ''}
            RightIcon={<Image source={IMAGES.dots} style={styles.dotIcon} />}
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
          <View style={styles.card}>
            <Text style={styles.dateText}>
              You applied to this position on 18 October 2024.
            </Text>
            <Text style={styles.jobTitle}>Restaurant Manager - Full Time</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View Job</Text>
            </TouchableOpacity>
          </View>

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
              <CustomImage source={IMAGES.down_arrow} size={wp(22)} />
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
    ...commonFontStyle(400, 14, '#000'),
    marginBottom: 5,
    textAlign: 'center',
  },
  jobTitle: {
    ...commonFontStyle(700, 14, '#000'),
    marginBottom: hp(4),
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#014389',
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
    backgroundColor: colors.coPrimary,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
