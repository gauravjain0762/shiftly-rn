import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HomeHeader, LinearContainer} from '../../../component';
import {hp, wp} from '../../../theme/fonts';
import FeedCard from '../../../component/employe/FeedCard';
import {AppStyles} from '../../../theme/appStyles';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';

const HomeScreen = () => {
  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <View style={styles.header}>
        <HomeHeader
          onPressNotifi={() => navigateTo(SCREENS.NotificationScreen)}
        />
      </View>
      <FlatList
        style={AppStyles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollcontainer}
        ItemSeparatorComponent={() => <View style={{height: hp(15)}} />}
        data={[1, 2]}
        renderItem={(item: any) => <FeedCard />}
      />
    </LinearContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
