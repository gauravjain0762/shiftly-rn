import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  ApplicationSuccessModal,
  BackHeader,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {IMAGES} from '../../../assets/Images';
import {colors} from '../../../theme/colors';
import {useRoute} from '@react-navigation/native';

const documents = [
  {id: 'cv', label: 'CV', icon: IMAGES.CV},
  {id: 'coverLetter', label: 'Cover Letter', icon: IMAGES.coverlatter},
  {
    id: 'recommendation',
    label: 'Recommendation Letter',
    icon: IMAGES.reccomandlatter,
  },
];

const ApplyJob = () => {
  const {t, i18n} = useTranslation();
  const [selected, setSelected] = useState('cv');
  const {params} = useRoute();
  const data = params?.data;
  const [visible, setVisible] = useState(false);

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <BackHeader title={t('Apply Job')} containerStyle={styles.header} />
      <View style={styles.container}>
        {/* Job Card */}
        <View style={styles.jobCard}>
          <View style={styles.logoBg}>
            <Image
              source={{
                uri: data?.logo,
              }}
              style={styles.logo}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.jobTitle}>{data?.title}</Text>
            <Text style={styles.location}>{data?.company}</Text>
            <Text style={styles.meta}>Dubai, UAE - Full Time</Text>
          </View>
          <Text style={styles.salary}>AED 10k</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Heading */}
        <View style={styles.Doccontainer}>
          <Text style={styles.heading}>{t('Choose documents to apply')}</Text>

          {/* Document List */}
          {documents?.map(doc => (
            <TouchableOpacity
              key={doc.id}
              style={styles.docRow}
              onPress={() => setSelected(doc.id)}>
              <View style={styles.radioCircle}>
                {selected === doc.id && (
                  <View style={styles.check}>
                    <Image source={IMAGES.check} style={styles.checked} />
                  </View>
                )}
              </View>
              <Text style={styles.docLabel}>{doc.label}</Text>
              <Image source={doc.icon} style={styles.docIcon} />
            </TouchableOpacity>
          ))}
        </View>
        <GradientButton
          style={styles.btn}
          onPress={() => setVisible(!visible)}
          title={t('Apply Now')}
        />
      </View>
      <ApplicationSuccessModal
        visible={visible}
        onClose={() => setVisible(!visible)}
      />
    </LinearContainer>
  );
};

export default ApplyJob;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(25),
    paddingBottom: hp(17),
  },
  container: {
    borderRadius: 20,
    flex: 1,
  },
  jobCard: {
    backgroundColor: '#F4E2B8',
    borderRadius: 16,
    flexDirection: 'row',
    padding: wp(15),
    alignItems: 'center',
    marginBottom: hp(20),
    marginHorizontal: wp(25),
  },
  logo: {
    height: hp(34),
    resizeMode: 'contain',
  },
  jobTitle: {
    ...commonFontStyle(700, 17, colors._33485B),
  },
  location: {
    ...commonFontStyle(400, 15, colors._33485B),
  },
  meta: {
    ...commonFontStyle(400, 14, '#33485B'),
  },
  salary: {
    ...commonFontStyle(700, 16, '#33485B'),
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  heading: {
    ...commonFontStyle(700, 22, colors._F4E2B8),
    paddingTop: hp(20),
    paddingBottom: hp(38),
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  radioCircle: {
    height: wp(26),
    width: wp(26),
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FBE9C6',
    // alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(12),
    overflow: 'hidden',
  },
  checked: {
    width: wp(12),
    height: wp(12),
    resizeMode: 'contain',
  },
  check: {
    backgroundColor: colors._F4E2B8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docLabel: {
    ...commonFontStyle(400, 21, colors.white),
    flex: 1,
  },
  docIcon: {
    width: wp(31),
    height: hp(37),
    resizeMode: 'contain',
  },
  Doccontainer: {
    paddingHorizontal: wp(25),
  },
  btn: {
    marginTop: 'auto',
    marginHorizontal: wp(35),
  },
  logoBg: {
    backgroundColor: colors.white,
    marginRight: 12,
    borderRadius: 100,
    width: wp(73),
    height: wp(73),
    justifyContent: 'center',
  },
});
