import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  BackHeader,
  CustomDropdown,
  CustomTextInput,
  GradientButton,
  LinearContainer,
  LocationContainer,
} from '../../../component';
import {useTranslation} from 'react-i18next';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  commonFontStyle,
  hp,
  wp,
} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {IMAGES} from '../../../assets/Images';
import {AppStyles} from '../../../theme/appStyles';
import {navigationRef} from '../../../navigation/RootContainer';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREEN_NAMES} from '../../../navigation/screenNames';
import {RFValue} from 'react-native-responsive-fontsize';
import BottomModal from '../../../component/common/BottomModal';
import CustomInput from '../../../component/common/CustomInput';

const jobTypeData = [
  {label: 'Full-time', value: 'full_time'},
  {label: 'Part-time', value: 'part_time'},
  {label: 'Freelance', value: 'freelance'},
  {label: 'Internship', value: 'internship'},
  {label: 'Temporary', value: 'temporary'},
];

const jobAreaData = [
  {label: 'Dubai Marina', value: 'dubai_marina'},
  {label: 'Business Bay', value: 'business_bay'},
  {label: 'Downtown Dubai', value: 'downtown_dubai'},
  {label: 'Jumeirah', value: 'jumeirah'},
  {label: 'Al Barsha', value: 'al_barsha'},
];

const durationData = [
  {label: '1 Month', value: '1_month'},
  {label: '3 Months', value: '3_months'},
  {label: '6 Months', value: '6_months'},
  {label: '12 Months', value: '12_months'},
  {label: 'Permanent', value: 'permanent'},
];

const jobSectorData = [
  {label: 'Hospitality', value: 'hospitality'},
  {label: 'Construction', value: 'construction'},
  {label: 'Retail', value: 'retail'},
  {label: 'Healthcare', value: 'healthcare'},
  {label: 'Education', value: 'education'},
  {label: 'IT & Technology', value: 'it_technology'},
];

const startDateData = [
  {label: 'Immediately', value: 'immediately'},
  {label: 'Within 3 Days', value: 'within_3_days'},
  {label: 'Within a Week', value: 'within_week'},
  {label: 'Next Month', value: 'next_month'},
];

const contractTypeData = [
  {label: 'Full-time experience', value: 'full_time'},
  {label: 'Part-time experience', value: 'part_time'},
  {label: 'Contractual', value: 'contractual'},
  {label: 'Probation Period', value: 'probation'},
];

const numberOfPositionsData = [
  {label: '1', value: '1'},
  {label: '2', value: '2'},
  {label: '3', value: '3'},
  {label: '4', value: '4'},
  {label: '5+', value: '5_plus'},
];

const salaryRangeData = [
  {label: '2,000 - 5,000', value: '2000-5000'},
  {label: '5,000 - 10,000', value: '5000-10000'},
  {label: '10,000 - 15,000', value: '10000-15000'},
  {label: '15,000 - 20,000', value: '15000-20000'},
  {label: '20,000+', value: '20000plus'},
];

const currencyData = [
  {label: 'AED', value: 'aed'},
  {label: 'USD', value: 'usd'},
  {label: 'EUR', value: 'eur'},
  {label: 'INR', value: 'inr'},
  {label: 'GBP', value: 'gbp'},
];

const benefitsOptions = [
  'Accommodation',
  'Flight Ticket',
  'Insurance',
  'Transportation',
  'Meals',
  'Commission',
  'Service Charge',
  'Tips',
  'Visa',
  'Career progression',
  'Training & development',
];

const jobSkills = [
  'Hotel Management',
  'Marketing',
  'Music',
  'Engineer',
  'Programming',
  'Finance',
];

const requirements = [
  'Experienced in figma or Sketch.',
  'Able to work in large or small team.',
  'At least 1 year of working experience in agancy. freelance, or start-up.',
  'Able to keep up with the lastest trends.',
  'Have relevant experience for at least 3 years with diploma on institute.',
  'Able to keep up with the lastest trends.',
];

const CoJob = () => {
  const {t} = useTranslation();
  const [title, setTitle] = useState('');
  const [type, setType] = useState({label: 'Full-time', value: 'full_time'});
  const [area, setArea] = useState({
    label: 'Dubai Marina',
    value: 'dubai_marina',
  });
  const [duration, setDuration] = useState({
    label: '1 Month',
    value: '1_month',
  });
  const [job, setJob] = useState({label: 'Hospitality', value: 'hospitality'});
  const [startDate, setStartDate] = useState({
    label: 'Immediately',
    value: 'immediately',
  });
  const [contract, setContract] = useState({
    label: 'Full-time experience',
    value: 'full_time',
  });
  const [salary, setSalary] = useState({
    label: '2,000 - 5,000',
    value: '2000-5000',
  });
  const [currency, setCurrency] = useState({label: 'AED', value: 'aed'});
  const [position, setPosition] = useState({label: '1', value: '1'});
  const [step, setStep] = useState(0);
  const [describe, setDescribe] = useState('');
  const [selected, setSelected] = useState(['Accommodation']);
  const [selectedJobSkills, setSelectedJobSkills] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const toggleItem = (item: any) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  const nextStep = () => setStep(prev => prev + 1);

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    }
    setStep(prev => prev - 1);
  };

  const handleSkillSelection = (skill: string) => {
    if (!selectedJobSkills.includes(skill)) {
      setSelectedJobSkills(prev => [...prev, skill]);
    }
  };

  const render = () => {
    switch (step) {
      case 1:
        return (
          <>
            <View style={styles.Backheader}>
              <TouchableOpacity onPress={() => prevStep()}>
                <Image source={IMAGES.backArrow} style={styles.back} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(0)}>
                <Image source={IMAGES.close} style={styles.close} />
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <View>
                <View
                  style={[
                    styles.row,
                    {justifyContent: 'space-between', marginTop: hp(30)},
                  ]}>
                  <Text style={styles.inputLabel}>
                    {t('Describe the role')}
                  </Text>
                  <TouchableOpacity hitSlop={10}>
                    <Image
                      source={IMAGES.info}
                      resizeMode="contain"
                      style={styles.info}
                    />
                  </TouchableOpacity>
                </View>
                <CustomTextInput
                  value={describe}
                  onChange={e => setDescribe(e)}
                  placeholder={'Describe'}
                  style={styles.input1}
                  multiline
                  placeholderTextColor={colors._7B7878}
                  containerStyle={styles.inputContainer}
                />
              </View>
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Continue')}
                onPress={() => nextStep()}
              />
            </View>
          </>
        );
      case 2:
        return (
          <>
            <View style={styles.Backheader}>
              <TouchableOpacity onPress={() => prevStep()}>
                <Image source={IMAGES.backArrow} style={styles.back} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(0)}>
                <Image source={IMAGES.close} style={styles.close} />
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <View>
                <Text style={[styles.inputLabel, {marginTop: hp(40)}]}>
                  {t('Add Job Skills')}
                </Text>
                <CustomTextInput
                  value={selectedJobSkills.join(', ')}
                  editable={false}
                  style={styles.input1}
                  multiline
                  placeholder="Select job skills"
                  placeholderTextColor={colors._7B7878}
                  containerStyle={styles.inputContainer}
                />

                <ScrollView style={{marginTop: hp(38)}}>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {jobSkills.map((item, index) => {
                      return (
                        <Pressable
                          key={index}
                          onPress={() => handleSkillSelection(item)}
                          style={[
                            {
                              backgroundColor: colors._061F3D,
                              borderRadius: hp(20),
                              padding: hp(10),
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: wp(8),
                              marginBottom: hp(8),
                              paddingHorizontal: wp(15),
                            },
                          ]}>
                          <Text
                            style={[
                              styles.inputLabel,
                              {color: colors.white, fontSize: hp(15)},
                            ]}>
                            {item}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Continue')}
                onPress={() => nextStep()}
              />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <View style={styles.Backheader}>
              <TouchableOpacity onPress={() => prevStep()}>
                <Image source={IMAGES.backArrow} style={styles.back} />
              </TouchableOpacity>
              <Text
                style={[
                  styles.inputLabel,
                  {fontSize: RFValue(20, SCREEN_HEIGHT)},
                ]}>
                {t('Create Requirements')}
              </Text>
              <View />
            </View>
            <View style={[{flex: 1, marginTop: hp(20)}]}>
              <Text
                style={[
                  styles.inputLabel,
                  {fontSize: RFValue(20, SCREEN_HEIGHT)},
                ]}>
                {t('Requirements')}
              </Text>

              <View style={{marginTop: hp(16)}}>
                {requirements.map((item, index) => {
                  return (
                    <>
                      <View style={styles.boxContainer}>
                        <View style={styles.checkRound}>
                          <Image
                            source={IMAGES.mark}
                            style={{
                              width: wp(12),
                              height: hp(12),
                              resizeMode: 'contain',
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            width: '90%',
                            color: colors._4A4A4A,
                            fontSize: RFValue(16, SCREEN_HEIGHT),
                          }}
                          numberOfLines={2}>
                          {item}
                        </Text>
                      </View>
                    </>
                  );
                })}
              </View>

              <Pressable
                onPress={() => setIsModalVisible(true)}
                style={[
                  styles.boxContainer,
                  {
                    marginTop: hp(40),
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <View style={styles.checkRound}>
                  <Image
                    source={IMAGES.close1}
                    style={{
                      width: wp(18),
                      height: hp(18),
                      resizeMode: 'contain',
                    }}
                    tintColor={colors.white}
                  />
                </View>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors._4A4A4A,
                    fontSize: RFValue(18, SCREEN_HEIGHT),
                  }}>
                  {t('Add New Requirements')}
                </Text>
              </Pressable>
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Continue')}
                onPress={() => nextStep()}
              />
            </View>
            <BottomModal
              visible={isModalVisible}
              onClose={() => {
                setIsModalVisible(false);
              }}>
              <View>
                <Pressable onPress={() => setIsModalVisible(false)}>
                  <Image
                    source={IMAGES.close}
                    style={{
                      width: wp(18),
                      height: hp(18),
                      alignSelf: 'flex-end',
                      resizeMode: 'contain',
                    }}
                    tintColor={colors.black}
                  />
                </Pressable>
                <Text
                  onPress={() => setIsModalVisible(true)}
                  style={{
                    color: colors.black,
                    fontSize: RFValue(18, SCREEN_HEIGHT),
                  }}>
                  {t('Add New Requirements')}
                </Text>
                <CustomTextInput
                  containerStyle={{
                    height: hp(100),
                    padding: hp(18),
                    marginTop: hp(29),
                    borderWidth: wp(1.5),
                    borderRadius: wp(10),
                    borderColor: colors._D5D5D5,
                  }}
                  placeholder={t('Write requirements')}
                  inputStyle={{
                    ...commonFontStyle(400, 18, '#8F8D8D'),
                    alignSelf: 'baseline'
                  }}
                />
                <GradientButton
                  type="Company"
                  style={styles.btn}
                  onPress={() => nextStep()}
                  title={t('Add Requirement')}
                />
              </View>
            </BottomModal>
          </>
        );
      case 4:
        return (
          <>
            <View style={styles.Backheader}>
              <TouchableOpacity onPress={() => prevStep()}>
                <Image source={IMAGES.backArrow} style={styles.back} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(0)}>
                <Image source={IMAGES.close} style={styles.close} />
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <View>
                <Text style={[styles.inputLabel, {marginTop: hp(40)}]}>
                  {t('You will Provide')}
                </Text>
                <FlatList
                  data={benefitsOptions}
                  keyExtractor={item => item}
                  contentContainerStyle={styles.providerContainer}
                  renderItem={({item}) => {
                    const isChecked = selected.includes(item);
                    return (
                      <Pressable
                        onPress={() => toggleItem(item)}
                        style={styles.itemContainer}>
                        <View
                          style={[
                            styles.checkbox,
                            {borderWidth: isChecked ? 0 : 1},
                          ]}>
                          {isChecked && (
                            <Image
                              source={IMAGES.checked}
                              style={styles.checkImg}
                            />
                          )}
                        </View>
                        <Text style={styles.Providerlabel}>{item}</Text>
                      </Pressable>
                    );
                  }}
                />
              </View>
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Post')}
                onPress={() => (
                  navigateTo(SCREEN_NAMES.SuggestedEmployee), setStep(0)
                )}
              />
            </View>
          </>
        );

      default:
        break;
    }
  };

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      {step == 0 && (
        <BackHeader
          type="company"
          title={t('Post your job')}
          containerStyle={styles.header}
          isRight={false}
          titleStyle={styles.title}
        />
      )}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={AppStyles.flex}
        contentContainerStyle={styles.scrollContainer}>
        {step == 0 && (
          <>
            <View>
              <View style={styles.field}>
                <Text style={styles.label}>{t('Job Title')}</Text>
                <CustomTextInput
                  value={title}
                  onChange={e => setTitle(e)}
                  placeholder={'Job Title'}
                  style={styles.input}
                  placeholderTextColor={colors._7B7878}
                  containerStyle={styles.inputContainer}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>{t('Job Type')}</Text>
                <CustomDropdown
                  data={jobTypeData}
                  labelField="label"
                  valueField="value"
                  value={type}
                  onChange={e => {
                    setType(e);
                  }}
                  dropdownStyle={styles.dropdown}
                  renderRightIcon={IMAGES.ic_down}
                  RightIconStyle={styles.rightIcon}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>{t('Job Area')}</Text>
                <CustomDropdown
                  data={jobAreaData}
                  labelField="label"
                  valueField="value"
                  value={area}
                  onChange={e => {
                    setArea(e);
                  }}
                  dropdownStyle={styles.dropdown}
                  renderRightIcon={IMAGES.ic_down}
                  RightIconStyle={styles.rightIcon}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </View>
              <LocationContainer containerStyle={styles.map} />
              <View style={[styles.row, {paddingVertical: hp(12), gap: wp(8)}]}>
                <Image source={IMAGES.check_circle} style={styles.check} />
                <Text style={styles.peopleTitle}>
                  {t('People from anywhere can apply')}
                </Text>
              </View>
              <View style={[styles.field, {marginTop: hp(16)}]}>
                <Text style={styles.label}>{t('Add Duration')}</Text>
                <CustomDropdown
                  data={durationData}
                  labelField="label"
                  valueField="value"
                  value={duration}
                  onChange={e => {
                    setDuration(e);
                  }}
                  dropdownStyle={styles.dropdown}
                  renderRightIcon={IMAGES.ic_down}
                  RightIconStyle={styles.rightIcon}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>{t('Add Duration')}</Text>
                <CustomDropdown
                  data={jobSectorData}
                  labelField="label"
                  valueField="value"
                  value={job}
                  onChange={e => {
                    setJob(e);
                  }}
                  dropdownStyle={styles.dropdown}
                  renderRightIcon={IMAGES.ic_down}
                  RightIconStyle={styles.rightIcon}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>{t('Start date?')}</Text>
                <CustomDropdown
                  data={startDateData}
                  labelField="label"
                  valueField="value"
                  value={startDate}
                  onChange={e => {
                    setStartDate(e);
                  }}
                  dropdownStyle={styles.dropdown}
                  renderRightIcon={IMAGES.ic_down}
                  RightIconStyle={styles.rightIcon}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>{t('Type of contract')}</Text>
                <CustomDropdown
                  data={contractTypeData}
                  labelField="label"
                  valueField="value"
                  value={contract}
                  onChange={e => {
                    setContract(e);
                  }}
                  dropdownStyle={styles.dropdown}
                  renderRightIcon={IMAGES.ic_down}
                  RightIconStyle={styles.rightIcon}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>{t('Monthly Salary Offer')}</Text>
                <View style={styles.salaryrow}>
                  <CustomDropdown
                    data={salaryRangeData}
                    labelField="label"
                    valueField="value"
                    value={salary}
                    onChange={e => {
                      setSalary(e);
                    }}
                    dropdownStyle={styles.dropdown}
                    renderRightIcon={IMAGES.ic_down}
                    RightIconStyle={styles.rightIcon}
                    selectedTextStyle={styles.selectedTextStyle}
                    container={AppStyles.flex}
                  />
                  <CustomDropdown
                    data={currencyData}
                    labelField="label"
                    valueField="value"
                    value={currency}
                    onChange={e => {
                      setCurrency(e);
                    }}
                    dropdownStyle={styles.dropdown}
                    renderRightIcon={IMAGES.ic_down}
                    RightIconStyle={styles.rightIcon}
                    selectedTextStyle={styles.selectedTextStyle}
                    container={{flex: 0.5}}
                  />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>
                  {t('Number of positions available')}
                </Text>
                <CustomDropdown
                  data={numberOfPositionsData}
                  labelField="label"
                  valueField="value"
                  value={position}
                  onChange={e => {
                    setPosition(e);
                  }}
                  dropdownStyle={styles.dropdown}
                  renderRightIcon={IMAGES.ic_down}
                  RightIconStyle={styles.rightIcon}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </View>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => nextStep()}
            />
          </>
        )}
        {render()}
      </KeyboardAwareScrollView>
    </LinearContainer>
  );
};

export default CoJob;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(35),
    paddingTop: hp(26),
  },
  title: {
    marginRight: 'auto',
    marginLeft: wp(((SCREEN_WIDTH - 70) / 2) * 0.5),
  },
  field: {
    gap: hp(12),
    marginBottom: hp(14),
  },
  label: {
    ...commonFontStyle(400, 18, colors._0B3970),
  },
  input: {
    borderWidth: 2,
    borderColor: colors._234F86,
    borderRadius: 10,
    flex: 1,
    ...commonFontStyle(400, 18, colors._7B7878),
    paddingVertical: hp(16),
    paddingHorizontal: wp(23),
  },
  scrollContainer: {
    paddingHorizontal: wp(30),
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  dropdown: {
    borderRadius: 10,
  },
  rightIcon: {
    width: wp(16),
    height: hp(13),
    tintColor: colors._0B3970,
  },
  selectedTextStyle: {
    ...commonFontStyle(400, 18, colors._7B7878),
  },
  inputContainer: {
    marginBottom: hp(0),
  },
  map: {
    marginTop: hp(0),
  },
  check: {
    width: wp(28),
    height: wp(28),
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  peopleTitle: {
    ...commonFontStyle(400, 18, colors._0B3970),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  salaryrow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: wp(16),
  },
  btn: {
    marginVertical: hp(25),
  },
  back: {
    width: wp(21),
    height: wp(21),
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  Backheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(20),
  },
  close: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
  },
  info: {
    width: wp(22),
    height: wp(22),
    tintColor: '#959595',
    marginLeft: wp(12),
  },
  inputLabel: {
    ...commonFontStyle(500, 25, colors._0B3970),
  },
  input1: {
    maxHeight: hp(200),
    ...commonFontStyle(400, 22, colors._7B7878),
    marginTop: hp(20),
    borderBottomWidth: 1,
    borderBottomColor: colors._7B7878,
    flex: 1,
    paddingBottom: hp(10),
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  checkbox: {
    height: wp(24),
    width: wp(24),
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checked: {
    borderColor: '#333',
    backgroundColor: '#444',
  },
  innerDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  providerContainer: {
    paddingTop: hp(30),
  },
  Providerlabel: {
    ...commonFontStyle(400, 22, colors?._7B7878),
  },
  checkImg: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
    tintColor: colors._4A4A4A,
  },
  boxContainer: {
    marginTop: hp(17),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: hp(1.5),
    borderRadius: hp(10),
    paddingVertical: hp(17),
    paddingHorizontal: wp(18),
    borderColor: colors._C9B68B,
  },
  checkRound: {
    width: wp(24),
    height: hp(24),
    marginRight: wp(15),
    borderRadius: hp(24),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors._4A4A4A,
  },
});
