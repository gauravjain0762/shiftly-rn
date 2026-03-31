import React, { useEffect, useMemo, useState } from 'react';
import { Image, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppStyles } from '../../theme/appStyles';
import { IMAGES } from '../../assets/Images';
import LocationContainer from './LocationContainer';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { colors } from '../../theme/colors';
import { formatAreaNameFromComponents, getAddress } from '../../utils/locationHandler';
import { API } from '../../utils/apiConstant';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type Props = {
  companyProfileData?: any;
  companyProfileAllData?: any;
};

const CoAboutTab = ({ companyProfileData }: Props) => {
  const { getAppData } = useSelector((state: RootState) => state.auth);
  const mapKey = getAppData?.map_key || API?.GOOGLE_MAP_API_KEY;
  const [resolvedAddress, setResolvedAddress] = useState<string>('');

  const fallbackAddress = useMemo(
    () => companyProfileData?.address || '',
    [companyProfileData?.address],
  );

  useEffect(() => {
    const lat = Number(companyProfileData?.lat);
    const lng = Number(companyProfileData?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setResolvedAddress(fallbackAddress);
      return;
    }

    getAddress(
      { latitude: lat, longitude: lng },
      (data: any) => {
        const components = data?.results?.[0]?.address_components || [];
        const formatted =
          formatAreaNameFromComponents(components) ||
          data?.results?.[0]?.formatted_address ||
          fallbackAddress ||
          '';
        setResolvedAddress(formatted);
      },
      () => {
        setResolvedAddress(fallbackAddress);
      },
      mapKey,
    );
  }, [companyProfileData?.lat, companyProfileData?.lng, fallbackAddress, mapKey]);

  const openInMaps = (lat: any, lng: any, address: any) => {
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
        <Text style={styles.infoTitle}>Business Type</Text>
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
            resolvedAddress || fallbackAddress,
          )
        }} >
          <LocationContainer
            containerStyle={styles.map}
            lat={companyProfileData?.lat}
            lng={companyProfileData?.lng}
            address={resolvedAddress || fallbackAddress}
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
