import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
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
import CustomInput from '../common/CustomInput';
import {errorToast} from '../../utils/commonFunction';
import CountryPicker from 'react-native-country-picker-modal';

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

const experienceOptions = [
  {label: 'Internship', value: 'internship'},
  {label: 'Part-time', value: 'part_time'},
  {label: 'Full-time', value: 'full_time'},
  {label: 'Freelance', value: 'freelance'},
  {label: 'Contract', value: 'contract'},
];

type Props = {
  onPressMessage: (item: MessageItem) => void;
  item: MessageItem[];
};

const ExperienceList: FC<Props> = ({
  onPressMessage = () => {},
  educationListEdit,
  setEducationListEdit,
  updateField,
  index,
  addNewEducation,
  onNextPress,
  isEditing,
  onSaveExperience,
}: any) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <View style={{paddingHorizontal: 29}}>
      {/* <CustomDropdown
        data={educationOptions}
        label="Preferred Position"
        placeholder={'Preferred Position'}
        value={educationListEdit.preferred}
        container={{marginBottom: 15}}
        disable={false}
        onChange={selectedItem => {
          setEducationListEdit({
            ...educationListEdit,
            preferred: selectedItem?.value,
          });
        }}
      /> */}
      <CustomInput
        label="Preferred Position"
        placeholder={'Enter Preferred Position'}
        value={educationListEdit.preferred}
        onChange={(text: any) => {
          setEducationListEdit({
            ...educationListEdit,
            preferred: text,
          });
        }}
      />

      <Text style={styles.headerText}>Past Job Experience</Text>
      <CustomInput
        label="Title"
        placeholder={'Enter Title'}
        value={educationListEdit.title}
        onChange={(text: any) => {
          setEducationListEdit({
            ...educationListEdit,
            title: text,
          });
        }}
      />
      <CustomInput
        label="Company"
        placeholder={'Enter Company'}
        value={educationListEdit.company}
        onChange={(text: any) => {
          setEducationListEdit({
            ...educationListEdit,
            company: text,
          });
        }}
      />

      <CustomDropdown
        data={educationOptions}
        label="Department"
        placeholder={'Select Department'}
        value={educationListEdit.department}
        // container={{marginBottom: 15}}
        disable={false}
        onChange={selectedItem => {
          setEducationListEdit({
            ...educationListEdit,
            department: selectedItem?.value,
          });
        }}
      />
      {/* <CustomDropdown
        data={educationOptions}
        label="Country"
        placeholder={'Select Country'}
        value={educationListEdit.country}
        container={{marginBottom: 15}}
        disable={false}
        onChange={selectedItem => {
          setEducationListEdit({
            ...educationListEdit,
            country: selectedItem?.value,
          });
        }}
      /> */}
      <View style={{flex: 1}}>
        <Text style={styles.label}>{'Country'}</Text>
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
          style={styles.country}>
          <Text style={styles.countryText} numberOfLines={2}>
            {educationListEdit?.country || 'Select Country'}
          </Text>
        </TouchableOpacity>
      </View>
      {isVisible && (
        <CountryPicker
          visible={isVisible ? true : false}
          withFilter
          withCountryNameButton // show only name in selected view
          withCallingCode={false}
          withFlag // hides flag in selected view
          withEmoji={false} // hides emoji flag in selected view
          onSelect={(item: any) => {
            setEducationListEdit({...educationListEdit, country: item?.name});
            setIsVisible(false);
          }}
          onClose={() => {
            setIsVisible(false);
          }}
          placeholder=""
        />
      )}
      <Text style={styles.headerText}>When did you start this job?</Text>
      {/* Start & End Date */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 10,
        }}>
        <CustomDatePicker
          label="Start Date"
          value={
            educationListEdit?.job_start
              ? moment(educationListEdit?.job_start).format('DD-MM-YYYY')
              : ''
          }
          maximumDate={new Date()}
          onChange={(date: any) => {
            setEducationListEdit({
              ...educationListEdit,
              job_start: moment(date).toISOString(),
            });
          }}
        />

        {/* Hide End Date if still_working is true */}
        {!educationListEdit?.still_working && (
          <CustomDatePicker
            label="End Date"
            value={
              educationListEdit?.job_end
                ? moment(educationListEdit?.job_end).format('DD-MM-YYYY')
                : ''
            }
            minimumDate={
              educationListEdit?.job_start
                ? new Date(educationListEdit?.job_start)
                : undefined
            }
            onChange={(date: any) => {
              if (
                educationListEdit.job_start &&
                moment(date).isBefore(moment(educationListEdit.job_start))
              ) {
                errorToast('End Date cannot be before Start Date');
                return;
              }
              setEducationListEdit({
                ...educationListEdit,
                job_end: moment(date).toISOString(),
              });
            }}
          />
        )}
      </View>

      <Text style={styles.headerText}>When did it end?</Text>
      <Pressable
        onPress={() => {
          setEducationListEdit({
            ...educationListEdit,
            still_working: !educationListEdit?.still_working,
            job_end: !educationListEdit?.still_working
              ? null // clear end date when selecting still working
              : educationListEdit?.job_end,
          });
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 12,
          marginBottom: 2,
        }}>
        <TouchableOpacity
          onPress={() => {
            setEducationListEdit({
              ...educationListEdit,
              still_working: !educationListEdit?.still_working,
              job_end: !educationListEdit?.still_working
                ? null
                : educationListEdit?.job_end,
            });
          }}>
          <ImageBackground
            source={IMAGES.checkBox}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {educationListEdit?.still_working && (
              <Image
                source={IMAGES.check}
                style={{
                  width: 17,
                  height: 17,
                  resizeMode: 'contain',
                  tintColor: '#F4E2B8',
                }}
              />
            )}
          </ImageBackground>
        </TouchableOpacity>
        <Text
          onPress={() => {
            setEducationListEdit({
              ...educationListEdit,
              still_working: !educationListEdit?.still_working,
              job_end: !educationListEdit?.still_working
                ? null
                : educationListEdit?.job_end,
            });
          }}
          style={styles.stillText}>
          Still working here
        </Text>
      </Pressable>

      <CustomDropdown
        data={experienceOptions}
        label="What type of experience"
        placeholder={'What type of experience'}
        value={educationListEdit?.experience_type}
        container={{marginBottom: 15}}
        disable={false}
        onChange={selectedItem => {
          setEducationListEdit({
            ...educationListEdit,
            experience_type: selectedItem?.value,
          });
        }}
      />

      <TouchableOpacity
        onPress={() => {
          isEditing ? onSaveExperience?.() : addNewEducation();
        }}
        style={styles.btnRow}>
        <Image
          source={IMAGES.close1}
          style={{width: 22, height: 22, resizeMode: 'contain'}}
        />
        <Text style={styles.addEduText}>
          {isEditing ? 'Save Experience' : 'Add Another Experience'}
        </Text>
      </TouchableOpacity>

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

export default ExperienceList;

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
  stillText: {
    ...commonFontStyle(400, 18, '#DADADA'),
    marginLeft: 12,
  },
  headerText: {
    ...commonFontStyle(700, 20, '#F4E2B8'),
    marginTop: 12,
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

  country: {
    paddingHorizontal: wp(16),
    borderRadius: 20,
    height: 59,
    borderWidth: 1.5,
    borderColor: '#225797',
    justifyContent: 'center',
  },
  countryText: {
    ...commonFontStyle(400, 18, '#F4E2B8'),
  },
  label: {
    marginTop: 20,
    marginBottom: 12,
    ...commonFontStyle(400, 18, '#DADADA'),
  },
});
