import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';

type modal = {
  visible?: boolean;
  onClose?: () => void;
  onJobList?: () => void;
  onViewApps?: () => void;
  onExploreJobs?: () => void;
};

const ApplicationSuccessModal: FC<modal> = ({
  visible,
  onClose = () => {},
  onJobList,
  onViewApps,
  onExploreJobs,
}) => {
  return (
    <Modal
      style={styles.container}
      isVisible={visible}
      onBackdropPress={() => onClose()}
      animationIn={'slideInUp'}>
      <View style={styles.modalContainer}>
        <View style={styles.iconCircle}>
          <Image style={styles.checkmark} source={IMAGES.check} />
        </View>
        <Text style={styles.title}>
          Check your email — your application was submitted successfully.
        </Text>

        <TouchableOpacity style={styles.button} onPress={onJobList}>
          <Text style={styles.buttonText}>Go back to job listings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onViewApps}>
          <Text style={styles.buttonText}>View my applications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onExploreJobs}>
          <Text style={styles.buttonText}>Explore similar jobs</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ApplicationSuccessModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors._F4E2B8,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: colors._061E3C,
    width: wp(90),
    height: wp(90),
    borderRadius: 100,
    marginBottom: hp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: wp(40),
    height: wp(40),
    tintColor: colors._F4E2B8,
    resizeMode: 'contain',
  },
  title: {
    ...commonFontStyle(600, 23, colors._050505),
    textAlign: 'center',
    marginBottom: hp(30),
    lineHeight: 28,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors._061F3D,
    paddingVertical: hp(18),
    borderRadius: 100,
    marginBottom: hp(20),
  },
  buttonText: {
    ...commonFontStyle(400, 22, colors.white),
  },
  container: {
    marginHorizontal: 0,
    justifyContent: 'flex-end',
  },
});
