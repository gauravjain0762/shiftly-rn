import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {BackHeader, LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import Stepper from '../../../component/employe/Stepper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EducationList from '../../../component/employe/EducationList';
import EducationCard from '../../../component/employe/EducationCard';
import ExperienceList from '../../../component/employe/ExperienceList';
import AboutMeList from '../../../component/employe/AboutMeList';
import SuccessffullyModal from '../../../component/employe/SuccessffullyModal';
import {useDispatch, useSelector} from 'react-redux';
import {
  setActiveStep,
  setEducationList,
  setEducationListEdit,
  setExperienceList,
  setExperienceListEdit,
  setAboutEdit,
  setShowModal,
  EducationItem,
  ExperienceItem,
} from '../../../features/employeeSlice';
import {RootState} from '../../../store';
import {
  useAddUpdateEducationMutation,
  useAddUpdateExperienceMutation,
  useGetEducationsQuery,
  useGetExperiencesQuery,
  useRemoveEducationMutation,
  useRemoveExperienceMutation,
  useUpdateAboutMeMutation,
} from '../../../api/dashboardApi';
import {errorToast, goBack, successToast} from '../../../utils/commonFunction';

const CreateProfileScreen = () => {
  const dispatch = useDispatch();

  const {
    educationList,
    educationListEdit,
    experienceList,
    experienceListEdit,
    aboutEdit,
    activeStep,
    showModal,
  } = useSelector((state: RootState) => state.employee);
  const {data: getEducation, refetch: refetchEducation} = useGetEducationsQuery(
    {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  const {data: getExperiences, refetch: refetchExperience} =
    useGetExperiencesQuery(
      {},
      {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      },
    );

  const educationData = getEducation?.data?.educations;
  const experienceData = getExperiences?.data?.experiences;

  const [addUpdateEducation] = useAddUpdateEducationMutation({});
  const [addUpdateExperience] = useAddUpdateExperienceMutation({});
  const [updateAboutMe] = useUpdateAboutMeMutation({});
  const [removeEducation] = useRemoveEducationMutation({});
  const [removeExperience] = useRemoveExperienceMutation({});

  const handleSaveOrAddEducation = () => {
    if (educationListEdit?.isEditing) {
      dispatch(
        setEducationList(
          educationList.map((edu: any) =>
            edu.education_id === educationListEdit.education_id ||
            edu._id === educationListEdit._id
              ? {...educationListEdit, isEditing: false}
              : edu,
          ),
        ),
      );
    } else {
      // Just add a new local entry
      dispatch(
        setEducationList([
          ...educationList,
          {
            ...educationListEdit,
            education_id: Date.now().toString(),
            isEditing: false,
          },
        ]),
      );
    }

    // Reset the editing state
    dispatch(
      setEducationListEdit({
        degree: '',
        university: '',
        startDate_month: '',
        startDate_year: '',
        endDate_month: '',
        endDate_year: '',
        country: '',
        province: '',
        isEditing: false,
      }),
    );
  };

  const handleSaveOrAddExperience = () => {
    if (experienceListEdit?.isEditing) {
      dispatch(
        setExperienceList(
          experienceList?.map(exp =>
            exp?.experience_id === experienceListEdit?.experience_id
              ? {...experienceListEdit, isEditing: false}
              : exp,
          ),
        ),
      );
    } else {
      dispatch(
        setExperienceList([
          ...experienceList,
          {
            ...experienceListEdit,
            experience_id: Date.now().toString(),
            isEditing: false,
          },
        ]),
      );
    }

    dispatch(
      setExperienceListEdit({
        preferred: '',
        title: '',
        company: '',
        department: '',
        country: '',
        jobStart_month: '',
        jobStart_year: '',
        jobEnd_month: '',
        jobEnd_year: '',
        still_working: false,
        experience_type: '',
        isEditing: false,
      }),
    );
  };

  const handleAddEducation = async () => {
    try {
      for (const edu of educationList) {
        const payload = {
          degree: edu.degree,
          university: edu.university,
          country: edu.country,
          province: edu.province,
          start_date: {
            month: edu.startDate_month,
            year: edu.startDate_year,
          },
          end_date: {
            month: edu.endDate_month,
            year: edu.endDate_year,
          },
        };

        try {
          const response = await addUpdateEducation(payload).unwrap();
          console.log('Education saved:', response);

          if (response?.status) {
            successToast(response?.message);
          } else {
            errorToast(response?.message);
          }
        } catch (error) {
          console.error('Error saving education:', error);
        }
      }

      dispatch(setEducationList([]));
      refetchEducation();
    } catch (error) {
      console.error('Error adding education:', error);
    }
  };

  const handleAddUExperience = async () => {
    try {
      for (const exp of experienceList) {
        const payload = {
          title: exp?.title,
          company: exp?.company,
          department: exp?.department,
          country: exp?.country,
          job_start: {
            month: exp?.jobStart_month,
            year: exp?.jobStart_year,
          },
          experience_type: exp.experience_type,
          still_working: exp.still_working,
          ...(exp.still_working === false && {
            job_end: {
              month: exp?.jobEnd_month,
              year: exp?.jobEnd_year,
            },
          }),
        };
        const response = await addUpdateExperience(payload).unwrap();

        if (response?.status) {
          successToast(response?.message);
          dispatch(setActiveStep(3));
        } else {
          errorToast(response?.message);
        }
      }

      dispatch(setExperienceList([]));
      refetchExperience();
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  const handleAddAboutMe = async () => {
    console.log('aboutEdit', aboutEdit);
    const params = {
      open_for_job: aboutEdit?.open_for_jobs ? true : false,
      location: aboutEdit?.location,
      responsibility: aboutEdit?.responsibilities,
      languages: aboutEdit?.selectedLanguages,
    };
    console.log('🔥🔥🔥 ~ handleAddAboutMe ~ params:', params);
    try {
      const res = await updateAboutMe(params).unwrap();
      if (res?.status) {
        successToast(res?.message);
        dispatch(setShowModal(true));
      } else {
        errorToast(res?.message);
      }

      dispatch(
        setAboutEdit({
          aboutMe: '',
          checkEnd: false,
          location: '',
          open_for_jobs: false,
          responsibilities: '',
          proficiency: '',
          selectedLanguages: [],
          selectOne: [],
          isOn: false,
        }),
      );
    } catch (error) {
      console.error('Error adding about me:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await handleAddEducation();
      await handleAddUExperience();
      await handleAddAboutMe();

      dispatch(setActiveStep(1));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleRemoveEducation = async (item: EducationItem | any) => {
    try {
      if (item?._id) {
        const res = await removeEducation(item._id).unwrap();
        successToast(res?.message || 'Education removed');
        refetchEducation();
      } else {
        dispatch(
          setEducationList(
            educationList.filter(edu => edu.education_id !== item.education_id),
          ),
        );
      }
    } catch (error) {
      errorToast('Failed to remove education');
      console.error(error);
    }
  };

  const handleRemoveExperience = async (item: ExperienceItem | any) => {
    try {
      if (item?._id) {
        const res = await removeExperience(item._id).unwrap();
        successToast(res?.message || 'Experience removed');
        refetchExperience();
      } else {
        dispatch(
          setExperienceList(
            experienceList.filter(
              exp => exp.experience_id !== item.experience_id,
            ),
          ),
        );
      }
    } catch (error) {
      errorToast('Failed to remove experience');
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{flex: 1, backgroundColor: colors._041326}}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <LinearContainer
          SafeAreaProps={{edges: ['bottom', 'top']}}
          colors={['#0D468C', '#041326']}>
          <View style={styles.topConrainer}>
            <BackHeader
              isRight={true}
              title={'Create Your Profile'}
              RightIcon={<View />}
              onBackPress={() => {
                if (activeStep === 1) {
                  goBack();
                  dispatch(
                    setEducationListEdit({
                      degree: '',
                      university: '',
                      startDate_month: '',
                      startDate_year: '',
                      endDate_month: '',
                      endDate_year: '',
                      country: '',
                      province: '',
                      isEditing: false,
                    }),
                  );

                  dispatch(
                    setExperienceListEdit({
                      preferred: '',
                      title: '',
                      company: '',
                      department: '',
                      country: '',
                      jobStart_month: '',
                      jobStart_year: '',
                      jobEnd_month: '',
                      jobEnd_year: '',
                      still_working: false,
                      experience_type: '',
                      isEditing: false,
                    }),
                  );

                  dispatch(
                    setAboutEdit({
                      aboutMe: '',
                      checkEnd: false,
                      location: '',
                      open_for_jobs: false,
                      responsibilities: '',
                      proficiency: '',
                      selectedLanguages: [],
                      selectOne: [],
                      isOn: false,
                    }),
                  );

                  dispatch(setEducationList([]));
                  dispatch(setExperienceList([]));
                  dispatch(setActiveStep(1));
                } else {
                  dispatch(setActiveStep(activeStep - 1));
                }
              }}
            />
          </View>

          <Stepper
            activeStep={activeStep}
            setActiveStep={(step: number) => dispatch(setActiveStep(step))}
          />

          {activeStep === 1 && (
            <>
              {[...(educationData || []), ...educationList].map(
                (item: any, index: number) => (
                  <EducationCard
                    key={item?._id || item?.education_id || index}
                    item={item}
                    type="Education"
                    onRemove={() => handleRemoveEducation(item)}
                    onEdit={() => {
                      dispatch(
                        setEducationListEdit({
                          ...item,
                          startDate_month:
                            item?.startDate_month ||
                            item?.start_date?.month ||
                            '',
                          startDate_year:
                            item?.startDate_year ||
                            item?.start_date?.year ||
                            '',
                          endDate_month:
                            item?.endDate_month || item?.end_date?.month || '',
                          endDate_year:
                            item?.endDate_year || item?.end_date?.year || '',
                          isEditing: true,
                        }),
                      );
                    }}
                  />
                ),
              )}

              <EducationList
                educationList={educationData || educationList}
                educationListEdit={educationListEdit}
                setEducationListEdit={val =>
                  dispatch(setEducationListEdit(val))
                }
                addNewEducation={handleSaveOrAddEducation}
                onSaveEducation={handleSaveOrAddEducation}
                onNextPress={() => {
                  dispatch(setActiveStep(2));
                }}
              />
            </>
          )}

          {activeStep === 2 && (
            <>
              {[...(experienceData || []), ...experienceList].map(
                (item, index) => (
                  <EducationCard
                    key={index}
                    item={item}
                    type={'Experience'}
                    onRemove={() => handleRemoveExperience(item)}
                    onEdit={() => {
                      const parseDate = (
                        val?: string | {month?: string; year?: string},
                      ) => {
                        if (!val) return {month: '', year: ''};

                        if (typeof val === 'object') {
                          return {
                            month: val.month || '',
                            year: val.year || '',
                          };
                        }

                        if (typeof val === 'string') {
                          const parts = val.split(' ');
                          return {
                            month: parts[0] || '',
                            year: parts[1] || '',
                          };
                        }

                        return {month: '', year: ''};
                      };

                      const start = parseDate(item?.job_start);
                      const end = parseDate(item?.job_end);

                      dispatch(
                        setExperienceListEdit({
                          ...item,
                          jobStart_month: item?.jobStart_month || start.month,
                          jobStart_year: item?.jobStart_year || start.year,
                          jobEnd_month: item?.jobEnd_month || end.month,
                          jobEnd_year: item?.jobEnd_year || end.year,
                          isEditing: true,
                        }),
                      );
                    }}
                  />
                ),
              )}
              <ExperienceList
                experienceList={experienceData || experienceList}
                experienceListEdit={experienceListEdit}
                setExperienceListEdit={(val: any) =>
                  dispatch(setExperienceListEdit(val))
                }
                addNewExperience={handleSaveOrAddExperience}
                onSaveExperience={handleSaveOrAddExperience}
                onNextPress={() => {
                  dispatch(setActiveStep(3));
                }}
              />
            </>
          )}

          {activeStep === 3 && (
            <AboutMeList
              aboutEdit={aboutEdit}
              experienceList={experienceList}
              onNextPress={handleUpdateProfile}
              setAboutEdit={(val: any) => dispatch(setAboutEdit(val))}
            />
          )}

          <SuccessffullyModal
            visible={showModal}
            onClose={() => dispatch(setShowModal(false))}
          />
        </LinearContainer>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreateProfileScreen;

const styles = StyleSheet.create({
  topConrainer: {
    paddingHorizontal: wp(25),
    paddingTop: hp(18),
    paddingBottom: hp(5),
  },
});
