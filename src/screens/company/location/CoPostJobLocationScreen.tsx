import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { AppStyles } from '../../../theme/appStyles';
import { colors } from '../../../theme/colors';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getAddress,
  requestLocationPermission,
} from '../../../utils/locationHandler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { API } from '../../../utils/apiConstant';
import GradientButton from '../../../component/common/GradientButton';
import { navigationRef } from '../../../navigation/RootContainer';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { IMAGES } from '../../../assets/Images';
import { getAsyncUserLocation, setAsyncLocation } from '../../../utils/asyncStorage';
import CustomImage from '../../../component/common/CustomImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

// Helper function to remove plus codes like "673C+M8F - " from addresses
const stripPlusCode = (address: string): string => {
  if (!address) return address;
  // Remove plus codes at the start like "673C+M8F - " or "673C+M8F, "
  return address.replace(/^[A-Z0-9]{4,}\+[A-Z0-9]{2,4}\s*[-–,]\s*/i, '').trim();
};

const CoPostJobLocationScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const mapRef = useRef<any | null>(null);
  const { userAddress: initialUserAddress } = (route.params as any) || {};
  const { userInfo, getAppData } = useSelector((state: RootState) => state.auth);
  const mapKey = getAppData?.map_key || API?.GOOGLE_MAP_API_KEY;

  // Priority: initialUserAddress > userInfo (registered) > default
  const defaultAddress = initialUserAddress ||
    (userInfo?.address && userInfo?.lat && userInfo?.lng
      ? {
        address: userInfo.address,
        lat: userInfo.lat,
        lng: userInfo.lng,
        state: userInfo.state || '',
        country: userInfo.country || '',
      }
      : null);

  const [search, setSearch] = useState(defaultAddress?.address || '');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(
    defaultAddress?.lat && defaultAddress?.lng
      ? {
        latitude: defaultAddress.lat,
        longitude: defaultAddress.lng,
      }
      : null,
  );
  const [position, setPosition] = useState(
    defaultAddress?.lat && defaultAddress?.lng
      ? {
        latitude: defaultAddress.lat,
        longitude: defaultAddress.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
      : {
        latitude: 25.2048,
        longitude: 55.2708,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
  );
  const [isMapMoving, setIsMapMoving] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(
    defaultAddress || null,
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const ref = useRef<any | null>(null);

  useEffect(() => {
    // Priority: initialUserAddress > userInfo (registered)
    const addressToUse = initialUserAddress ||
      (userInfo?.address && userInfo?.lat && userInfo?.lng
        ? {
          address: userInfo.address,
          lat: userInfo.lat,
          lng: userInfo.lng,
          state: userInfo.state || '',
          country: userInfo.country || '',
        }
        : null);

    if (addressToUse?.address) {
      setSearch(addressToUse.address);
      ref.current?.setAddressText(addressToUse.address);
      setSelectedAddress(addressToUse);
    }
  }, [initialUserAddress?.address, userInfo?.address]);

  const getUserLocation = async () => {
    try {
      setIsLoadingLocation(true);

      // Priority 1: Check route params (initialUserAddress) - Most specific to the current job
      if (initialUserAddress?.address && initialUserAddress?.lat && initialUserAddress?.lng) {
        const newPosition = {
          latitude: initialUserAddress.lat,
          longitude: initialUserAddress.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setPosition(newPosition);
        setMarkerPosition({
          latitude: initialUserAddress.lat,
          longitude: initialUserAddress.lng,
        });

        setSearch(initialUserAddress.address);
        ref.current?.setAddressText(initialUserAddress.address);
        setSelectedAddress(initialUserAddress);

        setTimeout(() => {
          mapRef.current?.animateToRegion(newPosition, 1000);
        }, 500);
        setIsLoadingLocation(false);
        return;
      }

      // Priority 2: Use registered company location from userInfo (fallback if no job location set)
      if (userInfo?.address && userInfo?.lat && userInfo?.lng) {
        const newPosition = {
          latitude: userInfo.lat,
          longitude: userInfo.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setPosition(newPosition);
        setMarkerPosition({
          latitude: userInfo.lat,
          longitude: userInfo.lng,
        });

        setSearch(userInfo.address);
        ref.current?.setAddressText(userInfo.address);
        setSelectedAddress({
          address: userInfo.address,
          lat: userInfo.lat,
          lng: userInfo.lng,
          state: userInfo.state || '',
          country: userInfo.country || '',
        });

        setTimeout(() => {
          mapRef.current?.animateToRegion(newPosition, 1000);
        }, 500);
        setIsLoadingLocation(false);
        return;
      }

      // Priority 3: Try to get from AsyncStorage (fallback)
      const locationString = await AsyncStorage.getItem('user_location');
      if (locationString !== null) {
        const location = JSON.parse(locationString);
        if (location.lat && location.lng) {
          const newPosition = {
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setPosition(newPosition);
          setMarkerPosition({
            latitude: location.lat,
            longitude: location.lng,
          });

          if (location.address) {
            setSearch(location.address);
            ref.current?.setAddressText(location.address);
            setSelectedAddress(location);
          } else {
            getAddress(
              { latitude: location.lat, longitude: location.lng },
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
                    lat: location.lat,
                    lng: location.lng,
                    state,
                    country,
                  });
                }
              },
              undefined,
              mapKey,
            );
          }

          setTimeout(() => {
            mapRef.current?.animateToRegion(newPosition, 1000);
          }, 500);
          setIsLoadingLocation(false);
          return;
        }
      }

      // Priority 4: Only if no registered location, try to get current GPS location
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

        getAddress(
          currentLocation,
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
                lat: currentLocation.latitude,
                lng: currentLocation.longitude,
                state,
                country,
              });
            }
          },
          undefined,
          mapKey,
        );

        setTimeout(() => {
          mapRef.current?.animateToRegion(newPosition, 1000);
        }, 500);
      } else {
        return new Promise(resolve => {
          requestLocationPermission(
            true,
            res => {
              setAsyncLocation(res);
              resolve(res);
            },
            (err: any) => {
              console.error('Location permission error:', err);
              resolve(null);
            },
          );
        });
      }
    } catch (error) {
      console.error('Failed to retrieve user location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your location. Please search for a location or enable location services.',
        [{ text: 'OK' }],
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // If we have an initial address (passed from PostJob), use it first
      if (initialUserAddress?.address && initialUserAddress?.lat && initialUserAddress?.lng) {
        const newPosition = {
          latitude: initialUserAddress.lat,
          longitude: initialUserAddress.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setPosition(newPosition);
        setMarkerPosition({
          latitude: initialUserAddress.lat,
          longitude: initialUserAddress.lng,
        });
        setSearch(initialUserAddress.address);
        ref.current?.setAddressText(initialUserAddress.address);
        setSelectedAddress(initialUserAddress);
      } else if (userInfo?.address && userInfo?.lat && userInfo?.lng) {
        // Fallback to registered location if available
        const newPosition = {
          latitude: userInfo.lat,
          longitude: userInfo.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setPosition(newPosition);
        setMarkerPosition({
          latitude: userInfo.lat,
          longitude: userInfo.lng,
        });
        setSearch(userInfo.address);
        ref.current?.setAddressText(userInfo.address);
        setSelectedAddress({
          address: userInfo.address,
          lat: userInfo.lat,
          lng: userInfo.lng,
          state: userInfo.state || '',
          country: userInfo.country || '',
        });
      } else {
        // Otherwise try to get current location
        getUserLocation();
      }
    }, [initialUserAddress?.address, userInfo?.address]),
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
    setIsSearchFocused(false);

    const { lat, lng } = details.geometry.location;
    const region = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    const rawAddress = details.formatted_address || data.description;
    const address = stripPlusCode(rawAddress);
    const components = details.address_components || [];

    const stateObj = components.find((c: any) =>
      c.types.includes('administrative_area_level_1'),
    );
    const countryObj = components.find((c: any) => c.types.includes('country'));

    const state = stateObj?.long_name || '';
    const country = countryObj?.long_name || '';

    setSearch(address);
    setPosition(region);
    setMarkerPosition({ latitude: lat, longitude: lng });
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
      Keyboard.dismiss();
      setIsSearchExpanded(false);
      setIsSearchFocused(false);
      return;
    }
    const coords = e.nativeEvent.coordinate;
    moveMarkerToCoords(coords);
  };

  const handlePoiClick = (e: any) => {
    if (isSearchFocused) return;
    const coords = e.nativeEvent.coordinate;
    moveMarkerToCoords(coords);
  };

  const handleRegionChange = (region: any) => {
    // Don't interfere during search
    if (isSearchFocused || isSearchExpanded) {
      return;
    }

    // Mark that map is being moved by user (but don't set state repeatedly)
    if (!isMapMoving) {
      setIsMapMoving(true);
    }

    // DON'T update position state during drag - this causes flickering
    // Only update marker position
    setMarkerPosition({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  const handleRegionChangeComplete = (region: any) => {
    // Don't fetch address if user is searching
    if (isSearchFocused || isSearchExpanded) {
      setIsMapMoving(false);
      return;
    }

    // Now update position state after dragging is complete
    setPosition({
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    });

    setIsMapMoving(false);

    // Fetch address for the new location
    getAddress(
      { latitude: region.latitude, longitude: region.longitude },
      (data: any) => {
        const rawAddress = data?.results?.[0]?.formatted_address;
        const address = stripPlusCode(rawAddress);
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
      undefined,
      mapKey,
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

    getAddress(
      coords,
      (data: any) => {
        const rawAddress = data?.results?.[0]?.formatted_address;
        const address = stripPlusCode(rawAddress);
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
      },
      undefined,
      mapKey,
    );
  };

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    const location = await getAsyncUserLocation();

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

      getAddress(
        location,
        (data: any) => {
          const rawAddress = data?.results?.[0]?.formatted_address;
          const address = stripPlusCode(rawAddress);
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
        },
        undefined,
        mapKey,
      );
    } else {
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your location settings.',
        [{ text: 'OK' }],
      );
    }
    setIsLoadingLocation(false);
  };

  const handleSaveLocation = async () => {
    if (selectedAddress) {
      try {
        // Save to AsyncStorage for PostJob to use
        await AsyncStorage.setItem(
          'user_location',
          JSON.stringify(selectedAddress),
        );
        console.log('Location saved successfully for PostJob');
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
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      if (!isKeyboardVisible) {
        setIsSearchExpanded(false);
        setIsSearchFocused(false);
      }
    }, 200);
  };

  const { bottom } = useSafeAreaInsets()

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
            { marginTop: useSafeAreaInsets().top },
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
                key: mapKey || API?.GOOGLE_MAP_API_KEY,
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
          <View style={AppStyles.flex}>
            <View style={styles.container}>
              <MapView
                ref={mapRef}
                region={position}
                initialRegion={position}
                onPress={handleMapPress}
                provider={Platform.OS === 'android' ? 'google' : undefined}
                onPoiClick={handlePoiClick}
                onRegionChange={handleRegionChange}
                onRegionChangeComplete={handleRegionChangeComplete}
                onMapReady={() => {
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
                    <Image
                      resizeMode="contain"
                      source={IMAGES.location_marker}
                      style={styles.customMarkerImage}
                    />
                  </Marker>
                )}
              </MapView>
            </View>

            <GradientButton
              type="Company"
              title={t('Save Location')}
              style={[
                styles.btn,
                { bottom: bottom },
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
            ]}>
            <Image
              source={IMAGES.current_location}
              style={styles.currentLocationIcon}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default CoPostJobLocationScreen;

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
    width: wp(36),
    height: hp(36),
  },
  customMarker: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: colors.coPrimary || '#007AFF',
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
    bottom: hp(150),
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
