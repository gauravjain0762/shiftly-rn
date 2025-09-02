/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import moment from 'moment';

import {LinearContainer} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {navigationRef} from '../../../navigation/RootContainer';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {errorToast} from '../../../utils/commonFunction';
import {
  useLazyGetCompanyChatMessagesQuery,
  useSendCompanyMessageMutation,
} from '../../../api/dashboardApi';
import {onChatMessage} from '../../../hooks/socketManager';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import ChatInput from '../../../component/chat/ChatInput';
import FastImage from 'react-native-fast-image';
// import MessageBubble from '../../../component/chat/MessageBubble';

// ---------- Types ----------
type Message = {
  _id?: string;
  sender: 'user' | 'company';
  message: string;
  time: string;
  file?: string | null;
  file_type?: 'image' | null;
};

type LogoFile = {
  name: string;
  uri: string;
  type: string;
} | null;

// ---------- Components ----------
const MessageBubble = React.memo(
  ({item, recipientName}: {item: Message; recipientName: string}) => {
    const isCompany = item.sender !== 'user';

    return (
      <View style={styles.messageContainer}>
        {!isCompany && (
          <View style={{flexDirection: 'row'}}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: 'https://content.presspage.com/templates/658/2042/729924/royal-atlantis-logo.png',
                }}
                style={styles.avatar}
              />
            </View>
            <View>
              <Text style={styles.senderName}>{recipientName}</Text>
              <Text style={styles.timeText}>
                {moment(item.time).format('hh:mm A')}
              </Text>
            </View>
          </View>
        )}

        <View style={{flex: 1}}>
          {item.message && (
            <View
              style={[
                styles.bubble,
                isCompany ? styles.userBubble : styles.otherBubble,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  isCompany ? styles.userText : styles.otherText,
                ]}>
                {item.message}
              </Text>
            </View>
          )}

          {item.file ? (
            item.file?.includes('pdf') ||
            item.file?.includes('doc') ||
            item.file?.includes('docx') ? (
              <FastImage
                source={IMAGES.pdfIcon}
                style={{
                  ...styles.attachment,
                  alignSelf: isCompany ? 'flex-end' : 'flex-start',
                }}
              />
            ) : (
              <FastImage
                source={{uri: item.file}}
                style={{
                  ...styles.attachment,
                  alignSelf: isCompany ? 'flex-end' : 'flex-start',
                }}
              />
            )
          ) : null}
        </View>
      </View>
    );
  },
);

const CoChat = () => {
  const {params} = useRoute<any>();
  const chatId = params?.data?._id;
  const userInfo = useSelector((state: any) => state.auth.userInfo);

  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [logo, setLogo] = useState<LogoFile>(null);

  const [chatList, setChatList] = useState<Message[]>([]);

  const flatListRef = useRef<FlatList>(null);

  // ----- API hooks -----
  const [sendCompanyMessage] = useSendCompanyMessageMutation();
  const [getCompanyChatMessages, {data: chats}] =
    useLazyGetCompanyChatMessagesQuery();

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
    formData.append('user_id', userInfo?._id);
    formData.append('message', message);

    if (logo) {
      formData.append('file', logo as any);
    }

    try {
      const res = await sendCompanyMessage(formData).unwrap();
      if (res?.status) {
        setChatList(prev => [res?.data?.message, ...prev]);
        setMessage('');
        setLogo(null);
      } else {
        errorToast(res?.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('❌ Error sending message', error);
    }
  };

  // ----- Image picker -----
  const handleImageSelected = useCallback((img: any) => {
    const uri = img?.sourceURL || img?.path || img?.uri;
    if (!uri) return;

    setLogo({
      name: img?.filename || img?.name || 'image.jpg',
      uri,
      type: img?.mime || 'image/jpeg',
    });
  }, []);

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
          {/* HEADER */}
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigationRef.goBack()}>
                <Image source={IMAGES.backArrow} style={styles.arrowIcon} />
              </TouchableOpacity>
              <View style={{flex: 1}}>
                <Text style={styles.company}>
                  {chats?.data?.chat?.user_id?.name || ''}
                </Text>
              </View>
              <Image source={IMAGES.dots} style={styles.arrowIcon1} />
            </View>
          </View>

          {/* BODY */}
          <View style={{flex: 1}}>
            {/* Job card */}
            <View style={styles.card}>
              <Text style={styles.dateText}>
                You applied to this position on 18 October 2024.
              </Text>
              <Text style={styles.jobTitle}>
                Restaurant Manager - Full Time
              </Text>
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
                  recipientName={chats?.data?.chat?.user_id?.name}
                  // type={'company'}
                />
              )}
              keyExtractor={(item, index) => item._id ?? index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chatContent}
              inverted
            />
          </View>

          {/* INPUT */}

          <ChatInput
            image={logo}
            setImage={setLogo}
            handleSendChat={handleSendChat}
            message={message}
            setMessage={setMessage}
            onPressAttachment={() => setImagePickerVisible(true)}
            type={'company'}
          />
        </KeyboardAvoidingView>

        {/* Image picker */}
        <ImagePickerModal
          actionSheet={isImagePickerVisible}
          setActionSheet={() => setImagePickerVisible(false)}
          onUpdate={handleImageSelected}
          allowDocument
        />
      </SafeAreaView>
    </LinearContainer>
  );
};

export default CoChat;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: hp(18),
    paddingHorizontal: wp(22),
  },
  back: {
    width: wp(21),
    height: wp(21),
    resizeMode: 'contain',
  },
  headerRow: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: hp(18),
  },
  arrowIcon: {
    width: 20,
    height: 20,
    alignSelf: 'flex-start',
    marginRight: wp(17),
    tintColor: colors?._0B3970,
  },
  arrowIcon1: {
    width: 3,
    height: 15,
    alignSelf: 'center',
  },
  company: {
    alignSelf: 'flex-start',
    ...commonFontStyle(700, 20, colors._0B3970),
  },
  hrText: {
    ...commonFontStyle(400, 13, colors.black),
    marginTop: 5,
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
  messageContainer: {
    // flexDirection: 'row',
    marginBottom: hp(2),
    marginTop: 20,
  },
  left: {
    alignSelf: 'flex-start',
  },
  right: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
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
    ...commonFontStyle(600, 16, colors._0B3970),
    marginBottom: hp(4),
  },
  timeText: {
    ...commonFontStyle(400, 12, colors.black),
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
  inputContainer: {
    paddingHorizontal: wp(14),
    paddingVertical: hp(10),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    flex: 1,
    ...commonFontStyle(400, 14, colors.black),
    marginRight: 4,
  },
  iconWrapper: {
    width: 39,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
    tintColor: '#C8B380',
  },
  sendIcon: {
    width: 47,
    height: 47,
    marginLeft: wp(2),
    tintColor: colors._0B3970,
  },
  attachment: {
    width: wp(120),
    height: hp(120),
    marginTop: hp(10),
    alignSelf: 'flex-end',
  },
  closeContainer: {
    zIndex: 9999,
    left: wp(40),
    bottom: hp(40),
    overflow: 'visible',
    borderRadius: hp(50),
    position: 'absolute',
    backgroundColor: colors.white,
  },
  close: {
    width: wp(22),
    height: hp(22),
  },
  logo: {height: hp(55), width: wp(55)},
});
