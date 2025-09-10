import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';

import BottomModal from './BottomModal';
import {IMAGES} from '../../assets/Images';
import {colors} from '../../theme/colors';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import CustomImage from './CustomImage';

type LanguageModalProps = {
  type: 'Employee' | 'Company';
  visible: boolean;
  onClose: () => void;
  onLanguageSelect: (language: string) => void;
};

const LanguageModal = ({
  type,
  visible,
  onClose,
  onLanguageSelect,
}: LanguageModalProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    onLanguageSelect(language);
  };

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      backgroundColor={type === 'Employee' ? colors._E8CE92 : colors.coPrimary}
      style={styles.modalContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>{'Select Language'}</Text>
        <CustomImage onPress={onClose} source={IMAGES.close} size={wp(20)} />
      </View>

      <View>
        {[
          {label: 'English', flag: IMAGES.flag},
          {label: 'Arabic', flag: IMAGES.flag2},
        ].map(({label, flag}) => (
          <TouchableOpacity
            key={label}
            style={styles.languageOption}
            onPress={() => handleLanguageSelect(label)}>
            <View style={styles.languageInfo}>
              <Image source={flag} style={styles.flagIcon} />
              <Text style={styles.languageText}>{label}</Text>
            </View>

            <View
              style={[
                styles.radioButton,
                {
                  borderColor:
                    type === 'Employee' ? colors._041326 : colors._1F1F1F,
                },
              ]}>
              {selectedLanguage === label && (
                <View
                  style={[
                    styles.radioButtonInner,
                    {
                      backgroundColor:
                        type === 'Employee' ? colors._041326 : colors._050505,
                    },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    paddingTop: hp(30),
    paddingBottom: hp(40),
    paddingHorizontal: wp(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(15),
    marginBottom: hp(15),
  },
  title: {
    ...commonFontStyle(600, 20, colors.black),
  },
  closeIcon: {
    width: wp(20),
    height: hp(20),
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(15),
    paddingHorizontal: wp(15),
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(15),
  },
  flagIcon: {
    width: wp(30),
    height: hp(30),
    resizeMode: 'contain',
  },
  languageText: {
    ...commonFontStyle(500, 16, colors.black),
  },
  radioButton: {
    width: wp(25),
    height: hp(25),
    borderRadius: wp(100),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: wp(10),
    height: hp(10),
    borderRadius: wp(5),
  },
});

export default LanguageModal;
