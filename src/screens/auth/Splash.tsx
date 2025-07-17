import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {resetNavigation} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';
import SplashScreen from 'react-native-splash-screen';
import {IMAGES} from '../../assets/Images';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../theme/fonts';
import useRole, {RoleType} from '../../hooks/useRole';
import {requestLocationPermission} from '../../utils/locationHandler';
import {
  getAsyncLanguage,
  getAsyncToken,
  getAsyncUserInfo,
  setAsyncLocation,
} from '../../utils/asyncStorage';
import {
  setAuthToken,
  setLanguages,
  setUserInfo,
} from '../../features/authSlice';
import {useAppDispatch} from '../../redux/hooks';
import {useGetBusinessTypesQuery} from '../../api/authApi';

type Props = {};

const Splash = (props: Props) => {
  const dispatch = useAppDispatch();
  const {role, setRole, loading} = useRole();
  const navigation = useNavigation();
  const {data: businessType, isLoading: Loading} = useGetBusinessTypesQuery({});

  useEffect(() => {
    // Wait for role to load before initializing app
    if (!loading) {
      initializeApp();
    }
  }, [loading, role]);

  const initializeApp = async () => {
    // Hide splash screen after 1 second
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);

    // Get location permission first
    await getLocation();

    // Then handle authentication and navigation
    await handleAuthAndNavigation();
  };

  const handleAuthAndNavigation = async () => {
    try {
      const token = await getAsyncToken();
      console.log('token--->', token);

      if (token) {
        // User is logged in
        const userData = await getAsyncUserInfo();
        const userLanguage = await getAsyncLanguage();

        dispatch(setLanguages(userLanguage));
        console.log(userData, 'userData');

        if (userData?.is_guest === true) {
          // Handle guest user
          navigateBasedOnRole(role, false);
        } else {
          // Regular authenticated user
          dispatch(setAuthToken(token));
          dispatch(setUserInfo(userData));

          // Get role from userData if available, otherwise use stored role
          const userRole = userData?.role || role;

          // Update role in storage if userData has a different role
          if (userData?.role && userData.role !== role) {
            await setRole(userRole as RoleType);
          }

          navigateBasedOnRole(userRole, true);
        }
      } else {
        // No token, user needs to login/select role
        navigateBasedOnRole(role, false);
      }
    } catch (error) {
      console.error('Error in handleAuthAndNavigation:', error);
      // Fallback to role selection
      resetNavigation(SCREENS.SelectRollScreen);
    }
  };

  const navigateBasedOnRole = (
    userRole: string | any,
    isAuthenticated: boolean,
  ) => {
    console.log(
      'Navigating based on role:',
      userRole,
      'Authenticated:',
      isAuthenticated,
    );

    if (isAuthenticated) {
      // User is logged in, navigate to main app
      switch (userRole) {
        case 'company':
          resetNavigation(SCREENS.CoStack);
          break;
        case 'employee':
          resetNavigation(SCREENS.EmployeeStack);
          break;
        default:
          // If role is not recognized, go to role selection
          resetNavigation(SCREENS.SelectRollScreen);
          break;
      }
    } else {
      // User is not logged in, navigate to auth screens
      switch (userRole) {
        case 'company':
          resetNavigation(SCREENS.CoStack);
          break;
        case 'employee':
          resetNavigation(SCREENS.EmployeeStack);
          break;
        default:
          // No role selected, go to role selection
          resetNavigation(SCREENS.SelectRollScreen);
          break;
      }
    }
  };

  const getLocation = async () => {
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
  };

  return (
    <View style={styles.container}>
      <Image
        source={IMAGES.launch_screen}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
