import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {navigationRef} from '../../../navigation/RootContainer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useEmployeeApplyJobMutation} from '../../../api/dashboardApi';
import CustomBtn from '../../../component/common/CustomBtn';

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
  const {params} = useRoute<any>();
  const data = params?.data as any;
  const resumeList = params?.resumeList as any;
  const [visible, setVisible] = useState(false);
  const {bottom} = useSafeAreaInsets();
  const [applyJob] = useEmployeeApplyJobMutation();

  const handleApplyJob = async () => {
    try {
      const res = await applyJob({job_id: data?._id}).unwrap();
      // console.log('🔥🔥🔥 ~ handleApplyJob ~ res?.data:', res?.data);
    } catch (error) {
      console.error('Error applying job:', error);
    } finally {
      setVisible(prev => !prev);
    }
  };

  return (
    <>
      <LinearContainer
        SafeAreaProps={{edges: ['bottom', 'top']}}
        colors={['#0D468C', '#041326']}
        containerStyle={[{paddingBottom: bottom}]}>
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.meta}>Dubai, UAE - Full Time</Text>
                <Text style={styles.salary}>AED 10k</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Heading */}
          <View style={styles.Doccontainer}>
            <Text style={styles.heading}>{t('Choose documents to apply')}</Text>

            {/* Document List */}
            {resumeList?.map((doc: any) => (
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
                <Text style={styles.docLabel}>{doc.file_name}</Text>
                <Image source={{uri: doc.file}} style={styles.docIcon} />
              </TouchableOpacity>
            ))}

            <Pressable style={styles.uploadButton}>
              <Text
                style={{
                  ...commonFontStyle(400, 22, colors._F4E2B8),
                }}>
                {'Upload CV'}
              </Text>
            </Pressable>
          </View>
          <GradientButton
            style={styles.btn}
            onPress={() => {
              handleApplyJob();
            }}
            title={t('Apply Now')}
          />
        </View>
      </LinearContainer>
      <ApplicationSuccessModal
        visible={visible}
        onClose={() => setVisible(!visible)}
        onJobList={() => {
          navigationRef.goBack();
          setVisible(false);
        }}
      />
    </>
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
    marginTop: 3,
    ...commonFontStyle(400, 15, colors._33485B),
    flex: 1,
  },
  meta: {
    ...commonFontStyle(400, 14, '#33485B'),
    flex: 1,
  },
  salary: {
    ...commonFontStyle(700, 16, '#33485B'),
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
    width: wp(37),
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
  uploadButton: {
    width: '90%',
    height: hp(55),
    marginTop: hp(30),
    borderWidth: hp(2),
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: hp(50),
    justifyContent: 'center',
    borderColor: colors._F4E2B8,
  },
});
