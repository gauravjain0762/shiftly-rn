import {
  Platform,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  ImageBackground,
} from 'react-native';
import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaView,
  SafeAreaViewProps,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {AppStyles} from '../../theme/appStyles';
import {colors} from '../../theme/colors';

type Props = {
  children: any;
  containerStyle?: ViewStyle | {};
  colors?: string[] | '';
  SafeAreaProps?: SafeAreaViewProps;
  props?: any;
};

const LinearContainer = ({
  children,
  containerStyle = [],
  colors = '',
  SafeAreaProps = {edges: ['top']},
  ...props
}: Props) => {
  return (
    <View style={[styles.mainContainer]}>
      <LinearGradient
        style={styles.linearView}
        colors={colors || ['#043379', '#041F50']}>
        <SafeAreaView
          {...SafeAreaProps}
          style={[AppStyles.flex]}
          edges={['top']}>
          <View style={[styles.containerStyle, containerStyle]} {...props}>
            {children}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default memo(LinearContainer);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  linearView: {
    flex: 1,
  },
  containerStyle: {
    flex: 1,
  },
});
