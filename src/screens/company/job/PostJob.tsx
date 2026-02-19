import {
  Animated,
  FlatList,
  Image,
  InteractionManager,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BackHeader,
  CustomDropdown,
  CustomTextInput,
  GradientButton,
  LocationContainer,
} from '../../../component';
import LinearContainer from '../../../component/common/LinearContainer';
import { useTranslation } from 'react-i18next';
import {
  SCREEN_HEIGHT,
  commonFontStyle,
  hp,
  wp,
} from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { IMAGES } from '../../../assets/Images';
import { AppStyles } from '../../../theme/appStyles';
import { navigationRef } from '../../../navigation/RootContainer';
import {
  errorToast,
  IMAGE_URL,
  navigateTo,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import { RFValue } from 'react-native-responsive-fontsize';
import BottomModal from '../../../component/common/BottomModal';

import EmplyoeeCard from '../../../component/employe/EmplyoeeCard';
import { useCreateJobMutation } from '../../../api/authApi';
import { getAsyncUserLocation } from '../../../utils/asyncStorage';
import { getAddress } from '../../../utils/locationHandler';
import {
  useEditCompanyJobMutation,
  useGetCompanyCertificationsQuery,
  useGetCompanyEducationsQuery,
  useGetCompanyExperiencesQuery,
  useGetCompanyLanguagesQuery,
  useGetCompanyOtherRequirementsQuery,
  useGetDepartmentsQuery,
  useGetEssentialBenefitsQuery,
  useGetSkillsQuery,
  useGetSuggestedEmployeesQuery,
} from '../../../api/dashboardApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux/hooks';
import {
  resetJobFormState,
  selectJobForm,
  setCoPostJobSteps,
} from '../../../features/companySlice';
import useJobFormUpdater from '../../../hooks/useJobFormUpdater';
import BaseText from '../../../component/common/BaseText';
import CharLength from '../../../component/common/CharLength';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Tooltip from '../../../component/common/Tooltip';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { API } from '../../../utils/apiConstant';

const contractTypeData = [
  { label: 'Full Time', value: 'Full Time' },
  { label: 'Part Time', value: 'Part Time' },
  { label: 'Freelance', value: 'Freelance' },
  { label: 'Internship', value: 'Internship' },
  { label: 'Temporary', value: 'Temporary' },
];

const durationData = [
  { label: '7 Days', value: '7 Days' },
  { label: '14 Days', value: '14 Days' },
  { label: '1 Month', value: '1 Month' },
  { label: '3 Months', value: '3 Months' },
  { label: 'Until Filled', value: 'Until Filled' },
];

const startDateData = [
  { label: 'Immediately', value: 'Immediately' },
  { label: 'Within 3 Days', value: 'Within 3 Days' },
  { label: 'Within a Week', value: 'Within a Week' },
  { label: 'Next Month', value: 'Next Month' },
];

const numberOfPositionsData = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5+', value: '5+' },
];

const salaryRangeData = [
  { label: '2,000 - 5,000', value: '2,000 - 5,000' },
  { label: '5,000 - 10,000', value: '5,000 - 10,000' },
  { label: '10,000 - 15,000', value: '10,000 - 15,000' },
  { label: '15,000 - 20,000', value: '15,000 - 20,000' },
  { label: '20,000+', value: '20,000+' },
];

const currencyData = [
  { label: 'AED', value: 'AED' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'INR', value: 'INR' },
];




const PostJob = () => {
  const { t } = useTranslation<any>();
  const dispatch = useDispatch<any>();

  const { data: educationDataVals } = useGetCompanyEducationsQuery({});
  const { data: experienceDataVals } = useGetCompanyExperiencesQuery({});
  const { data: certificationDataVals } = useGetCompanyCertificationsQuery({});
  const { data: languageDataVals } = useGetCompanyLanguagesQuery({});
  const { data: otherRequirementsDataVals } = useGetCompanyOtherRequirementsQuery({});

  const educationData = useMemo(() => {
    return educationDataVals?.data?.educations?.map((item: any) => ({ label: item?.title, value: item?._id })) || [];
  }, [educationDataVals]);

  const experienceData = useMemo(() => {
    return experienceDataVals?.data?.experiences?.map((item: any) => ({ label: item?.title, value: item?._id })) || [];
  }, [experienceDataVals]);

  const certificationData = useMemo(() => {
    return certificationDataVals?.data?.certifications?.map((item: any) => ({ label: item?.title, value: item?._id })) || [];
  }, [certificationDataVals]);

  const languageData = useMemo(() => {
    return languageDataVals?.data?.languages?.map((item: any) => ({ label: item?.title, value: item?._id })) || [];
  }, [languageDataVals]);

  const otherRequirementsData = useMemo(() => {
    return otherRequirementsDataVals?.data?.otherRequirements?.map((item: any) => ({ label: item?.title, value: item?._id })) || [];
  }, [otherRequirementsDataVals]);

  const {
    title,
    contract_type,
    area,
    duration,
    job_sector,
    startDate,
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
    expiry_date,
    education,
    experience,
    certification,
    language,
    other_requirements,
  } = useAppSelector((state: any) => selectJobForm(state));

  const insets = useSafeAreaInsets();
  const { updateJobForm } = useJobFormUpdater();
  const [createJob] = useCreateJobMutation();
  const [editJob] = useEditCompanyJobMutation();
  const { data: facilitiesData } = useGetEssentialBenefitsQuery({});
  const facilities = facilitiesData?.data?.benefits;
  const { data: skillsData } = useGetSkillsQuery({});
  const skills = skillsData?.data?.skills as any[];
  const { data: departmentsData } = useGetDepartmentsQuery({});
  const departments = departmentsData?.data?.departments as any[];
  const steps = useAppSelector((state: any) => state.company.coPostJobSteps);
  const shouldSkip = !(steps === 5 && !!job_id);
  const { data: suggestedData } = useGetSuggestedEmployeesQuery(job_id, {
    skip: shouldSkip || !job_id,
  });
  const suggestedEmployeeList = suggestedData?.data?.users;
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [createdJobId, setCreatedJobId] = useState<string>('');
  const [createdJobData, setCreatedJobData] = useState<any>(null);
  const { userInfo, getAppData } = useAppSelector((state: any) => state.auth);
  const mapKey = getAppData?.map_key || API?.GOOGLE_MAP_API_KEY;
  const [isExpiryDateManuallyChanged, setIsExpiryDateManuallyChanged] =
    useState(false);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const scrollViewRef = useRef<any>(null);
  const jobDepartmentFieldRef = useRef<View>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleJobDepartmentFocus = useCallback(() => {
    setIsDropdownOpen(true);
  }, []);

  const handleJobDepartmentBlur = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const dropdownDepartmentsOptions =
    departments?.map(item => ({
      label: item.title,
      value: item._id,
      title: item.title,
    })) || [];

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

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(async () => {
        try {
          const locationString = await AsyncStorage.getItem('user_location');
          if (locationString !== null) {
            const location = JSON.parse(locationString);
            if (location.address && location.lat && location.lng) {
              setUserAddress(location);
              updateJobForm({
                area: {
                  label: location.address,
                  value: location.address,
                  coordinates: { lat: location.lat, lng: location.lng },
                },
              });
              return;
            }
          }

          if (userInfo?.address && userInfo?.lat && userInfo?.lng) {
            setUserAddress({
              address: userInfo.address,
              lat: userInfo.lat,
              lng: userInfo.lng,
              state: userInfo.state || '',
              country: userInfo.country || '',
            });
            updateJobForm({
              area: {
                label: userInfo.address,
                value: userInfo.address,
                coordinates: { lat: userInfo.lat, lng: userInfo.lng },
              },
            });
          } else {
            const coordinates = await getAsyncUserLocation();
            if (coordinates) {
              getAddress(
                coordinates,
                (data: any) => {
                  const address = data?.results?.[0]?.formatted_address;
                  if (address) {
                    setUserAddress({
                      address,
                      lat: coordinates.latitude,
                      lng: coordinates.longitude,
                      state: '',
                      country: '',
                    });
                    // Also update the Job Area field with fetched address
                    updateJobForm({
                      area: {
                        label: address,
                        value: address,
                        coordinates: { lat: coordinates.latitude, lng: coordinates.longitude },
                      },
                    });
                  }
                },
                undefined,
              );
            }
          }
        } catch (error) {
          console.error('Failed to init location:', error);
        }
      });

      return () => task.cancel();
    }, [userInfo]),
  );

  useEffect(() => {
    fadeAnim.setValue(1);
    slideAnim.setValue(0);
  }, []);

  useEffect(() => {
    if (duration?.value && !expiry_date) {
      const calculatedExpiryDate = calculateExpiryDate(duration.value);
      updateJobForm({ expiry_date: calculatedExpiryDate });
    }
  }, []);

  const hasInitializedJobSectorRef = useRef<boolean>(false);
  const hasInitializedContractTypeRef = useRef<boolean>(false);
  const hasCleanedRequirementsRef = useRef<boolean>(false);

  useEffect(() => {
    if (
      dropdownDepartmentsOptions?.length > 0 &&
      (!job_sector || !job_sector?.value)
    ) {
      updateJobForm({ job_sector: dropdownDepartmentsOptions[0] });
      if (!hasInitializedJobSectorRef.current) {
        hasInitializedJobSectorRef.current = true;
      }
    }
  }, [dropdownDepartmentsOptions, job_sector, updateJobForm]);

  useEffect(() => {
    if (
      !hasInitializedContractTypeRef.current &&
      !editMode &&
      contractTypeData?.length > 0 &&
      (!contract_type || !contract_type?.label || !contract_type?.value)
    ) {
      updateJobForm({ contract_type: contractTypeData[0] });
      hasInitializedContractTypeRef.current = true;
    }
  }, [editMode, contract_type, updateJobForm]);

  useEffect(() => {
    if (
      !editMode &&
      !hasCleanedRequirementsRef.current &&
      requirements &&
      requirements.length > 0
    ) {
      const validRequirements = requirements.filter(
        (req: string) => req && req.trim().length > 0,
      );
      if (validRequirements.length !== requirements.length) {
        updateJobForm({ requirements: validRequirements });
      }
      hasCleanedRequirementsRef.current = true;
    }
  }, [editMode, requirements, updateJobForm]);

  const [location, setLocation] = useState<
    | {
      latitude: number;
      longitude: number;
    }
    | undefined
  >(undefined);

  // Removed redundant getLocation call on mount
  // useEffect(() => {
  //   getLocation();
  // }, []);

  useEffect(() => {
    if (userInfo?.address && userInfo?.lat && userInfo?.lng) {
      return;
    }

    if (location && !userAddress?.address) {
      getAddress(
        location,
        (data: any) => {
          const address = data?.results?.[0]?.formatted_address;
          const components = data?.results?.[0]?.address_components || [];

          const stateObj = components.find((c: any) =>
            c.types.includes('administrative_area_level_1'),
          );
          const countryObj = components.find((c: any) =>
            c.types.includes('country'),
          );

          const state = stateObj?.long_name || '';
          const country = countryObj?.long_name || '';

          if (address) {
            setUserAddress({
              address,
              lat: location.latitude,
              lng: location.longitude,
              state,
              country,
            });
          }
        },
        (error: any) => {
          console.error('Failed to get address from coordinates:', error);
        },
      );
    }
  }, [location, userInfo?.address]);

  const handleCreateJob = async () => {
    if (!title || title.trim() === '') {
      errorToast(t('Please enter a job title'));
      return;
    }

    if (!describe || describe.trim() === '') {
      errorToast(t('Please enter a job description'));
      return;
    }

    if (
      !job_sector ||
      !job_sector.value ||
      (typeof job_sector.value === 'string' && job_sector.value.trim() === '')
    ) {
      errorToast(t('Please select a job department'));
      return;
    }

    const finalLat = userAddress?.lat || location?.latitude || userInfo?.lat;
    const finalLng = userAddress?.lng || location?.longitude || userInfo?.lng;

    if (!finalLat || !finalLng) {
      errorToast(t('Please select a job location on the map'));
      return;
    }

    const [from, to] = salary?.value?.split('-') || [];

    const params = {
      title: title,
      contract_type:
        contract_type?.label || contract_type?.value || '',
      area: area?.value,
      description: describe,
      address: userAddress?.address || userInfo?.address || '',
      city: userAddress?.state || userInfo?.state || '',
      country: userAddress?.country || userInfo?.country || '',
      lat: userAddress?.lat || location?.latitude || userInfo?.lat,
      lng: userAddress?.lng || location?.longitude || userInfo?.lng,
      people_anywhere: canApply,
      duration: duration?.value,
      department_id: job_sector?.value,
      job_sector: job_sector?.label || job_sector?.value,
      expiry_date: expiry_date,
      start_date: startDate?.value,
      monthly_salary_from: from ? Number(from.replace(/,/g, '').trim()) : null,
      monthly_salary_to: to ? Number(to.replace(/,/g, '').trim()) : null,
      no_positions: position?.value,
      skills: Array.isArray(skillId) ? skillId.filter(Boolean).join(',') : '',
      facilities: Array.isArray(selected) ? selected.map((item: any) => item?._id).filter(Boolean).join(',') : '',
      currency: currency?.value,
      essential_benefits: Array.isArray(selected) ? selected.map((item: any) => item?._id).filter(Boolean).join(',') : '',
      educations: [education?.value].filter(Boolean).join(','),
      experiences: [experience?.value].filter(Boolean).join(','),
      certifications: [certification?.value].filter(Boolean).join(','),
      languages: [language?.value].filter(Boolean).join(','),
      job_requirements: Array.isArray(requirements) ? requirements.filter(Boolean).join(',') : '',
    };

    console.log('~ >>>> handleCreateJob ~ params:', params);

    try {
      let response;

      if (editMode) {
        response = await editJob({ job_id: job_id, ...params }).unwrap();
        console.log('Job updated: >>>>>>>>', response?.data);
      } else {
        response = (await createJob(params).unwrap()) as any;
        console.log('Job created: >>>>>>>>', response?.data);
      }

      if (response?.status) {
        const newJobId =
          response?.data?.job_id ||
          response?.data?._id ||
          response?.data?.id ||
          response?.data;
        if (newJobId) {
          setCreatedJobId(String(newJobId));
          updateJobForm({ job_id: String(newJobId) });
        }
        setCreatedJobData(response?.data || null);
        setTimeout(() => {
          if (!isSuccessModalVisible) {
            updateJobForm({ isSuccessModalVisible: true });
          }
        }, 150);
        successToast(response?.message);
      } else {
        errorToast(response?.message || 'Failed to submit job');
      }
    } catch (err: any) {
      console.error('Failed to submit job:', err);
      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        'Something went wrong!';
      errorToast(errorMessage);
    }
  };

  const toggleItem = (item: any) => {
    const isAlreadySelected = selected?.some((i: any) => i?._id === item?._id);
    const updatedList = isAlreadySelected
      ? selected.filter((i: any) => i?._id !== item?._id)
      : [...(selected || []), item];

    updateJobForm({ selected: updatedList });
  };

  const nextStep = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const nextStepValue = steps + 1;
      dispatch(setCoPostJobSteps(nextStepValue));
      setTimeout(() => {
        slideAnim.setValue(50);
        fadeAnim.setValue(0);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 50);
    });
  };

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        const prevStepValue = steps - 1;
        dispatch(setCoPostJobSteps(prevStepValue));
        setTimeout(() => {
          slideAnim.setValue(-50);
          fadeAnim.setValue(0);
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        }, 50);
      });
    }
  };

  const resetToFirstStep = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dispatch(setCoPostJobSteps(0));
      setTimeout(() => {
        slideAnim.setValue(-50);
        fadeAnim.setValue(0);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 50);
    });
  };

  const calculateExpiryDate = (durationValue: string): string => {
    const today = new Date();
    const expiryDate = new Date(today);

    switch (durationValue) {
      case '7 Days':
        expiryDate.setDate(today.getDate() + 7);
        break;
      case '14 Days':
        expiryDate.setDate(today.getDate() + 14);
        break;
      case '1 Month':
        expiryDate.setMonth(today.getMonth() + 1);
        break;
      case '3 Months':
        expiryDate.setMonth(today.getMonth() + 3);
        break;
      case 'Until Filled':
        expiryDate.setFullYear(today.getFullYear() + 1);
        break;
      default:
        expiryDate.setMonth(today.getMonth() + 1);
        break;
    }

    return expiryDate.toISOString().split('T')[0];
  };

  // FIXED: Simplified and corrected requirement adding logic
  const handleAddRequirements = () => {
    const trimmedText = requirementText.trim();
    if (!trimmedText) {
      errorToast(t('Please enter a requirement'));
      return;
    }
    updateJobForm({
      requirements: [...(requirements || []), trimmedText],
      requirementText: '',
      isModalVisible: false
    });
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = jobSkills.filter((s: string) => s !== skill);
    updateJobForm({ jobSkills: updatedSkills });
  };

  const handleSkillSelection = (skill: string) => {
    if (jobSkills.includes(skill)) {
      const filtered = jobSkills.filter((i: string) => i !== skill);
      updateJobForm({ jobSkills: filtered });
    } else {
      updateJobForm({ jobSkills: [...jobSkills, skill] });
    }
  };

  const toggleSkillId = (id: string) => {
    if (skillId.includes(id)) {
      const updated = skillId.filter((i: string) => i !== id);
      updateJobForm({ skillId: updated });
    } else {
      updateJobForm({ skillId: [...skillId, id] });
    }
  };

  const handleEmployeeSelection = (id: string) => {
    setSelectedEmployeeIds(prev =>
      prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id],
    );
  };

  const render = () => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [{ translateX: slideAnim }],
    };

    switch (steps) {
      case 1:
        return (
          <Animated.View key="step-1" style={[{ flex: 1 }, animatedStyle]}>
            <View style={styles.Backheader}>
              <TouchableOpacity onPress={() => prevStep()}>
                <Image source={IMAGES.backArrow} style={styles.back} />
              </TouchableOpacity>
              <TouchableOpacity onPress={resetToFirstStep}>
                <Image source={IMAGES.close} style={styles.close} />
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <KeyboardAwareScrollView
                style={AppStyles.flex}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.stepScrollContainer}
                enableOnAndroid={true}>
                <View style={styles.rowWithInfo}>
                  <Text style={styles.inputLabel}>
                    {t('Describe the role to candidates')}
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
                  onChangeText={e => updateJobForm({ describe: e })}
                />
                <CharLength value={describe} chars={1000} />
              </KeyboardAwareScrollView>
              <View style={{ paddingHorizontal: wp(30) }}>
                <GradientButton
                  type="Company"
                  style={styles.btn}
                  title={t('Continue')}
                  onPress={() => {
                    nextStep();
                  }}
                />
              </View>
            </View>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View key="step-2" style={[{ flex: 1 }, animatedStyle]}>
            <View style={styles.Backheader}>
              <TouchableOpacity onPress={() => prevStep()}>
                <Image source={IMAGES.backArrow} style={styles.back} />
              </TouchableOpacity>
              <TouchableOpacity onPress={resetToFirstStep}>
                <Image source={IMAGES.close} style={styles.close} />
              </TouchableOpacity>
            </View>

            {/* Fixed container with flex layout */}
            <View style={styles.skillsStepContainer}>
              {/* Label */}
              <Text style={styles.inputLabelWithMargin}>
                {t('Add Job Skills')}
              </Text>

              {/* Selected skills - scrollable if needed */}
              <ScrollView
                style={styles.selectedSkillsScrollContainer}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}>
                <View style={styles.selectedSkillsContainer}>
                  {jobSkills.length === 0 ? (
                    <Text style={styles.placeholderText}>
                      {t('Select job skills')}
                    </Text>
                  ) : (
                    jobSkills.map((skill: string, index: number) => (
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
                </View>
                <View style={styles.bottomUnderline} />
              </ScrollView>

              {/* Scrollable skills list */}
              <ScrollView
                style={styles.skillsScrollView}
                contentContainerStyle={{ flexGrow: 0 }}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}>
                <View style={styles.skillsWrapper}>
                  {skills?.map((item, index) => {
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

              {/* Fixed Continue button */}
              <View style={{ paddingHorizontal: wp(30) }}>
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
            </View>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View key="step-3" style={[{ flex: 1 }, animatedStyle]}>
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
              <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: hp(100) }}
                showsVerticalScrollIndicator={false}>

                {/* Education Dropdown */}
                <View style={styles.field}>
                  <Text style={styles.label}>{t('Education')}</Text>
                  <CustomDropdown
                    data={educationData}
                    labelField="label"
                    valueField="value"
                    value={education?.value}
                    onChange={(e: any) => {
                      updateJobForm({ education: { label: e.label, value: e.value } });
                    }}
                    dropdownStyle={styles.dropdown}
                    renderRightIcon={IMAGES.ic_down}
                    RightIconStyle={styles.rightIcon}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholder={t('Select one')}
                  />
                </View>

                {/* Work Experience Dropdown */}
                <View style={styles.field}>
                  <Text style={styles.label}>{t('Work Experience')}</Text>
                  <CustomDropdown
                    data={experienceData}
                    labelField="label"
                    valueField="value"
                    value={experience?.value}
                    onChange={(e: any) => {
                      updateJobForm({ experience: { label: e.label, value: e.value } });
                    }}
                    dropdownStyle={styles.dropdown}
                    renderRightIcon={IMAGES.ic_down}
                    RightIconStyle={styles.rightIcon}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholder={t('Select one')}
                  />
                </View>

                {/* Certifications Dropdown */}
                <View style={styles.field}>
                  <Text style={styles.label}>{t('Certifications')}</Text>
                  <CustomDropdown
                    data={certificationData}
                    labelField="label"
                    valueField="value"
                    value={certification?.value}
                    onChange={(e: any) => {
                      updateJobForm({ certification: { label: e.label, value: e.value } });
                    }}
                    dropdownStyle={styles.dropdown}
                    renderRightIcon={IMAGES.ic_down}
                    RightIconStyle={styles.rightIcon}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholder={t('Select one')}
                  />
                </View>

                {/* Languages Dropdown */}
                <View style={styles.field}>
                  <Text style={styles.label}>{t('Languages')}</Text>
                  <CustomDropdown
                    data={languageData}
                    labelField="label"
                    valueField="value"
                    value={language?.value}
                    onChange={(e: any) => {
                      updateJobForm({ language: { label: e.label, value: e.value } });
                    }}
                    dropdownStyle={styles.dropdown}
                    renderRightIcon={IMAGES.ic_down}
                    RightIconStyle={styles.rightIcon}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholder={t('Select one')}
                  />
                </View>

                <View style={[styles.field, { zIndex: 100 }]}>
                  <CustomDropdown
                    label={t('Other Requirements')}
                    data={otherRequirementsData}
                    labelField="label"
                    valueField="value"
                    value={other_requirements?.value}
                    onChange={(e: any) => {
                      updateJobForm({ other_requirements: e });
                    }}
                    dropdownStyle={styles.dropdown}
                    renderRightIcon={IMAGES.ic_down}
                    RightIconStyle={styles.rightIcon}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholder={t('Select Requirements')}
                  />
                </View>
              </KeyboardAwareScrollView>

              <View style={styles.fixedBottomSection}>
                <GradientButton
                  style={styles.btn}
                  type="Company"
                  title={t('Continue')}
                  onPress={() => {
                    nextStep();
                  }}
                />
              </View>
            </View>
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View key="step-4" style={[{ flex: 1 }, animatedStyle]}>
            <View style={styles.Backheader}>
              <TouchableOpacity onPress={() => prevStep()}>
                <Image source={IMAGES.backArrow} style={styles.back} />
              </TouchableOpacity>
              <TouchableOpacity onPress={resetToFirstStep}>
                <Image source={IMAGES.close} style={styles.close} />
              </TouchableOpacity>
            </View>
            <View style={[styles.container, { paddingHorizontal: wp(30) }]}>
              <View>
                <Text style={styles.inputLabelWithMargin}>
                  {t('You will Provide')}
                </Text>
                <FlatList
                  data={facilities}
                  keyExtractor={(_, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.providerContainer}
                  renderItem={({ item, index }) => {
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
                            { borderWidth: isChecked ? 0 : 1 },
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
            </View>
            <GradientButton
              style={[styles.btn, { marginHorizontal: wp(25) }]}
              type="Company"
              title={t('Review your job resume')}
              onPress={() => {
                // Validate required fields before navigating
                if (!title || title.trim() === '') {
                  errorToast(t('Please enter a job title'));
                  return;
                }
                if (!describe || describe.trim() === '') {
                  errorToast(t('Please enter a job description'));
                  return;
                }
                if (!job_sector || !job_sector.value) {
                  errorToast(t('Please select a job department'));
                  return;
                }
                const finalLat = userAddress?.lat || location?.latitude || userInfo?.lat;
                const finalLng = userAddress?.lng || location?.longitude || userInfo?.lng;
                if (!finalLat || !finalLng) {
                  errorToast(t('Please select a job location on the map'));
                  return;
                }
                // Navigate to JobPreview with necessary data
                navigateTo(SCREENS.JobPreview, {
                  userAddress,
                  skillId,
                  location,
                });
              }}
            />
          </Animated.View>
        );
      case 5:
        return (
          <Animated.View key="step-5" style={[{ flex: 1 }, animatedStyle]}>
            <View style={styles.empContainer}>
              <View style={styles.empHeader}>
                <BackHeader
                  type={'company'}
                  onBackPress={() => prevStep()}
                  title={t('Suggested Employee')}
                  RightIconStyle={styles.rightIcon}
                />

                <View style={styles.card}>
                  <Image source={{ uri: IMAGE_URL }} style={styles.avatar} />
                  <View style={styles.textContainer}>
                    <Text style={styles.empTitle}>{title}</Text>
                    <Text style={styles.empSubtitle}>
                      {userAddress?.address || 'N/A'}
                    </Text>
                    <View style={styles.empRow}>
                      <Text style={styles.location}>
                        {`${userAddress?.state || 'N/A'}, ${userAddress?.country || 'N/A'
                          }`}
                      </Text>
                    </View>
                    <Text style={styles.location}>{contract_type?.label}</Text>
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
                      } else if (Array.isArray(suggestedEmployeeList)) {
                        setSelectedEmployeeIds(
                          suggestedEmployeeList.map((item: any) => item?._id).filter(Boolean),
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
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      <EmplyoeeCard
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
                  ReactNativeHapticFeedback.trigger('impactLight', {
                    enableVibrateFallback: true,
                    ignoreAndroidSystemSettings: false,
                  });
                  handleCreateJob();
                }}
              />
            </View>
          </Animated.View>
        );
      default:
        break;
    }
  };

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
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

        {steps == 0 ? (
          <Animated.View
            key="step-0"
            style={[
              { flex: 1 },
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}>
            <KeyboardAwareScrollView
              ref={scrollViewRef}
              style={AppStyles.flex}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              enableOnAndroid={true}
              enableAutomaticScroll={false}
              scrollEnabled={!isDropdownOpen}
              nestedScrollEnabled={!isDropdownOpen}>
              <View>
                <View style={styles.field}>
                  <Text style={styles.label}>
                    {t('Job Title')}
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <CustomTextInput
                    value={title}
                    onChangeText={e => updateJobForm({ title: e })}
                    placeholder={'Enter job title'}
                    inputStyle={styles.input}
                    placeholderTextColor={colors._7B7878}
                    containerStyle={styles.inputContainer}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>{t('Type of contract')}</Text>
                  <CustomDropdown
                    data={contractTypeData}
                    labelField="label"
                    valueField="value"
                    value={contract_type?.value}
                    onChange={(e: any) => {
                      updateJobForm({
                        contract_type: { label: e.label, value: e.value },
                      });
                    }}
                    dropdownStyle={styles.dropdown}
                    renderRightIcon={IMAGES.ic_down}
                    RightIconStyle={styles.rightIcon}
                    selectedTextStyle={styles.selectedTextStyle}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>{t('Job Area')}</Text>
                  <View
                    style={[
                      styles.autocompleteWrapper,
                      isAutocompleteOpen && styles.autocompleteWrapperOpen,
                    ]}>
                    <GooglePlacesAutocomplete
                      placeholder={'Search your job area'}
                      onPress={(data, details = null) => {
                        console.log('Selected:', data.description);

                        const addressComponents = details?.address_components || [];

                        const sublocalityComponent = addressComponents.find((c: any) =>
                          c.types.includes('sublocality') || c.types.includes('sublocality_level_1') || c.types.includes('neighborhood')
                        );

                        const routeComponent = addressComponents.find((c: any) =>
                          c.types.includes('route')
                        );

                        const cityComponent = addressComponents.find((c: any) =>
                          c.types.includes('locality') || c.types.includes('administrative_area_level_1')
                        );

                        const countryComponent = addressComponents.find((c: any) =>
                          c.types.includes('country')
                        );

                        const sublocality = sublocalityComponent?.long_name || '';
                        const route = routeComponent?.long_name || '';
                        const city = cityComponent?.long_name || '';
                        const country = countryComponent?.long_name || '';

                        let displayParts: any[] = [];
                        if (sublocality) displayParts.push(sublocality);
                        else if (route) displayParts.push(route);
                        if (city) displayParts.push(city);
                        if (country) displayParts.push(country);

                        displayParts = displayParts.filter((item, index) => displayParts.indexOf(item) === index);

                        let displayAddress = displayParts.length > 0
                          ? displayParts.join(' - ')
                          : data.description;

                        displayAddress = displayAddress.replace(/^[A-Z0-9]{4}\+[A-Z0-9]{2,4}\s*[-–]\s*/i, '');

                        const lat = details?.geometry?.location?.lat;
                        const lng = details?.geometry?.location?.lng;

                        updateJobForm({
                          area: {
                            label: data.description,
                            value: data.description,
                            place_id: data.place_id,
                            coordinates: details?.geometry?.location,
                          },
                        });

                        if (lat && lng) {
                          setUserAddress({
                            address: displayAddress,
                            lat: lat,
                            lng: lng,
                            state: city,
                            country: country,
                          });
                        }

                        setIsAutocompleteOpen(false);
                      }}
                      query={{
                        key: mapKey,
                        language: 'en',
                        components: 'country:ae',
                      }}
                      fetchDetails={true}
                      enablePoweredByContainer={false}
                      keepResultsAfterBlur={true}
                      listViewDisplayed={isAutocompleteOpen}
                      onFocus={() => {
                        setIsAutocompleteOpen(true);
                      }}
                      onBlur={() => {
                        setTimeout(() => setIsAutocompleteOpen(false), 300);
                      }}
                      onFail={error => {
                        console.error('GooglePlacesAutocomplete error:', error);
                      }}
                      suppressDefaultStyles={false}
                      styles={{
                        container: {
                          flex: 0,
                          zIndex: 1000,
                        },
                        textInputContainer: {
                          backgroundColor: 'transparent',
                          borderWidth: 0,
                          zIndex: 1000,
                        },
                        textInput: {
                          height: hp(56),
                          borderWidth: 2,
                          borderRadius: 10,
                          paddingVertical: 0, // Reset vertical padding for better centering
                          paddingHorizontal: wp(13),
                          paddingRight: wp(45),
                          borderColor: colors._234F86,
                          ...commonFontStyle(400, 18, colors._181818),
                          backgroundColor: colors.white,
                          marginTop: 0,
                          marginBottom: 0,
                          textAlignVertical: 'center', // Fix for Android input vertical alignment
                          includeFontPadding: false, // Fix for Android font padding issues
                        },
                        listView: {
                          position: 'absolute',
                          top: hp(60),
                          left: 0,
                          right: 0,
                          backgroundColor: colors.white,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: colors._234F86,
                          elevation: 10,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          maxHeight: hp(250),
                          zIndex: 1001,
                          marginTop: hp(4),
                        },
                        row: {
                          backgroundColor: colors.white,
                          paddingVertical: hp(14),
                          paddingHorizontal: wp(13),
                          borderBottomWidth: 1,
                          borderBottomColor: colors._D9D9D9,
                          zIndex: 1001,
                        },
                        separator: {
                          height: 0,
                        },
                        description: {
                          ...commonFontStyle(400, 15, colors._181818),
                          zIndex: 1001,
                        },
                        loader: {
                          paddingVertical: hp(10),
                        },
                        poweredContainer: {
                          display: 'none',
                        },
                      }}
                      debounce={400}
                      minLength={2}
                      nearbyPlacesAPI="GooglePlacesSearch"
                      textInputProps={{
                        placeholderTextColor: colors._7B7878,
                        returnKeyType: 'search',
                        numberOfLines: 1,
                        multiline: false,
                        autoCorrect: false,
                        ellipsizeMode: 'tail',
                        onFocus: () => {
                          setIsAutocompleteOpen(true);
                        },
                        onChangeText: text => {
                          setSearchText(text);
                          setIsAutocompleteOpen(true);
                        },
                        clearButtonMode: 'while-editing',
                      }}
                    />
                  </View>
                </View>
                <LocationContainer
                  address={userAddress?.address}
                  onPressMap={() => {
                    navigateTo(SCREENS.CoPostJobLocationScreen, { userAddress });
                  }}
                  containerStyle={styles.map}
                  lat={userAddress?.lat || location?.latitude}
                  lng={userAddress?.lng || location?.longitude}
                />
                <Pressable
                  onPress={() => {
                    updateJobForm({ canApply: !canApply });
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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.label}>
                      {t('How long should this job be live?')}
                    </Text>
                    <Tooltip
                      message={t(
                        'Choose how long the job stays active. It will automatically expire after this period.',
                      )}
                    />
                  </View>
                  <CustomDropdown
                    data={durationData}
                    labelField="label"
                    valueField="value"
                    value={duration?.value}
                    onChange={(e: any) => {
                      updateJobForm({ duration: { label: e.label, value: e.value } });
                      if (!isExpiryDateManuallyChanged) {
                        const calculatedExpiryDate = calculateExpiryDate(e.value);
                        updateJobForm({ expiry_date: calculatedExpiryDate });
                      }
                    }}
                    dropdownStyle={styles.dropdown}
                    renderRightIcon={IMAGES.ic_down}
                    RightIconStyle={styles.rightIcon}
                    selectedTextStyle={styles.selectedTextStyle}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>{t('Expiry Date')}</Text>
                  <Pressable
                    style={{ position: 'relative' }}
                    onPress={() => updateJobForm({ isModalVisible: true })}>
                    <CustomDropdown
                      data={
                        expiry_date
                          ? [{ label: expiry_date, value: expiry_date }]
                          : []
                      }
                      disable={true}
                      value={expiry_date}
                      placeholder="Select Date"
                      labelField="label"
                      valueField="value"
                      dropdownStyle={styles.dropdown}
                      renderRightIcon={IMAGES.ic_down}
                      RightIconStyle={styles.rightIcon}
                      selectedTextStyle={styles.selectedTextStyle}
                    />
                    <Pressable
                      style={[StyleSheet.absoluteFill, styles.overlayPressable]}
                      onPress={() => updateJobForm({ isModalVisible: true })}
                    />
                  </Pressable>

                  <DateTimePicker
                    mode="date"
                    isVisible={isModalVisible}
                    date={
                      expiry_date && !isNaN(new Date(expiry_date).getTime())
                        ? new Date(expiry_date)
                        : new Date()
                    }
                    minimumDate={new Date()}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    pickerStyleIOS={{ alignSelf: 'center' }}
                    onConfirm={(date: Date) => {
                      const formattedDate = date.toISOString().split('T')[0];
                      updateJobForm({
                        expiry_date: formattedDate,
                        isModalVisible: false,
                      });
                      setIsExpiryDateManuallyChanged(true);
                    }}
                    onCancel={() => updateJobForm({ isModalVisible: false })}
                  />
                </View>
                <View
                  style={styles.field}
                  collapsable={false}>
                  <Text style={styles.label}>
                    {t('Job Department')}
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <CustomDropdown
                    data={dropdownDepartmentsOptions}
                    labelField="label"
                    valueField="value"
                    value={job_sector?.value}
                    onChange={(e: any) => {
                      updateJobForm({
                        job_sector: { label: e.label, value: e.value },
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
                        startDate: { label: e.label, value: e.value },
                      });
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
                        updateJobForm({ salary: { label: e.label, value: e.value } });
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
                          currency: { label: e.label, value: e.value },
                        });
                      }}
                      dropdownStyle={styles.dropdown}
                      renderRightIcon={IMAGES.ic_down}
                      RightIconStyle={styles.rightIcon}
                      selectedTextStyle={styles.selectedTextStyle}
                      container={{ flex: 0.5 }}
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
                    dropdownPosition="top"
                    onChange={(e: any) => {
                      updateJobForm({ position: { label: e.label, value: e.value } });
                    }}
                    dropdownStyle={styles.dropdown}
                    renderRightIcon={IMAGES.ic_down}
                    RightIconStyle={styles.rightIcon}
                    selectedTextStyle={styles.selectedTextStyle}
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
            <View style={{ paddingHorizontal: wp(30) }}>
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Next')}
                onPress={() => {
                  if (!title.trim()) {
                    errorToast(t('Please enter a valid title'));
                    return;
                  }
                  if (!expiry_date.trim()) {
                    errorToast(t('Please select expiry date'));
                    return;
                  }
                  nextStep();
                }}
              />
            </View>
          </Animated.View>
        ) : (
          <View style={AppStyles.flex}>
            {steps !== 0 && render()}
          </View>
        )}

        <BottomModal
          visible={isSuccessModalVisible}
          backgroundColor={colors._FAEED2}
          onClose={() => {
            updateJobForm({ isSuccessModalVisible: false });
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
            type="Company"
            style={styles.btn}
            textStyle={{ textAlign: 'center', alignSelf: 'center' }}
            title={t(editMode ? 'View Job Detail' : 'View Suggested Employees')}
            onPress={() => {
              try {
                updateJobForm({ isSuccessModalVisible: false });

                if (editMode) {
                  setCreatedJobId('');
                  setCreatedJobData(null);
                  dispatch(resetJobFormState());
                  dispatch(setCoPostJobSteps(1));
                  navigationRef?.current?.goBack();
                  return;
                }

                const jobIdToUse = createdJobId || job_id;
                const jobDataToUse = createdJobData;

                dispatch(resetJobFormState());
                dispatch(setCoPostJobSteps(1));

                setCreatedJobId('');
                setCreatedJobData(null);

                setTimeout(() => {
                  if (jobIdToUse) {
                    navigateTo(SCREENS.SuggestedEmployee, {
                      jobId: jobIdToUse,
                      jobData: jobDataToUse,
                    });
                  } else {
                    navigationRef?.current?.goBack();
                  }
                }, 100);
              } catch (error) {
                console.error('Navigation error:', error);
                updateJobForm({ isSuccessModalVisible: false });
              }
            }}
          />

          <Text
            onPress={() => {
              dispatch(resetJobFormState());
              dispatch(setCoPostJobSteps(1));
              updateJobForm({ isSuccessModalVisible: false });
              setCreatedJobId('');
              setCreatedJobData(null);
              resetNavigation(SCREENS.CoStack, SCREENS.CoTabNavigator);
            }}
            style={styles.modalHomeText}>
            {'Home'}
          </Text>
          <View style={{ paddingBottom: insets.bottom + 10 }} />
        </BottomModal>
      </View>
    </LinearContainer>
  );
};

export default PostJob;

const styles = StyleSheet.create({
  overlayPressable: {
    zIndex: 9999,
    elevation: 9999,
  },
  header: {
    paddingHorizontal: wp(35),
    paddingTop: hp(26),
  },
  title: {
    marginLeft: 0,
    marginRight: 0,
    textAlign: 'center',
    alignSelf: 'center',
  },
  fieldWithMargin: {
    gap: hp(12),
    marginBottom: hp(14),
    marginTop: hp(16),
  },
  label: {
    ...commonFontStyle(400, 18, colors._0B3970),
  },
  required: {
    color: 'red',
    marginLeft: 2,
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
    paddingBottom: hp(30),
    paddingHorizontal: wp(30),
    justifyContent: 'space-between',
  },
  stepScrollContainer: {
    flexGrow: 1,
    paddingHorizontal: wp(30),
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
    ...commonFontStyle(400, 16, colors._181818),
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
    paddingHorizontal: wp(30),
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
    marginTop: hp(20),
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
  // NEW: Container for step 2 with flex layout
  skillsStepContainer: {
    flex: 1,
    paddingHorizontal: wp(30),
  },
  // NEW: Scrollable selected skills container
  selectedSkillsScrollContainer: {
    marginTop: hp(20),
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
    paddingVertical: hp(30),
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
  requirementWrapper: { position: 'absolute', top: '5%', left: 0, right: 0 },
  boxContainer: {
    marginTop: hp(17),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: hp(1),
    borderRadius: hp(10),
    paddingVertical: hp(17),
    paddingHorizontal: wp(18),
    borderColor: colors._D9D9D9,
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
    marginTop: hp(20),
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: hp(1.5),
    borderRadius: hp(10),
    paddingVertical: hp(17),
    paddingHorizontal: wp(18),
    borderColor: colors._D9D9D9,
  },
  emptyReqContainer: {
    flex: 1,
    marginTop: hp(20),
    alignItems: 'center',
    marginBottom: hp(50),
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
  // FIXED: Updated requirements container layout
  requirementsContainer: {
    flex: 1,
    marginTop: hp(20),
    paddingHorizontal: wp(30),
  },
  // FIXED: New fixed bottom section for buttons
  fixedBottomSection: {
    paddingBottom: hp(10),
  },
  requirementsList: {},
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
    marginBottom: 0,
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
    ...commonFontStyle(400, 19, colors._050505),
  },
  selectedSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
    paddingBottom: hp(10),
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
    marginTop: hp(25),
    marginBottom: hp(10),
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  autocompleteContainer: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
  },
  dropdownIconContainer: {
    position: 'absolute',
    right: wp(13),
    top: '50%',
    transform: [{ translateY: -hp(6.5) }],
    zIndex: 2,
    pointerEvents: 'none',
  },
  autocompleteWrapper: {
    position: 'relative',
    zIndex: 100,
    elevation: 100,
    overflow: 'visible',
  },
  autocompleteWrapperOpen: {
    zIndex: 1000,
    elevation: 1000,
    overflow: 'visible',
  },
  searchIconContainer: {
    position: 'absolute',
    right: wp(13),
    top: hp(18),
    zIndex: 1002,
    pointerEvents: 'none',
  },
  field: {
    gap: hp(12),
    marginBottom: hp(14),
    zIndex: 1,
  },

  textAreaInput: {
    flex: 1,
    textAlignVertical: 'top',
    paddingTop: hp(15),
    paddingHorizontal: wp(15),
    ...commonFontStyle(400, 16, colors._181818),
  },
  textAreaContainer: {
    height: hp(120),
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors._234F86,
    backgroundColor: colors.white,
    marginTop: hp(10),
  },
});