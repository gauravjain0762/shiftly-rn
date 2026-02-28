import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import React, {FC, useMemo, useState} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import CustomDropdown from '../common/CustomDropdown';
import CustomDatePicker from '../common/CustomDatePicker';
import {IMAGES} from '../../assets/Images';
import CustomInput from '../common/CustomInput';
import CountryPicker from 'react-native-country-picker-modal';
import BaseText from '../common/BaseText';
import {ExperienceItem} from '../../features/employeeSlice';
import {colors} from '../../theme/colors';
import Tooltip from '../common/Tooltip';
import {useGetDepartmentsQuery} from '../../api/dashboardApi';

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
  const {data: departmentsResponse} = useGetDepartmentsQuery({});
  const departmentOptions = useMemo(() => {
    const list = departmentsResponse?.data?.departments ?? [];
    return list.map((item: any) => ({
      label: item?.title ?? '',
      value: item?._id ?? '',
    })).filter((opt: any) => opt.value);
  }, [departmentsResponse]);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.fieldHeader, {overflow: 'visible'}]}>
        <Text style={styles.fieldLabel}>
          Desired Job Title<Text style={styles.required}>*</Text>
        </Text>
        <Tooltip
          message="Select the job title you are looking for (e.g., Receptionist, Waiter, Housekeeping Attendant). This helps us match you with the right employers."
          position="bottom"
          containerStyle={styles.tooltipIcon}
          tooltipBoxStyle={{left: wp(-80), top: hp(28), width: wp(300), maxWidth: wp(280), zIndex: 1000}}
        />
      </View>
      <CustomInput
        placeholder={'Enter Desired Job Title'}
        value={experienceListEdit.preferred_position}
        onChange={(text: any) =>
          setExperienceListEdit({
            ...experienceListEdit,
            preferred_position: text,
          })
        }
        label=""
      />

      <BaseText style={styles.headerText}>Past Job Experience</BaseText>
      <View style={[styles.fieldHeader, {overflow: 'visible'}]}>
        <Text style={styles.fieldLabel}>
          Job Title<Text style={styles.required}>*</Text>
        </Text>
        <Tooltip
          message="Enter the position you held (e.g., Waiter, Receptionist). This helps us match your skills and salary expectations."
          position="bottom"
          containerStyle={styles.tooltipIcon}
          tooltipBoxStyle={{left: wp(-29), top: hp(28), width: wp(280), maxWidth: wp(280), zIndex: 1000}}
        />
      </View>
      <CustomInput
        placeholder={'Enter Job Title'}
        value={experienceListEdit.title}
        onChange={(text: any) =>
          setExperienceListEdit({...experienceListEdit, title: text})
        }
        label=""
      />
      <CustomInput
        label="Company Name"
        required
        placeholder={'Enter Company Name'}
        value={experienceListEdit.company}
        onChange={(text: any) =>
          setExperienceListEdit({...experienceListEdit, company: text})
        }
      />

      <CustomDropdown
        data={departmentOptions}
        label="Department"
        required
        placeholder={'Select Department'}
        value={experienceListEdit?.department}
        container={{marginBottom: hp(8)}}
        onChange={(selectedItem: {label: string; value: string} | any) => {
          setExperienceListEdit({
            ...experienceListEdit,
            department: selectedItem?.value ?? '',
          });
        }}
      />

      <View style={styles.countryWrapper}>
        <BaseText style={styles.label}>
          {'Country'}<Text style={styles.required}>*</Text>
        </BaseText>
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
          countryCode="US"
          withFilter
          withCountryNameButton
          withCallingCode={false}
          withFlag
          withEmoji={false}
          modalProps={{
            animationType: 'slide',
            transparent: true,
            presentationStyle: 'overFullScreen',
          }}
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
        required
        dateValue={experienceListEdit}
        onChange={(date: any) =>
          setExperienceListEdit({
            ...experienceListEdit,
            jobStart_month: date?.month?.toString(),
            jobStart_year: date?.year?.toString(),
          })
        }
      />

      <BaseText style={styles.headerText}>When did it end?</BaseText>
      
      {/* End Date Field - Disabled when still working */}
      <View style={experienceListEdit?.still_working && styles.disabledContainer}>
        <CustomDatePicker
          type={'Experience'}
          label={'End Date'}
          required={!experienceListEdit?.still_working}
          dateValue={experienceListEdit}
          disabled={experienceListEdit?.still_working}
          onChange={(date: any) => {
            if (!experienceListEdit?.still_working) {
              setExperienceListEdit({
                ...experienceListEdit,
                jobEnd_month: date?.month?.toString(),
                jobEnd_year: date?.year?.toString(),
              });
            }
          }}
        />
      </View>

      {/* "I currently work here" checkbox - Right below End Date */}
      <Pressable
        onPress={() =>
          setExperienceListEdit({
            ...experienceListEdit,
            still_working: !experienceListEdit?.still_working,
            // Clear end date when checking "still working"
            ...((!experienceListEdit?.still_working) && {
              jobEnd_month: '',
              jobEnd_year: '',
            }),
          })
        }
        style={styles.stillWrapper}>
        <TouchableOpacity
          onPress={() =>
            setExperienceListEdit({
              ...experienceListEdit,
              still_working: !experienceListEdit?.still_working,
              // Clear end date when checking "still working"
              ...((!experienceListEdit?.still_working) && {
                jobEnd_month: '',
                jobEnd_year: '',
              }),
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
        <BaseText style={styles.stillText}>I currently work here</BaseText>
      </Pressable>

      <CustomDropdown
        data={experienceOptions}
        dropdownPosition="top"
        label="What type of experience"
        required
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
    overflow: 'visible',
  },
  headerText: {
    marginTop: hp(21),
    ...commonFontStyle(700, wp(20), colors._0B3970),
  },
  label: {
    marginTop: hp(8),
    marginBottom: hp(8),
    ...commonFontStyle(400, wp(18), colors._050505),
  },
  required: {
    color: 'red',
    marginLeft: 2,
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
    ...commonFontStyle(400, wp(18), colors._050505),
  },
  stillWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(12),
    marginBottom: hp(20),
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
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
    gap: wp(8),
  },
  fieldLabel: {
    ...commonFontStyle(600, 18, colors._050505),
  },
  tooltipIcon: {
    marginTop: hp(0),
  },
  disabledContainer: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
});