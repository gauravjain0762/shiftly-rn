import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import {IMAGES} from '../../assets/Images';
import {colors} from '../../theme/colors';
import {commonFontStyle} from '../../theme/fonts';

const CustomHeader = ({onBack, onShare, mainHeader}: any) => {
  if (mainHeader) {
    return (
      <View style={styles.header}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={colors.mainColor}
        />
        <View />
        {/* <Image source={IMAGES.logo} style={{width:30,height:30}}/> */}
        <Text style={[styles.title, {marginLeft: 0}]}>{'Mangal Bhav'}</Text>
        {/* <TouchableOpacity onPress={onShare} style={styles.shareButton}>
        <Image source={IMAGES.ic_share} style={{width:28,height:28,tintColor:colors.white}}/>
  
        </TouchableOpacity> */}
        <View />
      </View>
    );
  }
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.left}>
        <Image
          source={IMAGES.back}
          style={{width: 20, height: 20, tintColor: colors.white}}
        />
        <Text style={styles.title}>{'Details'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onShare} style={styles.shareButton}>
        <Image
          source={IMAGES.ic_share}
          style={{width: 28, height: 28, tintColor: colors.white}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.mainColor, // Orange
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 8,
    ...commonFontStyle(700, 24, colors.white),
  },
  shareButton: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // borderColor: '#000',
    // borderWidth: 1,
    // borderRadius: 16,
    // paddingVertical: 4,
    // paddingHorizontal: 10,
    // backgroundColor: '#fff',
  },
  shareText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});

export default CustomHeader;
