import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import { useTranslation } from 'react-i18next';

const WelcomeModal = ({visible, name = 'William', onClose}) => {
      const {t, i18n} = useTranslation();
    
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Image
            source={IMAGES.welcome_icon}
            style={{width: 90, height: 90, resizeMode: 'contain'}}
          />

          <Text style={styles.welcomeText}>{t("Welcome")} {name}</Text>

          <Text style={styles.messageText}>
            {t("Your account has been created successfully! You’re all set to explore hospitality opportunities tailored just for you.")}
          </Text>
          {/* <Text style={styles.messageText}>
            You're all set to explore hospitality{'\n'}
            opportunities tailored just for you.
          </Text> */}

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{t("Lets get your job!")}</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
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
    marginTop:20
  },
  messageText: {
    ...commonFontStyle(400, 18, '#585656'),
textAlign:'center',
    marginBottom: 8,
    lineHeight:30
  },
  button: {
    backgroundColor: '#061F3D',
    paddingHorizontal: 86,
    // paddingVertical: 12,
    borderRadius: 50,
    marginTop: 24,
    height:63,
    justifyContent:'center'
  },
  buttonText: {
    ...commonFontStyle(400, 22, colors.white),
  },
});

export default WelcomeModal;
