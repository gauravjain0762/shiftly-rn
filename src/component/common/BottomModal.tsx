// components/BottomModal.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';

import {hp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import Modal from 'react-native-modal';

type BottomModalProps = {
  visible: boolean;
  style?: ViewStyle;
  onClose: () => void;
  children: React.ReactNode;
  backgroundColor?: string;
};

const BottomModal = ({
  visible,
  onClose,
  children,
  style,
  backgroundColor = '#fff',
}: BottomModalProps) => {
  return (
    <Modal
      style={styles.modal}
      onBackdropPress={onClose}
      avoidKeyboard
      isVisible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}>
        <View style={[styles.container, {backgroundColor}, style]}>{children}</View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BottomModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  transparent: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    padding: hp(20),
    maxHeight: '90%',
    borderTopLeftRadius: hp(25),
    borderTopRightRadius: hp(25),
    backgroundColor: colors.white,
  },
});
