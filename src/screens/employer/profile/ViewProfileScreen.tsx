import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import Slider from '@react-native-community/slider';

import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';

const ViewProfileScreen = () => {
  const [range, setRange] = useState('');
  const HeaderWithAdd = useCallback(
    ({title}) => (
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
      </View>
    ),
    [],
  );

  const Section = useCallback(
    ({title, content, onPress}) => (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => {
            onPress && onPress();
          }}
          style={styles.addButton}>
          <Image source={IMAGES.pluse} style={styles.plus} />
        </TouchableOpacity>
        <HeaderWithAdd title={title} />
        <Text style={styles.content}>{content}</Text>
      </View>
    ),
    [],
  );

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['top']}}
      colors={['#0D468C', '#041326']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Image
            source={{uri: 'https://randomuser.me/api/portraits/women/44.jpg'}}
            style={styles.avatar}
          />
          <Text style={styles.name}>Smith Williamson</Text>
          <View style={styles.locationRow}>
            <Image source={IMAGES.marker} style={styles.locationicon} />
            <Text style={styles.location}>Dubai Marina, Dubai - U.A.E</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
            <TouchableOpacity
              onPress={() => {
                navigateTo(SCREENS.AccountScreen);
              }}
              style={styles.editButton}>
              <Text style={styles.editButtonText}>Open to Work</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigateTo(SCREENS.AccountScreen);
              }}
              style={styles.editButton}>
              <Text style={styles.editButtonText}>View Profile</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.decText}>
            Sed ut perspiciatis unde omns iste natus error site voluptatem
            accusantum dolorem queitters lipsum lipslaudantiuml ipsum text.
          </Text>
        </View>
      </ScrollView>
    </LinearContainer>
  );
};

export default ViewProfileScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 30,
  },
  avatar: {
    width: wp(130),
    height: wp(130),
    borderRadius: 100,
  },
  name: {
    ...commonFontStyle(600, 25, colors.white),
    marginTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    gap: wp(16),
    marginTop: hp(8),
  },
  location: {
    ...commonFontStyle(400, 20, colors.white),
  },
  editButton: {
    marginTop: hp(25),
    paddingVertical: hp(12),
    paddingHorizontal: wp(21),
    borderRadius: 10,
    backgroundColor: colors._F4E2B8,
  },
  editButtonText: {
    ...commonFontStyle(400, 17, '#0A376D'),
  },
  decText: {
    ...commonFontStyle(400, 17, '#E7E7E7'),
    marginHorizontal: 23,
    lineHeight: 30,
    marginTop: 32,
  },

  locationicon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },
});
