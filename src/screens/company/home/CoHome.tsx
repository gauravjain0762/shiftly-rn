import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {HomeHeader, LinearContainer} from '../../../component';
import {AppStyles} from '../../../theme/appStyles';
import FeedCard from '../../../component/employe/FeedCard';
import {hp, wp} from '../../../theme/fonts';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';

const CoHome = () => {
  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <View style={styles.header}>
        <HomeHeader
          onPressAvatar={() => navigateTo(SCREENS.CoMessage)}
          type="company"
        />
      </View>
      <FlatList
        style={AppStyles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollcontainer}
        ItemSeparatorComponent={() => <View style={{height: hp(15)}} />}
        data={[1, 2]}
        renderItem={(item: any) => (
          <FeedCard
            isFollow
            onPressCard={() => navigateTo(SCREENS.CompanyProfile)}
          />
        )}
      />
    </LinearContainer>
  );
};

export default CoHome;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(25),
    marginTop: hp(20),
    paddingBottom: hp(21),
  },
  scrollcontainer: {
    paddingHorizontal: wp(25),
    paddingBottom: hp(21),
  },
});
