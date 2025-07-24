// components/BottomModal.tsx

import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import {hp} from '../../theme/fonts';
import {colors} from '../../theme/colors';

type BottomModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundColor?: string;
};

const BottomModal = ({
  visible,
  onClose,
  children,
  backgroundColor = '#fff',
}: BottomModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <Pressable style={styles.transparent} />
        </View>
      </TouchableWithoutFeedback>
      <View style={[styles.modalContent, {backgroundColor}]}>{children}</View>
    </Modal>
  );
};

export default BottomModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.greyOpacity,
  },
  transparent: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: hp(40),
    borderTopRightRadius: hp(40),
    padding: hp(20),
    maxHeight: '80%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
