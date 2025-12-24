import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';

const Loader = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size={'large'} color={colors._D5D5D5} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
