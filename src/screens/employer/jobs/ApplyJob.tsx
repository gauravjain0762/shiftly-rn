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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useEmployeeApplyJobMutation} from '../../../api/dashboardApi';
import {
  errorToast,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import {SCREENS} from '../../../navigation/screenNames';
import {RootState} from '../../../store';
import {useDispatch, useSelector} from 'react-redux';
import {setIsSuccessModalVisible} from '../../../features/employeeSlice';

const ApplyJob = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {params} = useRoute<any>();
  const data = params?.data as any;
  const [imageModal, setImageModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>([]);
  const resumeList = params?.resumeList as any;
  const [visible, setVisible] = useState<boolean>(false);
  const {bottom} = useSafeAreaInsets();
  const [applyJob] = useEmployeeApplyJobMutation({});
  const [resumes, setResumes] = useState<any[]>(resumeList || []);
  const {isSuccessModalVisible} = useSelector(
    (state: RootState) => state.employee,
  );

  const handleApplyJob = async () => {
    if (!selectedDoc) {
      errorToast('Please select or upload a resume');
      return;
    }

    const formData = new FormData();
    formData.append('job_id', data?._id);

    if (selectedDoc?._id) {
      formData.append('resume_id', selectedDoc?._id);
    } else {
      formData.append('resume', {
        uri: selectedDoc.file,
        type: selectedDoc.type || 'image/jpeg',
        name: selectedDoc.file_name || 'logo.jpg',
      } as any);
    }

    try {
      const res = await applyJob(formData).unwrap();

      if (res?.status) {
        // successToast(res?.message);
        dispatch(setIsSuccessModalVisible(true));
      } else {
        errorToast(res?.message);
      }
    } catch (error: any) {
      console.error('Error applying job:', error);
      errorToast(
        error?.message || error?.data?.message || 'Something went wrong',
      );
    }
  };

  const closeModal = () => {
    dispatch(setIsSuccessModalVisible(false));
    resetNavigation(SCREENS.TabNavigator, SCREENS.JobsScreen);
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
                source={
                  data?.company_id?.logo
                    ? {
                        uri: data?.company_id?.logo,
                      }
                    : IMAGES.dummy_cover
                }
                style={styles.logo}
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.jobTitle}>{data?.title}</Text>
              <Text style={styles.location}>{data?.address}</Text>
              <Text style={styles.meta}>{data?.area}</Text>
              <View
                style={{
                  marginTop: hp(5),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.meta}>{`${data?.job_type}`}</Text>
                <Text
                  style={
                    styles.salary
                  }>{`AED ${data?.monthly_salary_from} - ${data?.monthly_salary_to}`}</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Heading */}
          <View style={styles.Doccontainer}>
            <Text style={styles.heading}>{t('Choose documents to apply')}</Text>

            {/* Document List */}
            {resumes?.map((doc: any, index: number) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.docRow}
                  onPress={() => {
                    if (selectedDoc?.file_name === doc?.file_name) {
                      setSelectedDoc(null);
                    } else {
                      setSelectedDoc(doc);
                    }
                  }}>
                  <View style={styles.radioCircle}>
                    {selectedDoc?.file_name === doc.file_name && (
                      <View style={styles.check}>
                        <Image source={IMAGES.check} style={styles.checked} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.docLabel}>{doc.file_name}</Text>
                  <Image
                    source={doc?.file ? {uri: doc?.file} : IMAGES.dummy_cover}
                    style={styles.docIcon}
                  />
                </TouchableOpacity>
              );
            })}

            <Pressable
              onPress={() => setImageModal(true)}
              style={styles.uploadButton}>
              <Text
                style={{
                  ...commonFontStyle(400, 22, colors._F4E2B8),
                }}>
                {'Upload CV'}
              </Text>
            </Pressable>

            <Text
              style={{
                marginTop: hp(8),
                paddingHorizontal: wp(20),
                ...commonFontStyle(400, 12, colors.white),
              }}>
              {'PDF or word document up to 5MB'}
            </Text>
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
        onJobList={closeModal}
        onExploreJobs={closeModal}
        visible={isSuccessModalVisible}
      />

      <ImagePickerModal
        actionSheet={imageModal}
        setActionSheet={setImageModal}
        onUpdate={(image: any) => {
          setImageModal(false);

          const newResume = {
            file_name: image?.name || image?.filename || 'Uploaded CV',
            file: image?.path || image?.uri,
            type: image?.type,
          };

          setResumes(prev => [...prev, newResume]);
          setSelectedDoc(newResume);
        }}
        allowDocument={true}
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
    padding: wp(15),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: hp(16),
    marginBottom: hp(20),
    paddingBottom: hp(15),
    marginHorizontal: wp(25),
    backgroundColor: '#F4E2B8',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: hp(100),
  },
  jobTitle: {
    ...commonFontStyle(700, 17, colors._33485B),
  },
  location: {
    marginTop: hp(4),
    ...commonFontStyle(400, 15, colors._33485B),
    // flex: 1,
  },
  meta: {
    flex: 1,
    // marginTop: hp(2),
    ...commonFontStyle(400, 14, '#33485B'),
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
    width: wp(73),
    height: wp(73),
    borderRadius: 100,
    marginRight: hp(12),
    justifyContent: 'center',
    backgroundColor: colors.white,
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
