import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useState} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import GradientButton from '../common/GradientButton';
import CustomDropdown from '../common/CustomDropdown';
import CustomDatePicker from '../common/CustomDatePicker';
import {IMAGES} from '../../assets/Images';
import moment from 'moment';
import CustomDropdownMulti from '../common/CustomDropdownMulti';
import CustomSwitch from '../common/CustomSwitch';
import CustomInput from '../common/CustomInput';
import {MultiSelect} from 'react-native-element-dropdown';
import {useGetEmployeeSkillsQuery} from '../../api/dashboardApi';
import {useDispatch, useSelector} from 'react-redux';
import {selectEmployeeState} from '../../features/employeeSlice';

type MessageItem = {
  id: string;
  logo: string;
  title: string;
  sender: string;
  preview: string;
  date: string;
  unreadCount?: number;
};

const educationOptions = [
  {label: 'High School', value: 'high_school'},
  {label: 'Diploma', value: 'diploma'},
  {label: "Bachelor's Degree", value: 'bachelor'},
  {label: "Master's Degree", value: 'master'},
  {label: 'PhD', value: 'phd'},
];

const languages = [
  'English',
  'French',
  'Arabic',
  'Spanish',
  'German',
  'Italian',
  'Russian',
  'Urdu',
  'Hindi',
  'Turkish',
  'Chinese',
  'Japanese',
];

const getDotColor = (level: string) => {
  switch (level) {
    case 'Native':
      return '#F4E2B8';
    case 'Fluent':
      return '#CBC194';
    case 'Intermediate':
      return '#7390B1';
    case 'Basic':
      return '#024AA1';
    default:
      return '#999';
  }
};

const proficiencyLevels = ['Native', 'Fluent', 'Intermediate', 'Basic'];

type Props = {
  onPressMessage: (item: MessageItem) => void;
  item: MessageItem[];
};

const AboutMeList: FC<Props> = ({
  onPressMessage = () => {},
  educationListEdit,
  setEducationListEdit,
  updateField,
  index,
  addNewEducation,
  onNextPress,
}: any) => {
  const dispatch = useDispatch();
  const {data} = useGetEmployeeSkillsQuery({});
  const empSkills = data?.data?.skills;

  return (
    <View style={{paddingHorizontal: 29}}>
      <Text style={styles.headerText}>About Me</Text>
      <TextInput
        style={styles.dropdown}
        multiline
        value={educationListEdit.aboutMe}
        onChangeText={text => {
          setEducationListEdit({
            ...educationListEdit,
            aboutMe: text,
          });
        }}
        maxLength={400}
        textAlignVertical="top"
        placeholderTextColor={'rgba(231, 231, 231, 0.8)'}
        placeholder="If an employer visited your profile right now, what would you want them to know about you first?"
      />
      <Text
        style={
          styles.countText
        }>{`${educationListEdit.aboutMe?.length}/400`}</Text>
      <CustomDropdown
        data={educationOptions}
        label="Key Responsibilities "
        placeholder={'Key Responsibilities '}
        value={educationListEdit.responsibilities}
        container={{marginBottom: 25}}
        disable={false}
        onChange={selectedItem => {
          setEducationListEdit({
            ...educationListEdit,
            responsibilities: selectedItem?.value,
          });
        }}
      />

      <Text style={styles.headerText}>Select your skills</Text>
      <CustomDropdownMulti
        data={
          empSkills?.map((skill: { title: any; _id: any; }) => ({
            label: skill.title,
            value: skill._id,
          })) || []
        }
        placeholder="Select more than one"
        value={educationListEdit.selectOne}
        selectedStyle={styles.selectedStyle}
        container={{marginBottom: 15}}
        disable={false}
        onChange={selectedItem => {
          setEducationListEdit({
            ...educationListEdit,
            selectOne: selectedItem,
          });
        }}
      />

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CustomSwitch
          setIsOn={item => {
            setEducationListEdit({
              ...educationListEdit,
              isOn: item,
            });
          }}
          isOn={educationListEdit.isOn}
        />
        <Text style={styles.stillText}>
          Yes, I’m open to better opportunities
        </Text>
      </View>

      <Text style={[styles.headerText, {marginTop: 30, marginBottom: 12}]}>
        Front Desk Manager
      </Text>

      <View
        style={{
          gap: 11,
          borderBottomWidth: 1,
          paddingBottom: 28,
          borderBottomColor: '#FFF8E6',
        }}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
          onPress={() => {}}>
          <ImageBackground source={IMAGES.btnBg1} style={styles.iconWrapper}>
            <Image
              source={IMAGES.check}
              style={{
                width: 18,
                height: 16,
                resizeMode: 'contain',
                tintColor: colors._F4E2B8,
              }}
            />
          </ImageBackground>
          <Text style={styles.iconWrapperText}>
            Yes, I’m open to better opportunities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
          onPress={() => {}}>
          <ImageBackground source={IMAGES.btnBg1} style={styles.iconWrapper}>
            <Image
              source={IMAGES.close}
              style={{
                width: 15,
                height: 13,
                resizeMode: 'contain',
                tintColor: colors._F4E2B8,
              }}
            />
          </ImageBackground>
          <Text style={styles.iconWrapperText}>
            No, I’m not currently looking
          </Text>
        </TouchableOpacity>
      </View>
      <CustomInput
        label="Location"
        placeholder={'Enter Location'}
        value={educationListEdit.location}
        onChange={(text: any) => {
          setEducationListEdit({
            ...educationListEdit,
            location: text,
          });
        }}
      />

      <CustomDropdown
        data={educationOptions}
        label="Key Responsibilities "
        placeholder={'Key Responsibilities '}
        value={educationListEdit.responsibilities}
        container={{marginBottom: 20}}
        disable={false}
        onChange={selectedItem => {
          setEducationListEdit({
            ...educationListEdit,
            responsibilities: selectedItem?.value,
          });
        }}
      />

      <Text style={styles.headerText}>Select your language</Text>
      {/* <MultiSelect
        style={styles.dropdown1}
        data={languages.map(lang => ({label: lang, value: lang}))}
        labelField="label"
        valueField="value"
        placeholder="Select more than one"
        placeholderStyle={styles.placeholderStyle}
        value={educationListEdit.selectedLanguages}
        onChange={(val: any[]) => {
          setEducationListEdit({
            ...educationListEdit,
            selectedLanguages: val,
          });
        }}
        selectedStyle={styles.selectedStyle}
      /> */}

      <CustomDropdownMulti
        data={languages.map(lang => ({label: lang, value: lang}))}
        placeholder={'Select more than one'}
        value={educationListEdit.selectedLanguages}
        container={{marginBottom: 15}}
        disable={false}
        placeholderStyle={styles.placeholderStyle}
        selectedStyle={styles.selectedStyle}
        onChange={selectedItem => {
          setEducationListEdit({
            ...educationListEdit,
            selectedLanguages: selectedItem,
          });
        }}
      />

      {educationListEdit.selectedLanguages.length > 0 && (
        <>
          <Text style={styles.subTitle}>Proficiency Levels</Text>

          {educationListEdit.selectedLanguages.map((lang: boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.Key | null | undefined) => (
            <View style={styles.row} key={lang}>
              <Text style={styles.language}>{lang}</Text>
              {proficiencyLevels.map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.dot,
                    educationListEdit.proficiency[lang] === level &&
                      styles.selectedDot,
                    {backgroundColor: getDotColor(level)},
                  ]}
                  onPress={() => {
                    setEducationListEdit({
                      ...educationListEdit,
                      proficiency: {
                        ...educationListEdit.proficiency,
                        [lang]: level,
                      },
                    });
                  }}
                />
              ))}
            </View>
          ))}

          <View style={styles.legend}>
            {proficiencyLevels.map(level => (
              <View style={styles.legendItem} key={level}>
                <View
                  style={[styles.dot, {backgroundColor: getDotColor(level)}]}
                />
                <Text style={styles.legendText}>{level}</Text>
              </View>
            ))}
          </View>
        </>
      )}
      <GradientButton
        style={styles.btn}
        title={'Next'}
        onPress={() => {
          onNextPress();
        }}
      />
    </View>
  );
};

export default AboutMeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdown: {
    paddingHorizontal: wp(16),
    borderRadius: 10,
    minHeight: 200,
    maxHeight: 200,
    borderWidth: 1.5,
    borderColor: '#225797',
    flexDirection: 'row',
    alignItems: 'center',
    ...commonFontStyle(400, 15, '#F4E2B8'),
  },
  headerText: {
    ...commonFontStyle(700, 18, '#F4E2B8'),
    marginBottom: 8,
  },
  countText: {
    ...commonFontStyle(400, 12, 'rgba(231, 231, 231, 1)'),
    textAlign: 'right',
    marginTop: 10,
    marginRight: 3,
  },
  btn: {
    marginHorizontal: wp(4),
    marginTop: 40,
  },
  stillText: {
    ...commonFontStyle(400, 18, '#DADADA'),
    marginLeft: 12,
    textAlign: 'center',
  },
  iconWrapperText: {
    ...commonFontStyle(400, 18, '#DADADA'),
  },

  iconWrapper: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedStyle: {
    height: 0,
    opacity: 0,
    padding: 0,
    margin: 0,
  },
  placeholderStyle: {
    ...commonFontStyle(400, 18, '#F4E2B8'),
  },

  dropdown1: {
    paddingHorizontal: wp(16),
    borderRadius: 20,
    height: 59,
    borderWidth: 1.5,
    borderColor: '#225797',
    flexDirection: 'row',
    alignItems: 'center',
    ...commonFontStyle(400, 18, '#F4E2B8'),
  },

  subTitle: {
    ...commonFontStyle(700, 18, '#F4E2B8'),
    marginBottom: 10,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    marginBottom: 12,
  },
  language: {
    ...commonFontStyle(400, 18, '#DADADA'),
    flex: 1,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 24,
    marginHorizontal: 16,
  },
  selectedDot: {
    borderWidth: 2,
    borderColor: 'white',
  },
  legend: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    alignItems: 'center',
  },
  legendText: {
    ...commonFontStyle(400, 13, '#DADADA'),
    marginTop: 6,
  },
});
