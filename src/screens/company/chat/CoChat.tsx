import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {LinearContainer} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {navigationRef} from '../../../navigation/RootContainer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {errorToast} from '../../../utils/commonFunction';
import {useRoute} from '@react-navigation/native';
import {
  useGetCompanyChatMessagesQuery,
  useSendCompanyMessageMutation,
} from '../../../api/dashboardApi';
import {useSelector} from 'react-redux';
import moment from 'moment';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import {SafeAreaView} from 'react-native-safe-area-context';

const messages = [
  {
    id: '1',
    sender: 'Marriott',
    time: '09:45 AM',
    text: 'Sed ut perspiciatis unde omnis iste natus dolim voluptatem accusantium.',
    isUser: false,
  },
  {
    id: '2',
    sender: 'user',
    time: '',
    text: 'Sed ut perspiciatis unde omnis iste natus dolim voluptatem accusantium.',
    isUser: true,
  },
  {
    id: '3',
    sender: 'user',
    time: '',
    text: 'omnis iste natus',
    isUser: true,
  },
  {
    id: '4',
    sender: 'Marriott',
    time: '09:49 AM',
    text: 'Sed ut perspiciatis unde omnis iste natus dolim voluptatem accusantium.',
    isUser: false,
  },
  {
    id: '5',
    sender: 'user',
    time: '',
    text: 'Sed ut perspiciatis unde omnis iste natus dolim voluptatem accusantium.',
    isUser: true,
  },
];

const CoChat = () => {
  const {params} = useRoute<any>();
  const data = params?.data;
  const chatId = data?._id;
  console.log('🔥🔥🔥 ~ CoChat ~ chatId:', chatId);
  const userInfo = useSelector((state: any) => state.auth.userInfo);

  const [isImagePickerVisible, setImagePickerVisible] =
    useState<boolean>(false);
  const [message, setMessage] = useState<string | number | any>('');
  console.log('🔥🔥🔥 ~ CoChat ~ message:', message);
  const [sendCompanyMessage] = useSendCompanyMessageMutation();
  const {data: chats, refetch} = useGetCompanyChatMessagesQuery(chatId);
  const recipientDetails = chats?.data?.chat || {};
  const allChats = chats?.data?.messages || [];
  const [logo, setLogo] = useState<any | {}>();

  const handleSendChat = async () => {
    if (!message?.trim()) {
      return;
    }

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('user_id', userInfo?._id);
    formData.append('message', message);
    formData.append('file', logo);
    try {
      const res = await sendCompanyMessage(formData).unwrap();
      if (res?.status) {
        setMessage('');
        setLogo(null);
        await refetch();
        console.log('res message', res);
      } else {
        errorToast(res?.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error Sending message', error);
    }
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

  const renderMessage = ({item, index}: any) => {
    return (
      <View key={index} style={[styles.messageContainer]}>
        {item.sender === 'user' && (
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
                {recipientDetails?.user_id?.name || 'Test User'}
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
              item.sender !== 'user' ? styles.userBubble : styles.otherBubble,
            ]}>
            <Text
              style={[
                styles.messageText,
                item.sender !== 'user' ? styles.userText : styles.otherText,
              ]}>
              {item.message}
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

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
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
                {recipientDetails?.company_id?.company_name || 'Test User'}
              </Text>
              {/* <Text style={styles.hrText}>Bilal Izhar HR Admin</Text> */}
            </View>
            <Image source={IMAGES.dots} style={styles.arrowIcon1} />
          </View>
        </View>
        <KeyboardAwareScrollView
          extraHeight={20}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}>
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
            data={allChats}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
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
                placeholder="Write your message..."
                placeholderTextColor={colors.black}
                style={styles.input}
                value={message}
                onChangeText={setMessage}
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
        </KeyboardAwareScrollView>
        <ImagePickerModal
          actionSheet={isImagePickerVisible}
          setActionSheet={() => setImagePickerVisible(false)}
          onUpdate={(image: any) => handleImageSelected(image)}
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
    paddingVertical: hp(30),
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
