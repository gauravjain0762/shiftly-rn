import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {resetNavigation} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';
import SplashScreen from 'react-native-splash-screen';
import {IMAGES} from '../../assets/Images';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../theme/fonts';
import useRole from '../../hooks/useRole';

type Props = {};

const Splash = (props: Props) => {
  const {role, setRole} = useRole();
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
      GetRole();
    }, 1000);
  }, []);
  const GetRole = () => {
    if (role == 'company') {
      resetNavigation(SCREENS.CoStack);
    } else if (role == 'employee') {
      resetNavigation(SCREENS.EmployeeStack);
    } else {
      resetNavigation(SCREENS.SelectRollScreen);
    }
  };
  return (
    <View>
      <Image
        source={IMAGES.launch_screen}
        style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
