import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {BackHeader, LinearContainer} from '../../../component';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Stepper from '../../../component/employe/Stepper';
import EducationList from '../../../component/employe/EducationList';
import EducationCard from '../../../component/employe/EducationCard';
import ExperienceCard from '../../../component/employe/ExperienceCard';
import ExperienceList from '../../../component/employe/ExperienceList';
import AboutMeList from '../../../component/employe/AboutMeList';
import SuccessffullyModal from '../../../component/employe/SuccessffullyModal';
import {
  selectEmployeeState,
  setActiveStep,
  setEducationList,
  setExperienceList,
  setEducationListEdit,
  setExperienceListEdit,
  setAboutEdit,
  setShowModal,
  EducationItem,
  ExperienceItem,
  AboutMe,
} from '../../../features/employeeSlice';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useAddUpdateEducationMutation,
  useAddUpdateExperienceMutation,
} from '../../../api/dashboardApi';
import {
  errorToast,
  goBack,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';

const EditProfileScreen = () => {
  const dispatch = useDispatch();
  const [editingEducationIndex, setEditingEducationIndex] = useState<
    number | null
  >(null);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<
    number | null
  >(null);
  const {
    activeStep,
    showModal,
    educationList,
    experienceList,
    educationListEdit,
    experienceListEdit,
    aboutEdit,
  } = useSelector((state: RootState) => selectEmployeeState(state));
  console.log('🔥🔥🔥 ~ EditProfileScreen ~ experienceList:', experienceList);
  const [addUpdateEducation] = useAddUpdateEducationMutation({});
  const [addUpdateExperience] = useAddUpdateExperienceMutation({});

  const addEducation = (item: EducationItem) => {
    if (editingEducationIndex !== null && editingEducationIndex >= 0) {
      const updated = [...educationList];
      updated[editingEducationIndex] = item;
      dispatch(setEducationList(updated));
      setEditingEducationIndex(null);
    } else {
      dispatch(setEducationList([...educationList, item]));
    }
    dispatch(
      setEducationListEdit({
        education_id: '',
        degree: '',
        university: '',
        startDate: '',
        endDate: '',
        country: '',
        province: '',
      }),
    );
  };

  const addExperience = (item: ExperienceItem) => {
    if (editingExperienceIndex !== null && editingExperienceIndex >= 0) {
      const updated = [...experienceList];
      updated[editingExperienceIndex] = item;
      dispatch(setExperienceList(updated));
      setEditingExperienceIndex(null);
    } else {
      dispatch(setExperienceList([...experienceList, item]));
    }
    dispatch(
      setExperienceListEdit({
        preferred: '',
        title: '',
        company: '',
        department: '',
        country: '',
        job_start: '',
        job_end: '',
        still_working: false,
        experience_type: '',
      }),
    );
  };

  const removeEducation = (index: number) => {
    const updatedList = educationList.filter((_, i) => i !== index);
    dispatch(setEducationList(updatedList));
  };

  const removeExperience = (index: number) => {
    const updatedList = experienceList.filter((_, i) => i !== index);
    dispatch(setExperienceList(updatedList));
  };

  const handleUpdateExperience = async () => {
    try {
      const response = await addUpdateExperience({
        experience_id: (experienceListEdit as any)?._id,
        preferred: (experienceListEdit as any)?.preferred,
        title: (experienceListEdit as any)?.title,
        company: (experienceListEdit as any)?.company,
        department: (experienceListEdit as any)?.department,
        country: (experienceListEdit as any)?.country,
        job_start: (experienceListEdit as any)?.job_start,
        job_end: (experienceListEdit as any)?.job_end,
        still_working: (experienceListEdit as any)?.still_working,
        experience_type: (experienceListEdit as any)?.experience_type,
      }).unwrap();

      if ((response as any)?.status) {
        successToast((response as any)?.message);
        dispatch(setActiveStep(3));
      } else {
        errorToast((response as any)?.message);
      }
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  const handleUpdateEducation = async () => {
    try {
      const response = await addUpdateEducation({
        education_id: educationListEdit.education_id,
        degree: educationListEdit.degree,
        university: educationListEdit.university,
        country: educationListEdit.country,
        province: educationListEdit.province,
        start_date: educationListEdit.startDate,
        end_date: educationListEdit.endDate,
      }).unwrap();

      if (response?.status) {
        successToast(response?.message);
        dispatch(setActiveStep(2));
      } else {
        errorToast(response?.message);
      }
    } catch (error) {
      console.error('Error adding education:', error);
    }
  };

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['bottom', 'top']}}
      colors={['#0D468C', '#041326']}>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <View style={styles.topConrainer}>
          <BackHeader
            containerStyle={styles.header}
            isRight={true}
            title={'Update Profile'}
            onBackPress={() => {
              goBack();
              dispatch(setActiveStep(1));
            }}
            RightIcon={<View />}
          />
        </View>

        <Stepper
          activeStep={activeStep}
          setActiveStep={(step: number) => dispatch(setActiveStep(step))}
        />

        <KeyboardAwareScrollView style={{marginTop: 20}}>
          {activeStep === 1 && (
            <>
              {educationList?.map((item, index) => (
                <EducationCard
                  key={index}
                  item={item}
                  onRemove={() => removeEducation(index)}
                  onEdit={() => {
                    setEditingEducationIndex(index);
                    dispatch(setEducationListEdit(item));
                  }}
                />
              ))}
              <EducationList
                educationListEdit={educationListEdit}
                setEducationListEdit={val =>
                  dispatch(setEducationListEdit(val))
                }
                addNewEducation={() => addEducation(educationListEdit)}
                isEditing={editingEducationIndex !== null}
                onSaveEducation={() => addEducation(educationListEdit)}
                onNextPress={() => {
                  handleUpdateEducation();
                }}
              />
            </>
          )}

          {activeStep === 2 && (
            <>
              {experienceList?.map((item, index) => (
                <ExperienceCard
                  key={index}
                  item={item}
                  onRemove={() => removeExperience(index)}
                  onEdit={() => {
                    setEditingExperienceIndex(index);
                    dispatch(setExperienceListEdit(item));
                  }}
                />
              ))}
              <ExperienceList
                educationListEdit={experienceListEdit}
                setEducationListEdit={(val: ExperienceItem) =>
                  dispatch(setExperienceListEdit(val))
                }
                addNewEducation={() => addExperience(experienceListEdit)}
                isEditing={editingExperienceIndex !== null}
                onSaveExperience={() => addExperience(experienceListEdit)}
                onNextPress={() => {
                  handleUpdateExperience();
                }}
              />
            </>
          )}

          {activeStep === 3 && (
            <AboutMeList
              educationListEdit={aboutEdit}
              setEducationListEdit={(val: AboutMe) =>
                dispatch(setAboutEdit(val))
              }
              onNextPress={() => {
                resetNavigation(SCREENS.TabNavigator);
              }}
            />
          )}

          <SuccessffullyModal
            visible={showModal}
            onClose={() => dispatch(setShowModal(false))}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </LinearContainer>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  topConrainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  header: {
    paddingBottom: 10,
  },
});
