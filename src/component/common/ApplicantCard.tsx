import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../theme/fonts';

type Props = {
  item: any;
  showShortListButton?: boolean;
  handleShortListEmployee?: () => void;
};

const ApplicantCard = ({item, showShortListButton = true, handleShortListEmployee}: Props) => {
  const {t} = useTranslation();

  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <Image
          source={item?.picture ? {uri: item?.picture} : IMAGES.avatar}
          style={styles.avatar}
        />
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.name}>
            {item?.name || 'Tafnol Theresa'}
          </Text>
          <Text numberOfLines={1} style={styles.field} ellipsizeMode="tail">
            {item?.responsibility || 'Hotel Management'}
          </Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.experience}>
            5y Experience
          </Text>
        </View>
        <View style={styles.actionContainer}>
          <View style={styles.chatButton}>
            <Image source={IMAGES.chat} />
          </View>
          {showShortListButton && (
            <TouchableOpacity activeOpacity={0.5} onPress={handleShortListEmployee} style={styles.actionButton}>
              <Text style={styles.actionText}>{t('Shortlist')}</Text>
            </TouchableOpacity>
          )}
          <View
            style={[
              styles.actionButton,
              {
                marginTop: hp(4),
              },
            ]}>
            <Text style={styles.actionText}>{t('View Profile')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ApplicantCard;

const styles = StyleSheet.create({
  cardContainer: {
    padding: hp(12),
    borderRadius: hp(20),
    borderWidth: hp(1.5),
    borderColor: colors._C9B68B,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: wp(100),
    height: hp(100),
    borderRadius: hp(10),
    flexWrap: 'wrap',
  },
  infoContainer: {
    gap: hp(10),
    marginLeft: wp(10),
    width: '40%',
  },
  name: {
    ...commonFontStyle(600, 19, colors._0B3970),
  },
  field: {
    ...commonFontStyle(400, 17, colors.black),
  },
  experience: {
    ...commonFontStyle(400, 17, colors._4A4A4A),
  },
  actionContainer: {
    marginLeft: wp(5),
  },
  chatButton: {
    width: wp(35),
    height: hp(35),
    borderRadius: hp(35),
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors._0B3970,
  },
  actionButton: {
    marginTop: hp(13),
    borderRadius: hp(50),
    paddingVertical: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(20),
    backgroundColor: colors._0B3970,
  },
  actionText: {
    ...commonFontStyle(500, 11, colors.white),
  },
});
