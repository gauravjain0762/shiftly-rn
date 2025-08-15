import LinearGradient from 'react-native-linear-gradient';
import {
  GestureResponderEvent,
  Pressable,
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
  style?: ViewStyle;
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
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.wrapper,
        style,
        {borderWidth: type == 'Employee' ? 2.5 : 0},
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
                stopColor={stopColor || '#F4E2B8'}
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor={stopColor || '#CBB580'}
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
      ) : (
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient
              id="diamond"
              cx={cx || '50%'}
              cy={cy || '50%'}
              rx={rx || '60%'}
              ry={ry || '90%'}
              fx={fx || '10%'}
              fy={fy || '50%'}>
              <Stop
                offset="0%"
                stopColor={stopColor || '#024AA1'}
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor={stopColor || '#041428'}
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
    backgroundColor: colors.white,
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
