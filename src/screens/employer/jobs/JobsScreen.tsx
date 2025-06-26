import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const JobsScreen = () => {
  return (
    <LinearGradient colors={['#043379', '#041F50']} style={styles.container}>
      <SafeAreaView>

      <Text>JobsScreen</Text>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default JobsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
