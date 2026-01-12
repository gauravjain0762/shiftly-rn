import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import {
  ApplicationSuccessModal,
  BackHeader,
  GradientButton,
  LinearContainer,
} from '../../../component';
import { useTranslation } from 'react-i18next';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { IMAGES } from '../../../assets/Images';
import { colors } from '../../../theme/colors';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEmployeeApplyJobMutation } from '../../../api/dashboardApi';
import {
  errorToast,
  resetNavigation,
} from '../../../utils/commonFunction';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import { SCREENS } from '../../../navigation/screenNames';
import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSuccessModalVisible } from '../../../features/employeeSlice';
import Tooltip from '../../../component/common/Tooltip';
import RNFS from 'react-native-fs';

const ApplyJob = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { params } = useRoute<any>();
  const data = params?.data as any;
  console.log("🔥 ~ ApplyJob ~ data:", data)
  const [imageModal, setImageModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const resumeList = params?.resumeList as any;
  const { bottom } = useSafeAreaInsets();
  const [applyJob] = useEmployeeApplyJobMutation({});
  const [resumes, setResumes] = useState<any[]>(resumeList || []);
  const { isSuccessModalVisible } = useSelector(
    (state: RootState) => state.employee,
  );

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const checkFileSize = async (filePath: string): Promise<number> => {
    try {
      const fileInfo = await RNFS.stat(filePath);
      return fileInfo.size;
    } catch (error) {
      console.error('Error getting file size:', error);
      return 0;
    }
  };

  const handleApplyJob = async () => {
    if (!selectedDoc || (!selectedDoc?._id && !selectedDoc?.file)) {
      errorToast(t('Please select or upload a resume'));
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
        SafeAreaProps={{ edges: ['bottom', 'top'] }}
        colors={[colors._F7F7F7, colors._F7F7F7]}
        containerStyle={[{ paddingBottom: bottom }]}>
        <BackHeader type="employe" title={`Apply for ${data?.title}`} containerStyle={styles.header} />
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
            <View style={{ flex: 1 }}>
              <Text style={styles.jobTitle}>{data?.title}</Text>
              <Text style={{...commonFontStyle(400, 15, colors._050505)}}>{data?.company_id?.company_name || "N/A"}</Text>
              <Text style={styles.location}>{data?.address}</Text>
              <Text style={[styles.meta, { flex: 0 }]}>{data?.area}</Text>
              <View
                style={{
                  gap: wp(10),
                  marginTop: hp(5),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text numberOfLines={2} style={[styles.meta, { maxWidth: '50%' }]}>{`${data?.contract_type}`}</Text>
                <Text
                  style={
                    styles.salary
                  }>{`${data?.currency} ${data?.monthly_salary_from} - ${data?.monthly_salary_to}`}</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Heading */}
          <View style={styles.Doccontainer}>
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>{t('Upload CV (PDF or Word up to 5MB)')}</Text>

              <Tooltip
                message="You only need to upload your CV once. It will be saved for future applications."
                position="bottom"
                containerStyle={styles.tooltipIcon}
                tooltipBoxStyle={{ left: '-1100%', top: hp(28), width: wp(320), maxWidth: wp(320), zIndex: 1000 }}
              />
            </View>

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
                    {selectedDoc?.file_name === doc?.file_name && (
                      <View style={styles.check}>
                        <Image
                          source={IMAGES.check}
                          style={styles.checked}
                          tintColor={colors.white}
                        />
                      </View>
                    )}
                  </View>
                  <Text style={styles.docLabel}>{doc?.file_name}</Text>
                  <Image
                    source={doc?.file ? { uri: doc?.file } : IMAGES.dummy_cover}
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
                  ...commonFontStyle(400, 22, colors._0B3970),
                }}>
                {'Upload CV'}
              </Text>
            </Pressable>

            <Text
              style={{
                marginTop: hp(8),
                paddingHorizontal: wp(20),
                ...commonFontStyle(400, 12, colors._7B7878),
              }}>
              {'PDF or word document up to 5MB'}
            </Text>
          </View>
          <GradientButton
            type="Company"
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
        onUpdate={async (image: any) => {
          setImageModal(false);

          const filePath = image?.path || image?.uri;
          if (!filePath) {
            errorToast(t('Unable to get file information'));
            return;
          }

          // Check file size
          let fileSize = image?.size || 0;
          
          // If size is not provided, get it from file system
          if (!fileSize || fileSize === 0) {
            fileSize = await checkFileSize(filePath);
          }

          // Validate file size (5MB limit)
          if (fileSize > MAX_FILE_SIZE) {
            const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
            errorToast(
              `File size is ${fileSizeMB}MB. Maximum allowed size is 5MB`
            );
            return;
          }

          const newResume = {
            file_name: image?.name || image?.filename || 'Uploaded CV',
            file: filePath,
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
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: '#E0D7C8',
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
  },
  meta: {
    flex: 1,
    ...commonFontStyle(400, 14, '#33485B'),
  },
  salary: {
    ...commonFontStyle(700, 15, '#33485B'),
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginVertical: 10,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp(20),
    paddingBottom: hp(38),
    gap: wp(8),
    overflow: 'visible',
    paddingHorizontal: wp(20)
  },
  heading: {
    ...commonFontStyle(700, 22, colors._0B3970),
  },
  tooltipIcon: {
    marginTop: hp(0),
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
    borderColor: colors._D9D9D9,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  checked: {
    width: wp(12),
    height: wp(12),
    resizeMode: 'contain',
  },
  check: {
    backgroundColor: colors._0B3970,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docLabel: {
    flex: 1,
    paddingHorizontal: wp(10),
    ...commonFontStyle(400, 21, colors._050505),
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
    borderColor: colors._0B3970,
    backgroundColor: colors.white,
  },
});
