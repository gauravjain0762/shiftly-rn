/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useState} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import GradientButton from '../common/GradientButton';
import CustomDatePicker from '../common/CustomDatePicker';
import {IMAGES} from '../../assets/Images';
import moment from 'moment';
import {EducationItem} from '../../features/employeeSlice';
import CustomInput from '../common/CustomInput';
import {errorToast} from '../../utils/commonFunction';
import CountryPicker, {Country} from 'react-native-country-picker-modal';

type Props = {
  educationListEdit: EducationItem;
  setEducationListEdit: (item: EducationItem) => void;
  addNewEducation: () => void;
  onNextPress: () => void;
  isEditing?: boolean;
  onSaveEducation?: () => void;
};

const EducationList: FC<Props> = ({
  educationListEdit,
  setEducationListEdit,
  addNewEducation,
  onNextPress,
  isEditing,
  onSaveEducation,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <View style={{paddingHorizontal: 29}}>
      <CustomInput
        label="Degree"
        placeholder="Enter Degree"
        value={educationListEdit?.degree}
        onChange={text =>
          setEducationListEdit({...educationListEdit, degree: text})
        }
      />
      <CustomInput
        label="University"
        placeholder="Enter University"
        value={educationListEdit?.university}
        onChange={text =>
          setEducationListEdit({...educationListEdit, university: text})
        }
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
          maximumDate={new Date()}
          onChange={(date: any) => {
            setEducationListEdit({
              ...educationListEdit,
              startDate: moment(date).toISOString(),
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
          minimumDate={
            educationListEdit.startDate
              ? new Date(educationListEdit.startDate)
              : undefined
          }
          onChange={(date: any) => {
            if (
              educationListEdit.startDate &&
              moment(date).isBefore(moment(educationListEdit.startDate))
            ) {
              errorToast('End Date cannot be before Start Date');
              return;
            }
            setEducationListEdit({
              ...educationListEdit,
              endDate: moment(date).toISOString(),
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
        {/* <CustomInput
          label="Country"
          placeholder="Enter Country"
          value={educationListEdit?.country}
          onChange={text =>
            setEducationListEdit({...educationListEdit, country: text})
          }
          containerStyle={{flex: 1}}
        /> */}
        <View style={{width: '50%'}}>
          <Text style={styles.label}>{'Country'}</Text>
          <TouchableOpacity
            onPress={() => setIsVisible(true)}
            style={styles.country}>
            <Text style={styles.countryText} numberOfLines={2}>
              {educationListEdit?.country || 'Select Country'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '50%'}}>
          <CustomInput
            label="Province"
            placeholder="Enter Province"
            value={educationListEdit?.province}
            onChange={(text: any) =>
              setEducationListEdit({...educationListEdit, province: text})
            }
            containerStyle={{flex: 1}}
          />
        </View>
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

      <TouchableOpacity
        onPress={isEditing ? onSaveEducation : addNewEducation}
        style={styles.btnRow}>
        <Image
          source={IMAGES.close1}
          style={{width: 22, height: 22, resizeMode: 'contain'}}
        />
        <Text style={styles.addEduText}>
          {isEditing ? 'Save Education' : 'Add Another Education'}
        </Text>
      </TouchableOpacity>

      <GradientButton style={styles.btn} title="Next" onPress={onNextPress} />
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
