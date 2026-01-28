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
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {AppStyles} from '../../../theme/appStyles';
import {colors} from '../../../theme/colors';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  getAddress,
  requestLocationPermission,
} from '../../../utils/locationHandler';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {API} from '../../../utils/apiConstant';
import GradientButton from '../../../component/common/GradientButton';
import {navigationRef} from '../../../navigation/RootContainer';
import {useFocusEffect} from '@react-navigation/native';
import {IMAGES} from '../../../assets/Images';
import {
  getAsyncUserLocation,
  setAsyncLocation,
} from '../../../utils/asyncStorage';
import CustomImage from '../../../component/common/CustomImage';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {setUserInfo, setCompanyProfileData} from '../../../features/authSlice';

const CoProfileLocationScreen = () => {
  const {t} = useTranslation();
  const mapRef = useRef<any | null>(null);
  const dispatch = useDispatch();
  const {userInfo, getAppData} = useSelector((state: RootState) => state.auth);
  const mapKey = getAppData?.map_key || API?.GOOGLE_MAP_API_KEY;

  const [search, setSearch] = useState(userInfo?.address || '');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>({
    latitude: userInfo?.lat,
    longitude: userInfo?.lng,
  });
  const [position, setPosition] = useState({
    latitude: userInfo?.lat || 25.2048,
    longitude: userInfo?.lng || 55.2708,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const ref = useRef<any | null>(null);

  // Refs for debouncing and tracking
  const addressFetchTimeout = useRef<NodeJS.Timeout | null>(null);
  const isUserInteracting = useRef(false);
  const lastRegion = useRef(position);

  useEffect(() => {
    if (userInfo?.address) {
      setSearch(userInfo.address);
      ref.current?.setAddressText(userInfo.address);
      setSelectedAddress({
        address: userInfo.address,
        lat: userInfo.lat,
        lng: userInfo.lng,
        state: userInfo.state,
        country: userInfo.country,
      });
    }
  }, [userInfo?.address]);

  const getUserLocation = async () => {
    try {
      setIsLoadingLocation(true);

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
        lastRegion.current = newPosition;

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
        [{text: 'OK'}],
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!userInfo?.address) {
        getUserLocation();
      }
    }, [userInfo?.address]),
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
      if (addressFetchTimeout.current) {
        clearTimeout(addressFetchTimeout.current);
      }
    };
  }, []);

  const handlePlaceSelect = async (data: any, details: any) => {
    if (!details) return;

    Keyboard.dismiss();
    setIsSearchExpanded(false);
    setIsSearchFocused(false);
    isUserInteracting.current = false;

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
    lastRegion.current = region;
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

  // Optimized region change - only update marker position during drag
  const handleRegionChange = useCallback(
    (region: any) => {
      if (isSearchFocused || isSearchExpanded) {
        return;
      }

      // Mark that user is interacting
      isUserInteracting.current = true;

      // Update marker position immediately for smooth dragging
      setMarkerPosition({
        latitude: region.latitude,
        longitude: region.longitude,
      });
    },
    [isSearchFocused, isSearchExpanded],
  );

  // Fetch address only when drag is complete
  const handleRegionChangeComplete = useCallback(
    (region: any) => {
      if (isSearchFocused || isSearchExpanded) {
        return;
      }

      // Check if region actually changed significantly
      const hasChanged =
        Math.abs(region.latitude - lastRegion.current.latitude) > 0.0001 ||
        Math.abs(region.longitude - lastRegion.current.longitude) > 0.0001;

      if (!hasChanged) {
        isUserInteracting.current = false;
        return;
      }

      // Update position state
      setPosition(region);
      lastRegion.current = region;

      // Sync marker position one final time
      setMarkerPosition({
        latitude: region.latitude,
        longitude: region.longitude,
      });

      // Clear any pending address fetch
      if (addressFetchTimeout.current) {
        clearTimeout(addressFetchTimeout.current);
      }

      // Debounce address lookup with longer delay for smoother UX
      addressFetchTimeout.current = setTimeout(() => {
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
          undefined,
          mapKey,
        );
        isUserInteracting.current = false;
      }, 500); // Increased debounce time
    },
    [isSearchFocused, isSearchExpanded, mapKey],
  );

  const moveMarkerToCoords = (coords: any) => {
    const region = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setPosition(region);
    setMarkerPosition(coords);
    lastRegion.current = region;
    mapRef.current?.animateToRegion(region, 500);

    // Clear pending timeout
    if (addressFetchTimeout.current) {
      clearTimeout(addressFetchTimeout.current);
    }

    addressFetchTimeout.current = setTimeout(() => {
      getAddress(
        coords,
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
    }, 300);
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
      lastRegion.current = region;
      mapRef.current?.animateToRegion(region, 500);

      getAddress(
        location,
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
        [{text: 'OK'}],
      );
    }
    setIsLoadingLocation(false);
  };

  const handleSaveLocation = async () => {
    if (selectedAddress) {
      try {
        const data = {
          ...selectedAddress,
          lat: selectedAddress?.lat,
          lng: selectedAddress?.lng,
        };
        // Update both userInfo and companyProfileData
        dispatch(setUserInfo({...userInfo, ...data}));
        dispatch(
          setCompanyProfileData({
            address: selectedAddress.address,
            lat: selectedAddress.lat,
            lng: selectedAddress.lng,
            location: selectedAddress.address,
          }),
        );
        console.log('Location saved successfully for Profile');
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
                numberOfLines: 1,
                ellipsizeMode: 'tail',
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
                key={API?.GOOGLE_MAP_API_KEY}
                provider="google"
                region={position}
                onPress={handleMapPress}
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
                    }, 500);
                  }
                }}
                style={styles.mapStyle}
                showsUserLocation={false}
                showsMyLocationButton={false}
                showsCompass={false}
                toolbarEnabled={false}
                moveOnMarkerPress={false}
                pitchEnabled={false}
                rotateEnabled={false}
                scrollEnabled={!isSearchFocused}
                zoomEnabled={!isSearchFocused}
                zoomControlEnabled={false}
                loadingEnabled={true}
                cacheEnabled={true}
                mapPadding={{top: 0, right: 0, bottom: 0, left: 0}}>
                {markerPosition && (
                  <Marker
                    coordinate={markerPosition}
                    draggable={false}
                    tracksViewChanges={false}
                    anchor={{x: 0.5, y: 1}}
                    flat={true}>
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

export default CoProfileLocationScreen;

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
    paddingRight: wp(20),
    ...commonFontStyle(500, 16, colors.black),
    borderRadius: hp(25),
    backgroundColor: 'white',
    maxWidth: '100%',
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
    bottom: hp(40),
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
