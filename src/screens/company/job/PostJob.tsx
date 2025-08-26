import {
  FlatList,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  BackHeader,
  CustomDropdown,
  CustomTextInput,
  GradientButton,
  LinearContainer,
  LocationContainer,
} from '../../../component';
import {useTranslation} from 'react-i18next';
import AnimatedSwitcher from '../../../component/common/AnimatedSwitcher';
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
  useEditCompanyJobMutation,
  useGetBusinessTypesQuery,
  useGetFacilitiesQuery,
  useGetSkillsQuery,
  useGetSuggestedEmployeesQuery,
} from '../../../api/dashboardApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../../redux/hooks';
import {
  resetJobFormState,
  selectJobForm,
  setCoPostJobSteps,
} from '../../../features/companySlice';
import useJobFormUpdater from '../../../hooks/useJobFormUpdater';
import BaseText from '../../../component/common/BaseText';

const jobTypeData = [
  {label: 'Full Time', value: 'Full Time'},
  {label: 'Part Time', value: 'Part Time'},
  {label: 'Freelance', value: 'Freelance'},
  {label: 'Internship', value: 'Internship'},
  {label: 'Temporary', value: 'Temporary'},
];

const jobAreaData = [
  {label: 'Dubai Marina', value: 'Dubai Marina'},
  {label: 'Business Bay', value: 'Business Bay'},
  {label: 'Downtown Dubai', value: 'Downtown Dubai'},
  {label: 'Jumeirah', value: 'Jumeirah'},
  {label: 'Al Barsha', value: 'Al Barsha'},
];

const durationData = [
  {label: '1 Month', value: '1 Month'},
  {label: '3 Months', value: '3 Months'},
  {label: '6 Months', value: '6 Months'},
  {label: '12 Months', value: '12 Months'},
  {label: 'Permanent', value: 'Permanent'},
];

const startDateData = [
  {label: 'Immediately', value: 'Immediately'},
  {label: 'Within 3 Days', value: 'Within 3 Days'},
  {label: 'Within a Week', value: 'Within a Week'},
  {label: 'Next Month', value: 'Next Month'},
];

const contractTypeData = [
  {label: 'Full-time experience', value: 'Full-time experience'},
  {label: 'Part-time experience', value: 'Part-time experience'},
  {label: 'Contractual', value: 'Contractual'},
  {label: 'Probation Period', value: 'Probation Period'},
];

const numberOfPositionsData = [
  {label: '1', value: '1'},
  {label: '2', value: '2'},
  {label: '3', value: '3'},
  {label: '4', value: '4'},
  {label: '5+', value: '5+'},
];

const salaryRangeData = [
  {label: '2,000 - 5,000', value: '2,000 - 5,000'},
  {label: '5,000 - 10,000', value: '5,000 - 10,000'},
  {label: '10,000 - 15,000', value: '10,000 - 15,000'},
  {label: '15,000 - 20,000', value: '15,000 - 20,000'},
  {label: '20,000+', value: '20,000+'},
];

const currencyData = [
  {label: 'AED', value: 'AED'},
  {label: 'USD', value: 'USD'},
  {label: 'EUR', value: 'EUR'},
  {label: 'INR', value: 'INR'},
  {label: 'GBP', value: 'GBP'},
];

const PostJob = () => {
  const {t} = useTranslation<any>();
  const dispatch = useDispatch<any>();
  const {
    title,
    job_type,
    area,
    duration,
    job_sector,
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
    editMode,
    job_id,
  } = useAppSelector((state: any) => selectJobForm(state));
  console.log('🔥 ~ PostJob ~ job_type:', job_type);
  const {updateJobForm} = useJobFormUpdater();
  const [createJob] = useCreateJobMutation();
  const [editJob] = useEditCompanyJobMutation();
  // const {data: servicesData} = useGetServicesQuery({});
  // const services = servicesData?.data?.services;
  const {data: facilitiesData} = useGetFacilitiesQuery({});
  const facilities = facilitiesData?.data?.facilities;
  const {data: skillsData} = useGetSkillsQuery({});
  const skills = skillsData?.data?.skills as any[];
  const {data: businessTypesData} = useGetBusinessTypesQuery({});
  const businessTypes = businessTypesData?.data?.types as any[];
  const steps = useAppSelector((state: any) => state.company.coPostJobSteps);
  const shouldSkip = !(steps === 5 && skillId.length > 0);
  const {data: suggestedData} = useGetSuggestedEmployeesQuery(skillId, {
    skip: shouldSkip,
  });
  const suggestedEmployeeList = suggestedData?.data?.users;
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const dropdownBusinessTypesOptions = businessTypes?.map(item => ({
    label: item.title,
    value: item.title,
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

  const hasInitializedJobSectorRef = useRef<boolean>(false);

  useEffect(() => {
    if (
      !hasInitializedJobSectorRef.current &&
      dropdownBusinessTypesOptions?.length > 0 &&
      !job_sector
    ) {
      updateJobForm({job_sector: dropdownBusinessTypesOptions[0]});
      hasInitializedJobSectorRef.current = true;
    }
  }, [dropdownBusinessTypesOptions, job_sector, updateJobForm]);

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

  const [from, to] = salary?.value?.split('-') || [];

  const params = {
    title: title,
    job_type: job_type?.label,
    area: area?.value,
    description: describe,
    address: userAddress?.address || 'UAE, Dubai',
    lat: location?.latitude,
    lng: location?.longitude,
    people_anywhere: canApply,
    duration: duration?.value,
    job_sector: job_sector?.value,
    start_date: startDate?.value,
    contract_type: contract?.value,
    monthly_salary_from: from ? Number(from.replace(/,/g, '').trim()) : null,
    monthly_salary_to: to ? Number(to.replace(/,/g, '').trim()) : null,
    no_positions: position?.value,
    skills: skillId?.join(','),
    facilities: selected?.map((item: any) => item._id).join(','),
    requirements: requirements?.join(','),
    invite_users: selectedEmployeeIds?.join(','),
  };
  console.log('~ >>>> handleCreateJob ~ params:', params);
  const handleCreateJob = async () => {
    try {
      let response;

      if (editMode) {
        response = await editJob({job_id: job_id, ...params}).unwrap();
        console.log('Job updated:', response?.data);
      } else {
        response = await createJob(params).unwrap();
        console.log('Job created:', response?.data);
      }

      if (response?.status) {
        setTimeout(() => {
          if (!isSuccessModalVisible) {
            updateJobForm({isSuccessModalVisible: true});
          }
        }, 150);
        successToast(response?.message);
      } else {
        errorToast(response?.message);
      }
    } catch (err) {
      console.error('Failed to submit job:', err);
      errorToast('Something went wrong!');
    } finally {
    }
  };

  const toggleItem = (item: any) => {
    const isAlreadySelected = selected?.some((i: any) => i?._id === item?._id);
    const updatedList = isAlreadySelected
      ? selected.filter((i: any) => i?._id !== item?._id)
      : [...(selected || []), item];

    updateJobForm({selected: updatedList});
  };

  const nextStep = () => dispatch(setCoPostJobSteps(steps + 1));

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    } else {
      dispatch(setCoPostJobSteps(steps - 1));
    }
  };

  const resetToFirstStep = () => dispatch(setCoPostJobSteps(0));

  const handleAddRequirements = () => {
    if (!requirementText.trim()) {
      return;
    }
    const trimmedText = requirementText.trim();
    if (trimmedText) {
      updateJobForm({requirements: [...requirements, trimmedText]});
    }
    updateJobForm({requirementText: '', isModalVisible: false});
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
                </View>
                <CustomTextInput
                  multiline
                  value={describe}
                  maxLength={1000}
                  inputStyle={styles.input1}
                  placeholderTextColor={colors._7B7878}
                  containerStyle={styles.inputContainer}
                  placeholder={t('Enter role description')}
                  onChangeText={e => updateJobForm({describe: e})}
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

              <View
                style={{}
                  // requirements?.length
                  //   ? 
                  //   styles.requirementWrapper
                  //   : 
                  //   {flexGrow: 1}
                }>
                {requirements?.length ? (
                  <FlatList
                    data={requirements}
                    contentContainerStyle={{flexGrow: 1, paddingRight: wp(10)}}
                    keyExtractor={(_, index) => index.toString()}
                    style={{flex: 1}}
                    renderItem={({item}) => (
                      <View style={styles.boxContainer}>
                        <View style={styles.checkRound}>
                          <Image source={IMAGES.mark} style={styles.markIcon} />
                        </View>
                        <Text style={styles.requirementText} numberOfLines={2}>
                          {item}
                        </Text>
                      </View>
                    )}
                    ListEmptyComponent={() => (
                      <View style={styles.emptyReqContainer}>
                        <BaseText
                          style={{...commonFontStyle(400, 16, colors.black)}}>
                          {'No requirements added yet'}
                        </BaseText>
                      </View>
                    )}
                    showsVerticalScrollIndicator={true}
                  />
                ) : (
                  <View style={styles.emptyReqContainer}>
                    <BaseText
                      style={{...commonFontStyle(400, 16, colors.black)}}>
                      {'No requirements added yet'}
                    </BaseText>
                  </View>
                )}
              </View>

              <View
                style={{
                  // width: '100%',
                  // bottom: hp(0),
                  // position: 'absolute',
                }}>
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
                  data={facilities}
                  keyExtractor={(_, index) => index.toString()}
                  contentContainerStyle={styles.providerContainer}
                  renderItem={({item, index}) => {
                    const isChecked = selected?.some(
                      (i: any) => i?._id === item?._id,
                    );
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
                  onBackPress={() => prevStep()}
                  title={t('Suggested Employee')}
                  RightIconStyle={styles.rightIcon}
                />

                <View style={styles.card}>
                  <Image source={{uri: IMAGE_URL}} style={styles.avatar} />
                  <View style={styles.textContainer}>
                    <Text style={styles.empTitle}>{title}</Text>
                    <Text style={styles.empSubtitle}>
                      {userAddress?.address}
                    </Text>
                    <View style={styles.empRow}>
                      <Text style={styles.location}>
                        {`${userAddress?.state}, ${userAddress?.country}`}
                      </Text>
                    </View>
                    <Text style={styles.location}>{job_type?.label}</Text>
                    <Text
                      style={
                        styles.salary
                      }>{`${currency?.value} ${salary?.value}`}</Text>
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
          onBackPress={() => {
            dispatch(resetJobFormState());
            navigationRef?.goBack();
          }}
        />
      )}
      <KeyboardAwareScrollView
        style={AppStyles.flex}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {/* <AnimatedSwitcher index={steps}> */}
        {steps == 0 && (
          <>
            <View>
              <View style={styles.field}>
                <Text style={styles.label}>{t('Job Title')}</Text>
                <CustomTextInput
                  value={title}
                  onChangeText={e => updateJobForm({title: e})}
                  placeholder={'Enter job title'}
                  inputStyle={styles.input}
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
                  value={job_type?.value}
                  onChange={(e: any) => {
                    updateJobForm({job_type: {label: e.label, value: e.value}});
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
                  value={area?.value}
                  onChange={(e: any) => {
                    updateJobForm({area: {label: e.label, value: e.value}});
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
                  navigateTo(SCREENS.LocationScreen, {userAddress});
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
                  source={canApply ? IMAGES.check_mark : IMAGES.circle}
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
                  value={duration?.value}
                  onChange={(e: any) => {
                    updateJobForm({duration: {label: e.label, value: e.value}});
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
                  value={job_sector?.value}
                  onChange={(e: any) => {
                    updateJobForm({
                      job_sector: {label: e.label, value: e.value},
                    });
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
                  value={startDate?.value}
                  onChange={(e: any) => {
                    updateJobForm({
                      startDate: {label: e.label, value: e.value},
                    });
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
                  value={contract?.value}
                  onChange={(e: any) => {
                    updateJobForm({contract: {label: e.label, value: e.value}});
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
                    value={salary?.value}
                    onChange={(e: any) => {
                      updateJobForm({salary: {label: e.label, value: e.value}});
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
                    value={currency?.value}
                    onChange={(e: any) => {
                      updateJobForm({
                        currency: {label: e.label, value: e.value},
                      });
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
                  value={position?.value}
                  onChange={(e: any) => {
                    updateJobForm({position: {label: e.label, value: e.value}});
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
        {steps !== 0 && render()}
        {/* </AnimatedSwitcher> */}
      </KeyboardAwareScrollView>
      <BottomModal
        visible={isSuccessModalVisible}
        backgroundColor={colors._FAEED2}
        onClose={() => {
          updateJobForm({isSuccessModalVisible: false});
        }}>
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
          title={t(editMode ? 'View Job Detail' : 'View Listing')}
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
            resetNavigation(SCREENS.CoStack, SCREENS.CoTabNavigator);
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
    flex: 1,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: hp(16),
    paddingHorizontal: wp(13),
    borderColor: colors._234F86,
    ...commonFontStyle(400, 18, colors._181818),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp(20),
    paddingHorizontal: wp(30),
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
    ...commonFontStyle(400, 18, colors._181818),
  },
  inputContainer: {
    marginBottom: hp(0),
  },
  map: {
    marginTop: hp(0),
  },
  check: {
    width: wp(22),
    height: wp(22),
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
    ...commonFontStyle(400, 22, colors._181818),
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
  requirementWrapper: {position: 'absolute', top: '5%', left: 0, right: 0},
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
    color: colors._181818,
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
  emptyReqContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: hp(120),
    justifyContent: 'center',
  },
  closeIcon: {
    width: wp(18),
    height: hp(18),
    resizeMode: 'contain',
  },
  addRequirementText: {
    textAlign: 'center',
    color: colors._181818,
    fontSize: RFValue(18, SCREEN_HEIGHT),
  },
  requirementsContainer: {
    flex: 1,
    marginTop: hp(20),
  },
  requirementsList: {
    // flex: 1,
    // marginTop: hp(16),
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
    flex: 1,
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    ...commonFontStyle(400, 18, colors._181818),
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
    marginTop: hp(22),
    marginBottom: hp(16),
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
