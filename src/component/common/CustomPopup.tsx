import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CommonButton from './CommonButton';
import {colors} from '../../theme/colors';

interface ImageModalProps {
  isVisible: boolean;
  onCloseModal: () => void;
  onPressRight?: () => void;
  title?: string;
  leftButton?: string;
  rightButton?: string;
  type?: 'Company' | 'Employee';
}

const CustomPopup = ({
  isVisible,
  onCloseModal,
  onPressRight,
  title,
  leftButton,
  rightButton,
  type = 'Company',
}: ImageModalProps) => {
  const insets = useSafeAreaInsets();
  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackButtonPress={onCloseModal}
      onBackdropPress={onCloseModal}
      style={styles.modalContainer}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      renderToHardwareTextureAndroid
      animationInTiming={300}
      animationOutTiming={300}
      backdropColor={'rgba(0,0,0,0.7)'}
      backdropTransitionOutTiming={1}>
      <View
        style={[
          styles.modalView,
          {
            paddingBottom: insets.bottom + hp(20),
            backgroundColor:
              type === 'Company' ? colors.coPrimary : colors._E8CE92,
          },
        ]}>
        {/* <TouchableOpacity
          hitSlop={15}
          onPress={onCloseModal}
          style={styles.closeView}>
          <Image
            source={isDarkTheme ? IMAGES.close_dark : IMAGES.close}
            style={styles.closeImage}
          />
        </TouchableOpacity> */}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.buttonContainer}>
          <CommonButton
            title={leftButton}
            onPress={onCloseModal}
            btnStyle={{
              ...styles.btnStyle,
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: '#061F3D',
            }}
            textStyle={[styles.textStyle, {color: '#061F3D'}]}
          />
          <CommonButton
            title={rightButton}
            onPress={onPressRight}
            btnStyle={{...styles.btnStyle, backgroundColor: '#061F3D'}}
            textStyle={[styles.textStyle, {color: colors.white}]}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalView: {
    backgroundColor: '#F4E2B8',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingHorizontal: hp(20),
    paddingVertical: hp(25),
  },
  title: {
    ...commonFontStyle(600, 20, colors.black),
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
    flexDirection: 'row',
  },
  btnStyle: {
    flex: 1,
  },
  textStyle: {
    ...commonFontStyle(500, 20, '#000000'),
  },
  closeView: {
    padding: hp(20),
    position: 'absolute',
    top: 0,
  },
  closeImage: {
    width: hp(14),
    height: hp(14),
    resizeMode: 'contain',
  },
});

export default CustomPopup;
