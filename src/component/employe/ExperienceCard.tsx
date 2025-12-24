import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground} from 'react-native';
import {commonFontStyle, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import moment from 'moment';

type Props = {
  item: any;
  onRemove: () => void;
  onEdit: () => void;
};

const ExperienceCard = ({item, onRemove, onEdit}: Props) => {
  const start = item?.job_start
    ? moment(item?.job_start).format('YYYY')
    : '';
  const end = item?.still_working
    ? 'Present'
    : item?.job_end
    ? moment(item?.job_end).format('YYYY')
    : '';

  return (
    <View style={styles.card}>
      <View style={styles.rowSpaceBetween}>
        <Text style={styles.degree}>{item?.title}</Text>
        <Text style={styles.duration}>{start}{start || end ? ' - ' : ''}{end}</Text>
      </View>

      <View style={styles.rowSpaceBetween}>
        <View>
          <Text style={styles.university}>{item?.company}</Text>
          <Text style={styles.location}>
            {item?.department}{item?.country ? ` • ${item?.country}` : ''}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onRemove}>
            <ImageBackground source={IMAGES.btnBg1} style={styles.iconWrapper}>
              <Image
                source={IMAGES.close_icon}
                style={{width: 21, height: 21, resizeMode: 'contain'}}
              />
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit}>
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

export default ExperienceCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    position: 'relative',
    marginHorizontal: wp(25),
    padding: hp(16),
    marginTop: hp(15),
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: '#E0D7C8',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    gap: 10,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  underline: {
    marginVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
});




