import LinearGradient from 'react-native-linear-gradient';
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { commonFontStyle, hp } from '../../theme/fonts';
import { colors } from '../../theme/colors';
import { Defs, RadialGradient, Rect, Stop, Svg } from 'react-native-svg';

interface DiamondGradientButtonProps extends TouchableOpacityProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;

  radialStops?: {
    offset: string;
    color: string;
    opacity?: number;
  }[];

  cx?: string;
  cy?: string;
  rx?: string;
  ry?: string;
  fx?: string;
  fy?: string;

  gradientColors?: string[];

  type?: 'Company' | 'Employee';
  textContainerStyle?: ViewStyle;
}

const GradientButton: React.FC<DiamondGradientButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  radialStops,
  gradientColors = ['#024AA1', '#041428'],
  cx = '50%',
  cy = '50%',
  fx = '50%',
  fy = '50%',
  rx = '50%',
  ry = '50%',
  type = 'Employee',
  textContainerStyle,
  ...rest
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      {...rest}
      style={[
        styles.wrapper,
        {
          borderWidth: type == 'Employee' ? 2.5 : 1,
          backgroundColor: type == 'Company' ? colors.coPrimary : colors.white,
          opacity: rest.disabled ? 0.6 : 1,
          ...(type == 'Company' && {
            borderWidth: 1.5,
            borderColor: colors._0B3970,
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
          }),
        },
        style,
      ]}>
      {type === 'Employee' ? (
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient
              id="diamond"
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fx={fx}
              fy={fy}
            >
              {(radialStops ?? [
                { offset: '0%', color: colors.white, opacity: 1 },
                { offset: '100%', color: colors.white, opacity: 1 },
              ]).map((stop, index) => (
                <Stop
                  key={index}
                  offset={stop.offset}
                  stopColor={stop.color}
                  stopOpacity={stop.opacity ?? 1}
                />
              ))}
            </RadialGradient>
          </Defs>

          <Rect width="100%" height="100%" fill="url(#diamond)" />
        </Svg>
      ) : type === 'Company' ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={StyleSheet.absoluteFill} />
      )}
      <View style={[styles.content, textContainerStyle]}>
        <Text
          style={[
            type == 'Employee' ? styles.buttonText : styles.CombuttonText,
            textStyle,
          ]}>
          {title}
        </Text>
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  content: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CombuttonText: {
    ...commonFontStyle(600, 20, colors.white),
  },
});

export default GradientButton;
