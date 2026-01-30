import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, { memo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaViewProps,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

type Props = {
  children?: any;
  containerStyle?: ViewStyle | {};
  colors?: string[] | '';
  SafeAreaProps?: SafeAreaViewProps;
  props?: any;
};

const LinearContainer = ({
  children,
  containerStyle = [],
  colors = '',
  SafeAreaProps = { edges: ['top'] },
  ...props
}: Props) => {

  const insets = useSafeAreaInsets();
  const isAndroid15Plus = Platform.OS === 'android' && Platform.Version >= 35;
  const backgroundColor = "#fff";

  const getPaddingTop = () => {
    if (isAndroid15Plus) {
      return insets.top;
    }
    return insets.top;
  };


  const FocusAwareStatusBar = ({ barStyle, backgroundColor }) => {

    const isFocused = useIsFocused();
    return isFocused ? (
      <StatusBar
        barStyle={barStyle}
        backgroundColor="transparent"
        animated
        showHideTransition="fade"
        translucent={Platform.OS === 'android'}
      />
    ) : null;
  };

  return (
    <View style={[styles.mainContainer]}>
      <LinearGradient
        style={styles.linearView}
        colors={colors || ['#043379', '#041F50']}>
        <View
          style={[
            styles.containerStyle,
            {
              backgroundColor: backgroundColor,
              paddingTop: getPaddingTop(),
              // paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}
        >
          <FocusAwareStatusBar barStyle={'dark-content'} backgroundColor={backgroundColor} />
          <View style={[styles.containerStyle, containerStyle]} {...props}>
            {children}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default memo(LinearContainer);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  linearView: {
    flex: 1,
  },
  containerStyle: {
    flex: 1,
  },
});
