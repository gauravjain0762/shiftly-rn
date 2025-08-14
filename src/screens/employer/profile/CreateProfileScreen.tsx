import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
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
} from '../../../features/employeeSlice';
import {RootState} from '../../../store';
import {useAddUpdateEducationMutation} from '../../../api/dashboardApi';
import {errorToast} from '../../../utils/commonFunction';

const CreateProfileScreen = () => {
  const dispatch = useDispatch();
  const [addUpdateEducation] = useAddUpdateEducationMutation({});

  const {
    educationList,
    educationListEdit,
    experienceList,
    experienceListEdit,
    aboutEdit,
    activeStep,
    showModal,
  } = useSelector((state: RootState) => state.employee);

  const addEducation = (item: any) => {
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

  const addExperience = (item: any) => {
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

  console.log("educationListEdit >>>>>", educationListEdit)
  const handleAddEducation = async () => {
    try {
      const response = await addUpdateEducation({
        degree: educationListEdit.degree,
        university: educationListEdit.university,
        country: educationListEdit.country,
        province: educationListEdit.province,
        start_date: educationListEdit.startDate,
        end_date: educationListEdit.endDate,
      }).unwrap();
      console.log('🔥🔥🔥 ~ handleAddEducation ~ response:', response);

      if (!response?.status) {
        errorToast(response?.message);
        return;
      }

      // dispatch(setActiveStep(2))
    } catch (error) {
      console.error('Error adding education:', error);
    }
  };

  return (
    <SafeAreaView edges={[]} style={{flex: 1, backgroundColor: colors._0D468C}}>
      <LinearContainer
        SafeAreaProps={{edges: ['bottom', 'top']}}
        colors={['#0D468C', '#041326']}>
        <View style={styles.topConrainer}>
          <BackHeader
            containerStyle={{}}
            isRight={true}
            title={'Create Your Profile'}
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
                setEducationListEdit={val =>
                  dispatch(setEducationListEdit(val))
                }
                addNewEducation={() => {
                  dispatch(addEducation(educationListEdit));
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
                }}
                onNextPress={() => {
                  handleAddEducation();
                }}
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
                setEducationListEdit={(val: any) =>
                  dispatch(setExperienceListEdit(val))
                }
                addNewEducation={() => addExperience(experienceListEdit)}
                onNextPress={() => dispatch(setActiveStep(3))}
              />
            </>
          )}

          {activeStep === 3 && (
            <AboutMeList
              educationListEdit={aboutEdit}
              setEducationListEdit={(val: any) => dispatch(setAboutEdit(val))}
              onNextPress={() => dispatch(setShowModal(true))}
            />
          )}

          <SuccessffullyModal
            visible={showModal}
            onClose={() => dispatch(setShowModal(false))}
          />
        </KeyboardAwareScrollView>
      </LinearContainer>
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
