import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {useTranslation} from 'react-i18next';
import {navigateTo, resetNavigation} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';

const SuccessffullyModal = ({visible, name = 'William', onClose}) => {
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
            style={{
              width: 90,
              height: 90,
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
          />

          <Text style={styles.messageText}>
            {t('Awsome! your profile is completed successffully')}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onClose();
              resetNavigation(SCREENS.TabNavigator, SCREENS.JobsScreen);
            }}>
            <LinearGradient
              colors={[colors.white, colors._F7F7F7]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.buttonGradient}>
              <Text style={styles.buttonText}>{t('Explore Jobs')}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onClose();
              navigateTo(SCREENS.TabNavigator);
            }}>
            <LinearGradient
              colors={[colors.white, colors._F7F7F7]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.buttonGradient}>
              <Text style={styles.buttonText}>{t('Home')}</Text>
            </LinearGradient>
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
    backgroundColor: colors._F7F7F7,
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
    ...commonFontStyle(400, 23, '#585656'),
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
    marginTop: 20,
  },
  button: {
    borderRadius: 50,
    marginTop: 24,
    height: 63,
    borderWidth: 1.5,
    borderColor: '#D9D9D9',
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText: {
    ...commonFontStyle(400, 22, colors._0B3970),
  },
});

export default SuccessffullyModal;
