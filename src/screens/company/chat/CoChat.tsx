import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {LinearContainer} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {navigationRef} from '../../../navigation/RootContainer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';

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
  const renderMessage = ({item, index}) => {
    const showAvatar = !item.isUser;
    return (
      <View style={[styles.messageContainer]}>
        {!item.isUser && (
          <View style={{flexDirection: 'row'}}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: 'https://content.presspage.com/templates/658/2042/729924/royal-atlantis-logo.png',
                }} // Replace with your actual logo
                style={styles.avatar}
              />
            </View>
            {!item.isUser && (
              <View>
                <Text style={styles.senderName}>Marriott Banvoy Hotels</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            )}
          </View>
        )}

        <View style={{flex: 1}}>
          <View
            style={[
              styles.bubble,
              item.isUser ? styles.userBubble : styles.otherBubble,
            ]}>
            <Text
              style={[
                styles.messageText,
                item.isUser ? styles.userText : styles.otherText,
              ]}>
              {item.text}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <KeyboardAwareScrollView
        extraHeight={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => {
                navigationRef.goBack();
              }}>
              <Image source={IMAGES.backArrow} style={styles.arrowIcon} />
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <Text style={styles.company}>Marriott Banvoy Hotels</Text>
              <Text style={styles.hrText}>Bilal Izhar HR Admin</Text>
            </View>
            <Image source={IMAGES.dots} style={styles.arrowIcon1} />
          </View>
        </View>

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
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        />

        {/* ✅ Moved inside ScrollView and fixed */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Write your message..."
            placeholderTextColor={colors.black}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => {}} style={{marginRight: 10}}>
            <ImageBackground source={IMAGES.btnBg1} style={styles.iconWrapper}>
              <Image
                source={IMAGES.pin}
                style={{width: 18, height: 18, resizeMode: 'contain'}}
              />
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={IMAGES.send} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(14),
    paddingVertical: hp(30),
    // position: 'absolute',
    // bottom: 0,
    // width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    // marginTop: 100,
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
});
