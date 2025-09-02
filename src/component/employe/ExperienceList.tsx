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

const experienceOptions = [
  {label: 'Internship', value: 'internship'},
  {label: 'Part-time', value: 'part_time'},
  {label: 'Full-time', value: 'full_time'},
  {label: 'Freelance', value: 'freelance'},
  {label: 'Contract', value: 'contract'},
];

const ExperienceList: FC<any> = ({
  educationListEdit,
  setEducationListEdit,
  addNewEducation,
  onNextPress,
  isEditing,
  onSaveExperience,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <View style={styles.wrapper}>
      <CustomInput
        label="Preferred Position"
        placeholder={'Enter Preferred Position'}
        value={educationListEdit.preferred}
        onChange={(text: any) =>
          setEducationListEdit({...educationListEdit, preferred: text})
        }
      />

      <Text style={styles.headerText}>Past Job Experience</Text>
      <CustomInput
        label="Title"
        placeholder={'Enter Title'}
        value={educationListEdit.title}
        onChange={(text: any) =>
          setEducationListEdit({...educationListEdit, title: text})
        }
      />
      <CustomInput
        label="Company"
        placeholder={'Enter Company'}
        value={educationListEdit.company}
        onChange={(text: any) =>
          setEducationListEdit({...educationListEdit, company: text})
        }
      />

      <CustomInput
        label="Department"
        placeholder={'Enter Department'}
        value={educationListEdit?.department}
        onChange={(text: any) =>
          setEducationListEdit({...educationListEdit, department: text})
        }
      />

      <View style={styles.countryWrapper}>
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
          visible={isVisible}
          withFilter
          withCountryNameButton
          withCallingCode={false}
          withFlag
          withEmoji={false}
          onSelect={(item: any) => {
            setEducationListEdit({...educationListEdit, country: item?.name});
            setIsVisible(false);
          }}
          onClose={() => setIsVisible(false)}
        />
      )}

      <Text style={styles.headerText}>When did you start this job?</Text>
      <CustomDatePicker
        label="Start Date"
        value={
          educationListEdit?.job_start
            ? moment(educationListEdit?.job_start).format('DD-MM-YYYY')
            : ''
        }
        maximumDate={new Date()}
        onChange={(date: any) =>
          setEducationListEdit({
            ...educationListEdit,
            job_start: moment(date).toISOString(),
          })
        }
      />

      <View>
        <Text style={styles.headerText}>When did it end?</Text>
        <Pressable
          onPress={() =>
            setEducationListEdit({
              ...educationListEdit,
              still_working: !educationListEdit?.still_working,
              job_end: !educationListEdit?.still_working
                ? null
                : educationListEdit?.job_end,
            })
          }
          style={styles.stillWrapper}>
          <TouchableOpacity
            onPress={() =>
              setEducationListEdit({
                ...educationListEdit,
                still_working: !educationListEdit?.still_working,
                job_end: !educationListEdit?.still_working
                  ? null
                  : educationListEdit?.job_end,
              })
            }>
            <ImageBackground
              source={IMAGES.checkBox}
              resizeMode="contain"
              style={styles.checkbox}>
              {educationListEdit?.still_working && (
                <Image source={IMAGES.check} style={styles.checkIcon} />
              )}
            </ImageBackground>
          </TouchableOpacity>
          <Text style={styles.stillText}>Still working here</Text>
        </Pressable>

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

      <CustomDropdown
        data={experienceOptions}
        label="What type of experience"
        placeholder={'What type of experience'}
        value={educationListEdit?.experience_type}
        container={{marginBottom: 15}}
        onChange={selectedItem =>
          setEducationListEdit({
            ...educationListEdit,
            experience_type: selectedItem?.value,
          })
        }
      />

      <TouchableOpacity
        onPress={() => (isEditing ? onSaveExperience?.() : addNewEducation())}
        style={styles.btnRow}>
        <Image source={IMAGES.close1} style={styles.closeIcon} />
        <Text style={styles.addEduText}>
          {isEditing ? 'Save Experience' : 'Add Another Experience'}
        </Text>
      </TouchableOpacity>

      <GradientButton style={styles.btn} title={'Next'} onPress={onNextPress} />
    </View>
  );
};

export default ExperienceList;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: wp(29),
  },
  headerText: {
    marginTop: hp(21),
    ...commonFontStyle(700, wp(20), '#F4E2B8'),
  },
  label: {
    marginTop: hp(20),
    marginBottom: hp(12),
    ...commonFontStyle(400, wp(18), '#DADADA'),
  },
  countryWrapper: {
    flex: 1,
  },
  country: {
    paddingHorizontal: wp(16),
    borderRadius: wp(20),
    height: hp(59),
    borderWidth: wp(1.5),
    borderColor: '#225797',
    justifyContent: 'center',
  },
  countryText: {
    ...commonFontStyle(400, wp(18), '#F4E2B8'),
  },
  stillWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(12),
    marginBottom: hp(2),
  },
  checkbox: {
    width: wp(30),
    height: hp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: wp(17),
    height: hp(17),
    resizeMode: 'contain',
    tintColor: '#F4E2B8',
  },
  stillText: {
    ...commonFontStyle(400, wp(18), '#DADADA'),
    marginLeft: wp(12),
  },
  btnRow: {
    flexDirection: 'row',
    borderWidth: wp(2),
    borderColor: '#F4E2B8',
    borderRadius: wp(50),
    paddingTop: hp(12),
    paddingBottom: hp(12),
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(4),
    marginHorizontal: wp(4),
    marginBottom: hp(37),
    marginTop: hp(10),
  },
  btn: {
    marginHorizontal: wp(4),
  },
  closeIcon: {
    width: wp(22),
    height: hp(22),
    resizeMode: 'contain',
  },
  addEduText: {
    ...commonFontStyle(500, wp(20), '#F4E2B8'),
  },
});
