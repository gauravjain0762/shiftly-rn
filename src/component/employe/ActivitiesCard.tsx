import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {IMAGES} from '../../assets/Images';
import {colors} from '../../theme/colors';

type props = {
  onPress: () => void;
  item?: any;
};

const ActivitiesCard: FC<props> = ({onPress = () => {}, item}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.card}>
      <View style={styles.left}>
        <Image
          source={IMAGES.Activitielogo}
          resizeMode="contain"
          style={styles.logo}
        />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item?.name}</Text>
          <Text style={styles.subtitle}>{item?.subtitle}</Text>
          {item?.tag == 'Chat' && (
            <Text style={styles.details}>{item?.details}</Text>
          )}
          {item?.tag != 'Chat' && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.details}>
                {item?.startDetails} {' - '}
              </Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
                <Image
                  source={IMAGES.distance}
                  resizeMode="contain"
                  style={{width: 11, height: 15, resizeMode: 'contain'}}
                />
                <Text style={styles.details}>{item?.endDetails}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={styles.rightSide}>
        <Text style={styles.time}>{item?.time}</Text>
        <View style={styles.tagWrapper}>
          <Text style={styles.tagText}>{item?.tag}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ActivitiesCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors._0B3970,
    borderRadius: 20,
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors._104686,
    padding: wp(13),
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    gap: wp(18),
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: wp(60),
    height: wp(60),
    borderRadius: 100,
  },
  cardContent: {
    flex: 1,
    gap: wp(9),
  },
  title: {
    ...commonFontStyle(600, 20, colors.white),
  },
  subtitle: {
    ...commonFontStyle(400, 14, colors.white),
  },
  details: {
    ...commonFontStyle(400, 14, colors.white),
  },
  rightSide: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  time: {
    ...commonFontStyle(400, 13, colors.white),
  },
  tagWrapper: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: wp(12),
    paddingVertical: hp(10),
  },
  tagText: {
    ...commonFontStyle(600, 12, '#003C8F'),
  },
});
