import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Alert,
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
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {IMAGES} from '../../assets/Images';
import {getAsyncUserLocation} from '../../utils/asyncStorage';
import CustomImage from './CustomImage';

const LocationScreen = () => {
  const {t} = useTranslation();
  const {params} = useRoute<any>();
  const userAddress = params?.userAddress;
  const mapRef = useRef<any | null>(null);

  const [search, setSearch] = useState(userAddress?.address || '');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [position, setPosition] = useState({
    latitude: 25.2048,
    longitude: 55.2708,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isMapMoving, setIsMapMoving] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false); // New state to track search focus
  const ref = useRef<any | null>(null);

  useEffect(() => {
    if (userAddress?.address) {
      setSearch(userAddress.address);
      ref.current?.setAddressText(userAddress.address);
      setSelectedAddress(userAddress);
    }
  }, [userAddress]);

  const getUserLocation = async () => {
    try {
      setIsLoadingLocation(true);

      // First try to get saved location
      const locationString = await AsyncStorage.getItem('user_location');
      if (locationString !== null) {
        const location = JSON.parse(locationString);
        console.log('🔥🔥🔥 ~ getUserLocation ~ saved location:', location);

        const newPosition = {
          latitude: location?.lat || location?.latitude,
          longitude: location?.lng || location?.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setPosition(newPosition);
        setMarkerPosition({
          latitude: location?.lat || location?.latitude,
          longitude: location?.lng || location?.longitude,
        });

        if (location.address) {
          setSearch(location.address);
          ref.current?.setAddressText(location.address);
          setSelectedAddress(location);
        }

        // Animate to saved location after map loads
        setTimeout(() => {
          mapRef.current?.animateToRegion(newPosition, 1000);
        }, 500);

        setIsLoadingLocation(false);
        return location;
      }

      // If no saved location, get current location
      const currentLocation = await getAsyncUserLocation();
      if (currentLocation) {
        const newPosition = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setPosition(newPosition);
        setMarkerPosition({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });

        // Get address for current location
        getAddress(currentLocation, (data: any) => {
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
            setSelectedAddress({
              address,
              lat: currentLocation.latitude,
              lng: currentLocation.longitude,
              state,
              country,
            });
          }
        });

        setTimeout(() => {
          mapRef.current?.animateToRegion(newPosition, 1000);
        }, 500);
      }
    } catch (error) {
      console.error('Failed to retrieve user location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your location. Please search for a location or enable location services.',
        [{text: 'OK'}],
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUserLocation();
    }, []),
  );

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      setIsSearchExpanded(true);
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      setTimeout(() => setIsSearchExpanded(false), 200);
    });
    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const handlePlaceSelect = async (data: any, details: any) => {
    if (!details) return;

    Keyboard.dismiss();
    setIsSearchExpanded(false);
    setIsSearchFocused(false); // Reset search focus when place is selected

    const {lat, lng} = details.geometry.location;
    const region = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    const address = details.formatted_address || data.description;
    const components = details.address_components || [];

    const stateObj = components.find((c: any) =>
      c.types.includes('administrative_area_level_1'),
    );
    const countryObj = components.find((c: any) => c.types.includes('country'));

    const state = stateObj?.long_name || '';
    const country = countryObj?.long_name || '';

    setSearch(address);
    setPosition(region);
    setMarkerPosition({latitude: lat, longitude: lng});
    setSelectedAddress({
      address,
      lat,
      lng,
      state,
      country,
    });

    mapRef.current?.animateToRegion(region, 500);
  };

  const handleMapPress = (e: any) => {
    if (isKeyboardVisible || isSearchFocused) {
      // Check both keyboard and search focus
      Keyboard.dismiss();
      setIsSearchExpanded(false);
      setIsSearchFocused(false);
      return;
    }
    const coords = e.nativeEvent.coordinate;
    moveMarkerToCoords(coords);
  };

  const handlePoiClick = (e: any) => {
    if (isSearchFocused) return; // Don't handle POI clicks when search is focused
    const coords = e.nativeEvent.coordinate;
    moveMarkerToCoords(coords);
  };

  const handleRegionChange = (region: any) => {
    // Don't update marker position if search is focused/expanded
    if (isSearchFocused || isSearchExpanded) {
      return;
    }

    if (!isMapMoving) {
      setIsMapMoving(true);
    }

    setMarkerPosition({
      latitude: region.latitude,
      longitude: region.longitude,
    });

    setPosition(region);
  };

  const handleRegionChangeComplete = (region: any) => {
    // Don't update address if search is focused/expanded
    if (isSearchFocused || isSearchExpanded) {
      return;
    }

    setIsMapMoving(false);

    getAddress(
      {latitude: region.latitude, longitude: region.longitude},
      (data: any) => {
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
          setSelectedAddress({
            address,
            lat: region.latitude,
            lng: region.longitude,
            state,
            country,
          });
        }
      },
    );
  };

  const moveMarkerToCoords = (coords: any) => {
    const region = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setPosition(region);
    setMarkerPosition(coords);
    mapRef.current?.animateToRegion(region, 500);

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

      if (address) {
        setSearch(address);
        ref.current?.setAddressText(address);
        setSelectedAddress({
          address,
          lat: coords.latitude,
          lng: coords.longitude,
          state,
          country,
        });
      }
    });
  };

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    const location = await getAsyncUserLocation();
    console.log('🔥🔥🔥 ~ handleGetCurrentLocation ~ location:', location);

    if (location) {
      const region = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setPosition(region);
      setMarkerPosition({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      mapRef.current?.animateToRegion(region, 500);

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
          setSelectedAddress({
            address,
            lat: location.latitude,
            lng: location.longitude,
            state,
            country,
          });
        }
      });
    } else {
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your location settings.',
        [{text: 'OK'}],
      );
    }
    setIsLoadingLocation(false);
  };

  const handleSaveLocation = async () => {
    if (selectedAddress) {
      try {
        await AsyncStorage.setItem(
          'user_location',
          JSON.stringify({
            ...selectedAddress,
            latitude: selectedAddress.lat,
            longitude: selectedAddress.lng,
          }),
        );
        console.log('Location saved successfully');
        navigationRef.goBack();
      } catch (error) {
        console.error('Failed to save location:', error);
        Alert.alert('Error', 'Failed to save location. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please select a location first.');
    }
  };

  const handleGoBack = () => {
    navigationRef.goBack();
  };

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
    setIsSearchFocused(true); // Set search as focused
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      if (!isKeyboardVisible) {
        setIsSearchExpanded(false);
        setIsSearchFocused(false); // Reset search focus when blurred
      }
    }, 200);
  };

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <SafeAreaView style={AppStyles.mainWhiteContainer} edges={[]}>
        {/* Search Bar with Back Button - Fixed Position */}
        <View
          style={[
            styles.searchContainer,
            {marginTop: useSafeAreaInsets().top},
          ]}>
          <CustomImage
            source={IMAGES.backArrow}
            size={24}
            tintColor={colors.black}
            onPress={handleGoBack}
            containerStyle={styles.backButton}
          />

          <View style={styles.googleAutoCompleteWrapper}>
            <GooglePlacesAutocomplete
              ref={ref}
              placeholder="Search Location"
              keyboardShouldPersistTaps="handled"
              onPress={handlePlaceSelect}
              styles={{
                container: styles.googleAutoCompleteContainer,
                textInput: styles.googleAutoCompleteInput,
                listView: styles.googleAutoCompleteListOverlay,
                row: styles.googleAutoCompleteRow,
                description: styles.googleAutoCompleteDescription,
              }}
              textInputProps={{
                value: search,
                onChangeText: setSearch,
                placeholderTextColor: '#999',
                onFocus: handleSearchFocus,
                onBlur: handleSearchBlur,
              }}
              predefinedPlaces={[]}
              minLength={2}
              fetchDetails={true}
              query={{
                key: API?.GOOGLE_MAP_API_KEY,
                language: 'en',
              }}
              autoFillOnNotFound={false}
              currentLocation={false}
              debounce={300}
              timeout={20000}
              disableScroll={false}
              enablePoweredByContainer={false}
              numberOfLines={1}
              listViewDisplayed={isSearchExpanded}
            />
          </View>
        </View>

        <KeyboardAvoidingView
          style={AppStyles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Loading Overlay */}
          {isLoadingLocation && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator
                size="large"
                color={colors.coPrimary || '#007AFF'}
              />
              <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
          )}

          <View style={AppStyles.flex}>
            <View style={styles.container}>
              <MapView
                ref={mapRef}
                provider="google"
                region={position}
                onPress={handleMapPress}
                onPoiClick={handlePoiClick}
                onRegionChange={handleRegionChange}
                onRegionChangeComplete={handleRegionChangeComplete}
                onMapReady={() => {
                  setIsMapLoaded(true);
                  // Auto-animate to user location when map is ready
                  if (markerPosition) {
                    setTimeout(() => {
                      mapRef.current?.animateToRegion(
                        {
                          ...position,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        },
                        1000,
                      );
                    }, 1000);
                  }
                }}
                style={styles.mapStyle}
                showsUserLocation={true}
                showsMyLocationButton={false}
                showsCompass={false}
                toolbarEnabled={false}>
                {markerPosition && (
                  <Marker coordinate={markerPosition} draggable={false}>
                    {Platform.OS === 'ios' ? (
                      <Image
                        resizeMode="contain"
                        source={IMAGES.location_marker}
                        style={styles.customMarkerImage}
                      />
                    ) : (
                      <View style={styles.customMarker}>
                        <View style={styles.markerDot} />
                      </View>
                    )}
                  </Marker>
                )}
              </MapView>
            </View>

            {/* Address Display */}
            {/* {selectedAddress && !isKeyboardVisible && (
              <View style={styles.addressDisplay}>
                <Text style={styles.selectedAddressText} numberOfLines={2}>
                  📍 {selectedAddress.address}
                </Text>
              </View>
            )} */}

            <GradientButton
              type="Employee"
              title={t('Save Location')}
              style={[
                styles.btn,
                (!selectedAddress || isKeyboardVisible) && styles.btnDisabled,
              ]}
              onPress={handleSaveLocation}
              disabled={!selectedAddress}
            />
          </View>

          <TouchableOpacity
            onPress={handleGetCurrentLocation}
            style={[
              styles.currentLocationButton,
              isKeyboardVisible && styles.currentLocationButtonHidden,
            ]}
            disabled={isLoadingLocation}>
            {isLoadingLocation ? (
              <ActivityIndicator
                size="small"
                color={colors.primary || '#007AFF'}
              />
            ) : (
              <Image
                source={IMAGES.current_location}
                style={styles.currentLocationIcon}
              />
            )}
          </TouchableOpacity>
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
  searchContainer: {
    position: 'absolute',
    // top: hp(10),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1001,
    paddingHorizontal: wp(15),
  },
  backButton: {
    padding: wp(10),
    backgroundColor: colors.white,
    borderRadius: hp(25),
    marginRight: wp(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleAutoCompleteWrapper: {
    flex: 1,
    zIndex: 1001,
  },
  googleAutoCompleteContainer: {
    flex: 0,
    borderRadius: hp(25),
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1001,
  },
  googleAutoCompleteInput: {
    height: hp(50),
    paddingHorizontal: wp(15),
    ...commonFontStyle(500, 16, colors.black),
    borderRadius: hp(25),
    backgroundColor: 'white',
  },
  googleAutoCompleteListOverlay: {
    position: 'absolute',
    top: hp(55),
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: hp(10),
    maxHeight: hp(300),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 1002,
  },
  googleAutoCompleteRow: {
    paddingVertical: hp(12),
    paddingHorizontal: wp(15),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  googleAutoCompleteDescription: {
    ...commonFontStyle(400, 14, colors.black),
    lineHeight: hp(18),
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    marginTop: hp(10),
    ...commonFontStyle(500, 16, colors.black),
  },
  addressDisplay: {
    position: 'absolute',
    bottom: hp(80),
    left: wp(15),
    right: wp(15),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: wp(15),
    paddingVertical: hp(10),
    borderRadius: hp(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedAddressText: {
    ...commonFontStyle(500, 14, colors.black),
    lineHeight: hp(18),
  },
  btn: {
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    marginVertical: hp(20),
    marginHorizontal: wp(20),
  },
  btnDisabled: {
    opacity: 0.6,
  },
  customMarkerImage: {
    width: wp(40),
    height: hp(40),
  },
  customMarker: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: colors.primary || '#007AFF',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerDot: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: wp(3),
  },
  currentLocationButton: {
    position: 'absolute',
    right: wp(16),
    bottom: hp(100),
    backgroundColor: 'white',
    borderRadius: wp(25),
    padding: wp(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  currentLocationButtonHidden: {
    opacity: 0,
  },
  currentLocationIcon: {
    width: wp(24),
    height: wp(24),
  },
});
