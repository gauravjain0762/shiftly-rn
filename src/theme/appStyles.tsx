import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const AppStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  side: {
    paddingHorizontal: 20,
  },
  mainSide: {
    marginHorizontal: 20,
  },
  mainWhiteContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
