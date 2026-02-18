import React, { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { colors } from '../../theme/colors';
import { IMAGES } from '../../assets/Images';

type modal = {
  visible?: boolean;
  onClose?: () => void;
  onJobList?: () => void;
  onViewApps?: () => void;
  onExploreJobs?: () => void;
};

const ApplicationSuccessModal: FC<modal> = ({
  visible,
  onClose = () => { },
  onJobList,
  onViewApps,
  onExploreJobs,
}) => {
  return (
    <Modal
      style={styles.container}
      isVisible={visible}
      onBackdropPress={() => onClose()}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropOpacity={0.5}
      useNativeDriver={true}>
      <View style={styles.modalContainer}>
        <View style={styles.iconCircle}>
          <Image style={styles.checkmark} source={IMAGES.check} />
        </View>

        <Text style={styles.title}>
          Check your email — your application was submitted successfully.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={onJobList}
          activeOpacity={0.8}>
          <View style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Go back to job listings</Text>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity 
          style={styles.button} 
          onPress={onViewApps}
          activeOpacity={0.8}>
          <View style={styles.buttonGradient}>
            <Text style={styles.buttonText}>View my applications</Text>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.button}
          onPress={onExploreJobs}
          activeOpacity={0.8}>
          <View style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Explore similar jobs</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ApplicationSuccessModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: colors._F7F7F7,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: hp(40),
    paddingBottom: hp(40),
    paddingHorizontal: wp(20),
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: colors._0B3970,
    width: wp(90),
    height: wp(90),
    borderRadius: wp(45),
    marginBottom: hp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: wp(40),
    height: wp(40),
    tintColor: colors.white,
    resizeMode: 'contain',
  },
  title: {
    ...commonFontStyle(600, 20, colors._050505),
    textAlign: 'center',
    marginBottom: hp(30),
    lineHeight: 26,
    paddingHorizontal: wp(10),
  },
  button: {
    width: '100%',
    borderRadius: 100,
    marginBottom: hp(15),
    borderWidth: 1.5,
    borderColor: '#D9D9D9',
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: hp(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  buttonText: {
    ...commonFontStyle(600, 16, colors._0B3970),
    letterSpacing: 0.2,
  },
});