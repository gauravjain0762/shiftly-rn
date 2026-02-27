import React, { FC, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import { commonFontStyle, hp, wp } from '../../theme/fonts';
import CustomDatePicker from '../common/CustomDatePicker';
import { IMAGES } from '../../assets/Images';
import { EducationItem } from '../../features/employeeSlice';
import CustomInput from '../common/CustomInput';
import CountryPicker from 'react-native-country-picker-modal';
import BaseText from '../common/BaseText';
import { colors } from '../../theme/colors';
import Tooltip from '../common/Tooltip';
import CustomDropdown from '../common/CustomDropdown';

type Props = {
  educationListEdit: EducationItem;
  setEducationListEdit: (item: EducationItem) => void;
  // Optional props for other screens (not required here)
  addNewEducation?: () => void;
  onNextPress?: () => void;
  onSaveEducation?: () => void;
  educationList?: EducationItem[];
  educationData?: EducationItem[];
};

export const isEmptyEducation = (edu: EducationItem) => {
  if (!edu) return true;
  // Check if degree is empty or just "Other" without actual text
  const isDegreeEmpty = !edu.degree || edu.degree === 'Other';

  return (
    isDegreeEmpty ||
    !edu.university ||
    !edu.startDate_month ||
    !edu.startDate_year ||
    !edu.endDate_month ||
    !edu.endDate_year ||
    !edu.country ||
    !edu.province
  );
};
const degreeOptions = [
  { label: 'High School', value: 'High School' },
  { label: 'Diploma', value: 'Diploma' },
  { label: 'Vocational Training', value: 'Vocational Training' },
  { label: 'Associate Degree', value: 'Associate Degree' },
  { label: 'Bachelor\'s Degree', value: 'Bachelor\'s Degree' },
  { label: 'Master\'s Degree', value: 'Master\'s Degree' },
  { label: 'Doctorate (PhD)', value: 'Doctorate (PhD)' },
  { label: 'Professional Degree', value: 'Professional Degree' },
  { label: 'Certificate', value: 'Certificate' },
  { label: 'Other', value: 'Other' },
];

const EducationList: FC<Props> = ({
  educationListEdit,
  setEducationListEdit,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showOtherDegreeInput, setShowOtherDegreeInput] = useState<boolean>(false);
  const [otherDegreeText, setOtherDegreeText] = useState<string>('');

  // Check if "Other" is selected and set the state
  React.useEffect(() => {
    if (!educationListEdit) return;
    const isOther =
      educationListEdit?.degree === 'Other' ||
      (!!educationListEdit?.degree &&
        !degreeOptions.some(opt => opt.value === educationListEdit.degree));

    setShowOtherDegreeInput(isOther);

    if (isOther && educationListEdit?.degree !== 'Other') {
      setOtherDegreeText(educationListEdit?.degree);
    }
  }, [educationListEdit?.degree]);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.fieldHeader, { overflow: 'visible' }]}>
        <Text style={styles.fieldLabel}>
          Degree<Text style={styles.required}>*</Text>
        </Text>
        <Tooltip
          message="We use your education info to better match you with employers who value specific qualifications."
          position="bottom"
          containerStyle={styles.tooltipIcon}
          tooltipBoxStyle={{
            left: wp(-29),
            top: hp(28),
            width: wp(280),
            maxWidth: wp(280),
            zIndex: 1000
          }}
        />
      </View>

      <CustomDropdown
        data={degreeOptions}
        placeholder="Select Degree"
        value={showOtherDegreeInput ? 'Other' : educationListEdit?.degree}
        container={{}}
        onChange={(selectedItem: { label: string; value: string }) => {
          if (selectedItem?.value === 'Other') {
            setShowOtherDegreeInput(true);
            setEducationListEdit({
              ...educationListEdit,
              degree: 'Other',
            });
          } else {
            setShowOtherDegreeInput(false);
            setOtherDegreeText('');
            setEducationListEdit({
              ...educationListEdit,
              degree: selectedItem?.value,
            });
          }
        }}
      />

      {showOtherDegreeInput && (
        <CustomInput
          placeholder="Enter your degree"
          value={otherDegreeText}
          onChange={(text: string) => {
            setOtherDegreeText(text);
            setEducationListEdit({
              ...educationListEdit,
              degree: text,
            });
          }}
          label=""
          inputStyle={{ color: colors._050505, marginTop: 10 }}
          containerStyle={{ marginTop: hp(-10), marginBottom: hp(15) }}
        />
      )}

      <CustomInput
        label="University"
        required
        placeholder="Enter University"
        value={educationListEdit?.university}
        onChange={(text: any) =>
          setEducationListEdit({ ...educationListEdit, university: text })
        }
        inputStyle={{ color: colors._050505 }}
      />

      {/* Rest of the component stays the same */}
      <View style={styles.dateContainer}>
        <CustomDatePicker
          type="Education"
          label="Start Date"
          required
          dateValue={educationListEdit}
          onChange={(date: any) => {
            setEducationListEdit({
              ...educationListEdit,
              startDate_month: date?.month?.toString(),
              startDate_year: date?.year,
            });
          }}
        />
        <CustomDatePicker
          type="Education"
          label="End Date"
          required
          dateValue={educationListEdit}
          onChange={(date: any) => {
            setEducationListEdit({
              ...educationListEdit,
              endDate_month: date?.month?.toString(),
              endDate_year: date?.year?.toString(),
            });
          }}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <BaseText style={styles.label}>
            {'Country'}<Text style={styles.required}>*</Text>
          </BaseText>
          <TouchableOpacity
            onPress={() => setIsVisible(true)}
            style={styles.country}>
            <BaseText
              style={
                educationListEdit?.country
                  ? styles.countryText
                  : styles.countryPlaceholder
              }
              numberOfLines={2}>
              {educationListEdit?.country || 'Select Country'}
            </BaseText>
            <Image source={IMAGES.down1} style={styles.dropdownIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.halfWidth}>
          <CustomInput
            required
            label="City/Region"
            placeholder={'City/Region'}
            placeholderTextColor={'#969595'}
            value={educationListEdit?.province}
            onChange={(text: string) => {
              // Allow letters and spaces only - preserve all spaces between words
              const cleanedText = text.replace(/[^A-Za-z ]/g, '');

              setEducationListEdit({
                ...educationListEdit,
                province: cleanedText,
              });
            }}
            containerStyle={styles.flex1}
            inputStyle={{ ...commonFontStyle(400, 16, colors._050505) }}
          />
        </View>
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
            const countryName =
              typeof item?.name === 'string'
                ? item.name
                : item?.name?.common || '';
            setEducationListEdit({ ...educationListEdit, country: countryName });
            setIsVisible(false);
          }}
          onClose={() => {
            setIsVisible(false);
          }}
        />
      )}
    </View>
  );
};

export default EducationList;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 29,
    overflow: 'visible',
  },
  dateContainer: {
    marginBottom: hp(12),
    gap: 10,
  },
  row: {
    gap: wp(10),
    flexDirection: 'row',
    marginBottom: hp(20),
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '50%',
  },
  flex1: {
    flex: 1,
  },

  country: {
    gap: wp(10),
    height: hp(59),
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: hp(20),
    borderColor: '#225797',
    justifyContent: 'center',
    paddingHorizontal: wp(20),
  },
  countryText: {
    flex: 1,
    ...commonFontStyle(400, 18, colors._050505),
  },
  countryPlaceholder: {
    flex: 1,
    ...commonFontStyle(400, 17, '#969595'),
  },
  dropdownIcon: {
    width: 12,
    height: 13,
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  label: {
    marginTop: 20,
    marginBottom: 12,
    ...commonFontStyle(500, 18, colors._050505),
  },
  required: {
    color: 'red',
    marginLeft: 2,
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
});
