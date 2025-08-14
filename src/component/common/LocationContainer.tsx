import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {IMAGES} from '../../assets/Images';
import {getAsyncUserLocation} from '../../utils/asyncStorage';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import Config from 'react-native-config';

type map = {
  containerStyle?: ViewStyle;
  lat?: number | undefined;
  lng?: number | undefined;
  onPressMap?: () => void;
  address?: string | undefined;
};

const LocationContainer: FC<map> = ({
  containerStyle,
  lat,
  lng,
  onPressMap,
  address,
}) => {
  useEffect(() => {
    getLocation();
  }, []);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });
  // console.log('🔥🔥🔥 ~ LocationContainer ~ location:', location);
  const getLocation = async () => {
    const res = await getAsyncUserLocation();
    if (res) {
      setLocation(res);
    }
  };
  return (
    <View style={[styles.map, containerStyle]}>
      <View style={styles.locationCard}>
        <View style={styles.row}>
          <Text style={styles.locationLabel}>Locations</Text>
          <View style={styles.primaryTag}>
            <Text style={styles.primary}>{'Primary'}</Text>
          </View>
        </View>
        <Text style={styles.locationText}>
          {address || `Crescent Road, The Palm Jumeirah, Dubai, 211222, AE`}
        </Text>
      </View>
      <Pressable onPress={onPressMap}>
        <MapView
          region={{
            latitude: lat || location?.latitude,
            longitude: lng || location?.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          }}
          zoomEnabled={false}
          scrollEnabled={false}
          key={Config?.MAP_KEY}
          style={styles.mapImage}>
          <Marker
            coordinate={{
              latitude: lat || location?.latitude,
              longitude: lng || location?.longitude,
            }}>
            <Image
              source={IMAGES.location_marker}
              style={styles.location_marker}
            />
          </Marker>
        </MapView>
      </Pressable>
    </View>
  );
};

export default LocationContainer;

const styles = StyleSheet.create({
  location_marker: {
    width: wp(37),
    height: hp(56),
    resizeMode: 'contain',
  },
  map: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: hp(30),
  },
  primary: {
    ...commonFontStyle(500, 11, colors.white),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp(5),
  },
  locationLabel: {
    ...commonFontStyle(400, 18, colors.white),
  },
  primaryTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    ...commonFontStyle(400, 14, colors.white),
    marginTop: hp(7),
  },
  locationCard: {
    backgroundColor: colors._0B3970,
    paddingHorizontal: wp(22),
    paddingVertical: hp(12),
  },
  mapImage: {
    height: hp(130),
    width: '100%',
    resizeMode: 'cover',
  },
});
