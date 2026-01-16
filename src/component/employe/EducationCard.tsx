import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import {colors} from '../../theme/colors';
import BaseText from '../common/BaseText';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';

type Props = {
  item: any;
  onEdit: () => void;
  onRemove: () => void;
  type?: 'Education' | 'Experience';
};

const EducationCard = ({item, onRemove, onEdit, type}: Props) => {
  const isEducation = type === 'Education';

  return (
    <View style={styles.card}>
      <View style={styles.rowSpaceBetween}>
        <BaseText style={styles.degree}>
          {isEducation ? item?.degree : item?.title}
        </BaseText>
        {isEducation ? (
          <BaseText style={styles.duration}>
            {item?.startDate_year || item?.start_date?.year || ''}
            {item?.endDate_year || item?.end_date?.year ? ' - ' : ''}
            {item?.endDate_year || item?.end_date?.year || ''}
          </BaseText>
        ) : (
          <BaseText style={styles.duration}>
            {item?.jobStart_year || item?.job_start?.year
              ? item.jobStart_year || item.job_start.year
              : ''}

            {item?.still_working || item?.jobEnd_year || item?.job_end?.year
              ? ' - '
              : ''}

            {item?.still_working
              ? 'Present'
              : item?.jobEnd_year || item?.job_end?.year
              ? item.jobEnd_year || item.job_end.year
              : ''}
          </BaseText>
        )}
      </View>

      <View style={styles.rowSpaceBetween}>
        <View style={{ width: '70%' }}>
          <BaseText 
            style={styles.university}
            numberOfLines={3}
            ellipsizeMode="tail">
            {isEducation ? item?.university : item?.company}
          </BaseText>
          <BaseText style={styles.location}>
            {item?.country} {item?.province}
          </BaseText>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => {
              onRemove();
            }}>
            <ImageBackground source={IMAGES.btnBg1} style={styles.iconWrapper}>
              <Image
                source={IMAGES.close_icon}
                style={{width: 21, height: 21, resizeMode: 'contain'}}
              />
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onEdit();
            }}>
            <ImageBackground source={IMAGES.btnBg1} style={styles.iconWrapper}>
              <Image
                source={IMAGES.edit_icon}
                style={{width: 21, height: 21, resizeMode: 'contain'}}
              />
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.underline} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: hp(16),
    marginTop: hp(15),
    borderRadius: hp(6),
    position: 'relative',
    marginHorizontal: wp(25),
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: '#E0D7C8',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  degree: {
    ...commonFontStyle(700, 18, colors._0B3970),
  },
  duration: {
    ...commonFontStyle(400, 18, colors._4A4A4A),
  },
  university: {
    marginTop: 8,
    ...commonFontStyle(400, 18, colors._4A4A4A),
  },
  location: {
    ...commonFontStyle(400, 18, colors._4A4A4A),
    marginTop: 8,
  },
  actions: {
    // position: 'absolute',
    // right: 16,
    // top: 45,
    flexDirection: 'row',
    gap: 10,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'white',
    fontSize: 14,
  },
  underline: {
    marginVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
});

export default EducationCard;
