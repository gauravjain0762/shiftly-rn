import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  ActivitiesCard,
  BackHeader,
  CustomDropdown,
  LinearContainer,
} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {AppStyles} from '../../../theme/appStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import NotificationCard from '../../../component/employe/NotificationCard';
import {IMAGES} from '../../../assets/Images';
import Stepper from '../../../component/employe/Stepper';

const educationOptions = [
  {label: 'High School', value: 'high_school'},
  {label: 'Diploma', value: 'diploma'},
  {label: "Bachelor's Degree", value: 'bachelor'},
  {label: "Master's Degree", value: 'master'},
  {label: 'PhD', value: 'phd'},
];

const CreateProfileScreen = () => {
  const [activeStep, setActiveStep] = useState(1);

  const [education, setEducation] = useState(__DEV__ ? 'diploma ' : '');

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <View style={styles.topConrainer}>
        <BackHeader
          containerStyle={styles.header}
          isRight={true}
          title={'Create Your Profile'}
          RightIcon={<View />}
        />
      </View>
      <Stepper activeStep={activeStep} setActiveStep={setActiveStep} />

      <View style={{paddingHorizontal: 29}}>
        <CustomDropdown
          data={educationOptions}
          label="Preferred Position"
          placeholder={'Select preferred position'}
          value={education}
          container={{marginBottom: 15}}
          disable={false}
          onChange={selectedItem => {
            setEducation(selectedItem?.value);
          }}
        />
      </View>
    </LinearContainer>
  );
};

export default CreateProfileScreen;

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
  topConrainer: {
    paddingHorizontal: wp(25),
    paddingTop: hp(18),
    paddingBottom: hp(5),
    // borderBottomWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.8)',
  },
});
