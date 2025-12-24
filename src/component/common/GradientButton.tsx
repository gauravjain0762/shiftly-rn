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
import {commonFontStyle, hp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {Defs, RadialGradient, Rect, Stop, Svg} from 'react-native-svg';

interface DiamondGradientButtonProps extends TouchableOpacityProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  stopColor?: string;
  cx?: string;
  cy?: string;
  rx?: string;
  ry?: string;
  fx?: string;
  fy?: string;
  type?: 'Company' | 'Employee';
  textContainerStyle?: ViewStyle;
}

const GradientButton: React.FC<DiamondGradientButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  stopColor = '',
  cx = '',
  cy = '',
  fx = '',
  fy = '',
  rx = '',
  ry = '',
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
        style,
        {
          borderWidth: type == 'Employee' ? 2.5 : 1,
          backgroundColor: type == 'Company' ? colors.coPrimary : colors.white,
          opacity: rest.disabled ? 0.6 : 1,
          ...(type == 'Company' && {
            borderWidth: 1.5,
            borderColor: colors._0B3970,
            shadowColor: 'transparent',
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
          }),
        },
      ]}>
      {type == 'Employee' ? (
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient
              id="diamond"
              cx={cx || '50%'}
              cy={cy || '50%'}
              rx={rx || '50%'}
              ry={ry || '50%'}
              fx={fx || '50%'}
              fy={fy || '50%'}>
              <Stop
                offset="0%"
                stopColor={stopColor || colors.white}
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor={stopColor || colors.white}
                stopOpacity="1"
              />
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
      ) : type == 'Company' ? (
        <LinearGradient
          colors={[colors.white, colors._F7F7F7]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
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
    shadowOffset: {width: 0, height: 8},
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
    ...commonFontStyle(600, 20, colors._0B3970),
  },
});

export default GradientButton;
