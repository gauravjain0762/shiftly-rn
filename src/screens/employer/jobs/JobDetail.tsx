import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  BackHeader,
  GradientButton,
  LinearContainer,
  ShareModal,
} from '../../../component';
import {useTranslation} from 'react-i18next';
import {IMAGES} from '../../../assets/Images';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {useRoute} from '@react-navigation/native';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREEN_NAMES} from '../../../navigation/screenNames';

const JobDetail = () => {
  const {t, i18n} = useTranslation();
  const {params} = useRoute();
  const data = params?.data;
  const [modal, setModal] = useState(false);

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['bottom', 'top']}}
      colors={['#0D468C', '#041326']}>
      <BackHeader
        title={t('Job Detail')}
        containerStyle={styles.headerContainer}
        RightIcon={
          <TouchableOpacity
            onPress={() => setModal(!modal)}
            style={styles.right}>
            <Image
              source={IMAGES.share}
              resizeMode="contain"
              style={styles.share}
            />
          </TouchableOpacity>
        }
        leftStyle={styles.lefticon}
      />
      <Image
        style={styles.banner}
        resizeMode="cover"
        source={{uri: data?.image}}
      />
      <ScrollView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoBg}>
            <Image
              resizeMode="contain"
              source={{
                uri: data?.logo,
              }}
              style={styles.logo}
            />
          </View>
          <View style={styles.locationTitle}>
            <View style={styles.row}>
              <Image source={IMAGES.location} style={styles.location} />
              <Text style={styles.locationText}>{data?.company}</Text>
            </View>
            <Text style={styles.jobTitle}>{data?.title}</Text>
          </View>
          <TouchableOpacity style={styles.like}>
            <Image source={IMAGES.like} style={styles.heart} />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Atlantis Collection is a diverse group of luxury hotels with a fresh
          focus, offering guests a more authentic and thoughtful way to travel.
          We've created a collection brand that gives guests & colleagues an
          inspiring new choice. One that puts people at the heart of everything
          we do, to reframe luxury hospitality for the better.
        </Text>

        {/* Requirements */}
        <Text style={styles.sectionTitle}>What we need from you</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>
            • Bachelor's degree / higher education qualification / equivalent in
            Hotel Management/ Business Administration
          </Text>
          <Text style={styles.bullet}>
            • 3 years of Front Office/Guest Service experience including
            management experience
          </Text>
          <Text style={styles.bullet}>• Must speak fluent English</Text>
          <Text style={styles.bullet}>• Other languages preferred</Text>
        </View>

        {/* Offer */}
        <Text style={styles.sectionTitle}>What we offer</Text>
        <Text style={styles.description}>
          We give our people everything they need to succeed. From a competitive
          salary that rewards all your hard work to a wide range of benefits
          designed to help you live your best work life. We welcome everyone and
          create inclusive teams where we celebrate difference and encourage
          colleagues to bring their whole selves to work.
        </Text>
        <View style={{height: hp(10)}} />
        <GradientButton
          onPress={() => navigateTo(SCREEN_NAMES.ApplyJob, {data: data})}
          title={t('Apply Job')}
        />
      </ScrollView>
      <ShareModal visible={modal} onClose={() => setModal(!modal)} />
    </LinearContainer>
  );
};

export default JobDetail;

const styles = StyleSheet.create({
  lefticon: {marginRight: wp(21)},
  share: {
    width: wp(17),
    height: wp(17),
  },
  right: {
    backgroundColor: colors.white,
    borderRadius: 100,
    padding: wp(8),
    marginLeft: 'auto',
  },
  headerContainer: {
    paddingHorizontal: wp(16),
  },
  banner: {
    height: hp(230),
    marginTop: hp(10),
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(26),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(20),
  },
  logo: {
    height: hp(34),
    resizeMode: 'contain',
    width: '100%',
  },
  locationTitle: {
    marginLeft: wp(12),
    gap: hp(8),
    flex: 0.89,
  },
  locationText: {
    ...commonFontStyle(400, 14, '#fff'),
  },
  jobTitle: {
    ...commonFontStyle(700, 18, '#fff'),
  },
  heart: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
  },
  description: {
    ...commonFontStyle(400, 14, colors.white),
    lineHeight: 25,
    marginBottom: hp(20),
  },
  sectionTitle: {
    ...commonFontStyle(600, 18, colors.white),
    marginBottom: hp(8),
  },
  bulletList: {
    marginBottom: hp(20),
  },
  bullet: {
    ...commonFontStyle(400, 14, colors.white),
    marginBottom: hp(8),
    lineHeight: 25,
  },
  logoBg: {
    backgroundColor: colors.white,
    width: wp(73),
    height: wp(73),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  like: {
    backgroundColor: colors.white,
    padding: wp(8),
    borderRadius: 100,
    marginLeft: 'auto',
  },
  location: {
    width: wp(17),
    height: wp(17),
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(4),
  },
});
