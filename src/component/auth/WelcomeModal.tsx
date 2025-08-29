import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';

const WelcomeModal = ({
  visible,
  name = 'William',
  onClose,
  description,
  ButtonContainer,
}: {
  visible: boolean;
  name?: string;
  onClose: () => void;
  description?: string;
  ButtonContainer?: React.ReactNode;
}) => {
  const {t, i18n} = useTranslation();

  return (
    <Modal
      backdropOpacity={0.4}
      style={styles.modal}
      animationIn={'slideInUp'}
      isVisible={visible}>
      <View style={styles.modalContent}>
        <Image
          source={IMAGES.welcome_icon}
          style={{
            width: 90,
            height: 90,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />

        <Text style={styles.welcomeText}>
          {t('Welcome')} {name}
        </Text>

        <Text style={styles.messageText}>
          {description ||
            t(
              'Your account has been created successfully! You’re all set to explore hospitality opportunities tailored just for you.',
            )}
        </Text>
        {/* <Text style={styles.messageText}>
            You're all set to explore hospitality{'\n'}
            opportunities tailored just for you.
          </Text> */}

        {ButtonContainer || (
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{t('Lets get your job!')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: '#F4E2B8',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    // alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#03386E',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    ...commonFontStyle(500, 25, colors._050505),
    marginBottom: 14,
    marginTop: 20,
    alignSelf: 'center',
  },
  messageText: {
    ...commonFontStyle(400, 18, '#585656'),
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },
  button: {
    backgroundColor: '#061F3D',
    borderRadius: 50,
    marginTop: 24,
    height: 63,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...commonFontStyle(400, 22, colors.white),
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
});

export default WelcomeModal;
