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
  type?: 'user' | 'company';
};

const ChatInput = ({
  message,
  setMessage,
  handleSendChat,
  onPressAttachment,
  image,
  setImage,
  type,
}: Props) => {
  return (
    <View
      style={{
        ...styles.inputContainer,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor: colors.white,
      }}>
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
          {image?.uri?.includes('pdf') ||
          image?.uri?.includes('doc') ||
          image?.uri?.includes('docx') ? (
            <FastImage
              source={IMAGES.document}
              defaultSource={IMAGES.document}
              style={styles.logo}
              tintColor={type === 'user' ? colors._E8CE92 : colors._0B3970}
            />
          ) : (
            <FastImage source={{uri: image.uri}} style={styles.logo} />
          )}
        </View>
      ) : (
        <></>
      )}

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          value={message}
          style={{
            ...styles.input,
            color: colors._2F2F2F,
          }}
          onChangeText={setMessage}
          placeholderTextColor={colors._A3A3A3}
          placeholder="Write your message..."
        />
        <TouchableOpacity onPress={onPressAttachment} style={{marginRight: 10}}>
          <ImageBackground source={IMAGES.btnBg1} style={styles.iconWrapper}>
            <FastImage
              source={IMAGES.pin}
              style={{width: 18, height: 18}}
              defaultSource={IMAGES.pin}
              resizeMode="contain"
            />
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendChat}>
          <FastImage
            source={IMAGES.send}
            style={styles.sendIcon}
            defaultSource={IMAGES.send}
            tintColor={colors._0B3970}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: wp(14),
    paddingTop: hp(15),
    // paddingVertical: hp(15),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    ...commonFontStyle(400, 14, colors._2F2F2F),
    marginRight: 4,
    paddingHorizontal: wp(8)
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
