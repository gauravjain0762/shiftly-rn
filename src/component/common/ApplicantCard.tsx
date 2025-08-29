import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {navigateTo} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';

type Props = {
  item: any;
  showShortListButton?: boolean;
  handleShortListEmployee?: () => void;
};

const ApplicantCard = ({
  item,
  showShortListButton = true,
  handleShortListEmployee,
}: Props) => {
  const {t} = useTranslation();

  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <Image
          style={styles.avatar}
          source={item?.picture ? {uri: item?.picture} : IMAGES.avatar}
        />
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.name}>
            {item?.name}
          </Text>
          <Text numberOfLines={2} style={styles.field} ellipsizeMode="tail">
            {item?.responsibility}
          </Text>
          {/* <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.experience}>
            5y Experience
          </Text> */}
        </View>
        <View style={styles.actionContainer}>
          <Pressable
            onPress={() => {
              navigateTo(SCREENS.CoMessage);
            }}
            style={styles.chatButton}>
            <Image source={IMAGES.chat} />
          </Pressable>
          {showShortListButton && (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleShortListEmployee}
              style={styles.actionButton}>
              <Text style={styles.actionText}>
                {t(!showShortListButton ? 'Shortlisted' : 'Shortlist')}
              </Text>
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
    marginBottom: hp(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: wp(90),
    height: hp(90),
    borderRadius: hp(10),
  },
  infoContainer: {
    gap: hp(10),
    width: '40%',
    marginLeft: wp(10),
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
    marginRight: wp(5),
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
    alignItems: 'center',
    paddingVertical: hp(7),
    justifyContent: 'center',
    paddingHorizontal: wp(20),
    backgroundColor: colors._0B3970,
  },
  actionText: {
    ...commonFontStyle(500, 11, colors.white),
  },
});
