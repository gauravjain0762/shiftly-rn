import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../theme/colors';

type Props = {};

const Loader = ({visible = false, isModal = true}) => {
  return (
    <Modal visible={visible} transparent={true} statusBarTranslucent={false}>
      <View style={styles.modalContainer}>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: colors.white,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius:10,
            elevation:1
          }}>
          <ActivityIndicator size={'large'} color={colors.black} />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
