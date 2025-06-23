import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {resetNavigation} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';
import SplashScreen from 'react-native-splash-screen';
import {IMAGES} from '../../assets/Images';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../theme/fonts';

type Props = {};

const Splash = (props: Props) => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
      resetNavigation(SCREENS.SelectRollScreen);
    }, 1000);
  }, []);
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
