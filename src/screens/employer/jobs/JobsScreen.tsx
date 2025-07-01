import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {JobCard, LinearContainer} from '../../../component';
import {SCREEN_WIDTH, commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import {AppStyles} from '../../../theme/appStyles';
import Carousel from 'react-native-reanimated-carousel';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREEN_NAMES, SCREENS} from '../../../navigation/screenNames';
import {useTranslation} from 'react-i18next';
const jobs = [
  {
    id: '1',
    company: 'Atlantis, The Palm, Dubai',
    logo: 'https://content.presspage.com/templates/658/2042/729924/royal-atlantis-logo.png',
    title: 'Restaurant Manager',
    description:
      'We are looking for experienced restaurant manager to manage our newly opened branch in Palm Jumeirah...',
    image:
      'https://images.unsplash.com/photo-1690923934414-fbfcaf874f79?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxhbmRzY2FwZSUyMGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D',
    posted: 'Recently Posted',
  },
  {
    id: '2',
    company: 'Marriot, Palm Jumeirah, dubai UAE',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Marriott_hotels_logo14.svg/512px-Marriott_hotels_logo14.svg.png',
    title: 'Restaurant Manager',
    description:
      'We are looking for experienced restaurant manager to manage our newly opened branch in Palm Jumeirah...',
    image:
      'https://images.unsplash.com/photo-1721539151779-e6dc7f9de376?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGxhbmRzY2FwZSUyMGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D',
    posted: 'Posted 2 Days ago',
  },
];

const carouselImages = [
  'https://images.unsplash.com/photo-1636137628585-db2f13cad125?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGxhbmRzY2FwZSUyMGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1551598305-fe1be9fe579e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGxhbmRzY2FwZSUyMGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFuZHNjYXBlfGVufDB8fDB8fHww',
];

const JobsScreen = () => {
  const {t, i18n} = useTranslation();
  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('Search Jobs')}</Text>
        <View style={styles.headerImgBar}>
          <TouchableOpacity>
            <Image style={styles.headerIcons} source={IMAGES.search} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={styles.headerIcons} source={IMAGES.filter} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo(SCREENS.NotificationScreen)}>
            <Image style={styles.headerIcons} source={IMAGES.notification} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.carouselWrapper}>
        <Carousel
          loop
          width={SCREEN_WIDTH - 32}
          height={180}
          autoPlay={true}
          data={carouselImages}
          scrollAnimationDuration={2500}
          renderItem={({item}) => (
            <Image
              source={{uri: item}}
              style={styles.carouselImage}
              resizeMode="cover"
            />
          )}
        />
      </View>

      <Text style={styles.sectionTitle}>{t('Recent Jobs')}</Text>
      <FlatList
        data={jobs}
        style={AppStyles.flex}
        showsVerticalScrollIndicator={false}
        renderItem={(item: any) => (
          <JobCard
            onPress={() =>
              navigateTo(SCREEN_NAMES.JobDetail, {data: item?.item})
            }
            {...item}
          />
        )}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={{height: hp(28)}} />}
        contentContainerStyle={styles.scrollContainer}
      />
    </LinearContainer>
  );
};

export default JobsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(25),
    paddingVertical: hp(32),
  },
  headerTitle: {
    ...commonFontStyle(600, 22, colors.white),
  },
  headerIcons: {
    width: wp(26),
    height: wp(26),
    tintColor: '#F4E2B8',
  },
  icon: {
    fontSize: 20,
    color: '#fff',
  },
  headerImgBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(18),
  },
  sectionTitle: {
    ...commonFontStyle(500, 20, colors.white),
    paddingVertical: hp(12),
    paddingHorizontal: wp(25),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: wp(25),
  },
  carouselWrapper: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  carouselImage: {
    width: '100%',
    height: 180,
  },
});
