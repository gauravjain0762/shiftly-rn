import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {LinearContainer} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {useRoute} from '@react-navigation/native';
import {colors} from '../../../theme/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {navigationRef} from '../../../navigation/RootContainer';
import {
  useEmployeeGetChatMessagesQuery,
  useEmployeeSendMessageMutation,
} from '../../../api/dashboardApi';
import moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import {errorToast} from '../../../utils/commonFunction';

const Chat = () => {
  const {params} = useRoute<any>();
  const data = params?.data;
  const chatId = data?._id;

  const [isImagePickerVisible, setImagePickerVisible] =
    useState<boolean>(false);
  const [message, setMessage] = useState<string | number | any>('');
  const [sendMessage] = useEmployeeSendMessageMutation();
  const {data: chats, refetch} = useEmployeeGetChatMessagesQuery(chatId);
  const recipientDetails = chats?.data?.chat || {};
  const allChats = chats?.data?.messages || [];
  const [logo, setLogo] = useState<any | {}>();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (allChats.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: Number.MAX_SAFE_INTEGER,
          animated: true,
        });
        flatListRef.current?.scrollToOffset({
          offset: Number.MAX_SAFE_INTEGER - 40,
          animated: true,
        });
      }, 100);
    }
  }, [allChats]);

  const handleSendChat = async () => {
    if (!message?.trim()) {
      return;
    }

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('message', message);
    formData.append('file', logo);
    try {
      const res = await sendMessage(formData).unwrap();
      if (res?.status) {
        setMessage('');
        setLogo(null);
        // successToast(res?.message);
        await refetch();
        console.log('res message', res);
      } else {
        errorToast(res?.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error Sending message', error);
    }
  };

  const renderMessage = ({item, index}: any) => {
    return (
      <View key={index} style={[styles.messageContainer]}>
        {item.sender === 'company' && (
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
              <Text style={styles.senderName}>
                {recipientDetails?.company_id?.company_name}
              </Text>
              <Text style={styles.timeText}>
                {moment(item?.time).format('hh:mm A')}
              </Text>
            </View>
          </View>
        )}

        <View style={{flex: 1}}>
          <View
            style={[
              styles.bubble,
              item?.sender !== 'company'
                ? styles.userBubble
                : styles.otherBubble,
            ]}>
            <Text
              style={[
                styles.messageText,
                item?.sender !== 'company' ? styles.userText : styles.otherText,
              ]}>
              {item?.message}
            </Text>
          </View>
          {item?.file_type === 'image' &&
          item?.file_type !== null &&
          item?.file !== null ? (
            <Image source={{uri: item?.file}} style={styles.attachment} />
          ) : null}
        </View>
      </View>
    );
  };

  const handleImageSelected = (e: any) => {
    const uri = e?.sourceURL || e?.path || e?.uri;
    if (!uri) return;

    const newLogo = {
      name: e?.filename || e?.name || 'logo.jpg',
      uri,
      type: e?.mime || 'image/jpeg',
    };

    setLogo(newLogo);
  };

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => {
                navigationRef.goBack();
              }}>
              <Image source={IMAGES.backArrow} style={styles.arrowIcon} />
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <Text style={styles.company}>
                {recipientDetails?.company_id?.company_name}
              </Text>
              {/* <Text style={styles.hrText}>Bilal Izhar HR Admin</Text> */}
            </View>
            <Image source={IMAGES.dots} style={styles.arrowIcon1} />
          </View>
        </View>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // adjust header height if needed
        >
          <View style={styles.card}>
            <Text style={styles.dateText}>
              You applied to this position on 18 October 2024.
            </Text>
            <Text style={styles.jobTitle}>Restaurant Manager - Full Time</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View Job</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={allChats}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatContent}
            keyExtractor={(_, index) => index.toString()}
            onContentSizeChange={() => {
              if (allChats.length > 0) {
                flatListRef.current?.scrollToEnd({animated: true});
              }
            }}
            onLayout={() => {
              if (allChats.length > 0) {
                flatListRef.current?.scrollToEnd({animated: true});
              }
            }}
          />

          <View style={styles.inputContainer}>
            {logo && (
              <View>
                <Pressable
                  onPress={() => setLogo(null)}
                  style={styles.closeContainer}>
                  <Image
                    tintColor={'red'}
                    source={IMAGES.close_icon}
                    style={styles.close}
                  />
                </Pressable>
                <Image source={{uri: logo.uri}} style={styles.logo} />
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextInput
                value={message}
                style={styles.input}
                onChangeText={setMessage}
                placeholderTextColor="#fff"
                placeholder="Write your message..."
              />
              <TouchableOpacity
                onPress={() => {
                  setImagePickerVisible(true);
                }}
                style={{marginRight: 10}}>
                <ImageBackground
                  source={IMAGES.btnBg1}
                  style={styles.iconWrapper}>
                  <Image
                    source={IMAGES.pin}
                    style={{width: 18, height: 18, resizeMode: 'contain'}}
                  />
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSendChat()}>
                <Image source={IMAGES.send} style={styles.sendIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        <ImagePickerModal
          actionSheet={isImagePickerVisible}
          setActionSheet={() => setImagePickerVisible(false)}
          onUpdate={(image: any) => handleImageSelected(image)}
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
  },
  arrowIcon1: {
    width: 3,
    height: 15,
    alignSelf: 'center',
  },
  company: {
    alignSelf: 'flex-start',
    ...commonFontStyle(700, 20, '#fff'),
  },
  hrText: {
    ...commonFontStyle(400, 13, '#fff'),
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
    paddingTop: hp(4),
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
    ...commonFontStyle(600, 16, '#fff'),
    marginBottom: hp(4),
  },
  timeText: {
    ...commonFontStyle(400, 12, '#fff'),
    marginBottom: hp(11),
  },
  bubble: {
    borderRadius: 25,
    paddingVertical: hp(12),
    paddingHorizontal: wp(18),
    maxWidth: '85%',
  },
  otherBubble: {
    backgroundColor: '#2D5B89',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: '#FFE8BB',
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
    paddingVertical: hp(15),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  input: {
    flex: 1,
    ...commonFontStyle(400, 14, '#fff'),
    marginRight: 4,
  },
  iconWrapper: {
    width: 39,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 47,
    height: 47,
    marginLeft: wp(2),
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
