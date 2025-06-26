import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const ActivityScreen = () => {
  return (
    <LinearGradient colors={['#043379', '#041F50']} style={styles.container}>
      <SafeAreaView>

      <Text>ActivityScreen</Text>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
