import {
  Image,
  ImageBackground,
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

const ExperienceList: FC<Props> = ({
  onPressMessage = () => {},
  educationListEdit,
  setEducationListEdit,
  updateField,
  index,
  addNewEducation,
  onNextPress,
}: any) => {
  return (
    <View style={{paddingHorizontal: 29}}>
      <CustomDropdown
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
      />

      <Text style={styles.headerText}>Past Job Experience</Text>
      <CustomInput
        label="Title"
        placeholder={'Enter Title'}
        value={educationListEdit.title}
        onChange={text => {
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
        onChange={text => {
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
      <CustomDropdown
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
      />

      <Text style={styles.headerText}>When did you start this job?</Text>
      {/* Start & End Date */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          // marginBottom: 20,
          gap: 10,
        }}>
        <CustomDropdown
          data={educationOptions}
          label="Month"
          placeholder={'Month'}
          value={educationListEdit?.month}
          container={{marginBottom: 15, flex: 1}}
          disable={false}
          onChange={selectedItem => {
            setEducationListEdit({
              ...educationListEdit,
              month: selectedItem?.value,
            });
          }}
        />
        <CustomDropdown
          data={educationOptions}
          label="Year"
          placeholder={'Year'}
          value={educationListEdit?.year}
          container={{marginBottom: 15, flex: 1}}
          disable={false}
          onChange={selectedItem => {
            setEducationListEdit({
              ...educationListEdit,
              year: selectedItem?.value,
            });
          }}
        />
      </View>

      <Text style={styles.headerText}>When did it end?</Text>
      <View
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
              checkEnd: !educationListEdit?.checkEnd,
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
            {educationListEdit?.checkEnd && (
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
              checkEnd: !educationListEdit?.checkEnd,
            });
          }}
          style={styles.stillText}>
          Still working here
        </Text>
      </View>
      <CustomDropdown
        data={educationOptions}
        label="What type of experience"
        placeholder={'What type of experience'}
        value={educationListEdit?.province}
        container={{marginBottom: 15}}
        disable={false}
        onChange={selectedItem => {
          setEducationListEdit({
            ...educationListEdit,
            province: selectedItem?.value,
          });
        }}
      />

      <TouchableOpacity
        onPress={() => {
          addNewEducation();
        }}
        style={styles.btnRow}>
        <Image
          source={IMAGES.close1}
          style={{width: 22, height: 22, resizeMode: 'contain'}}
        />
        <Text style={styles.addEduText}>Add Another Experience</Text>
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
});
