import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BackHeader, LinearContainer} from '../../../component';
import {colors} from '../../../theme/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Stepper from '../../../component/employe/Stepper';
import EducationList from '../../../component/employe/EducationList';
import EducationCard from '../../../component/employe/EducationCard';
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

const EditProfileScreen = () => {
  const dispatch = useDispatch();
  const {
    activeStep,
    showModal,
    educationList,
    experienceList,
    educationListEdit,
    experienceListEdit,
    aboutEdit,
  } = useSelector((state: RootState) => selectEmployeeState(state));

  const addEducation = (item: EducationItem) => {
    dispatch(setEducationList([...educationList, item]));
    dispatch(
      setEducationListEdit({
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
    dispatch(setExperienceList([...experienceList, item]));
    dispatch(
      setExperienceListEdit({
        preferred: '',
        title: '',
        company: '',
        department: '',
        country: '',
        month: '',
        year: '',
        checkEnd: false,
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

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['bottom', 'top']}}
      colors={['#0D468C', '#041326']}>
      <View style={styles.topConrainer}>
        <BackHeader
          containerStyle={styles.header}
          isRight={true}
          title={'Update Profile'}
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
                onEdit={() => dispatch(setEducationListEdit(item))}
              />
            ))}
            <EducationList
              educationListEdit={educationListEdit}
              setEducationListEdit={val => dispatch(setEducationListEdit(val))}
              addNewEducation={() => addEducation(educationListEdit)}
              onNextPress={() => dispatch(setActiveStep(2))}
            />
          </>
        )}

        {activeStep === 2 && (
          <>
            {experienceList?.map((item, index) => (
              <EducationCard
                key={index}
                item={item}
                onRemove={() => removeExperience(index)}
                onEdit={() => dispatch(setExperienceListEdit(item))}
              />
            ))}
            <ExperienceList
              educationListEdit={experienceListEdit}
              setEducationListEdit={(val: ExperienceItem) => dispatch(setExperienceListEdit(val))}
              addNewEducation={() => addExperience(experienceListEdit)}
              onNextPress={() => dispatch(setActiveStep(3))}
            />
          </>
        )}

        {activeStep === 3 && (
          <AboutMeList
            educationListEdit={aboutEdit}
            setEducationListEdit={(val: AboutMe) => dispatch(setAboutEdit(val))}
            onNextPress={() => dispatch(setShowModal(true))}
          />
        )}

        <SuccessffullyModal
          visible={showModal}
          onClose={() => dispatch(setShowModal(false))}
        />
      </KeyboardAwareScrollView>
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
