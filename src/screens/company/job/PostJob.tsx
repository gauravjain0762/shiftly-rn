import {
  Animated,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHeader,
  CustomDropdown,
  CustomTextInput,
  GradientButton,
  LinearContainer,
  LocationContainer,
} from '../../../component';
import { useTranslation } from 'react-i18next';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
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
  useGetBusinessTypesQuery,
  useGetFacilitiesQuery,
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

const jobTypeData = [
  { label: 'Full Time', value: 'Full Time' },
  { label: 'Part Time', value: 'Part Time' },
  { label: 'Freelance', value: 'Freelance' },
  { label: 'Internship', value: 'Internship' },
  { label: 'Temporary', value: 'Temporary' },
];

const jobAreaData = [
  { label: 'Dubai Marina', value: 'Dubai Marina' },
  { label: 'Business Bay', value: 'Business Bay' },
  { label: 'Downtown Dubai', value: 'Downtown Dubai' },
  { label: 'Jumeirah', value: 'Jumeirah' },
  { label: 'Al Barsha', value: 'Al Barsha' },
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

const contractTypeData = [
  { label: 'Full-time experience', value: 'Full-time experience' },
  { label: 'Part-time experience', value: 'Part-time experience' },
  { label: 'Contractual', value: 'Contractual' },
  { label: 'Probation Period', value: 'Probation Period' },
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
  { label: 'GBP', value: 'GBP' },
];

const PostJob = () => {
  const { t } = useTranslation<any>();
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
    expiry_date,
  } = useAppSelector((state: any) => selectJobForm(state));
  const { updateJobForm } = useJobFormUpdater();
  const [createJob] = useCreateJobMutation();
  const [editJob] = useEditCompanyJobMutation();
  const { data: facilitiesData } = useGetFacilitiesQuery({});
  const facilities = facilitiesData?.data?.facilities;
  const { data: skillsData } = useGetSkillsQuery({});
  const skills = skillsData?.data?.skills as any[];
  const { data: businessTypesData } = useGetBusinessTypesQuery({});
  const businessTypes = businessTypesData?.data?.types as any[];
  const steps = useAppSelector((state: any) => state.company.coPostJobSteps);
  const shouldSkip = !(steps === 5 && !!job_id);
  const { data: suggestedData } = useGetSuggestedEmployeesQuery(job_id, {
    skip: shouldSkip || !job_id,
  });
  const suggestedEmployeeList = suggestedData?.data?.users;
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [createdJobId, setCreatedJobId] = useState<string>('');
  const [createdJobData, setCreatedJobData] = useState<any>(null);
  const { userInfo } = useAppSelector((state: any) => state.auth);
  const [isExpiryDateManuallyChanged, setIsExpiryDateManuallyChanged] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Refs for scroll control
  const scrollViewRef = useRef<any>(null);
  const jobDepartmentFieldRef = useRef<View>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle dropdown focus - prevent scroll to keep dropdown positioned correctly
  const handleJobDepartmentFocus = () => {
    // Disable scroll immediately to prevent any auto-scrolling
    setIsDropdownOpen(true);
  };

  // Re-enable scroll when dropdown closes
  const handleJobDepartmentBlur = () => {
    setIsDropdownOpen(false);
    if (scrollViewRef.current?.setNativeProps) {
      scrollViewRef.current.setNativeProps({ scrollEnabled: true });
    }
  };

  const dropdownBusinessTypesOptions = businessTypes?.map(item => ({
    label: item.title,
    value: item._id, // Use _id for department_id
    title: item.title, // Keep title for display
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
      // Priority 1: Check AsyncStorage first (selected address from location screen - has state/country)
      const locationString = await AsyncStorage.getItem('user_location');
      if (locationString !== null) {
        const location = JSON.parse(locationString);
        if (location.address && location.lat && location.lng) {
          setUserAddress({
            address: location.address,
            lat: location.lat,
            lng: location.lng,
            state: location.state || '',
            country: location.country || '',
          });
          console.log('Retrieved location from AsyncStorage:', location);
          return {
            address: location.address,
            lat: location.lat,
            lng: location.lng,
            state: location.state || '',
            country: location.country || '',
          };
        }
      }

      // Priority 2: Use registered company location from userInfo (fallback)
      if (userInfo?.address && userInfo?.lat && userInfo?.lng) {
        setUserAddress({
          address: userInfo.address,
          lat: userInfo.lat,
          lng: userInfo.lng,
          state: userInfo.state || '',
          country: userInfo.country || '',
        });
        console.log('Using registered company location:', userInfo.address);
        return {
          address: userInfo.address,
          lat: userInfo.lat,
          lng: userInfo.lng,
          state: userInfo.state || '',
          country: userInfo.country || '',
        };
      }

      // Priority 3: Only if no registered location, try to get current GPS location
      const coordinates = await getAsyncUserLocation();
      if (coordinates) {
        getAddress(
          coordinates,
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
                lat: coordinates.latitude,
                lng: coordinates.longitude,
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

  // Refresh address when screen comes into focus (e.g., returning from location screen)
  useFocusEffect(
    useCallback(() => {
      const refreshAddress = async () => {
        try {
          // Check AsyncStorage for the latest selected address
          const locationString = await AsyncStorage.getItem('user_location');
          if (locationString !== null) {
            const location = JSON.parse(locationString);
            if (location.address && location.lat && location.lng) {
              setUserAddress({
                address: location.address,
                lat: location.lat,
                lng: location.lng,
                state: location.state || '',
                country: location.country || '',
              });
            }
          }
        } catch (error) {
          console.error('Failed to refresh address:', error);
        }
      };
      refreshAddress();
    }, []),
  );

  // Reset animation when component mounts
  useEffect(() => {
    fadeAnim.setValue(1);
    slideAnim.setValue(0);
  }, []);


  // Auto-calculate expiry date on mount if duration is set but expiry_date is not
  useEffect(() => {
    if (duration?.value && !expiry_date) {
      const calculatedExpiryDate = calculateExpiryDate(duration.value);
      updateJobForm({ expiry_date: calculatedExpiryDate });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Disable/enable scroll based on dropdown state
  useEffect(() => {
    if (scrollViewRef.current) {
      // Use setNativeProps to disable scroll when dropdown is open
      if (isDropdownOpen) {
        scrollViewRef.current.setNativeProps?.({ scrollEnabled: false });
      } else {
        scrollViewRef.current.setNativeProps?.({ scrollEnabled: true });
      }
    }
  }, [isDropdownOpen]);

  const hasInitializedJobSectorRef = useRef<boolean>(false);
  const hasInitializedJobTypeRef = useRef<boolean>(false);
  const hasCleanedRequirementsRef = useRef<boolean>(false);

  useEffect(() => {
    if (
      !hasInitializedJobSectorRef.current &&
      dropdownBusinessTypesOptions?.length > 0 &&
      !job_sector
    ) {
      updateJobForm({ job_sector: dropdownBusinessTypesOptions[0] });
      hasInitializedJobSectorRef.current = true;
    }
  }, [dropdownBusinessTypesOptions, job_sector, updateJobForm]);

  // Initialize job_type if not set (only for new jobs, not edit mode)
  useEffect(() => {
    if (
      !hasInitializedJobTypeRef.current &&
      !editMode &&
      jobTypeData?.length > 0 &&
      !job_type
    ) {
      updateJobForm({ job_type: jobTypeData[0] }); // Default to "Full Time"
      hasInitializedJobTypeRef.current = true;
    }
  }, [editMode, job_type, updateJobForm]);

  // Clean up empty/blank requirements when creating a new job (only on mount)
  useEffect(() => {
    if (!editMode && !hasCleanedRequirementsRef.current && requirements && requirements.length > 0) {
      const validRequirements = requirements.filter((req: string) => req && req.trim().length > 0);
      if (validRequirements.length !== requirements.length) {
        // Only update if there were empty requirements to remove
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

  useEffect(() => {
    getLocation();
  }, []);

  // Fetch address when location is available but address is not (only if no registered location)
  useEffect(() => {
    // Don't override if we already have registered company location
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

  const getLocation = async () => {
    const res = await getAsyncUserLocation();
    if (res) {
      setLocation(res);
    }
  };

  const handleCreateJob = async () => {
    // Validate required fields - check if job_sector exists and has a valid value
    if (!job_sector || !job_sector.value || (typeof job_sector.value === 'string' && job_sector.value.trim() === '')) {
      errorToast(t('Please select a job department'));
      return;
    }

    // Calculate salary range
    const [from, to] = salary?.value?.split('-') || [];

    // Build params with latest values
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
      department_id: job_sector?.value, // Backend expects department_id
      job_sector: job_sector?.value, // Backend also expects job_sector (for validation)
      expiry_date: expiry_date,
      start_date: startDate?.value,
      contract_type: contract?.value,
      monthly_salary_from: from ? Number(from.replace(/,/g, '').trim()) : null,
      monthly_salary_to: to ? Number(to.replace(/,/g, '').trim()) : null,
      no_positions: position?.value,
      skills: skillId?.join(','),
      facilities: selected?.map((item: any) => item._id).join(','),
      requirements: requirements?.join(','),
    };

    console.log('~ >>>> handleCreateJob ~ params:', params);
    console.log('~ >>>> handleCreateJob ~ job_sector:', job_sector);
    console.log('~ >>>> handleCreateJob ~ department_id:', job_sector?.value);

    try {
      let response;

      if (editMode) {
        response = await editJob({ job_id: job_id, ...params }).unwrap();
        console.log('Job updated: >>>>>>>>', response?.data);
      } else {
        response = await createJob(params).unwrap() as any;
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
      // Extract error message from response
      const errorMessage = 
        err?.data?.message || 
        err?.data?.error || 
        err?.message || 
        'Something went wrong!';
      errorToast(errorMessage);
    } finally {
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
    // Fade out and slide left
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
      // Small delay to ensure state update is processed before starting new animation
      setTimeout(() => {
        // Reset and fade in from right
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
      // Fade out and slide right
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
        // Small delay to ensure state update is processed before starting new animation
        setTimeout(() => {
          // Reset and fade in from left
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
    // Animate out current step
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
      // Reset and fade in step 0
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

  // Calculate expiry date based on duration
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

  const handleAddRequirements = () => {
    if (!requirementText.trim()) {
      return;
    }
    const trimmedText = requirementText.trim();
    if (trimmedText) {
      updateJobForm({ requirements: [...requirements, trimmedText] });
    }
    updateJobForm({ requirementText: '', isModalVisible: false });
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = jobSkills.filter(s => s !== skill);
    updateJobForm({ jobSkills: updatedSkills });
  };

  const handleSkillSelection = (skill: string) => {
    if (jobSkills.includes(skill)) {
      const filtered = jobSkills.filter(i => i !== skill);
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
              <View>
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.inputLabelLarge}>{t('Job Requirements')}</Text>
                <Tooltip
                  tooltipBoxStyle={{right: '-100%'}}
                  message={"Choose from our predefined list of requirements to ensure accurate candidate matching."}
                />
              </View>
              <View
                style={
                  {}
                  // requirements?.length
                  //   ?
                  //   styles.requirementWrapper
                  //   :
                  //   {flexGrow: 1}
                }>
                {(() => {
                  // Filter out empty/blank requirements
                  const validRequirements = requirements?.filter((req: string) => req && req.trim().length > 0) || [];
                  
                  return validRequirements.length > 0 ? (
                    <FlatList
                      data={validRequirements}
                      contentContainerStyle={{ flexGrow: 1, paddingRight: wp(10) }}
                      keyExtractor={(_, index) => index.toString()}
                      style={{ flex: 1 }}
                      renderItem={({ item }) => (
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
                            style={{ ...commonFontStyle(400, 16, colors._2F2F2F) }}>
                            {'No requirements added yet'}
                          </BaseText>
                        </View>
                      )}
                      showsVerticalScrollIndicator={true}
                    />
                  ) : (
                    <View style={styles.emptyReqContainer}>
                      <BaseText
                        style={{ ...commonFontStyle(400, 16, colors.black) }}>
                        {'No requirements added yet'}
                      </BaseText>
                    </View>
                  );
                })()}
              </View>

              <View
                style={
                  {
                    // width: '100%',
                    // bottom: hp(0),
                    // position: 'absolute',
                  }
                }>
                <Pressable
                  onPress={() => updateJobForm({ isModalVisible: true })}
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
                updateJobForm({ isModalVisible: false });
              }}>
              <Pressable
                onPress={() => {
                  updateJobForm({ requirementText: '', isModalVisible: false });
                }}>
                <Image
                  source={IMAGES.close}
                  style={styles.modalCloseIcon}
                  tintColor={colors.black}
                />
              </Pressable>
              <Text
                onPress={() => updateJobForm({ isModalVisible: true })}
                style={styles.modalTitleText}>
                {t('Add New Requirements')}
              </Text>
              <CustomTextInput
                multiline
                maxLength={400}
                value={requirementText}
                onChangeText={text => updateJobForm({ requirementText: text })}
                containerStyle={styles.modalInputContainer}
                placeholder={t('Write requirements')}
                inputStyle={styles.modalInputStyle}
              />
              <CharLength chars={400} value={requirementText} />
              <GradientButton
                type="Company"
                style={styles.btn}
                title={t('Add Requirement')}
                onPress={handleAddRequirements}
              />
            </BottomModal>
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
            <View style={styles.container}>
              <View>
                <Text style={styles.inputLabelWithMargin}>
                  {t('You will Provide')}
                </Text>
                <FlatList
                  data={facilities}
                  keyExtractor={(_, index) => index.toString()}
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
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Post')}
                onPress={handleCreateJob}
              />
            </View>
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
                        {`${userAddress?.state || 'N/A'}, ${userAddress?.country || 'N/A'}`}
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
                renderItem={({ item, index }) => {
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
          </Animated.View>
        );
      default:
        break;
    }
  };

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
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
        ref={scrollViewRef}
        style={AppStyles.flex}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        enableAutomaticScroll={false}
        scrollEnabled={!isDropdownOpen}
        nestedScrollEnabled={!isDropdownOpen}>
        {/* <AnimatedSwitcher index={steps}> */}
        {steps == 0 && (
          <Animated.View
            key="step-0"
            style={[
              { flex: 1 },
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}>
            <View>
              <View style={styles.field}>
                <Text style={styles.label}>{t('Job Title')}</Text>
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
                  data={jobTypeData}
                  labelField="label"
                  valueField="value"
                  value={job_type?.value}
                  onChange={(e: any) => {
                    updateJobForm({ job_type: { label: e.label, value: e.value } });
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
                    updateJobForm({ area: { label: e.label, value: e.value } });
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
                  <Text style={styles.label}>{t('How long should this job be live?')}</Text>
                  <Tooltip
                    message={t('Choose how long the job stays active. It will automatically expire after this period.')}
                  />
                </View>
                <CustomDropdown
                  data={durationData}
                  labelField="label"
                  valueField="value"
                  value={duration?.value}
                  onChange={(e: any) => {
                    updateJobForm({ duration: { label: e.label, value: e.value } });
                    // Automatically calculate expiry date if not manually changed
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
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  pickerStyleIOS={{ alignSelf: 'center' }}
                  onConfirm={(date: Date) => {
                    const formattedDate = date.toISOString().split('T')[0];
                    updateJobForm({
                      expiry_date: formattedDate,
                      isModalVisible: false,
                    });
                    // Mark as manually changed so duration changes don't override it
                    setIsExpiryDateManuallyChanged(true);
                  }}
                  onCancel={() => updateJobForm({ isModalVisible: false })}
                />
              </View>
              <View 
                ref={jobDepartmentFieldRef} 
                style={styles.field}
                collapsable={false}>
                <Text style={styles.label}>{t('Job Department')}</Text>
                <CustomDropdown
                  data={dropdownBusinessTypesOptions}
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
                  onDropdownOpen={handleJobDepartmentFocus}
                  onDropdownClose={handleJobDepartmentBlur}
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
              {/* <View style={styles.field}>
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
              </View> */}
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
          </Animated.View>
        )}
        {steps !== 0 && render()}
        {/* </AnimatedSwitcher> */}
      </KeyboardAwareScrollView>
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
          style={styles.btn}
          type="Company"
          title={t(editMode ? 'View Job Detail' : 'View Suggested Employees')}
          onPress={() => {
            updateJobForm({ isSuccessModalVisible: false });
            if (editMode) {
              setCreatedJobId('');
              setCreatedJobData(null);
              dispatch(resetJobFormState());
              dispatch(setCoPostJobSteps(0));
              navigationRef?.current?.goBack();
              return;
            }
            const jobIdToUse = createdJobId || job_id;
            const jobDataToUse = createdJobData;
            dispatch(resetJobFormState());
            dispatch(setCoPostJobSteps(0));
            setCreatedJobId('');
            setCreatedJobData(null);
            if (jobIdToUse) {
              navigateTo(SCREENS.SuggestedEmployee, {
                jobId: jobIdToUse,
                jobData: jobDataToUse,
              });
            } else {
              navigationRef?.current?.goBack();
            }
          }}
        />

        <Text
          onPress={() => {
            dispatch(resetJobFormState());
            dispatch(setCoPostJobSteps(0));
            updateJobForm({ isSuccessModalVisible: false });
            setCreatedJobId('');
            setCreatedJobData(null);
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
  overlayPressable: {
    zIndex: 9999, // make sure it's above the dropdown
    elevation: 9999, // for Android layering
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
    marginTop: hp(40),
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
    ...commonFontStyle(400, 19, colors._050505),
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
