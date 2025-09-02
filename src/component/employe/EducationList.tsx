import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useState} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import GradientButton from '../common/GradientButton';
import CustomDatePicker from '../common/CustomDatePicker';
import {IMAGES} from '../../assets/Images';
import {EducationItem} from '../../features/employeeSlice';
import CustomInput from '../common/CustomInput';
import CountryPicker from 'react-native-country-picker-modal';
import {colors} from '../../theme/colors';

type Props = {
  educationListEdit: EducationItem;
  setEducationListEdit: (item: EducationItem) => void;
  addNewEducation: () => void;
  onNextPress: () => void;
  onSaveEducation?: () => void;
};

const EducationList: FC<Props> = ({
  educationListEdit,
  setEducationListEdit,
  addNewEducation,
  onNextPress,
  onSaveEducation,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const isEmptyEducation = (edu: EducationItem) => {
    return (
      !edu.degree &&
      !edu.university &&
      !edu.startDate_month &&
      !edu.startDate_year &&
      !edu.endDate_month &&
      !edu.endDate_year &&
      !edu.country &&
      !edu.province
    );
  };

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
          label="Start Date"
          dateValue={educationListEdit}
          onChange={(date: any) => {
            setEducationListEdit({
              ...educationListEdit,
              startDate_month: date?.month?.toString(),
              startDate_year: date?.year?.toString(),
            });
          }}
        />
        <CustomDatePicker
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
          <Text style={styles.label}>{'Country'}</Text>
          <TouchableOpacity
            onPress={() => setIsVisible(true)}
            style={styles.country}>
            <Text style={educationListEdit?.country ? styles.countryText : styles.countryPlaceholder} numberOfLines={2}>
              {educationListEdit?.country || 'Select Country'}
            </Text>
            <Image source={IMAGES.down1} style={styles.dropdownIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.halfWidth}>
          <CustomInput
            label="Province"
            placeholder="Enter Province"
            value={educationListEdit?.province}
            onChange={(text: any) =>
              setEducationListEdit({...educationListEdit, province: text})
            }
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

      <TouchableOpacity
        onPress={
          educationListEdit?.isEditing ? onSaveEducation : addNewEducation
        }
        disabled={
          !educationListEdit?.isEditing && isEmptyEducation(educationListEdit)
        }
        style={[
          styles.btnRow,
          !educationListEdit?.isEditing &&
            isEmptyEducation(educationListEdit) && {
              opacity: 0.5,
            },
        ]}>
        <Image
          source={educationListEdit?.isEditing ? IMAGES.check : IMAGES.close1}
          style={styles.closeIcon}
        />
        <Text style={styles.addEduText}>
          {educationListEdit?.isEditing
            ? 'Save Education'
            : 'Add Another Education'}
        </Text>
      </TouchableOpacity>

      <GradientButton style={styles.btn} title="Next" onPress={onNextPress} />
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
    ...commonFontStyle(400, 18, '#F4E2B8'),
  },
  countryPlaceholder: {
    flex: 1,
    ...commonFontStyle(400, 18, '#969595'),
  },
  dropdownIcon: {
    width: 12,
    height: 13,
    resizeMode: 'contain',
  },
  closeIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.coPrimary,
  },
  label: {
    marginTop: 20,
    marginBottom: 12,
    ...commonFontStyle(400, 18, '#DADADA'),
  },
  addEduText: {
    ...commonFontStyle(500, 20, '#F4E2B8'),
  },
});
