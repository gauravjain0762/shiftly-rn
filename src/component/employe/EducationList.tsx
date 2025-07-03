import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useState} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import GradientButton from '../common/GradientButton';
import CustomDropdown from '../common/CustomDropdown';
import CustomDatePicker from '../common/CustomDatePicker';
import {IMAGES} from '../../assets/Images';
import moment from 'moment';

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

type Props = {
  onPressMessage: (item: MessageItem) => void;
  item: MessageItem[];
};

const EducationList: FC<Props> = ({
  onPressMessage = () => {},
  educationListEdit,
  setEducationListEdit,
  updateField,
  index,
  addNewEducation,
  onNextPress,
}: any) => {
  console.log('====================================');
  console.log('educationListEdit.startDate', educationListEdit.startDate);
  console.log('====================================');
  return (
    <View style={{paddingHorizontal: 29}}>
      <CustomDropdown
        data={educationOptions}
        label="Degree"
        placeholder={'Select Degree'}
        value={educationListEdit.degree}
        container={{marginBottom: 15}}
        disable={false}
        onChange={selectedItem => {
          setEducationListEdit({
            ...educationListEdit,
            degree: selectedItem?.value,
          });
        }}
      />
      <CustomDropdown
        data={educationOptions}
        label="University"
        placeholder={'Select University'}
        value={educationListEdit.university}
        container={{marginBottom: 15}}
        disable={false}
        onChange={selectedItem => {
          setEducationListEdit({
            ...educationListEdit,
            university: selectedItem?.value,
          });
        }}
      />
      {/* Start & End Date */}
      <View style={{flexDirection: 'row', marginBottom: 20, gap: 10}}>
        <CustomDatePicker
          label="Start Date"
          value={
            educationListEdit.startDate
              ? moment(educationListEdit.startDate).format('DD-MM-YYYY')
              : ''
          }
          minimumDate={new Date()} // today
          onChange={date => {
            setEducationListEdit({
              ...educationListEdit,
              startDate: date, // store raw Date
            });
          }}
        />

        <CustomDatePicker
          label="End Date"
          value={
            educationListEdit.endDate
              ? moment(educationListEdit.endDate).format('DD-MM-YYYY')
              : ''
          }
          minimumDate={educationListEdit.startDate || new Date()} // prevent Invalid Date
          onChange={date => {
            setEducationListEdit({
              ...educationListEdit,
              endDate: date, // store raw Date
            });
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
          gap: 10,
        }}>
        <CustomDropdown
          data={educationOptions}
          label="Country"
          placeholder={'Country'}
          value={educationListEdit?.country}
          container={{marginBottom: 15, flex: 1}}
          disable={false}
          onChange={selectedItem => {
            setEducationListEdit({
              ...educationListEdit,
              country: selectedItem?.value,
            });
          }}
        />
        <CustomDropdown
          data={educationOptions}
          label="Province"
          placeholder={'Province'}
          value={educationListEdit?.province}
          container={{marginBottom: 15, flex: 1}}
          disable={false}
          onChange={selectedItem => {
            setEducationListEdit({
              ...educationListEdit,
              province: selectedItem?.value,
            });
          }}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          addNewEducation();
        }}
        style={styles.btnRow}>
        <Image
          source={IMAGES.close1}
          style={{width: 22, height: 22, resizeMode: 'contain'}}
        />
        <Text style={styles.addEduText}>Add Another Education</Text>
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

export default EducationList;

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
