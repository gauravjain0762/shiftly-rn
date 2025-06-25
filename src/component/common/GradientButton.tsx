import LinearGradient from 'react-native-linear-gradient';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {commonFontStyle, hp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {Defs, RadialGradient, Rect, Stop, Svg} from 'react-native-svg';

interface DiamondGradientButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const GradientButton: React.FC<DiamondGradientButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, style]}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="diamond"
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
            fx="50%"
            fy="50%">
            <Stop offset="0%" stopColor="#F4E2B8" stopOpacity="1" />
            <Stop offset="100%" stopColor="#CBB580" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="0"
          ry="0"
          fill="url(#diamond)"
        />
      </Svg>

      <View style={styles.content}>
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    ...commonFontStyle(400, 22, colors.black),
  },
  wrapper: {
    borderWidth: 2.5,
    borderColor: '#1C4C88',
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: '#FFFFFF',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
    backgroundColor: colors.white,
  },
  content: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GradientButton;
