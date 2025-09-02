/* eslint-disable react-native/no-inline-styles */
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';

type Props = {
  message: string;
  setMessage: (message: string) => void;
  handleSendChat: () => void;
  onPressAttachment: () => void;
  image: any;
  setImage: (logo: any) => void;
};

const ChatInput = ({
  message,
  setMessage,
  handleSendChat,
  onPressAttachment,
  image,
  setImage,
}: Props) => {
  console.log('image', image);
  return (
    <View style={styles.inputContainer}>
      {image?.uri ? (
        <View>
          <Pressable
            onPress={() => setImage(null)}
            style={styles.closeContainer}>
            <FastImage
              tintColor={'red'}
              source={IMAGES.close_icon}
              style={styles.close}
              defaultSource={IMAGES.close_icon}
            />
          </Pressable>
          {image?.uri?.includes('image') ? (
            <FastImage source={{uri: image.uri}} style={styles.logo} />
          ) : (
            <FastImage
              source={IMAGES.pdfIcon}
              defaultSource={IMAGES.pdfIcon}
              style={styles.logo}
            />
          )}
        </View>
      ) : (
        <></>
      )}

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          value={message}
          style={styles.input}
          onChangeText={setMessage}
          placeholderTextColor="#fff"
          placeholder="Write your message..."
        />
        <TouchableOpacity onPress={onPressAttachment} style={{marginRight: 10}}>
          <ImageBackground source={IMAGES.btnBg1} style={styles.iconWrapper}>
            <FastImage
              source={IMAGES.pin}
              style={{width: 18, height: 18}}
              resizeMode="contain"
            />
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendChat}>
          <FastImage source={IMAGES.send} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
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
