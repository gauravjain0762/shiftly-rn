import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import Slider from 'react-native-slider';

const ProfileScreen = () => {
  const [range, setRange] = useState('');
  const HeaderWithAdd = useCallback(
    ({title}) => (
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
      </View>
    ),
    [],
  );

  const Section = useCallback(
    ({title, content}) => (
      <View style={styles.card}>
        <TouchableOpacity style={styles.addButton}>
          <Image source={IMAGES.pluse} style={styles.plus} />
        </TouchableOpacity>
        <HeaderWithAdd title={title} />
        <Text style={styles.content}>{content}</Text>
      </View>
    ),
    [],
  );

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['top']}}
      colors={['#0D468C', '#041326']}>
      <ScrollView
        contentContainerStyle={styles.scrollContiner}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Image
            source={{uri: 'https://randomuser.me/api/portraits/women/44.jpg'}}
            style={styles.avatar}
          />
          <Text style={styles.name}>Smith Williamson</Text>
          <View style={styles.locationRow}>
            <Image source={IMAGES.marker} style={styles.locationicon} />
            <Text style={styles.location}>Dubai Marina, Dubai - U.A.E</Text>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <Text style={styles.statText}>0 Connections</Text>
            <Text style={styles.statText}>0 Profile Views</Text>
          </View>

          <View style={styles.completionCard}>
            <Text style={styles.completionTitle}>Profile completion</Text>
            <View style={styles.row}>
              <View style={styles.progressBarBg}>
                <View style={styles.progressBarFill} />
              </View>
              <Text style={styles.percentage}>50%</Text>
            </View>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                Keep it up! you’re halfway there.
              </Text>
            </View>
          </View>

          <Pressable style={styles.ctaCard}>
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>
                Put your hospitality soft skills to the test
              </Text>
              <Text style={styles.ctaSubtitle}>
                Take Shiftly new test and find out if you have what it takes to
                succeed in hospitality
              </Text>
            </View>
            <Image style={styles.right} source={IMAGES.back} />
          </Pressable>
          {/* Section: About Me */}
          <Section
            title="About me"
            content="Sed ut perspiciatis unde omnis iste natus error site voluptatem accusantium dolorem queitters lipsum lipslaudantiuml ipsum text."
          />

          {/* Section: Professional Experience */}
          <Section
            title="Professional Experience"
            content="Sed ut perspiciatis unde omnis iste natus error site voluptatem accusantium dolorem queitters lipsum lipslaudantiuml ipsum text."
          />

          {/* Section: My Languages */}
          <View style={styles.card}>
            <HeaderWithAdd title="My Languages" />
            <Text style={styles.languageText}>English</Text>
            {/* <Slider value={range} onValueChange={value => setRange(value)} /> */}
          </View>

          {/* Section: Education */}
          <Section
            title="Education"
            content="Sed ut perspiciatis unde omnis iste natus error site voluptatem accusantium dolorem queitters lipsum lipslaudantiuml ipsum text."
          />

          {/* Section: Skills */}
          <View style={styles.card}>
            <HeaderWithAdd title="Skills" />
            <TouchableOpacity style={styles.addButton}>
              <Image source={IMAGES.pluse} style={styles.plus} />
            </TouchableOpacity>
            <View style={styles.skillContainer}>
              {[
                'All Job',
                'Design',
                'Marketing',
                'Engineer',
                'Programming',
                'Finance',
              ].map(skill => (
                <View key={skill} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section: Additional Info */}
          <View style={styles.card}>
            <TouchableOpacity style={styles.addButton}>
              <Image source={IMAGES.pluse} style={styles.plus} />
            </TouchableOpacity>
            <HeaderWithAdd title="Additional Information" />
            <Text style={styles.subtitle}>Highlight your achievements</Text>
            <Text style={styles.content}>
              Sed ut perspiciatis unde omnis iste natus error site voluptatem
              accusantium dolorem queitters lipsum lipslaudantiuml ipsum text.
            </Text>
          </View>

          {/* Section: Achievements */}
          <View style={styles.card}>
            <TouchableOpacity style={styles.addButton}>
              <Image source={IMAGES.pluse} style={styles.plus} />
            </TouchableOpacity>
            <HeaderWithAdd title="Achievements and Certifications" />
            <View style={styles.certRow}>
              {/* {[1, 2, 3, 4].map(item => (
                <Image
                  key={item}
                  source={require('./assets/certificate-placeholder.png')} // Replace with actual images
                  style={styles.certImage}
                />
              ))} */}
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearContainer>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 12,
  },
  avatar: {
    width: wp(130),
    height: wp(130),
    borderRadius: 100,
  },
  name: {
    ...commonFontStyle(600, 25, colors.white),
    marginTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    gap: wp(16),
    marginTop: hp(8),
  },
  location: {
    ...commonFontStyle(400, 20, colors.white),
  },
  editButton: {
    marginTop: hp(25),
    paddingVertical: hp(10),
    paddingHorizontal: wp(30),
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors._F4E2B8,
  },
  editButtonText: {
    ...commonFontStyle(400, 17, colors._F4E2B8),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: hp(24),
    paddingHorizontal: wp(50),
    borderBottomWidth: hp(1),
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: hp(20),
  },
  statText: {
    ...commonFontStyle(500, 15, colors._F4E2B8),
  },
  completionCard: {
    backgroundColor: colors._F4E2B8,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    margin: wp(20),
  },
  completionTitle: {
    ...commonFontStyle(600, 18, colors._051C38),
    marginBottom: hp(4),
  },
  progressBarBg: {
    height: hp(6),
    borderRadius: 6,
    width: '80%',
    marginVertical: 8,
    backgroundColor: 'rgba(209, 197, 166, 0.8)',
  },
  progressBarFill: {
    backgroundColor: '#111827',
    height: 6,
    borderRadius: 6,
    width: '50%',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    ...commonFontStyle(500, 15, colors._4F4F4F),
  },
  percentage: {
    ...commonFontStyle(500, 25, '#051D3A'),
  },
  ctaCard: {
    marginTop: 16,
    backgroundColor: 'rgba(245, 245, 245, 0.2)',
    paddingHorizontal: wp(26),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(20),
    marginBottom: hp(20),
  },
  ctaTextContainer: {
    flex: 1,
    gap: hp(8),
  },
  ctaTitle: {
    ...commonFontStyle(700, 17, colors.white),
    marginBottom: 2,
  },
  ctaSubtitle: {
    ...commonFontStyle(400, 14, colors.white),
  },
  ctaArrow: {
    ...commonFontStyle(700, 16, '#fff'),
  },
  locationicon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  right: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
    transform: [{rotate: '180deg'}],
    tintColor: colors._F4E2B8,
  },
  card: {
    backgroundColor: '#0B3970',
    borderRadius: 20,
    paddingHorizontal: wp(18),
    marginBottom: hp(15),
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#104686',
    paddingBottom: hp(26),
    marginHorizontal: wp(21),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp(11),
    marginBottom: hp(16),
  },
  title: {
    ...commonFontStyle(700, 22, colors.white),
  },
  plus: {
    width: wp(14),
    height: wp(14),
    resizeMode: 'contain',
  },
  addButton: {
    backgroundColor: colors._F4E2B8,
    position: 'absolute',
    right: 0,
    paddingHorizontal: wp(16),
    paddingVertical: hp(13),
    borderBottomLeftRadius: 20,
  },
  content: {
    ...commonFontStyle(400, 16, '#E7E7E7'),
    lineHeight: hp(25),
    marginTop: hp(6),
  },
  subtitle: {
    ...commonFontStyle(500, 21, colors.white),
  },
  languageText: {
    ...commonFontStyle(500, 14, '#fff'),
    marginTop: 12,
    marginBottom: 4,
  },
  slider: {
    width: '100%',
    marginTop: 4,
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  skillBadge: {
    borderWidth: 1,
    borderColor: '#FBE7BD',
    borderRadius: 8,
    paddingVertical: hp(10),
    paddingHorizontal: wp(16),
    marginRight: wp(5),
    marginBottom: 8,
  },
  skillText: {
    ...commonFontStyle(400, 15, '#F4E2B8'),
  },
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  certImage: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  scrollContiner: {},
});
