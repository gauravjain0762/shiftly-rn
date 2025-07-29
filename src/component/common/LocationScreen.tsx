import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {AppStyles} from '../../theme/appStyles';
import {colors} from '../../theme/colors';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {getAddress} from '../../utils/locationHandler';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {API} from '../../utils/apiConstant';
import GradientButton from './GradientButton';
import {navigationRef} from '../../navigation/RootContainer';
import {useFocusEffect} from '@react-navigation/native';
import {IMAGES} from '../../assets/Images';
import {getAsyncUserLocation} from '../../utils/asyncStorage';

const LocationScreen = () => {
  const {t} = useTranslation();
  const mapRef = useRef<any | null>(null);

  const [search, setSearch] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  // console.log('🔥🔥🔥 ~ LocationScreen ~ markerPosition:', markerPosition);
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const ref = useRef<any | null>(null);

  const getUserLocation = async () => {
    try {
      const locationString = await AsyncStorage.getItem('user_location');
      if (locationString !== null) {
        const location = JSON.parse(locationString);
        console.log('🔥🔥🔥 ~ getUserLocation ~ location:', location);
        setPosition(prev => ({
          ...prev,
          latitude: location?.lat,
          longitude: location?.lng,
        }));

        console.log('Retrieved location:', location);
        return location;
      }
    } catch (error) {
      console.error('Failed to retrieve user location:', error);
    }
    return null;
  };

  useFocusEffect(
    useCallback(() => {
      getUserLocation();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      getUserLocation().then(location => {
        if (location?.lat && location?.lng) {
          setMarkerPosition({
            latitude: location.lat,
            longitude: location.lng,
          });
        }
      });
    }, []),
  );

  useEffect(() => {
    ref.current?.setAddressText('');
  }, []);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );
    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const handlePlaceSelect = async (item: any) => {
    setSearch(item.description);

    const region = {
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,
    };

    getAddress(
      region,
      async (response: any) => {
        const formatted =
          response?.results?.[0]?.formatted_address || item.description;
        setSearch(formatted);
        setPosition({
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        mapRef.current?.animateToRegion({
          ...region,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        await AsyncStorage.setItem('user_location', formatted);
      },
      (error: any) => console.log('Address fetch error:', error),
    );
  };

  const handleMapPress = (e: any) => {
    const coords = e.nativeEvent.coordinate;
    moveMarker(coords);
  };

  const handlePoiClick = (e: any) => {
    const coords = e.nativeEvent.coordinate;
    moveMarker(coords);
  };

  const moveMarker = (coords: any) => {
    setPosition(prev => ({...prev, ...coords}));
    setMarkerPosition(coords);
    mapRef.current?.animateToRegion({
      ...coords,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });

    getAddress(coords, (data: any) => {
      const address = data?.results?.[0]?.formatted_address;
      const components = data?.results?.[0]?.address_components || [];

      const stateObj = components.find((c: any) =>
        c.types.includes('administrative_area_level_1'),
      );
      const countryObj = components.find((c: any) =>
        c.types.includes('country'),
      );

      const state = stateObj?.long_name || '';
      const country = countryObj?.long_name || '';

      console.log('🔥🔥🔥 ~ moveMarker ~ address:', address);
      console.log('🔥🔥🔥 ~ moveMarker ~ state:', state);
      console.log('🔥🔥🔥 ~ moveMarker ~ country:', country);

      if (address) {
        setSearch(address);
        ref.current?.setAddressText(address);
        AsyncStorage.setItem(
          'user_location',
          JSON.stringify({
            address,
            lat: coords.latitude,
            lng: coords.longitude,
            state,
            country,
          }),
        );
      }
    });
  };

  const handleGetCurrentLocation = async () => {
    const location = await getAsyncUserLocation();
    console.log('🔥🔥🔥 ~ handleGetCurrentLocation ~ location:', location);
    getAddress(location, (data: any) => {
      const address = data?.results?.[0]?.formatted_address;
      const components = data?.results?.[0]?.address_components || [];

      const stateObj = components.find((c: any) =>
        c.types.includes('administrative_area_level_1'),
      );
      const countryObj = components.find((c: any) =>
        c.types.includes('country'),
      );

      const state = stateObj?.long_name || '';
      const country = countryObj?.long_name || '';
      if (address) {
        setSearch(address);
        ref.current?.setAddressText(address);
        AsyncStorage.setItem(
          'user_location',
          JSON.stringify({
            address: address,
            lat: location.latitude,
            lng: location.longitude,
            state,
            country,
          }),
        );
      }
    });
    if (location) {
      setPosition({
        latitude: location?.latitude,
        longitude: location?.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setMarkerPosition({
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
      mapRef.current?.animateToRegion({
        latitude: location?.latitude,
        longitude: location?.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <SafeAreaView style={AppStyles.mainWhiteContainer} edges={[]}>
        <GooglePlacesAutocomplete
          ref={ref}
          placeholder="Search Location"
          onPress={async (data, details = null) => {
            console.log('🔥🔥🔥 ~ async ~ details:', details);
            console.log('🔥🔥🔥 ~ async ~ data:', data);
            if (!details) return;

            const {lat, lng} = details.geometry.location;
            const region = {
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            };
            const address = details.formatted_address || data.description;

            ref.current?.setAddressText(address);
            setSearch(address);
            setPosition(region);
            setMarkerPosition({latitude: lat, longitude: lng});
            mapRef.current?.animateToRegion(region);
            await AsyncStorage.setItem(
              'user_location',
              JSON.stringify({
                address: address,
                lat: lat,
                lng: lng,
              }),
            );
          }}
          styles={{container: styles.googleAutoCompleteContainer}}
          textInputProps={{
            value: search,
            onChangeText: setSearch,
            placeholderTextColor: '#000',
            style: styles.googleAutoCompleteInput,
          }}
          predefinedPlaces={[]}
          minLength={0}
          fetchDetails={true}
          query={{
            key: API?.GOOGLE_MAP_API_KEY,
            language: 'en',
          }}
          autoFillOnNotFound={false}
          currentLocation={false}
          currentLocationLabel="Current location"
          debounce={300}
          timeout={20000}
          disableScroll={false}
        />
        <KeyboardAvoidingView
          style={AppStyles.flex}
          behavior={isKeyboardVisible ? 'height' : undefined}>
          <View style={AppStyles.flex}>
            <View style={styles.container}>
              <MapView
                ref={mapRef}
                provider="google"
                region={position}
                onPress={handleMapPress}
                onPoiClick={handlePoiClick}
                onMapReady={() => setIsMapLoaded(true)}
                onMapLoaded={() => setIsMapLoaded(true)}
                style={styles.mapStyle}>
                <Marker
                  coordinate={{
                    latitude: position.latitude,
                    longitude: position.longitude,
                  }}>
                  {Platform.OS === 'ios' && (
                    <Image
                      resizeMode="contain"
                      source={IMAGES.location_marker}
                      style={styles.customMarkerImage}
                    />
                  )}
                </Marker>
              </MapView>
            </View>
            <GradientButton
              type="Employee"
              title={t('Save')}
              style={styles.btn}
              onPress={() => navigationRef.goBack()}
            />
          </View>
          <Pressable onPress={handleGetCurrentLocation}>
            <Image
              source={IMAGES.current_location}
              style={styles.currentLocationButton}
            />
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    width: wp(22),
    height: wp(22),
  },
  locationContainer: {
    position: 'absolute',
    bottom: hp(76),
    right: wp(22),
  },
  modalContent: {
    backgroundColor: colors.white,
    paddingHorizontal: wp(28),
    paddingTop: hp(10),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: hp(16),
  },
  sheetBarStyle: {
    width: wp(48),
    height: hp(5),
    alignSelf: 'center',
    borderRadius: 100,
    marginBottom: hp(10),
  },
  title: {
    ...commonFontStyle(600, 22, colors.black),
    textAlign: 'center',
    marginBottom: hp(20),
  },
  btn: {
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    marginVertical: hp(40),
    marginHorizontal: wp(40),
  },
  customMarkerImage: {
    width: wp(40),
    height: hp(40),
    borderRadius: hp(20),
  },
  googleAutoCompleteContainer: {
    flex: 0,
    marginHorizontal: wp(15),
    borderRadius: hp(15),
    backgroundColor: 'white',
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: wp(20),
  },
  googleAutoCompleteInput: {
    flex: 1,
    height: hp(60),
    ...commonFontStyle(500, 18, colors.black),
  },
  currentLocationButton: {
    right: wp(16),
    bottom: hp(150),
    position: 'absolute',
    alignSelf: 'flex-end',
  },
});
