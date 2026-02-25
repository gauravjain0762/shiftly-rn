import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../../theme/fonts';
import {getCurrencySymbol} from '../../utils/currencySymbols';

type Props = {
  range?: number[] | any;
  setRange: React.Dispatch<React.SetStateAction<number[]>>;
  currency?: string;
};

const RangeSlider = ({range, setRange, currency = 'AED'}: Props) => {
  const symbol = getCurrencySymbol(currency);
  return (
    <View style={styles.container}>
      <MultiSlider
        values={range}
        min={0}
        max={50000}
        step={100}
        sliderLength={SCREEN_WIDTH - wp(70)}
        onValuesChange={(values: number[]) => setRange(values)}
        trackStyle={{height: hp(2), borderRadius: hp(1)}}
        containerStyle={{}}
        selectedStyle={{backgroundColor: colors._7B7878}}
        unselectedStyle={{backgroundColor: colors._7B7878}}
        markerStyle={{
          borderWidth: 1,
          borderColor: colors._7B7878,
          backgroundColor: colors.white,
        }}
      />
      <Text style={styles.label}>
        {symbol} {range[0]} - {symbol} {range[1]}
      </Text>
    </View>
  );
};

export default RangeSlider;

const styles = StyleSheet.create({
  container: {
    padding: wp(4),
    alignItems: 'center',
  },
  label: {
    marginBottom: hp(2),
    ...commonFontStyle(600, 18, colors._7B7878),
  },
});
