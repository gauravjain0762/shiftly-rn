/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect, useCallback} from 'react';
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
import {useSelector} from 'react-redux';
import moment from 'moment';

import {LinearContainer} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {navigationRef} from '../../../navigation/RootContainer';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {
  errorToast,
  formatDate,
  formatDateWithoutTime,
  goBack,
  navigateTo,
} from '../../../utils/commonFunction';
import {
  useLazyGetCompanyChatMessagesQuery,
  useSendCompanyMessageMutation,
} from '../../../api/dashboardApi';
import {onChatMessage} from '../../../hooks/socketManager';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import ChatInput from '../../../component/chat/ChatInput';
import FastImage from 'react-native-fast-image';
import {SCREENS} from '../../../navigation/screenNames';
import CustomImage from '../../../component/common/CustomImage';
// import MessageBubble from '../../../component/chat/MessageBubble';

// ---------- Types ----------
type Message = {
  _id?: string;
  sender: 'user' | 'company';
  message: string;
  createdAt: string;
  file?: string | null;
  file_type?: 'image' | null;
};

type LogoFile = {
  name: string;
  uri: string;
  type: string;
} | null;

// ---------- Components ----------

const CoChat = () => {
  const {params} = useRoute<any>();
  const jobdetail_chatData = params?.data ?? {};
  const mainjob_data = params?.mainjob_data ?? {};
  const isFromJobDetail = params?.isFromJobDetail ?? {};
  const chatId = params?.data?.chat_id || params?.data?._id || {};

  const userInfo = useSelector((state: any) => state.auth.userInfo);

  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [logo, setLogo] = useState<LogoFile>(null);
  const [showJobCard, setShowJobCard] = useState<boolean>(true);

  const [chatList, setChatList] = useState<Message[]>([]);

  const flatListRef = useRef<FlatList>(null);
  const [showDownIcon, setShowDownIcon] = useState(false);

  const handleChatScrollDown = () => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
    setShowDownIcon(false);
  };

  const MessageBubble = React.memo(
    ({
      item,
      recipientName,
      type,
    }: {
      item: Message;
      recipientName: string;
      type: 'user' | 'company';
    }) => {
      const isCompany = item.sender !== 'user';

      return (
        <View style={styles.messageContainer}>
          {!isCompany && (
            <View style={{flexDirection: 'row'}}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: jobdetail_chatData?.user_id?.picture,
                  }}
                  style={styles.avatar}
                />
              </View>
              <View>
                <Text style={styles.senderName}>{recipientName}</Text>
                <Text style={styles.timeText}>
                  {moment(item?.createdAt).format('hh:mm A')}
                </Text>
              </View>
            </View>
          )}

          <View style={{flex: 1}}>
            {isCompany && (
              <Text style={{...styles.timeText, alignSelf: 'flex-end'}}>
                {moment(item?.createdAt).format('hh:mm A')}
              </Text>
            )}
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
                <TouchableOpacity
                  onPress={() => {
                    navigateTo(SCREENS.WebviewScreen, {
                      link: item.file,
                      title: '',
                      type: 'company',
                    });
                  }}>
                  <FastImage
                    source={IMAGES.document}
                    defaultSource={IMAGES.document}
                    tintColor={
                      type === 'user' ? colors._E8CE92 : colors._0B3970
                    }
                    style={{
                      ...styles.attachment,
                      alignSelf: isCompany ? 'flex-end' : 'flex-start',
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    navigateTo(SCREENS.WebviewScreen, {
                      link: item?.file,
                      title: '',
                      type: 'company',
                    });
                  }}>
                  <FastImage
                    source={{uri: item?.file}}
                    style={{
                      ...styles.attachment,
                      alignSelf: isCompany ? 'flex-end' : 'flex-start',
                    }}
                  />
                </TouchableOpacity>
              )
            ) : null}
          </View>
        </View>
      );
    },
  );

  // ----- Detect scroll -----
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 200) {
      setShowDownIcon(true);
    } else {
      setShowDownIcon(false);
    }
  };

  // ----- API hooks -----
  const [sendCompanyMessage] = useSendCompanyMessageMutation();
  const [getCompanyChatMessages, {data: chats}] =
    useLazyGetCompanyChatMessagesQuery();

  // ----- Load messages -----
  useEffect(() => {
    if (isFromJobDetail) {
      console.log('>>> user_id', jobdetail_chatData?.user_id?._id);
      console.log('>>> job_id', mainjob_data?._id);
      getCompanyChatMessages({
        user_id: jobdetail_chatData?.user_id?._id,
        job_id: mainjob_data?._id,
      });
    } else {
      console.log('🔥 ~ CoChat ~ chatId:', chatId);
      getCompanyChatMessages({
        chat_id: chatId,
      });
    }
  }, [chatId, getCompanyChatMessages]);

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

    if (isFromJobDetail) {
      formData.append(
        // 'user_id',
        // chatId !== null ? userInfo?._id : jobdetail_chatData?.user_id?._id,
        'user_id',
        jobdetail_chatData?.user_id?._id,
      );
      formData.append('job_id', mainjob_data?._id);
    } else {
      formData.append('chat_id', chatId);
    }
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
    <LinearContainer colors={['#EFEEF3', '#FFFFFF']}>
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
                  {chats?.data?.chat?.user_id?.name ||
                    jobdetail_chatData?.user_id?.name}
                </Text>
              </View>
              <CustomImage
                onPress={() => {
                  setShowJobCard(prev => !prev);
                }}
                size={wp(24)}
                tintColor={colors.black}
                source={showJobCard ? IMAGES.eye_on : IMAGES.eye}
              />
            </View>
          </View>

          {/* BODY */}
          <View style={{flex: 1}}>
            {showJobCard && (
              <View style={styles.card}>
                <Text style={styles.dateText}>
                  You applied to this position on{' '}
                  {formatDateWithoutTime(jobdetail_chatData?.createdAt)}
                </Text>
                <Text style={styles.jobTitle}>
                  {`${
                    mainjob_data?.title ||
                    jobdetail_chatData?.job_id?.title ||
                    'N/A'
                  } - ${
                    mainjob_data?.contract_type ||
                    jobdetail_chatData?.job_id?.contract_type ||
                    'N/A'
                  }`}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (isFromJobDetail) {
                      goBack();
                    } else {
                      navigateTo(SCREENS.CoJobDetails, {
                        _id: jobdetail_chatData?.job_id?._id,
                      });
                    }
                  }}
                  style={styles.button}>
                  <Text style={styles.buttonText}>View Job</Text>
                </TouchableOpacity>
              </View>
            )}

            <FlatList
              ref={flatListRef}
              data={chatList}
              renderItem={({item}) => (
                <MessageBubble
                  item={item}
                  type={'company'}
                  recipientName={chats?.data?.chat?.user_id?.name}
                />
              )}
              keyExtractor={(item, index) => item._id ?? index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chatContent}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              inverted
            />
          </View>

          {showDownIcon && (
            <Pressable onPress={handleChatScrollDown} style={styles.downIcon}>
              <CustomImage
                size={wp(22)}
                source={IMAGES.down_arrow}
                tintColor={colors?.coPrimary}
              />
            </Pressable>
          )}

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
          isGalleryEnable={false}
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
    width: '100%',
    height: '100%',
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
    backgroundColor: colors._FEFEFE,
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
    borderRadius: hp(8),
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
  downIcon: {
    position: 'absolute',
    bottom: hp(100),
    alignSelf: 'center',
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors._104686,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
