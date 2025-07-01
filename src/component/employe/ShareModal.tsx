import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import Modal from 'react-native-modal';
import {SCREEN_WIDTH, commonFontStyle, hp, wp} from '../../theme/fonts';
import {useTranslation} from 'react-i18next';
import {colors} from '../../theme/colors';

type modal = {
  visible?: boolean;
  onClose?: () => void;
};

const shareOptions = [
  {
    name: 'Twitter',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Twitter_new_X_logo.png',
  },
  {
    name: 'Gmail',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png',
  },
  {
    name: 'Facebook',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Facebook_Logo_2023.png/1200px-Facebook_Logo_2023.png?20231011121526',
  },
  {
    name: 'Instagram',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
  },
  {
    name: 'Whatsapp',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Whatsapp_logo_2022.jpg',
  },
  {
    name: 'Linkedin',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
  },
  {
    name: 'Behance',
    icon: 'https://1000logos.net/wp-content/uploads/2020/11/Behance-Logo-2020.jpg',
  },
  {
    name: 'Pinterest',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png',
  },
];

const ShareModal: FC<modal> = ({visible, onClose = () => {}}) => {
  const {t, i18n} = useTranslation();

  return (
    <Modal
      isVisible={visible}
      style={styles.container}
      onBackdropPress={() => onClose()}
      animationIn={'slideInUp'}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>{t('Share Job')}</Text>
        <FlatList
          data={shareOptions}
          keyExtractor={item => item.name}
          numColumns={4}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.iconContainer}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.iconWrapper}>
              <Image source={{uri: item.icon}} style={styles.iconImage} />
              <Text style={styles.iconText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};

export default ShareModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FBE9C6',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: hp(27),
    paddingBottom: hp(40),
  },
  title: {
    ...commonFontStyle(500, 20, colors._181818),
    alignSelf: 'center',
    paddingBottom: hp(23),
  },
  iconContainer: {
    alignItems: 'center',
    paddingHorizontal: wp(20),
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  iconWrapper: {
    alignItems: 'center',
    width: SCREEN_WIDTH / 4 - 10,
  },
  iconImage: {
    width: wp(50),
    height: wp(50),
    borderRadius: 100,
    marginBottom: 6,
    resizeMode: 'cover',
  },
  iconText: {
    ...commonFontStyle(500, 15, colors._181818),
  },
  closeButton: {
    marginTop: hp(10),
    alignSelf: 'center',
  },
  container: {
    justifyContent: 'flex-end',
    padding: 0,
    margin: 0,
  },
});
