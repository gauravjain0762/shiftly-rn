import React from 'react';
import { Image, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppStyles } from '../../theme/appStyles';
import { IMAGES } from '../../assets/Images';
import LocationContainer from './LocationContainer';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { colors } from '../../theme/colors';

type Props = {
  companyProfileData?: any;
  companyProfileAllData?: any;
};

const CoAboutTab = ({ companyProfileData }: Props) => {

  const openInMaps = (lat, lng, address) => {
    if (!lat || !lng) return;

    const encodedAddress = encodeURIComponent(address || '');
    let url = '';

    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?ll=${lat},${lng}&q=${encodedAddress}`;
    } else {
      url = `geo:${lat},${lng}?q=${lat},${lng}(${encodedAddress})`;
    }

    Linking.openURL(url).catch(err =>
      console.error('Failed to open maps:', err),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <View style={[AppStyles.flex]}>
          <Text style={styles.infoTitle}>{'Website'}</Text>
          <View style={styles.row}>
            <Image source={IMAGES.web} style={styles.web} />
            <Text
              onPress={async () => {
                if (await Linking.canOpenURL(companyProfileData?.website)) {
                  Linking.openURL(companyProfileData?.website || 'N/A');
                }
              }}
              style={styles.infoValue}>
              {companyProfileData?.website
                ? `${companyProfileData?.website || 'N/A'}`
                : 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.infoSection]}>
        <Text style={styles.infoTitle}>Type</Text>
        <Text style={styles.infoValue}>
          {companyProfileData?.business_type_id?.title || 'N/A'}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Company size</Text>
        <Text style={styles.infoValue}>
          {companyProfileData?.company_size || 'N/A'}
        </Text>
      </View>

      {/* <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Sectors/industry</Text>
        <Text style={styles.infoValue}>
          {companyProfileData?.business_type_id}
        </Text>
      </View> */}

      {companyProfileData && (
        <Pressable onPress={() => {
          openInMaps(
            companyProfileData?.lat,
            companyProfileData?.lng,
            companyProfileData?.address,
          )
        }} >
          <LocationContainer
            containerStyle={styles.map}
            lat={companyProfileData?.lat}
            lng={companyProfileData?.lng}
            address={companyProfileData?.address}
          />
        </Pressable>
      )}
    </View>
  );
};

export default CoAboutTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  infoSection: {
    marginTop: hp(18),
  },
  infoTitle: {
    marginBottom: hp(8),
    ...commonFontStyle(400, 18, colors._0B3970),
  },
  infoValue: {
    ...commonFontStyle(400, 16, colors._434343),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp(5),
  },
  web: {
    width: wp(19),
    height: wp(19),
    resizeMode: 'contain',
  },
  map: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: hp(30),
  },
});
