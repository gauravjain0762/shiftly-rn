import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../../theme/fonts';

type Props = {
  range?: number[] | any;
  setRange?: React.Dispatch<React.SetStateAction<number[]>>;
};

const RangeSlider = ({range, setRange}: Props) => {
  return (
    <View style={styles.container}>
      <MultiSlider
        values={range}
        min={0}
        max={50000}
        step={100}
        sliderLength={SCREEN_WIDTH - wp(70)}
        onValuesChange={setRange}
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
        ₹{range[0]} - ₹{range[1]}
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
