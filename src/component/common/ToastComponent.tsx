import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../theme/colors';
import {
  commonFontStyle,
  fontFamily,
  hp,
  SCREEN_WIDTH,
  wp,
} from '../../theme/fonts';
import {IMAGES} from '../../assets/Images';

interface ToastProps {
  type: 'error' | 'success';
  text1: string;
  lineAnim?: any;
}

const ToastComponent: React.FC<ToastProps> = ({type, text1, lineAnim}) => {

  return (
    <SafeAreaView>
      <View style={styles.toastStyle}>
        {type === 'success' && (
          <View style={{}}>
            <View style={styles.row}>
              <Image
                source={IMAGES.checked}
                defaultSource={IMAGES.checked}
                style={{height: hp(20), width: wp(20)}}
                resizeMode="contain"
                tintColor={colors.green}
              />
              <Text style={styles.textStyleToast}>{text1}</Text>
            </View>

            <Animated.View
              style={{
                height: 4,
                backgroundColor: colors.green,
                width: lineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'], // Animate from 0% to 100%
                }),
              }}
            />
          </View>
        )}

        {type === 'error' && (
         <View style={{backgroundColor:"black"}}>
            <View style={styles.row}>
              <Image
                source={IMAGES.cancel}
                defaultSource={IMAGES.cancel}
                style={{height: hp(20), width: wp(20)}}
                resizeMode="contain"
                tintColor={colors.red}
              />
              <Text style={styles.textStyleToast}>{text1}</Text>
            </View>

            <Animated.View
              style={{
                height: 4,
                backgroundColor: colors.red,
                width: lineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'], // Animate from 0% to 100%
                }),
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  toastStyle: {
    backgroundColor: colors._25201a,
    width: SCREEN_WIDTH - 50,
    borderRadius: 10,
    overflow: 'hidden',
  },
  row: {
    flexDirection:"row",
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: hp(15),
  },
  textStyleToastSuccess: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: SCREEN_WIDTH,
  },
  textStyleToast: {
    ...commonFontStyle(500, 15, colors.white),
    textAlign: 'left',
    paddingRight: wp(10),
  },
});

export default ToastComponent;
