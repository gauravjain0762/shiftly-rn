import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';

const EducationCard = ({item, onRemove, onEdit}: any) => {
  return (
    <View style={styles.card}>
      <View style={styles.rowSpaceBetween}>
        <Text style={styles.degree}>{item?.degree}</Text>
        <Text style={styles.duration}>
          {item?.startDate_year}
          {item?.startDate_year || item?.endDate_year ? ' - ' : ''}
          {item?.endDate_year}
        </Text>
      </View>

      <View style={styles.rowSpaceBetween}>
        <View>
          <Text style={styles.university}>{item?.university}</Text>
          <Text style={styles.location}>
            {item?.country} {item?.province}
          </Text>
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
    backgroundColor: '#003366',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  degree: {
    ...commonFontStyle(700, 18, colors._F4E2B8),
  },
  duration: {
    ...commonFontStyle(400, 18, colors._F4E2B8),
  },
  university: {
    marginTop: 8,
    ...commonFontStyle(400, 18, colors._F4E2B8),
  },
  location: {
    ...commonFontStyle(400, 18, colors._F4E2B8),
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
