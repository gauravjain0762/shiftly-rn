import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  ActivitiesCard,
  BackHeader,
  CustomDropdown,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {AppStyles} from '../../../theme/appStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import NotificationCard from '../../../component/employe/NotificationCard';
import {IMAGES} from '../../../assets/Images';
import Stepper from '../../../component/employe/Stepper';
import CustomDatePicker from '../../../component/common/CustomDatePicker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EducationList from '../../../component/employe/EducationList';
import EducationCard from '../../../component/employe/EducationCard';
import moment from 'moment';
import ExperienceList from '../../../component/employe/ExperienceList';
import AboutMeList from '../../../component/employe/AboutMeList';

const CreateProfileScreen = () => {
  const [activeStep, setActiveStep] = useState(1);

  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [educationListEdit, setEducationListEdit] = useState({
    degree: '',
    university: '',
    startDate: '',
    endDate: '',
    country: '',
    province: '',
  });
  const [experienceListEdit, setExperienceListEdit] = useState({
    preferred: '',
    title: '',
    company: '',
    department: '',
    country: '',
    month: '',
    year: '',
    checkEnd: false,
  });

   const [aboutEdit, setAboutEdit] = useState({
    aboutMe: '',
    responsibilities: '',
    selectOne: [],
    isOn: false,
    location: '',
    selectedLanguages: [],
    proficiency: '',
    checkEnd: false,
    
  });

  const addEducation = item => {
    setEducationList([...educationList, item]);
    setEducationListEdit({
      degree: '',
      university: '',
      startDate: '',
      endDate: '',
      country: '',
      province: '',
    });
  };

  const addExperience = item => {
    setExperienceList([...experienceList, item]);
    setExperienceListEdit({
      degree: '',
      university: '',
      startDate: '',
      endDate: '',
      country: '',
      province: '',
    });
  };

  const removeEducation = (index: number) => {
    const updatedList = educationList.filter((_, i) => i !== index);
    setEducationList(updatedList);
  };

  const removeExperience = (index: number) => {
    const updatedList = experienceList.filter((_, i) => i !== index);
    setExperienceList(updatedList);
  };

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['bottom', 'top']}}
      colors={['#0D468C', '#041326']}>
      <View style={styles.topConrainer}>
        <BackHeader
          containerStyle={styles.header}
          isRight={true}
          title={'Create Your Profile'}
          RightIcon={<View />}
        />
      </View>
      <Stepper activeStep={activeStep} setActiveStep={setActiveStep} />

      <KeyboardAwareScrollView style={{marginTop: 20}}>
        {activeStep == 1 && (
          <>
            {educationList?.map((item, index) => {
              return (
                <EducationCard
                  item={item}
                  onRemove={() => {
                    removeEducation(index);
                  }}
                  onEdit={() => {
                    setEducationListEdit(item);
                  }}
                />
              );
            })}
            <EducationList
              educationListEdit={educationListEdit}
              setEducationListEdit={setEducationListEdit}
              addNewEducation={() => {
                addEducation(educationListEdit);
              }}
              onNextPress={() => {
                setActiveStep(3);
              }}
            />
          </>
        )}
        {activeStep == 2 && (
          <>
            {experienceList?.map((item, index) => {
              return (
                <EducationCard
                  item={item}
                  onRemove={() => {
                    removeExperience(index);
                  }}
                  onEdit={() => {
                    setEducationListEdit(item);
                  }}
                />
              );
            })}
            <ExperienceList
              educationListEdit={experienceListEdit}
              setEducationListEdit={setExperienceListEdit}
              addNewEducation={() => {
                addExperience(experienceListEdit);
              }}
              onNextPress={() => {
                setActiveStep(2);
              }}
            />
          </>
        )}
        {activeStep == 3 && (
          <AboutMeList
            educationListEdit={aboutEdit}
            setEducationListEdit={setAboutEdit}
            // addNewEducation={() => {
            //   addEducation(aboutEdit);
            // }}
            onNextPress={() => {
              setActiveStep(2);
            }}
          />
        )}
      </KeyboardAwareScrollView>
    </LinearContainer>
  );
};

export default CreateProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: wp(51),
    height: wp(51),
    borderRadius: 51,
  },
  tab: {
    backgroundColor: colors.white,
    paddingVertical: hp(14),
    borderRadius: 10,
    alignItems: 'center',
    marginTop: hp(22),
  },
  activeTabText: {
    ...commonFontStyle(700, 20, colors._0B3B75),
  },
  addEduText: {
    ...commonFontStyle(500, 20, '#F4E2B8'),
  },
  topConrainer: {
    paddingHorizontal: wp(25),
    paddingTop: hp(18),
    paddingBottom: hp(5),
    // borderBottomWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  btnRow: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#F4E2B8',
    borderRadius: 50,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginHorizontal: wp(4),
    marginBottom: 37,
    marginTop: 10,
  },
  btn: {
    marginHorizontal: wp(4),
  },
});
