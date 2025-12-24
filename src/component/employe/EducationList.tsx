import React, {FC, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

import {commonFontStyle, hp, wp} from '../../theme/fonts';
import CustomDatePicker from '../common/CustomDatePicker';
import {IMAGES} from '../../assets/Images';
import {EducationItem} from '../../features/employeeSlice';
import CustomInput from '../common/CustomInput';
import CountryPicker from 'react-native-country-picker-modal';
import BaseText from '../common/BaseText';
import {colors} from '../../theme/colors';

type Props = {
  educationListEdit: EducationItem;
  setEducationListEdit: (item: EducationItem) => void;
  addNewEducation: () => void;
  onNextPress: () => void;
  onSaveEducation?: () => void;
  educationList: EducationItem[];
  educationData?: EducationItem[];
};
export const isEmptyEducation = (edu: EducationItem) => {
  return (
    !edu.degree ||
    !edu.university ||
    !edu.startDate_month ||
    !edu.startDate_year ||
    !edu.endDate_month ||
    !edu.endDate_year ||
    !edu.country ||
    !edu.province
  );
};

const EducationList: FC<Props> = ({
  educationListEdit,
  setEducationListEdit,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <View style={styles.wrapper}>
      <CustomInput
        label="Degree"
        placeholder="Enter Degree"
        value={educationListEdit?.degree}
        onChange={(text: any) =>
          setEducationListEdit({...educationListEdit, degree: text})
        }
      />
      <CustomInput
        label="University"
        placeholder="Enter University"
        value={educationListEdit?.university}
        onChange={(text: any) =>
          setEducationListEdit({...educationListEdit, university: text})
        }
      />
      <View style={styles.dateContainer}>
        <CustomDatePicker
          type="Education"
          label="Start Date"
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
          <BaseText style={styles.label}>{'Country'}</BaseText>
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
            label="Province"
            placeholder="Enter Province"
            value={educationListEdit?.province}
            onChange={(text: string) => {
              const onlyLetters = text.replace(/[^A-Za-z ]/g, '');
              setEducationListEdit({
                ...educationListEdit,
                province: onlyLetters.trim(),
              });
            }}
            containerStyle={styles.flex1}
          />
        </View>
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
            const countryName =
              typeof item?.name === 'string'
                ? item.name
                : item?.name?.common || '';
            setEducationListEdit({...educationListEdit, country: countryName});
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
  },
  dateContainer: {
    marginBottom: 20,
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
    ...commonFontStyle(400, 18, colors._0B3970),
  },
  countryPlaceholder: {
    flex: 1,
    ...commonFontStyle(400, 18, '#969595'),
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
    ...commonFontStyle(400, 18, colors._050505),
  },
});
