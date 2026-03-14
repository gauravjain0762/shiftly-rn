import { Image, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BackHeader,
  CustomDropdown,
  GradientButton,
  LinearContainer,
  Loader,
} from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Stepper from '../../../component/employe/Stepper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import EducationList, {
  isEmptyEducation,
} from '../../../component/employe/EducationList';
import EducationCard from '../../../component/employe/EducationCard';
import ExperienceList, {
  isEmptyExperience,
} from '../../../component/employe/ExperienceList';
import AboutMeList from '../../../component/employe/AboutMeList';
import SuccessffullyModal from '../../../component/employe/SuccessffullyModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  setActiveStep,
  setEducationList,
  setEducationListEdit,
  setExperienceList,
  setExperienceListEdit,
  setAboutEdit,
  setShowModal,
  EducationItem,
  ExperienceItem,
} from '../../../features/employeeSlice';
import { RootState } from '../../../store';
import {
  useAddUpdateEducationMutation,
  useAddUpdateExperienceMutation,
  useGetCompanyExperiencesQuery,
  useGetEducationsQuery,
  useGetEmployeeProfileQuery,
  useGetEmployeeSkillsQuery,
  useGetExperiencesQuery,
  useGetDropdownDataQuery,
  useRemoveEducationMutation,
  useRemoveExperienceMutation,
  useUpdateAboutMeMutation,
  useEmpUpdateProfileMutation,
} from '../../../api/dashboardApi';
import { errorToast, goBack, successToast } from '../../../utils/commonFunction';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import BaseText from '../../../component/common/BaseText';
import { IMAGES } from '../../../assets/Images';
import UploadResume from '../../../component/employe/UploadResume';
import { useTranslation } from 'react-i18next';

type Resume = {
  file_name: string;
  file: string;
  type: string;
};

const CreateProfileScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const {
    educationList,
    educationListEdit,
    experienceList,
    experienceListEdit,
    aboutEdit,
    activeStep,
    showModal,
  } = useSelector((state: RootState) => state.employee);

  const { data: getEducation, refetch: refetchEducation } = useGetEducationsQuery(
    {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: getExperiences, refetch: refetchExperience } =
    useGetExperiencesQuery(
      {},
      {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      },
    );
  const { data: experienceDataVals } = useGetCompanyExperiencesQuery({});
  const { data: dropdownData } = useGetDropdownDataQuery();
  const { data: getAboutmeandResumes, refetch: refetchAboutMe } =
    useGetEmployeeProfileQuery(
      {},
      {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      },
    );
  const route = useRoute<any>();
  const scrollRef = React.useRef<any>(null);

  const educationData = getEducation?.data?.educations;
  const experienceData = getExperiences?.data?.experiences;
  const experienceUser = getExperiences?.data?.user;
  const aboutmeandResumes = getAboutmeandResumes?.data?.user;
  const uploadedResumes = aboutmeandResumes?.resumes;
  const experienceOptionsData = useMemo(() => {
    const apiExperiences =
      dropdownData?.data?.experiences ||
      experienceDataVals?.data?.experiences ||
      [];

    return apiExperiences.map((item: any) => ({
      label: item?.title,
      value: item?._id,
    }));
  }, [dropdownData, experienceDataVals]);

  const [isEducationUpdate, setIsEducationUpdate] = useState(false);
  const [isExperienceUpdate, setIsExperienceUpdate] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>(uploadedResumes || []);
  const [yearsOfExperienceOption, setYearsOfExperienceOption] = useState<{
    label: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    if (educationData) {
      console.log(
        '🔥 [CreateProfileScreen] useGetEducationsQuery educationData:',
        JSON.stringify(educationData, null, 2),
      );
    }
  }, [educationData]);

  useEffect(() => {
    if (experienceData) {
      console.log(
        '🔥 [CreateProfileScreen] useGetExperiencesQuery experienceData:',
        JSON.stringify(experienceData, null, 2),
      );
    }
  }, [experienceData]);

  const globalDesiredJobTitle = useMemo(() => {
    const fromList =
      Array.isArray(experienceList) &&
      experienceList.find(
        (exp: any) => typeof exp?.preferred_position === 'string' && exp.preferred_position.trim().length > 0,
      );
    return (
      (fromList && (fromList as any)?.preferred_position?.trim()) ||
      experienceListEdit?.preferred_position ||
      userInfo?.desired_job_title ||
      ''
    );
  }, [experienceList, experienceListEdit?.preferred_position, userInfo?.desired_job_title]);

  const [addUpdateEducation, { isLoading: isLoadingEducation }] =
    useAddUpdateEducationMutation({});
  const [addUpdateExperience, { isLoading: isLoadingExperience }] =
    useAddUpdateExperienceMutation({});
  const [updateAboutMe, { isLoading: isLoadingAboutme }] =
    useUpdateAboutMeMutation({});
  const [empUpdateProfile] = useEmpUpdateProfileMutation();
  const [removeEducation] = useRemoveEducationMutation({});
  const [removeExperience] = useRemoveExperienceMutation({});
  const { data: skillsData } = useGetEmployeeSkillsQuery({});
  const skillsList = skillsData?.data?.skills;

  useFocusEffect(
    useCallback(() => {
      refetchEducation();
      refetchExperience();
      refetchAboutMe();

      if (route.params?.selectedLocation) {
        dispatch(setActiveStep(3));
      }

      return () => {
        if (!route.params?.selectedLocation) {
        }
      };
    }, [route.params?.selectedLocation]),
  );

  useEffect(() => {
    const selectedLocation = route.params?.selectedLocation;

    if (selectedLocation) {
      dispatch(setActiveStep(3));

      const currentAboutEdit = aboutEdit;
      dispatch(
        setAboutEdit({
          ...currentAboutEdit,
          location: selectedLocation,
        })
      );
    } else {
      dispatch(setActiveStep(1));
    }
  }, [route.params?.selectedLocation]);

  useEffect(() => {
    if (educationData) {
      dispatch(setEducationList(educationData));
    }

    if (experienceData) {
      dispatch(setExperienceList(experienceData));
    }

    if (aboutmeandResumes) {
      const locationValue =
        route.params?.selectedLocation ||
        aboutmeandResumes?.location ||
        userInfo?.address ||
        '';

      const locationLat = aboutmeandResumes?.lat ?? userInfo?.lat ?? null;
      const locationLng = aboutmeandResumes?.lng ?? userInfo?.lng ?? null;

      const skillsFromApi = (aboutmeandResumes?.skills || []).map((s: any) =>
        typeof s === 'string' ? s : s._id,
      );
      const languagesFromApi = aboutmeandResumes?.languages || [];
      const preserveLocalSkills = (aboutEdit?.selectedSkills?.length ?? 0) > 0;
      const preserveLocalLanguages = (aboutEdit?.selectedLanguages?.length ?? 0) > 0;

      dispatch(
        setAboutEdit({
          open_for_jobs: aboutmeandResumes?.open_for_job || false,
          about: aboutmeandResumes?.about || '',
          responsibilities: aboutmeandResumes?.responsibility || '',
          location: locationValue,
          locationLat,
          locationLng,
          selectedSkills: preserveLocalSkills ? aboutEdit.selectedSkills : skillsFromApi,
          selectedLanguages: preserveLocalLanguages ? aboutEdit.selectedLanguages : languagesFromApi,
        }),
      );
    }
  }, [educationData, experienceData, aboutmeandResumes]);

  useEffect(() => {
    const savedLabel =
      experienceUser?.years_of_experience ||
      aboutmeandResumes?.years_of_experience ||
      userInfo?.years_of_experience;

    if (savedLabel && experienceOptionsData.length > 0) {
      const match =
        experienceOptionsData.find(
          (opt: any) => opt.label === savedLabel,
        ) || null;
      setYearsOfExperienceOption(match);
    } else if (!savedLabel) {
      setYearsOfExperienceOption(null);
    }
  }, [
    experienceUser?.years_of_experience,
    aboutmeandResumes?.years_of_experience,
    userInfo?.years_of_experience,
    experienceOptionsData,
  ]);

  const handleSaveOrAddEducation = () => {
    if (educationListEdit?.isEditing) {
      dispatch(
        setEducationList(
          educationList.map((edu: any) => {
            const isEditing =
              edu.education_id === educationListEdit.education_id;

            return edu.isLocal === true
              ? isEditing
                ? { ...educationListEdit, isEditing: false }
                : edu
              : edu._id === educationListEdit._id
                ? { ...educationListEdit, isEditing: false }
                : edu;
          }),
        ),
      );
    } else {
      dispatch(
        setEducationList([
          ...educationList,
          {
            ...educationListEdit,
            education_id: Date.now().toString(),
            isEditing: false,
            isLocal: true,
          },
        ]),
      );
    }
    setIsEducationUpdate(true);
    dispatch(
      setEducationListEdit({
        degree: '',
        university: '',
        startDate_month: '',
        startDate_year: '',
        endDate_month: '',
        endDate_year: '',
        country: '',
        province: '',
        isEditing: false,
      }),
    );

    // After adding/saving, scroll to top so user sees the updated list
    if (scrollRef.current) {
      if (typeof scrollRef.current.scrollTo === 'function') {
        scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
      }
    }
  };

  const handleSaveOrAddExperience = () => {
    if (experienceListEdit?.isEditing) {
      dispatch(
        setExperienceList(
          experienceList?.map(exp =>
            exp?.experience_id === experienceListEdit?.experience_id
              ? { ...experienceListEdit, isEditing: false }
              : exp,
          ),
        ),
      );
      dispatch(
        setExperienceList(
          experienceList.map((exp: any) => {
            const isEditing =
              exp.experience_id === experienceListEdit.experience_id;

            return exp.isLocal === true
              ? isEditing
                ? { ...experienceListEdit, isEditing: false }
                : exp
              : exp._id === experienceListEdit._id
                ? { ...experienceListEdit, isEditing: false }
                : exp;
          }),
        ),
      );
    } else {
      dispatch(
        setExperienceList([
          ...experienceList,
          {
            ...experienceListEdit,
            preferred_position: globalDesiredJobTitle || experienceListEdit.preferred_position,
            experience_id: Date.now().toString(),
            isEditing: false,
            isLocal: true,
          },
        ]),
      );
    }

    setIsExperienceUpdate(true);

    dispatch(
      setExperienceListEdit({
        preferred_position: globalDesiredJobTitle,
        title: '',
        company: '',
        department: '',
        country: '',
        jobStart_month: '',
        jobStart_year: '',
        jobEnd_month: '',
        jobEnd_year: '',
        still_working: false,
        experience_type: '',
        isEditing: false,
        job_start: {
          month: '',
          year: '',
        },
        job_end: {
          month: '',
          year: '',
        },
      }),
    );

    if (scrollRef.current) {
      if (typeof scrollRef.current.scrollTo === 'function') {
        scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
      }
    }
  };

  const handleAddEducation = async () => {
    try {
      const degreeMap: Record<string, string> =
        Array.isArray(educationData)
          ? educationData.reduce((acc: any, item: any) => {
              if (item?._id) {
                acc[item._id] = item.title || '';
              }
              return acc;
            }, {})
          : {};

      for (const edu of educationList) {
        const payload = {
          education_id: edu._id || '',
          degree:
            typeof edu.degree === 'string'
              ? degreeMap[edu.degree] || edu.degree
              : edu.degree,
          university: edu.university,
          country: edu.country,
          province: edu.province,
          start_date: {
            month: edu.startDate_month,
            year: edu.startDate_year,
          },
          end_date: {
            month: edu.endDate_month,
            year: edu.endDate_year,
          },
        };

        try {

          console.log('✅ ~ Education Payload:', JSON.stringify(payload, null, 2));
          const response = await addUpdateEducation(payload).unwrap();
          console.log('✅ ~ Education Response:', JSON.stringify(response, null, 2));


          if (response?.status) {
            // successToast(response?.message);
          } else {
            errorToast(response?.message);
          }
        } catch (error) {
          console.error('Error saving education:', error);
        }
      }

      refetchEducation();
    } catch (error) {
      console.error('Error adding education:', error);
    }
  };

  const handleAddUExperience = async () => {
    try {
      const list = Array.isArray(experienceList) ? experienceList : [];
      for (const exp of list) {
        const dep = exp?.department as any;
        const departmentId =
          typeof dep === 'object' && dep?._id ? dep._id : (exp?.department ?? '');
        const payload = {
          experience_id: exp._id || '',
          title: exp?.title,
          preferred_position: exp?.preferred_position,
          company: exp?.company,
          department: departmentId,
          department_id: departmentId,
          country: exp?.country,
          job_start: {
            month: exp?.jobStart_month,
            year: exp?.jobStart_year,
          },
          experience_type: exp.experience_type,
          still_working: exp.still_working,
          ...(exp.still_working === false && {
            job_end: {
              month: exp?.jobEnd_month,
              year: exp?.jobEnd_year,
            },
          }),
          ...(yearsOfExperienceOption?.label && {
            years_of_experience: yearsOfExperienceOption.label,
          }),
          ...(exp?.preferred_position && {
            desired_job_title: exp.preferred_position,
          }),
        };

        console.log('✅ ~ Experience Payload:', JSON.stringify(payload, null, 2));
        const response = await addUpdateExperience(payload).unwrap();
        console.log('✅ ~ Experience Response:', JSON.stringify(response, null, 2));

        if (response?.status) {
          // successToast(response?.message);
          // dispatch(setActiveStep(3)); 
        } else {
          errorToast(response?.message);
        }
      }

      refetchExperience();
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  const handleAddAboutMe = async () => {
    const formData = new FormData();

    const locationData = route.params?.locationData;
    const city =
      locationData?.city ??
      aboutmeandResumes?.city ??
      userInfo?.city ??
      (() => {
        const loc = aboutEdit?.location || '';
        if (!loc) return '';
        const parts = loc.split(/\s*[,-]\s*/).map((p: string) => p.trim()).filter(Boolean);
        return parts[0] ?? '';
      })();
    const country =
      locationData?.country ??
      aboutmeandResumes?.country ??
      userInfo?.country ??
      (() => {
        const loc = aboutEdit?.location || '';
        if (!loc) return '';
        const parts = loc.split(/\s*[,-]\s*/).map((p: string) => p.trim()).filter(Boolean);
        return parts.length >= 2 ? parts.slice(1).join(', ') : '';
      })();

    const debugPayload: any = {
      open_for_job: !!aboutEdit?.open_for_jobs,
      about: aboutEdit?.about || '',
      city,
      country,
      skills: aboutEdit?.selectedSkills || [],
      years_of_experience: yearsOfExperienceOption?.label || null,
      languages: (aboutEdit?.selectedLanguages || []).map((l: any) => ({
        name: l?.name,
        level: l?.level,
      })),
      resumes: (resumes || [])
        .filter((resume: any) => !resume._id)
        .map((resume: any, index: number) => ({
          uri: resume.file,
          type: resume.type,
          name: resume.file_name || `resume_${index}.pdf`,
        })),
    };

    console.log(
      '🔥 [CreateProfileScreen] /updateAboutMe payload:',
      JSON.stringify(debugPayload, null, 2),
    );

    formData.append('open_for_job', debugPayload.open_for_job ? '1' : '0');
    formData.append('about', debugPayload.about);
    if (city) formData.append('city', city);
    if (country) formData.append('country', country);
    formData.append('skills', (aboutEdit?.selectedSkills || []).join(','));

    if (debugPayload.years_of_experience) {
      formData.append('years_of_experience', debugPayload.years_of_experience);
    }

    debugPayload.languages.forEach((lang: any, index: number) => {
      formData.append(`languages[${index}][name]`, lang.name);
      formData.append(`languages[${index}][level]`, lang.level);
    });

    debugPayload.resumes.forEach((resume: any) => {
      formData.append('resumes', resume as any);
    });

    try {
      const res = await updateAboutMe(formData).unwrap();
      console.log(
        '🔥 [CreateProfileScreen] /updateAboutMe response:',
        JSON.stringify(res, null, 2),
      );
      const updatedData = res?.data?.user;

      if (res?.status) {
        dispatch(setShowModal(true));
      } else {
        errorToast(res?.message);
      }

      dispatch(
        setAboutEdit({
          aboutMe: '',
          about: '',
          checkEnd: false,
          location: '',
          open_for_jobs: false,
          responsibilities: '',
          proficiency: '',
          selectedLanguages: [],
          languages: [],
          selectOne: [],
          isOn: false,
        }),
      );
    } catch (error) {
      console.error('Error adding about me:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (isEducationUpdate) {
        console.log('isEducationUpdate called >>>>>>>>>>>.');
        await handleAddEducation();
      }

      const serverDesiredJobTitle =
        experienceUser?.desired_job_title || userInfo?.desired_job_title || '';
      const currentDesiredJobTitle = (globalDesiredJobTitle || '').trim();

      const serverYearsLabel =
        experienceUser?.years_of_experience ||
        aboutmeandResumes?.years_of_experience ||
        userInfo?.years_of_experience ||
        '';
      const currentYearsLabel = yearsOfExperienceOption?.label || '';

      const hasDesiredChanged =
        currentDesiredJobTitle.length > 0 &&
        currentDesiredJobTitle !== serverDesiredJobTitle;
      const hasYearsChanged =
        !!currentYearsLabel && currentYearsLabel !== serverYearsLabel;

      if (isExperienceUpdate || hasDesiredChanged || hasYearsChanged) {
        console.log('isExperienceUpdate/changed called >>>>>>>>>>>.');
        await handleAddUExperience();
      }

      await handleAddAboutMe();
      console.log('handleAddAboutMe called >>>>>>>>>>>.');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
    }
  };

  const handleRemoveEducation = async (item: EducationItem | any) => {
    Alert.alert(
      'Remove Education',
      'Are you sure you want to remove this',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              if (item?._id) {
                const res = await removeEducation(item._id).unwrap();
                successToast(res?.message || 'Education removed');
                refetchEducation();
                dispatch(
                  setEducationList(educationList.filter(edu => edu._id !== item._id)),
                );
              } else {
                dispatch(
                  setEducationList(
                    educationList.filter(edu => edu.education_id !== item.education_id),
                  ),
                );
              }
            } catch (error) {
              errorToast('Failed to remove education');
              console.error(error);
            }
          },
        },
      ],
    );
  };

  const handleRemoveExperience = async (item: ExperienceItem | any) => {
    Alert.alert(
      'Remove Experience',
      'Are you sure you want to remove this',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              if (item?._id) {
                const res = await removeExperience(item._id).unwrap();
                successToast(res?.message || 'Experience removed');
                refetchExperience();
                setExperienceList(experienceList.filter(exp => exp._id !== item._id));
              } else {
                dispatch(
                  setExperienceList(
                    experienceList.filter(
                      exp => exp.experience_id !== item.experience_id,
                    ),
                  ),
                );
              }
            } catch (error) {
              errorToast('Failed to remove experience');
              console.error(error);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{ flex: 1, backgroundColor: colors._F7F7F7 }}>
      <LinearContainer
        containerStyle={{ flex: 1 }}
        colors={[colors._F7F7F7, colors._F7F7F7]}>
        <View style={styles.topConrainer}>
          <BackHeader
            type="employe"
            isRight={true}
            titleStyle={{ color: colors._0B3970 }}
            title={route.params?.isEdit ? 'Edit your Profile' : 'Create Your Profile'}
            RightIcon={<View />}
            onBackPress={() => {
              if (activeStep === 1) {
                goBack();
                dispatch(
                  setEducationListEdit({
                    degree: '',
                    university: '',
                    startDate_month: '',
                    startDate_year: '',
                    endDate_month: '',
                    endDate_year: '',
                    country: '',
                    province: '',
                    isEditing: false,
                  }),
                );

                dispatch(
                  setExperienceListEdit({
                    experience_id: '',
                    job_end: { month: '', year: '' },
                    job_start: { month: '', year: '' },
                    preferred_position: '',
                    title: '',
                    company: '',
                    department: '',
                    country: '',
                    jobStart_month: '',
                    jobStart_year: '',
                    jobEnd_month: '',
                    jobEnd_year: '',
                    still_working: false,
                    experience_type: '',
                    isEditing: false,
                  }),
                );

                dispatch(
                  setAboutEdit({
                    aboutMe: '',
                    about: '',
                    checkEnd: false,
                    location: '',
                    open_for_jobs: false,
                    responsibilities: '',
                    proficiency: '',
                    selectedLanguages: [],
                    languages: [],
                    selectOne: [],
                    isOn: false,
                  }),
                );

                dispatch(setEducationList([]));
                dispatch(setExperienceList([]));
                dispatch(setActiveStep(1));
              } else {
                dispatch(setActiveStep(activeStep - 1));
              }
            }}
          />
        </View>

        <Stepper activeStep={activeStep} onPress={(step) => dispatch(setActiveStep(step))} />

        <KeyboardAwareScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(30) }}
          keyboardShouldPersistTaps="handled">
          {activeStep === 1 && (
            <>
              {educationList?.length > 0 &&
                educationList?.map((item: any, index: number) => (
                  <EducationCard
                    key={item?._id || item?.education_id || index}
                    item={item}
                    type="Education"
                    onRemove={() => handleRemoveEducation(item)}
                    onEdit={() => {
                      const deg = item?.degree as any;
                      const degreeId =
                        typeof deg === 'object' && deg?._id
                          ? deg._id
                          : (item?.degree ?? '');
                      dispatch(
                        setEducationListEdit({
                          ...item,
                          degree: degreeId,
                          startDate_month:
                            item?.startDate_month ||
                            item?.start_date?.month ||
                            '',
                          startDate_year:
                            item?.startDate_year ||
                            item?.start_date?.year ||
                            '',
                          endDate_month:
                            item?.endDate_month || item?.end_date?.month || '',
                          endDate_year:
                            item?.endDate_year || item?.end_date?.year || '',
                          isEditing: true,
                        }),
                      );
                    }}
                  />
                ))}

              <EducationList
                educationList={educationData || educationList}
                educationListEdit={educationListEdit}
                setEducationListEdit={val =>
                  dispatch(setEducationListEdit(val))
                }
                addNewEducation={() => {}}
                onNextPress={() => {}}
              />
            </>
          )}

          {activeStep === 2 && (
            <>
              {experienceList?.length > 0 &&
                experienceList?.map((item: ExperienceItem, index: number) => (
                  <EducationCard
                    key={index}
                    item={item}
                    type={'Experience'}
                    onRemove={() => handleRemoveExperience(item)}
                    onEdit={() => {
                      const parseDate = (
                        val?: string | { month?: string; year?: string },
                      ) => {
                        if (!val) return { month: '', year: '' };

                        if (typeof val === 'object') {
                          return {
                            month: val.month || '',
                            year: val.year || '',
                          };
                        }

                        if (typeof val === 'string') {
                          const parts = val.split(' ');
                          return {
                            month: parts[0] || '',
                            year: parts[1] || '',
                          };
                        }

                        return { month: '', year: '' };
                      };

                      const start = parseDate(item?.job_start);
                      const end = parseDate(item?.job_end);

                      const dep = item?.department as any;
                      const departmentId =
                        typeof dep === 'object' && dep?._id ? dep._id : (item?.department ?? '');
                      dispatch(
                        setExperienceListEdit({
                          ...item,
                          department: departmentId,
                          jobStart_month: item?.jobStart_month || start.month,
                          jobStart_year: item?.jobStart_year || start.year,
                          jobEnd_month: item?.jobEnd_month || end.month,
                          jobEnd_year: item?.jobEnd_year || end.year,
                          isEditing: true,
                        }),
                      );
                    }}
                  />
                ))}
              <ExperienceList
                experienceList={experienceList}
                experienceListEdit={experienceListEdit}
                setExperienceListEdit={(val: any) =>
                  dispatch(setExperienceListEdit(val))
                }
                desiredJobTitle={globalDesiredJobTitle}
                disableDesiredJob={false}
                onExperienceTypePress={() => {
                  if (scrollRef.current) {
                    if (typeof scrollRef.current.scrollTo === 'function') {
                      scrollRef.current.scrollTo({x: 0, y: hp(180), animated: true});
                    }
                  }
                }}
                yearsOfExperienceNode={
                  <View style={[styles.yearsExperienceRow, styles.experienceDropdownField]}>
                    <BaseText style={styles.experienceDropdownLabel}>
                      {t('Years of Experience')}
                    </BaseText>
                    <CustomDropdown
                      data={experienceOptionsData}
                      labelField="label"
                      valueField="value"
                      value={yearsOfExperienceOption?.value}
                      onChange={(e: any) => {
                        setYearsOfExperienceOption(
                          e?.value != null ? { label: e.label, value: e.value } : null,
                        );
                      }}
                      dropdownStyle={styles.experienceDropdown}
                      renderRightIcon={IMAGES.ic_down}
                      RightIconStyle={styles.experienceDropdownRightIcon}
                      selectedTextStyle={styles.experienceDropdownSelectedText}
                      placeholder={t('Select one')}
                    />
                  </View>
                }
              />
            </>
          )}

          {activeStep === 3 && (
            <AboutMeList
              aboutEdit={aboutEdit}
              skillsList={skillsList}
              isEdit={route.params?.isEdit}
              onNextPress={() => {
                dispatch(setActiveStep(4));
              }}
              experienceList={experienceList}
              setAboutEdit={(val: any) => dispatch(setAboutEdit(val))}
              item={[]}
              onPressMessage={() => {}}
            />
          )}

          {activeStep === 4 && (
            <UploadResume resumes={resumes} setResumes={setResumes} />
          )}
        </KeyboardAwareScrollView>

        <SuccessffullyModal
          visible={showModal}
          onClose={() => {
            dispatch(setShowModal(false));
            dispatch(setActiveStep(1));
          }}
        />
      </LinearContainer>

      {activeStep === 1 && (
        <View style={styles.buttonStyle}>
          <TouchableOpacity
            onPress={handleSaveOrAddEducation}
            disabled={
              !educationListEdit?.isEditing &&
              isEmptyEducation(educationListEdit)
            }
            style={[
              styles.btnRow,
              !educationListEdit?.isEditing &&
              isEmptyEducation(educationListEdit) && {
                opacity: 0.5,
              },
            ]}>
            <Image
              style={styles.closeIcon}
              source={
                educationListEdit?.isEditing ? IMAGES.check : IMAGES.close1
              }
            />
            <BaseText style={styles.addEduText}>
              {educationListEdit?.isEditing || educationList.length === 0
                ? 'Save Education'
                : 'Add Education'}
            </BaseText>
          </TouchableOpacity>

          <GradientButton
            type="Company"
            style={styles.btn}
            title="Next"
            onPress={async () => {
              await handleAddEducation();
              dispatch(setActiveStep(2));
            }}
          // disabled={educationList?.length === 0}
          />
          {route.params?.isEdit && (
            <GradientButton
              type="Company"
              style={styles.btn}
              title="Update Profile"
              onPress={() => {
                handleUpdateProfile();
              }}
            />
          )}
        </View>
      )}

      {activeStep === 2 && (
        <View style={styles.buttonStyle}>
          <TouchableOpacity
            onPress={handleSaveOrAddExperience}
            disabled={
              !experienceListEdit?.isEditing &&
              isEmptyExperience(experienceListEdit)
            }
            style={[
              styles.btnRow,
              !experienceListEdit?.isEditing &&
              isEmptyExperience(experienceListEdit) && {
                opacity: 0.5,
              },
            ]}>
            <Image
              style={styles.closeIcon}
              source={
                experienceListEdit?.isEditing ? IMAGES.check : IMAGES.close1
              }
            />
            <BaseText style={styles.addEduText}>
              {experienceListEdit?.isEditing
                ? 'Save Exeprience'
                : 'Add Experience'}
            </BaseText>
          </TouchableOpacity>

          <GradientButton
            type="Company"
            style={styles.btn}
            title={'Next'}
            onPress={async () => {
              if (yearsOfExperienceOption?.label) {
                try {
                  const fd = new FormData();
                  fd.append('years_of_experience', yearsOfExperienceOption.label);
                  await empUpdateProfile(fd).unwrap();
                } catch (_) {
                  // non-blocking; still allow moving to step 3
                }
              }
              dispatch(setActiveStep(3));
            }}
          />
          {route.params?.isEdit && (
            <GradientButton
              type="Company"
              style={styles.btn}
              title={'Update Profile'}
              onPress={() => {
                handleUpdateProfile();
              }}
            />
          )}
        </View>
      )}

      {activeStep === 3 && (
        <>
          <GradientButton
            type="Company"
            style={[
              styles.btn,
              {
                marginHorizontal: wp(25),
              },
            ]}
            title={'Next'}
            disabled={!aboutEdit?.selectedSkills || aboutEdit?.selectedSkills?.length === 0}
            onPress={() => {
              if (!aboutEdit?.selectedSkills || aboutEdit?.selectedSkills?.length === 0) {
                errorToast('Please select at least one skill');
                return;
              }
              dispatch(setActiveStep(4));
            }}
          />
          {route.params?.isEdit && (
            <GradientButton
              type="Company"
              style={[
                styles.btn,
                {
                  marginHorizontal: wp(25),
                },
              ]}
              title={'Update Profile'}
              onPress={() => {
                if (
                  !aboutEdit?.selectedSkills ||
                  aboutEdit?.selectedSkills?.length === 0
                ) {
                  errorToast('Please select at least one skill');
                  return;
                }
                handleUpdateProfile();
              }}
            />
          )}
        </>
      )}

      {activeStep === 4 && (
        <GradientButton
          type="Company"
          style={[
            styles.btn,
            {
              marginHorizontal: wp(25),
            },
          ]}
          title={'Update Profile'}
          onPress={() => {
            if (isLoadingAboutme || isLoadingEducation || isLoadingExperience) {
              return;
            } else {
              handleUpdateProfile();
            }
          }}
        />
      )}
      {(isLoadingEducation || isLoadingAboutme) && <Loader />}
    </SafeAreaView>
  );
};
export default CreateProfileScreen;

const styles = StyleSheet.create({
  topConrainer: {
    paddingTop: hp(18),
    paddingBottom: hp(5),
    paddingHorizontal: wp(25),
  },
  yearsExperienceRow: {
    marginTop: hp(20),
    marginBottom: hp(4),
  },
  experienceDropdownField: {
    gap: hp(12),
    marginBottom: hp(4),
    zIndex: 10,
  },
  experienceDropdownLabel: {
    ...commonFontStyle(600, 18, colors._050505),
    marginBottom: hp(4),
  },
  experienceDropdown: {
    borderRadius: 10,
  },
  experienceDropdownRightIcon: {
    width: wp(16),
    height: hp(13),
    tintColor: colors._0B3970,
  },
  experienceDropdownSelectedText: {
    ...commonFontStyle(400, 16, colors._181818),
  },
  btnRow: {
    gap: hp(4),
    marginTop: hp(10),
    borderWidth: wp(2),
    paddingTop: hp(12),
    flexDirection: 'row',
    borderRadius: hp(50),
    marginBottom: hp(12),
    alignItems: 'center',
    paddingBottom: hp(12),
    marginHorizontal: wp(4),
    borderColor: colors._0B3970,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  btn: {
    marginHorizontal: wp(4),
    marginBottom: hp(10)
  },
  addEduText: {
    ...commonFontStyle(500, 20, colors._0B3970),
  },
  closeIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  buttonStyle: {
    paddingHorizontal: wp(25),
  },
});
