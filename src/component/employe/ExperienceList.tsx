import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useState} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import GradientButton from '../common/GradientButton';
import CustomDropdown from '../common/CustomDropdown';
import CustomDatePicker from '../common/CustomDatePicker';
import {IMAGES} from '../../assets/Images';
import moment from 'moment';
import CustomInput from '../common/CustomInput';
import CountryPicker from 'react-native-country-picker-modal';
import BaseText from '../common/BaseText';
import {ExperienceItem} from '../../features/employeeSlice';
import {errorToast} from '../../utils/commonFunction';
import {colors} from '../../theme/colors';

const experienceOptions = [
  {label: 'Internship', value: 'internship'},
  {label: 'Part-time', value: 'part_time'},
  {label: 'Full-time', value: 'full_time'},
  {label: 'Freelance', value: 'freelance'},
  {label: 'Contract', value: 'contract'},
];

export const isEmptyExperience = (exp: ExperienceItem) => {
  return (
    !exp?.company ||
    !exp?.title ||
    !exp?.preferred_position ||
    !exp?.country ||
    !exp?.department ||
    !exp?.jobStart_month ||
    !exp?.jobStart_year ||
    !exp?.experience_type ||
    (!exp?.still_working && (!exp?.jobEnd_month || !exp?.jobEnd_year))
  );
};

const ExperienceList: FC<any> = ({
  experienceListEdit,
  setExperienceListEdit,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <View style={styles.wrapper}>
      <CustomInput
        label="Preferred Position"
        placeholder={'Enter Preferred Position'}
        value={experienceListEdit.preferred_position}
        onChange={(text: any) =>
          setExperienceListEdit({
            ...experienceListEdit,
            preferred_position: text,
          })
        }
      />

      <BaseText style={styles.headerText}>Past Job Experience</BaseText>
      <CustomInput
        label="Title"
        placeholder={'Enter Title'}
        value={experienceListEdit.title}
        onChange={(text: any) =>
          setExperienceListEdit({...experienceListEdit, title: text})
        }
      />
      <CustomInput
        label="Company"
        placeholder={'Enter Company'}
        value={experienceListEdit.company}
        onChange={(text: any) =>
          setExperienceListEdit({...experienceListEdit, company: text})
        }
      />

      <CustomInput
        label="Department"
        placeholder={'Enter Department'}
        value={experienceListEdit?.department}
        onChange={(text: any) =>
          setExperienceListEdit({...experienceListEdit, department: text})
        }
      />

      <View style={styles.countryWrapper}>
        <BaseText style={styles.label}>{'Country'}</BaseText>
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
          style={styles.country}>
          <BaseText
            style={
              experienceListEdit?.country
                ? styles.countryText
                : styles.countryPlaceholder
            }
            numberOfLines={2}>
            {experienceListEdit?.country || 'Select Country'}
          </BaseText>
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
            setExperienceListEdit({...experienceListEdit, country: item?.name});
            setIsVisible(false);
          }}
          onClose={() => setIsVisible(false)}
        />
      )}

      <BaseText style={styles.headerText}>
        When did you start this job?
      </BaseText>
      <CustomDatePicker
        type={'Experience'}
        label={'Start Date'}
        dateValue={experienceListEdit}
        onChange={(date: any) =>
          setExperienceListEdit({
            ...experienceListEdit,
            jobStart_month: date?.month?.toString(),
            jobStart_year: date?.year?.toString(),
          })
        }
      />

      <View>
        <BaseText style={styles.headerText}>When did it end?</BaseText>
        <Pressable
          onPress={() =>
            setExperienceListEdit({
              ...experienceListEdit,
              still_working: !experienceListEdit?.still_working,
            })
          }
          style={styles.stillWrapper}>
          <TouchableOpacity
            onPress={() =>
              setExperienceListEdit({
                ...experienceListEdit,
                still_working: !experienceListEdit?.still_working,
              })
            }>
            <ImageBackground
              source={IMAGES.checkBox}
              resizeMode="contain"
              style={styles.checkbox}>
              {experienceListEdit?.still_working && (
                <Image source={IMAGES.check} style={styles.checkIcon} />
              )}
            </ImageBackground>
          </TouchableOpacity>
          <BaseText style={styles.stillText}>Still working here</BaseText>
        </Pressable>

        {!experienceListEdit?.still_working && (
          <CustomDatePicker
            type={'Experience'}
            label={'End Date'}
            dateValue={experienceListEdit}
            onChange={(date: any) => {
              setExperienceListEdit({
                ...experienceListEdit,
                jobEnd_month: date?.month?.toString(),
                jobEnd_year: date?.year?.toString(),
              });
            }}
          />
        )}
      </View>

      <CustomDropdown
        data={experienceOptions}
        label="What type of experience"
        placeholder={'What type of experience'}
        value={experienceListEdit?.experience_type}
        container={{marginBottom: 15}}
        onChange={(selectedItem: {label: string; value: string} | any) => {
          setExperienceListEdit({
            ...experienceListEdit,
            experience_type: selectedItem?.value,
          });
        }}
      />
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
    ...commonFontStyle(700, wp(20), colors._0B3970),
  },
  label: {
    marginTop: hp(20),
    marginBottom: hp(12),
    ...commonFontStyle(400, wp(18), colors._050505),
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
    ...commonFontStyle(400, wp(18), colors._0B3970),
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
    tintColor: colors._0B3970,
  },
  stillText: {
    ...commonFontStyle(400, wp(18), colors._050505),
    marginLeft: wp(12),
  },
  btnRow: {
    flexDirection: 'row',
    borderWidth: wp(2),
    borderColor: colors._0B3970,
    backgroundColor: colors.white,
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
    tintColor: colors._0B3970,
  },
  addEduText: {
    ...commonFontStyle(500, wp(20), colors._0B3970),
  },
  countryPlaceholder: {
    ...commonFontStyle(400, 18, '#969595'),
  },
});
