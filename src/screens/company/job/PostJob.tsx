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
import React, {useCallback, useEffect, useState} from 'react';
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
import {
  errorToast,
  IMAGE_URL,
  navigateTo,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {RFValue} from 'react-native-responsive-fontsize';
import BottomModal from '../../../component/common/BottomModal';
import EmplyoeeCard from '../../../component/employe/EmplyoeeCard';
import {useCreateJobMutation} from '../../../api/authApi';
import {getAsyncUserLocation} from '../../../utils/asyncStorage';
import {
  useGetBusinessTypesQuery,
  useGetServicesQuery,
  useGetSkillsQuery,
  useGetSuggestedEmployeesQuery,
} from '../../../api/dashboardApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../../redux/hooks';
import {
  resetJobFormState,
  selectJobForm,
  setCoPostJobSteps,
} from '../../../features/companySlice';
import useJobFormUpdater from '../../../hooks/useJobFormUpdater';

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

// const jobSectorData = [
//   {label: 'Hospitality', value: 'hospitality'},
//   {label: 'Construction', value: 'construction'},
//   {label: 'Retail', value: 'retail'},
//   {label: 'Healthcare', value: 'healthcare'},
//   {label: 'Education', value: 'education'},
//   {label: 'IT & Technology', value: 'it_technology'},
// ];

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

// const requirements = [
//   'Experienced in figma or Sketch.',
//   'Able to work in large or small team.',
//   'At least 1 year of working experience in agancy. freelance, or start-up.',
//   'Able to keep up with the lastest trends.',
//   'Have relevant experience for at least 3 years with diploma on institute.',
//   'Able to keep up with the lastest trends.',
// ];

const PostJob = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  // const [title, setTitle] = useState('');
  // const [type, setType] = useState({label: 'Full-time', value: 'full_time'});
  // const [area, setArea] = useState({
  //   label: 'Dubai Marina',
  //   value: 'dubai_marina',
  // });
  // const [duration, setDuration] = useState({
  //   label: '1 Month',
  //   value: '1_month',
  // });
  // const [job, setJob] = useState({label: 'Hospitality', value: 'hospitality'});
  // const [startDate, setStartDate] = useState({
  //   label: 'Immediately',
  //   value: 'immediately',
  // });
  // const [contract, setContract] = useState({
  //   label: 'Full-time experience',
  //   value: 'full_time',
  // });
  // const [salary, setSalary] = useState({
  //   label: '2,000 - 5,000',
  //   value: '2000-5000',
  // });
  // const [currency, setCurrency] = useState({label: 'AED', value: 'aed'});
  // const [position, setPosition] = useState({label: '1', value: '1'});
  // const [describe, setDescribe] = useState('');
  // const [selected, setSelected] = useState<any>([]);
  // const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // const [isSuccessModalVisible, setIsSuccessModalVisible] =
  //   useState<boolean>(false);
  // const [jobSkills, setJobSkills] = useState<string[]>([]);
  // const [skillId, setSkillId] = useState<string | any>([]);
  // const [requirements, setRequirements] = useState<string[]>([]);
  // const [requirementText, setRequirementText] = useState<string>('');
  // const [isSelected, setIsSelected] = useState<boolean>(false);
  const {
    title,
    type,
    area,
    duration,
    job,
    startDate,
    contract,
    salary,
    currency,
    position,
    describe,
    selected,
    jobSkills,
    skillId,
    requirements,
    requirementText,
    isSuccessModalVisible,
    isModalVisible,
    canApply,
  } = useAppSelector(selectJobForm);
  const {updateJobForm} = useJobFormUpdater();
  const [createJob] = useCreateJobMutation();
  const {data: servicesData} = useGetServicesQuery({});
  const services = servicesData?.data?.services;
  const {data: skillsData} = useGetSkillsQuery({});
  const skills = skillsData?.data?.skills as any[];
  const {data: businessTypesData} = useGetBusinessTypesQuery({});
  const businessTypes = businessTypesData?.data?.types as any[];
  const steps = useAppSelector((state: any) => state.company.coPostJobSteps);
  const shouldSkip = !(steps === 5 && skillId.length > 0);
  const {data: suggestedData, isLoading: isSuggestedLoading} =
    useGetSuggestedEmployeesQuery(skillId, {skip: shouldSkip});
  const suggestedEmployeeList = suggestedData?.data?.users;
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);

  const dropdownBusinessTypesOptions = businessTypes?.map(item => ({
    label: item.title,
    value: item._id,
  }));

  const [userAddress, setUserAddress] = useState<
    | {
        address: string;
        lat: number;
        lng: number;
        state: string;
        country: string;
      }
    | undefined
  >();
  console.log('🔥 ~ PostJob ~ userAddress:', userAddress);

  const getUserLocation = async () => {
    try {
      const locationString = await AsyncStorage.getItem('user_location');
      if (locationString !== null) {
        const location = JSON.parse(locationString);
        setUserAddress(location);
        console.log('Retrieved location:', location);
        return location;
      }
    } catch (error) {
      console.error('Failed to retrieve user location:', error);
    }
    return null;
  };

  useFocusEffect(
    useCallback(() => {
      getUserLocation();
    }, []),
  );

  useEffect(() => {
    if (dropdownBusinessTypesOptions?.length) {
      updateJobForm({job: dropdownBusinessTypesOptions[0]});
    }
  }, [businessTypes]);

  const [location, setLocation] = useState<
    | {
        latitude: number;
        longitude: number;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const res = await getAsyncUserLocation();
    if (res) {
      setLocation(res);
    }
  };

  const handleCreateJob = async () => {
    const params = {
      title: title,
      description: describe,
      job_type: type?.label,
      area: area?.value,
      address: userAddress?.address,
      lat: location?.latitude,
      lng: location?.longitude,
      people_anywhere: canApply,
      duration: duration?.value,
      job_sector: job?.value,
      start_date: startDate?.value,
      contract_type: contract?.value,
      monthly_salary_from: salary?.value.split('-')[0],
      monthly_salary_to: salary?.value.split('-')[1],
      no_positions: position?.value,
      skills: skillId?.join(','),
      facilities: selected?.map((item: any) => item._id).join(','),
      requirements: requirements?.join(','),
      invite_users: selectedEmployeeIds?.map((item: any) => item._id).join(','),
    };

    try {
      const response = await createJob(params).unwrap();
      if (response?.status) {
        // dispatch(setCoPostJobSteps(0));
        successToast(response?.message);
      }
      console.log('Job created:', response);
    } catch (err) {
      console.error('Failed to create job:', err);
    } finally {
      updateJobForm({isSuccessModalVisible: true});
    }
  };

  const toggleItem = (item: any) => {
    const updatedList = selected.includes(item)
      ? selected.filter((i: any) => i !== item)
      : [...selected, item];

    updateJobForm({selected: updatedList});
  };

  const nextStep = () => dispatch(setCoPostJobSteps(steps + 1));

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    }
    dispatch(setCoPostJobSteps(steps - 1));
  };

  const resetToFirstStep = () => dispatch(setCoPostJobSteps(0));

  const handleAddRequirements = () => {
    // Keyboard.dismiss();
    if (!requirementText) {
      return;
    }
    updateJobForm({requirementText: '', isModalVisible: false});
    const trimmedText = requirementText.trim();
    if (trimmedText) {
      updateJobForm({requirements: [...requirements, trimmedText]});
    }
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = jobSkills.filter(s => s !== skill);
    updateJobForm({jobSkills: updatedSkills});
  };

  const handleSkillSelection = (skill: string) => {
    if (jobSkills.includes(skill)) {
      const filtered = jobSkills.filter(i => i !== skill);
      updateJobForm({jobSkills: filtered});
    } else {
      updateJobForm({jobSkills: [...jobSkills, skill]});
    }
  };

  const toggleSkillId = (id: string) => {
    if (skillId.includes(id)) {
      const updated = skillId.filter((i: string) => i !== id);
      updateJobForm({skillId: updated});
    } else {
      updateJobForm({skillId: [...skillId, id]});
    }
  };

  const handleEmployeeSelection = (id: string) => {
    setSelectedEmployeeIds(prev =>
      prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id],
    );
  };

  const render = () => {
    switch (steps) {
      case 1:
        return (
          <>
            <View style={styles.Backheader}>
              <TouchableOpacity onPress={() => prevStep()}>
                <Image source={IMAGES.backArrow} style={styles.back} />
              </TouchableOpacity>
              <TouchableOpacity onPress={resetToFirstStep}>
                <Image source={IMAGES.close} style={styles.close} />
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <View>
                <View style={styles.rowWithInfo}>
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
                  onChangeText={e => updateJobForm({describe: e})}
                  placeholder={'Describe'}
                  style={styles.input1}
                  multiline
                  maxLength={1000}
                  placeholderTextColor={colors._7B7878}
                  containerStyle={styles.inputContainer}
                />
                <Text
                  style={
                    styles.characterCount
                  }>{`${describe?.length}/1000 Characters`}</Text>
              </View>
              <GradientButton
                type="Company"
                style={styles.btn}
                title={t('Continue')}
                onPress={() => {
                  // if (!describe.trim()) {
                  //   errorToast('Please enter description');
                  //   return;
                  // }
                  nextStep();
                }}
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
              <TouchableOpacity onPress={resetToFirstStep}>
                <Image source={IMAGES.close} style={styles.close} />
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <View>
                <Text style={styles.inputLabelWithMargin}>
                  {t('Add Job Skills')}
                </Text>

                {/* Show selected skills as tags with close */}
                <View style={styles.selectedSkillsContainer}>
                  {jobSkills.length === 0 ? (
                    <Text style={styles.placeholderText}>
                      {t('Select job skills')}
                    </Text>
                  ) : (
                    jobSkills.map((skill, index) => (
                      <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                        <Pressable
                          onPress={() => removeSkill(skill)}
                          style={styles.closeBtn}>
                          <Text style={styles.closeText}>×</Text>
                        </Pressable>
                      </View>
                    ))
                  )}

                  <View style={styles.bottomUnderline} />
                </View>

                <ScrollView style={styles.skillsScrollView}>
                  <View style={styles.skillsWrapper}>
                    {skills.map((item, index) => {
                      return (
                        <Pressable
                          key={index}
                          onPress={() => {
                            toggleSkillId(item._id);
                            handleSkillSelection(item.title);
                          }}
                          style={[
                            styles.skillOption,
                            jobSkills.includes(item.title) && {
                              backgroundColor: colors._0B3970,
                            },
                          ]}>
                          <Text style={styles.skillOptionText}>
                            {item.title}
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
                onPress={() => {
                  if (jobSkills?.length === 0) {
                    errorToast('Please select at least one skill');
                    return;
                  }
                  nextStep();
                }}
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
              <Text style={styles.inputLabelLarge}>
                {t('Create Requirements')}
              </Text>
              <View />
            </View>
            <View style={styles.requirementsContainer}>
              <Text style={styles.inputLabelLarge}>{t('Requirements')}</Text>

              <View style={styles.requirementsList}>
                {requirements?.map((item, index) => {
                  return (
                    <>
                      <View key={index} style={styles.boxContainer}>
                        <View style={styles.checkRound}>
                          <Image source={IMAGES.mark} style={styles.markIcon} />
                        </View>
                        <Text style={styles.requirementText} numberOfLines={2}>
                          {item}
                        </Text>
                      </View>
                    </>
                  );
                })}
              </View>

              <Pressable
                onPress={() => updateJobForm({isModalVisible: true})}
                style={styles.addRequirementButton}>
                <View style={styles.checkRound}>
                  <Image
                    source={IMAGES.close1}
                    style={styles.closeIcon}
                    tintColor={colors.white}
                  />
                </View>
                <Text style={styles.addRequirementText}>
                  {t('Add New Requirements')}
                </Text>
              </Pressable>
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Continue')}
                onPress={() => {
                  // if (requirements?.length === 0) {
                  //   errorToast('Please add at least one requirement');
                  //   return;
                  // }
                  nextStep();
                }}
              />
            </View>
            <BottomModal
              visible={isModalVisible}
              onClose={() => {
                updateJobForm({isModalVisible: false});
              }}>
              <Pressable
                onPress={() => {
                  updateJobForm({requirementText: '', isModalVisible: false});
                }}>
                <Image
                  source={IMAGES.close}
                  style={styles.modalCloseIcon}
                  tintColor={colors.black}
                />
              </Pressable>
              <Text
                onPress={() => updateJobForm({isModalVisible: true})}
                style={styles.modalTitleText}>
                {t('Add New Requirements')}
              </Text>
              <CustomTextInput
                multiline
                maxLength={400}
                value={requirementText}
                onChangeText={text => updateJobForm({requirementText: text})}
                containerStyle={styles.modalInputContainer}
                placeholder={t('Write requirements')}
                inputStyle={styles.modalInputStyle}
              />
              <Text
                style={
                  styles.characterCount
                }>{`${requirementText?.length}/400 Characters`}</Text>
              <GradientButton
                type="Company"
                style={styles.btn}
                onPress={handleAddRequirements}
                title={t('Add Requirement')}
              />
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
              <TouchableOpacity onPress={resetToFirstStep}>
                <Image source={IMAGES.close} style={styles.close} />
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <View>
                <Text style={styles.inputLabelWithMargin}>
                  {t('You will Provide')}
                </Text>
                <FlatList
                  data={services}
                  keyExtractor={(_, index) => index.toString()}
                  contentContainerStyle={styles.providerContainer}
                  renderItem={({item, index}) => {
                    const isChecked = selected.includes(item);
                    return (
                      <Pressable
                        key={index}
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
                        <Text style={styles.Providerlabel}>{item?.title}</Text>
                      </Pressable>
                    );
                  }}
                />
              </View>
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Post')}
                onPress={() => nextStep()}
              />
            </View>
          </>
        );
      case 5:
        return (
          <>
            <View style={styles.empContainer}>
              <View style={styles.empHeader}>
                <BackHeader
                  type={'company'}
                  RightIconStyle={styles.rightIcon}
                  title={t('Suggested Employee')}
                  RightIcon={<Image source={IMAGES.bell} />}
                  onBackPress={() => prevStep()}
                />

                <View style={styles.card}>
                  <Image source={{uri: IMAGE_URL}} style={styles.avatar} />
                  <View style={styles.textContainer}>
                    <Text style={styles.empTitle}>{title || 'N/A'}</Text>
                    <Text style={styles.empSubtitle}>
                      {userAddress?.address || 'Atlantis, The Palm, Dubai'}
                    </Text>
                    <View style={styles.empRow}>
                      <Text style={styles.location}>
                        {`${userAddress?.state}, ${userAddress?.country} - ${
                          type?.label || 'Full-Time'
                        }`}
                      </Text>
                      <Text style={styles.salary}>{`AED ${
                        salary?.label?.split('-')[1]
                      }`}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    {t('Suggested Employee')}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      if (selectedEmployeeIds?.length) {
                        setSelectedEmployeeIds([]);
                      } else {
                        setSelectedEmployeeIds(
                          suggestedEmployeeList.map((item: any) => item._id),
                        );
                      }
                    }}
                    style={styles.inviteButton}>
                    <Image source={IMAGES.invite_all} />
                    <Text style={styles.inviteText}>{t('Invite All')}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <FlatList
                data={suggestedEmployeeList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item, index}) => {
                  return (
                    <View>
                      <EmplyoeeCard
                        key={index}
                        name={item?.name}
                        selected={selectedEmployeeIds.includes(item._id)}
                        picture={item?.picture}
                        responsibility={item?.responsibility}
                        onPressEmployee={() => {
                          handleEmployeeSelection(item?._id);
                        }}
                      />
                    </View>
                  );
                }}
              />

              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Submit')}
                onPress={() => {
                  handleCreateJob();
                }}
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
      {steps == 0 && (
        <BackHeader
          type="company"
          isRight={false}
          titleStyle={styles.title}
          title={t('Post your job')}
          containerStyle={styles.header}
        />
      )}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={AppStyles.flex}
        contentContainerStyle={styles.scrollContainer}>
        {steps == 0 && (
          <>
            <View>
              <View style={styles.field}>
                <Text style={styles.label}>{t('Job Title')}</Text>
                <CustomTextInput
                  value={title}
                  onChangeText={e => updateJobForm({title: e})}
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
                  onChange={(e: any) => {
                    updateJobForm({type: e});
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
                  onChange={(e: any) => {
                    updateJobForm({area: e});
                  }}
                  dropdownStyle={styles.dropdown}
                  renderRightIcon={IMAGES.ic_down}
                  RightIconStyle={styles.rightIcon}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </View>
              <LocationContainer
                address={userAddress?.address}
                onPressMap={() => {
                  navigateTo(SCREENS.LocationScreen);
                }}
                containerStyle={styles.map}
                lat={userAddress?.lat}
                lng={userAddress?.lng}
              />
              <Pressable
                onPress={() => {
                  updateJobForm({canApply: !canApply});
                }}
                style={styles.peopleRow}>
                <Image
                  style={styles.check}
                  source={canApply ? IMAGES.check_circle : IMAGES.blank_circle}
                />
                <Text style={styles.peopleTitle}>
                  {t('People from anywhere can apply')}
                </Text>
              </Pressable>
              <View style={styles.fieldWithMargin}>
                <Text style={styles.label}>{t('Add Duration')}</Text>
                <CustomDropdown
                  data={durationData}
                  labelField="label"
                  valueField="value"
                  value={duration}
                  onChange={(e: any) => {
                    updateJobForm({duration: e});
                  }}
                  dropdownStyle={styles.dropdown}
                  renderRightIcon={IMAGES.ic_down}
                  RightIconStyle={styles.rightIcon}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>{t('Job Sector/Industry')}</Text>
                <CustomDropdown
                  data={dropdownBusinessTypesOptions}
                  labelField="label"
                  valueField="value"
                  value={job}
                  onChange={(e: any) => {
                    updateJobForm({job: e});
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
                  onChange={(e: any) => {
                    updateJobForm({startDate: e});
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
                  onChange={(e: any) => {
                    updateJobForm({contract: e});
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
                    onChange={(e: any) => {
                      updateJobForm({salary: e});
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
                    onChange={(e: any) => {
                      updateJobForm({currency: e});
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
                  onChange={(e: any) => {
                    updateJobForm({position: e});
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
              onPress={() => {
                if (!title.trim()) {
                  errorToast(t('Please enter a valid title'));
                  return;
                }
                nextStep();
              }}
            />
          </>
        )}
        {render()}
      </KeyboardAwareScrollView>
      <BottomModal
        visible={isSuccessModalVisible}
        backgroundColor={colors._FAEED2}
        onClose={() => {}}>
        <View style={styles.modalIconWrapper}>
          <Image
            source={IMAGES.check}
            tintColor={colors._FAEED2}
            style={styles.modalCheckIcon}
          />
        </View>

        <View>
          <Text style={styles.modalTitle}>{'Job Posted Successfully'}</Text>
          <Text style={styles.modalSubtitle}>
            {
              "We're excited to post your job. get ready to start receiving profiles."
            }
          </Text>
        </View>

        <GradientButton
          style={styles.btn}
          type="Company"
          title={t('View Listing')}
          onPress={() => {
            dispatch(resetJobFormState());
            dispatch(setCoPostJobSteps(0));
            navigationRef?.current?.goBack();
          }}
        />

        <Text
          onPress={() => {
            dispatch(resetJobFormState());
            dispatch(setCoPostJobSteps(0));
            updateJobForm({isSuccessModalVisible: false});
            resetNavigation(SCREENS.CoTabNavigator);
          }}
          style={styles.modalHomeText}>
          {'Home'}
        </Text>
      </BottomModal>
    </LinearContainer>
  );
};

export default PostJob;

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
  fieldWithMargin: {
    gap: hp(12),
    marginBottom: hp(14),
    marginTop: hp(16),
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
  peopleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: hp(12),
    gap: wp(8),
  },
  rowWithInfo: {
    justifyContent: 'space-between',
    marginTop: hp(30),
    alignItems: 'center',
    flexDirection: 'row',
  },
  salaryrow: {
    flex: 1,
    gap: wp(16),
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: hp(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  inputLabelWithMargin: {
    ...commonFontStyle(500, 25, colors._0B3970),
    marginTop: hp(40),
  },
  inputLabelLarge: {
    ...commonFontStyle(500, 25, colors._0B3970),
    fontSize: RFValue(20, SCREEN_HEIGHT),
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
  characterCount: {
    marginTop: hp(15),
    alignSelf: 'flex-end',
    ...commonFontStyle(400, 16, colors._4A4A4A),
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
  markIcon: {
    width: wp(12),
    height: hp(12),
    resizeMode: 'contain',
  },
  requirementText: {
    width: '90%',
    color: colors._4A4A4A,
    fontSize: RFValue(16, SCREEN_HEIGHT),
  },
  addRequirementButton: {
    marginTop: hp(40),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: hp(1.5),
    borderRadius: hp(10),
    paddingVertical: hp(17),
    paddingHorizontal: wp(18),
    borderColor: colors._C9B68B,
  },
  closeIcon: {
    width: wp(18),
    height: hp(18),
    resizeMode: 'contain',
  },
  addRequirementText: {
    textAlign: 'center',
    color: colors._4A4A4A,
    fontSize: RFValue(18, SCREEN_HEIGHT),
  },
  requirementsContainer: {
    flex: 1,
    marginTop: hp(20),
  },
  requirementsList: {
    marginTop: hp(16),
  },
  modalCloseIcon: {
    width: wp(18),
    height: hp(18),
    alignSelf: 'flex-end',
    resizeMode: 'contain',
  },
  modalTitleText: {
    color: colors.black,
    fontSize: RFValue(18, SCREEN_HEIGHT),
  },
  modalInputContainer: {
    height: hp(100),
    padding: hp(18),
    marginTop: hp(29),
    borderWidth: wp(1.5),
    borderRadius: wp(10),
    borderColor: colors._D5D5D5,
  },
  modalInputStyle: {
    ...commonFontStyle(400, 18, '#8F8D8D'),
    alignSelf: 'baseline',
  },
  empContainer: {
    flex: 1,
    // backgroundColor: colors._F4E2B8
  },
  empHeader: {
    marginTop: hp(15),
  },
  empScrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(20),
  },
  card: {
    gap: wp(14),
    padding: hp(14),
    marginTop: hp(10),
    flexDirection: 'row',
    borderRadius: wp(20),
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  avatar: {
    width: wp(56),
    height: hp(56),
    borderRadius: wp(56),
  },
  avatar2: {
    width: wp(100),
    height: hp(100),
    borderRadius: wp(10),
  },
  textContainer: {
    flex: 1,
    gap: hp(5),
  },
  empTitle: {
    ...commonFontStyle(700, 20, colors._0B3B75),
  },
  empSubtitle: {
    ...commonFontStyle(400, 16, colors._4A4A4A),
  },
  empRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    // width: '70%',
    flex: 1,
    ...commonFontStyle(400, 15, colors._939393),
  },
  salary: {
    ...commonFontStyle(700, 16, colors._0D468C),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(22),
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...commonFontStyle(700, 20, colors._4A4A4A),
  },
  inviteButton: {
    backgroundColor: colors._0B3970,
    borderRadius: wp(50),
    paddingVertical: hp(10),
    paddingHorizontal: wp(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(5),
  },
  inviteText: {
    ...commonFontStyle(400, 12.5, colors.white),
  },
  modalIconWrapper: {
    width: wp(90),
    height: hp(90),
    alignSelf: 'center',
    borderRadius: wp(90),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors._0B3970,
  },
  modalCheckIcon: {
    width: wp(30),
    height: hp(30),
    borderRadius: wp(30),
  },
  modalTitle: {
    textAlign: 'center',
    marginVertical: hp(16),
    ...commonFontStyle(600, 25, colors.black),
  },
  modalSubtitle: {
    textAlign: 'center',
    ...commonFontStyle(400, 18, colors._6B6B6B),
  },
  modalHomeText: {
    marginBottom: hp(20),
    textAlign: 'center',
    ...commonFontStyle(400, 19, colors._B4B4B4),
  },
  selectedSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp(35),
    marginBottom: hp(5),
    gap: wp(8),
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors._061F3D,
    borderRadius: hp(20),
    paddingHorizontal: wp(10),
    paddingVertical: hp(6),
  },
  skillText: {
    ...commonFontStyle(400, 14, colors.white),
    marginRight: wp(5),
  },
  closeBtn: {
    backgroundColor: colors.white,
    borderRadius: 50,
    width: wp(16),
    height: wp(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    ...commonFontStyle(500, 12, colors._061F3D),
  },
  skillOption: {
    backgroundColor: colors._061F3D,
    borderRadius: hp(20),
    padding: hp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(8),
    marginBottom: hp(8),
    paddingHorizontal: wp(15),
  },
  skillOptionText: {
    ...commonFontStyle(400, 15, colors.white),
  },
  placeholderText: {
    ...commonFontStyle(400, 22, colors._7B7878),
  },
  bottomUnderline: {
    width: '100%',
    height: hp(1.5),
    backgroundColor: colors._7B7878,
    marginTop: hp(10),
  },
  skillsScrollView: {
    marginTop: hp(38),
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
