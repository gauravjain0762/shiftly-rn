import React from 'react';
import {Image, Linking, StyleSheet, Text, View} from 'react-native';

import {AppStyles} from '../../theme/appStyles';
import {IMAGES} from '../../assets/Images';
import LocationContainer from './LocationContainer';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';

type Props = {
  companyProfileData?: any;
  companyProfileAllData?: any;
};

const CoAboutTab = ({companyProfileData}: Props) => {
  return (
    <View>
      <View style={styles.infoRow}>
        <View style={[AppStyles.flex]}>
          <Text style={styles.infoTitle}>{'Website'}</Text>
          <View style={styles.row}>
            <Image source={IMAGES.web} style={styles.web} />
            <Text
              onPress={async () => {
                if (await Linking.canOpenURL(companyProfileData?.website)) {
                  Linking.openURL(companyProfileData?.website);
                }
              }}
              style={styles.infoValue}>
              {companyProfileData?.website}
            </Text>
          </View>
        </View>
        <View style={[AppStyles.flex, {paddingLeft: wp(30)}]}>
          <Text style={styles.infoTitle}>Type</Text>
          <Text style={styles.infoValue}>
            {companyProfileData?.business_type_id?.title}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Company size</Text>
        <Text style={styles.infoValue}>
          {companyProfileData?.company_size || '50 - 100'}
        </Text>
      </View>

      {/* <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Sectors/industry</Text>
        <Text style={styles.infoValue}>
          {companyProfileData?.business_type_id}
        </Text>
      </View> */}

      <LocationContainer
        containerStyle={styles.map}
        lat={companyProfileData?.lat}
        lng={companyProfileData?.lng}
        address={companyProfileData?.address}
      />
    </View>
  );
};

export default CoAboutTab;

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  infoSection: {
    marginTop: 14,
  },
  infoTitle: {
    marginBottom: hp(10),
    ...commonFontStyle(400, 18, colors._0B3970),
  },
  infoValue: {
    ...commonFontStyle(400, 16, colors._434343),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp(5),
  },
  web: {
    width: wp(19),
    height: wp(19),
    resizeMode: 'contain',
  },
  map: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: hp(30),
  },
});
