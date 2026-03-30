import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { animation } from '../../../assets/animation';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import {
    BackHeader,
    GradientButton,
    LinearContainer,
} from '../../../component';
import { colors } from '../../../theme/colors';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { IMAGES } from '../../../assets/Images';
import BottomModal from '../../../component/common/BottomModal';
import ReadMoreText from '../../../component/common/ReadMoreText';
import {
    errorToast,
    navigateTo,
    resetNavigation,
    successToast,
    goBack,
} from '../../../utils/commonFunction';
import { getCurrencySymbol } from '../../../utils/currencySymbols';
import {
    formatMonthlySalaryRangeText,
    getJobMonthlySalaryRangeText,
} from '../../../utils/monthlySalaryRange';
import { SCREENS } from '../../../navigation/screenNames';
import {
    useEditCompanyJobMutation,
    useGetCompanyJobDetailsQuery,
    useGetCompanyLanguagesQuery,
    useGetCompanyEducationsQuery,
    useGetCompanyExperiencesQuery,
    useGetCompanyCertificationsQuery,
    useGetCompanyOtherRequirementsQuery,
    useGetEssentialBenefitsQuery,
    useGetSkillsQuery,
} from '../../../api/dashboardApi';
import { useCreateJobMutation } from '../../../api/authApi';
import { useAppSelector } from '../../../redux/hooks';
import { resetJobFormState, selectJobForm, setCoPostJobSteps } from '../../../features/companySlice';
import useJobFormUpdater from '../../../hooks/useJobFormUpdater';
import { navigationRef } from '../../../navigation/RootContainer';

const JobPreview = () => {
    const { t } = useTranslation();
    const route = useRoute<any>();
    const isFocused = useIsFocused();
    const dispatch = useDispatch<any>();
    const insets = useSafeAreaInsets();
    const { updateJobForm } = useJobFormUpdater();
    const [createJob] = useCreateJobMutation();
    const [editJob] = useEditCompanyJobMutation();

    const { data: languageDataVals } = useGetCompanyLanguagesQuery({});
    const languageData = React.useMemo(
        () =>
            languageDataVals?.data?.languages?.map((item: any) => ({
                label: item?.title,
                value: item?._id,
            })) || [],
        [languageDataVals],
    );

    const { data: educationDataVals } = useGetCompanyEducationsQuery({});
    const educationMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        educationDataVals?.data?.educations?.forEach((item: any) => {
            if (item?._id) map[item._id] = item.title || '';
        });
        return map;
    }, [educationDataVals]);

    const { data: experienceDataVals } = useGetCompanyExperiencesQuery({});
    const experienceMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        experienceDataVals?.data?.experiences?.forEach((item: any) => {
            if (item?._id) map[item._id] = item.title || '';
        });
        return map;
    }, [experienceDataVals]);

    const { data: certificationDataVals } = useGetCompanyCertificationsQuery({});
    const certificationMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        certificationDataVals?.data?.certifications?.forEach((item: any) => {
            if (item?._id) map[item._id] = item.title || '';
        });
        return map;
    }, [certificationDataVals]);

    const { data: otherRequirementsDataVals } = useGetCompanyOtherRequirementsQuery({});
    const otherReqMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        otherRequirementsDataVals?.data?.otherRequirements?.forEach((item: any) => {
            if (item?._id) map[item._id] = item.title || '';
        });
        return map;
    }, [otherRequirementsDataVals]);

    const { data: essentialBenefitsDataVals } = useGetEssentialBenefitsQuery();
    const essentialBenefitMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        essentialBenefitsDataVals?.data?.benefits?.forEach((item: any) => {
            const id = item?._id ?? item?.id;
            if (id) map[id] = item.title || '';
        });
        return map;
    }, [essentialBenefitsDataVals]);

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
        essential_benefits,
        jobSkills,
        requirements,
        editMode,
        job_id,
        expiry_date,
        isSuccessModalVisible,
        education,
        experience,
        certification,
        languages,
        other_requirements,
    } = useAppSelector((state: any) => selectJobForm(state));

    const { userInfo } = useAppSelector((state: any) => state.auth);

    const {
        userAddress,
        skillId,
        location,
        jobId: routeJobId,
    } = route.params || {};
    const isReadOnlyPreview = Boolean(routeJobId) && !editMode;

    const [createdJobId, setCreatedJobId] = useState<string>('');
    const [createdJobData, setCreatedJobData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showHiringAnimation, setShowHiringAnimation] = useState(false);
    const proficiencyLevels = ['Basic', 'Conversational', 'Fluent', 'Native'];

    const { data: skillsData } = useGetSkillsQuery({});
    const { data: jobDetailsById } = useGetCompanyJobDetailsQuery(routeJobId, {
        skip: !routeJobId,
    });
    const skillMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        const list = skillsData?.data?.skills;
        if (Array.isArray(list)) {
            list.forEach((item: any) => {
                if (item?._id) map[item._id] = item.title || '';
            });
        }
        return map;
    }, [skillsData]);

    const getLanguageDotColor = (level: string) => {
        switch (level) {
            case 'Native':
                return colors._0B3970;
            case 'Fluent':
                return colors._4A4A4A;
            case 'Conversational':
                return colors._7B7878;
            case 'Basic':
                return colors._D9D9D9;
            default:
                return '#999999';
        }
    };

    const apiJob = React.useMemo(
        () => jobDetailsById?.data?.job || null,
        [jobDetailsById],
    );
    const displayCompany = apiJob?.company_id || userInfo;
    const displayTitle = apiJob?.title || title || 'Job Title';
    const displayDescription = apiJob?.description || describe || 'No description provided';
    const displayContractType = apiJob?.contract_type || contract_type?.label || contract_type?.value || '-';
    const displayDuration = apiJob?.duration || duration?.label || duration?.value || '-';
    const displayStartDate = apiJob?.start_date || startDate?.label || startDate?.value || '-';
    const displayPositions = apiJob?.no_positions || position?.value || '';
    const displaySector =
        apiJob?.job_sector ||
        apiJob?.department_id?.title ||
        job_sector?.label ||
        (job_sector as any)?.title ||
        '-';

    const displaySkills = React.useMemo(() => {
        if (Array.isArray(apiJob?.skills) && apiJob.skills.length > 0) {
            return apiJob.skills;
        }
        return Array.isArray(jobSkills) ? jobSkills : [];
    }, [apiJob, jobSkills]);

    const displayRequirements = React.useMemo(() => {
        if (Array.isArray(apiJob?.job_requirements) && apiJob.job_requirements.length > 0) {
            return apiJob.job_requirements;
        }
        return Array.isArray(requirements) ? requirements : [];
    }, [apiJob, requirements]);

    const displayEducation = React.useMemo(() => {
        if (Array.isArray(apiJob?.educations) && apiJob.educations.length > 0) {
            return apiJob.educations;
        }
        return Array.isArray(education) ? education : [];
    }, [apiJob, education]);

    const displayExperience = React.useMemo(() => {
        if (Array.isArray(apiJob?.experiences) && apiJob.experiences.length > 0) {
            return apiJob.experiences;
        }
        return Array.isArray(experience) ? experience : [];
    }, [apiJob, experience]);

    const displayCertifications = React.useMemo(() => {
        if (Array.isArray(apiJob?.certifications) && apiJob.certifications.length > 0) {
            return apiJob.certifications;
        }
        return Array.isArray(certification) ? certification : [];
    }, [apiJob, certification]);

    const displayOtherRequirements = React.useMemo(() => {
        if (Array.isArray(apiJob?.job_requirements) && apiJob.job_requirements.length > 0) {
            return apiJob.job_requirements;
        }
        return Array.isArray(other_requirements) ? other_requirements : [];
    }, [apiJob, other_requirements]);

    const displayBenefits = React.useMemo(() => {
        if (Array.isArray(apiJob?.essential_benefits) && apiJob.essential_benefits.length > 0) {
            return apiJob.essential_benefits;
        }
        const createdBenefits = (createdJobData as any)?.essential_benefits;
        if (Array.isArray(createdBenefits) && createdBenefits.length > 0) {
            return createdBenefits;
        }
        return Array.isArray(essential_benefits) ? essential_benefits : [];
    }, [apiJob, createdJobData, essential_benefits]);

    const previewLanguages = React.useMemo(() => {
        const source = Array.isArray(apiJob?.languages) && apiJob.languages.length > 0
            ? apiJob.languages
            : Array.isArray(languages)
                ? languages
                : [];

        return source
            .filter((l: any) => l)
            .map((l: any) => {
                const id =
                    typeof l === 'object'
                        ? l.id ?? l.value ?? l._id ?? l.language_id ?? ''
                        : l;
                const level = typeof l === 'object' ? l.level || '' : '';
                const fromMap =
                    languageData.find((opt: any) => String(opt?.value) === String(id))?.label ?? '';
                const fallbackName =
                    typeof l === 'object'
                        ? l.name ?? l.title ?? id
                        : l;
                const name = (fromMap || fallbackName || '').toString();
                return { name, level };
            });
    }, [apiJob, languages, languageData]);

    const formatSalary = () => {
        const currencyCode = apiJob?.currency || currency?.value || 'AED';
        const salaryRangeTextFromApi = getJobMonthlySalaryRangeText(apiJob);
        if (salaryRangeTextFromApi) {
            return (
                <View style={styles.salaryContainer}>
                    {currencyCode === 'AED' ? (
                        <Image source={IMAGES.currency} style={styles.currencyImage} />
                    ) : (
                        <Text style={styles.currencySymbol}>{getCurrencySymbol(currencyCode)}</Text>
                    )}
                    <Text style={styles.jobSalary}>{salaryRangeTextFromApi}</Text>
                </View>
            );
        }

        if (!salary?.value) return null;
        const salaryRangeText = formatMonthlySalaryRangeText(salary.value);
        if (!salaryRangeText) return null;
        return (
            <View style={styles.salaryContainer}>
                {currencyCode === 'AED' ? (
                    <Image source={IMAGES.currency} style={styles.currencyImage} />
                ) : (
                    <Text style={styles.currencySymbol}>{getCurrencySymbol(currencyCode)}</Text>
                )}
                <Text style={styles.jobSalary}>
                    {salaryRangeText}
                </Text>
            </View>
        );
    };

    // Animation finish handler - called after a short delay (~1–1.5s)
    const handleAnimationFinish = () => {
        const jobIdToUse = createdJobId || job_id;
        const rawJobData = createdJobData;
        const jobDataToUse = rawJobData?.data?.job
            ? rawJobData
            : rawJobData?.job
                ? { data: { job: rawJobData.job } }
                : rawJobData
                    ? { data: { job: rawJobData } }
                    : null;

        setShowHiringAnimation(false);
        dispatch(resetJobFormState());
        dispatch(setCoPostJobSteps(1));

        if (jobIdToUse) {
            navigateTo(SCREENS.SuggestedEmployee, {
                jobId: jobIdToUse,
                jobData: jobDataToUse,
                fromPostJob: true,
            });
        } else {
            navigationRef?.current?.goBack();
        }
    };

    const handlePostJob = async () => {
        setIsLoading(true);

        const finalLat = userAddress?.lat || location?.latitude || userInfo?.lat;
        const finalLng = userAddress?.lng || location?.longitude || userInfo?.lng;

        console.log(
            '🔥 [JobPreview] using lat/lng:',
            { finalLat, finalLng, userAddress, fallbackLocation: location, userInfoLat: userInfo?.lat, userInfoLng: userInfo?.lng },
        );

        const params = {
            title: title,
            contract_type: contract_type?.label || contract_type?.value || '',
            area: area?.value ?? '',
            description: describe,
            address: userAddress?.address || userInfo?.address || '',
            city: userAddress?.state || userInfo?.state || '',
            country: userAddress?.country || userInfo?.country || '',
            lat: finalLat ?? null,
            lng: finalLng ?? null,
            people_anywhere: true,
            duration: duration?.value,
            department_id: job_sector?.value,
            job_sector: job_sector?.label || job_sector?.value,
            expiry_date: expiry_date,
            start_date: startDate?.value,
            monthly_salary_range: salary?.value || '',
            no_positions: position?.value,
            skills: Array.isArray(skillId) ? skillId.filter(Boolean).join(',') : '',
            currency: currency?.value,
            essential_benefits: Array.isArray(essential_benefits)
                ? essential_benefits.map((item: any) => item?._id).filter(Boolean).join(',')
                : '',
            educations: Array.isArray(education) ? education.filter(Boolean).join(',') : '',
            experiences: Array.isArray(experience) ? experience.filter(Boolean).join(',') : '',
            certifications: Array.isArray(certification) ? certification.filter(Boolean).join(',') : '',
            languages: Array.isArray(languages)
                ? languages
                    .filter((l: any) => l && (typeof l === 'object' ? l.id : l))
                    .map((l: any) => {
                        const id = typeof l === 'object' ? l.id : l;
                        const level = typeof l === 'object' ? l.level || '' : '';
                        // Resolve name: form state > languageData lookup > id as fallback (NEVER send empty - backend clears languages)
                        const resolvedName =
                            (typeof l === 'object' && l?.name && String(l.name).trim()) ||
                            languageData.find((opt: any) => String(opt?.value) === String(id))?.label ||
                            '';
                        const name = resolvedName || (id ? String(id) : '');
                        return { id, name, language_id: id, level: level || '' };
                    })
                : [],
            job_requirements: Array.isArray(other_requirements)
                ? other_requirements.filter(Boolean).join(',')
                : '',
        };
        console.log(">>>>>>>>>>> ~ handlePostJob ~ params:", params)

        try {
            let response;

            if (editMode) {
                response = await editJob({ job_id: job_id, ...params }).unwrap();
            } else {
                response = (await createJob(params).unwrap()) as any;
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
                updateJobForm({ isSuccessModalVisible: true });
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewSuggestedEmployees = () => {
        console.log('[DEBUG] handleViewSuggestedEmployees: START');
        updateJobForm({ isSuccessModalVisible: false });
        console.log('[DEBUG] Set animation true');
        setShowHiringAnimation(true);
        // Navigate after a short animation delay (~1.2s)
        setTimeout(handleAnimationFinish, 1200);
    };

    const handleGoHome = () => {
        dispatch(resetJobFormState());
        dispatch(setCoPostJobSteps(1));
        updateJobForm({ isSuccessModalVisible: false });
        resetNavigation(SCREENS.CoStack, SCREENS.CoTabNavigator);
    };

    const locationDisplay = () => {
        if (apiJob) {
            const city = apiJob?.city || '';
            const country = apiJob?.country || '';
            const areaValue = apiJob?.area || '';
            if (city && country) return `${city}, ${country}`;
            return city || country || areaValue || '';
        }
        const city = userAddress?.state || userInfo?.state || '';
        const country = userAddress?.country || userInfo?.country || '';
        if (city && country) return `${city}, ${country}`;
        return city || country || '';
    };

    return (
        <LinearContainer colors={[colors.white, colors.white]}>
            <View style={styles.header}>
                <BackHeader
                    type="company"
                    onBackPress={() => goBack()}
                    title={t('Job Preview')}
                    isRight={true}
                    RightIcon={IMAGES.notification}
                />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                {/* Job Card Header */}
                <View style={styles.jobCard}>
                    <View style={styles.jobCardRow}>
                        <View style={styles.companyLogo}>
                            {displayCompany?.logo ? (
                                <Image source={{ uri: displayCompany.logo }} style={styles.logoImage} />
                            ) : (
                                <Text style={styles.companyLogoText}>
                                    {displayCompany?.company_name?.[0]?.toUpperCase() || 'C'}
                                </Text>
                            )}
                        </View>
                        <View style={styles.jobCardInfo}>
                            <Text style={styles.jobTitle}>{displayTitle}</Text>
                            <Text style={styles.companyName}>
                                {displayCompany?.company_name || 'N/A'}
                            </Text>
                            <View style={styles.jobMetaRow}>
                                <Text style={styles.jobLocation}>
                                    {locationDisplay()} - {displayContractType}
                                </Text>
                                {formatSalary()}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Job Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('Job Description')}</Text>
                    <ReadMoreText
                        text={displayDescription}
                        numberOfLines={4}
                        style={styles.sectionText}
                    />
                </View>

                {/* Job Duration & Sector */}
                <View style={styles.rowSection}>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>{t('Job Duration')}</Text>
                        <Text style={styles.sectionValue}>{displayDuration}</Text>
                    </View>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>{t('Job Sector/Industry')}</Text>
                        <Text style={styles.sectionValue}>{displaySector}</Text>
                    </View>
                </View>

                {/* Start Date & Positions */}
                <View style={styles.rowSection}>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>{t('Start date')}</Text>
                        <Text style={styles.sectionValue}>{displayStartDate}</Text>
                    </View>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>{t('Number of positions available')}</Text>
                        <Text style={styles.sectionValue}>{displayPositions ? `${displayPositions} Positions` : '-'}</Text>
                    </View>
                </View>

                {/* Job Required Skills */}
                {displaySkills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('Job Required Skills')}</Text>
                        {displaySkills.map((skill: any, index: number) => {
                            const raw = skill?.title || skill?.label || skill || '';
                            // If raw looks like a MongoDB ObjectId, resolve via skillMap
                            const display = /^[a-f\d]{24}$/i.test(String(raw).trim())
                                ? skillMap[String(raw).trim()] || raw
                                : raw;
                            return (
                                <Text key={index} style={styles.bulletItem}>
                                    {display}
                                </Text>
                            );
                        })}
                    </View>
                )}

                {/* Job Requirements */}
                {displayRequirements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('Job Requirements')}</Text>
                        {displayRequirements.filter((req: any) => req && String(req).trim()).map((req: any, index: number) => (
                            <View key={index} style={styles.bulletRow}>
                                <View style={styles.bullet} />
                                <Text style={styles.bulletText}>{req?.title || req?.label || String(req)}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {displayEducation.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('Education')}</Text>
                        {displayEducation
                            .filter((item: any) => item)
                            .map((item: any, index: number) => (
                                <View key={index} style={styles.bulletRow}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.bulletText}>
                                        {item?.title ||
                                            item?.label ||
                                            educationMap[item?._id] ||
                                            (typeof item === 'string' ? educationMap[item] || item : '')}
                                    </Text>
                                </View>
                            ))}
                    </View>
                )}

                {/* Experience */}
                {displayExperience.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('Experience')}</Text>
                        {displayExperience
                            .filter((item: any) => item)
                            .map((item: any, index: number) => (
                                <View key={index} style={styles.bulletRow}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.bulletText}>
                                        {item?.title ||
                                            item?.label ||
                                            experienceMap[item?._id] ||
                                            (typeof item === 'string' ? experienceMap[item] || item : '')}
                                    </Text>
                                </View>
                            ))}
                    </View>
                )}

                {/* Certifications */}
                {displayCertifications.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('Certifications')}</Text>
                        {displayCertifications
                            .filter((item: any) => item)
                            .map((item: any, index: number) => (
                                <View key={index} style={styles.bulletRow}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.bulletText}>
                                        {item?.title ||
                                            item?.label ||
                                            certificationMap[item?._id] ||
                                            (typeof item === 'string' ? certificationMap[item] || item : '')}
                                    </Text>
                                </View>
                            ))}
                    </View>
                )}

                {/* Languages */}
                {previewLanguages.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('Languages')}</Text>
                        <View style={styles.languageContainer}>
                            {previewLanguages.map((lang: any, index: number) => (
                                <View key={index} style={styles.languageChipWithDots}>
                                    <Text style={styles.languageChipName}>{lang?.name || '-'}</Text>
                                    <View style={styles.languageDotsRow}>
                                        {proficiencyLevels.map(level => {
                                            const isActive = lang?.level === level;
                                            return (
                                                <View
                                                    key={level}
                                                    style={[
                                                        styles.langDotWrapper,
                                                        isActive && {
                                                            borderWidth: 2,
                                                            borderColor: getLanguageDotColor(level),
                                                            borderRadius: 16,
                                                            width: 32,
                                                            height: 32,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        },
                                                    ]}>
                                                    <View
                                                        style={[
                                                            styles.langDot,
                                                            { backgroundColor: getLanguageDotColor(level) },
                                                        ]}
                                                    />
                                                    {isActive && (
                                                        <Text
                                                            numberOfLines={1}
                                                            style={[
                                                                styles.langDotLabel,
                                                                { color: getLanguageDotColor(level) },
                                                            ]}>
                                                            {level}
                                                        </Text>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Other Requirements */}
                {displayOtherRequirements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('Other Requirements')}</Text>
                        {displayOtherRequirements
                            .filter((req: any) => req && String(req).trim())
                            .map((req: any, index: number) => (
                                <View key={index} style={styles.bulletRow}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.bulletText}>
                                        {req?.title ||
                                            req?.label ||
                                            otherReqMap[req?._id] ||
                                            (typeof req === 'string' ? otherReqMap[req] || req : '')}
                                    </Text>
                                </View>
                            ))}
                    </View>
                )}

                {/* Key Job Benefits */}
                {(() => {
                    const source = displayBenefits;

                    if (!Array.isArray(source) || source.length === 0) return null;

                    return (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('Key Job Benefits')}</Text>
                            {source.map((benefit: any, index: number) => {
                                const id =
                                    benefit?._id ??
                                    benefit?.id ??
                                    (typeof benefit === 'string' ? benefit : '');
                                const mappedTitle = id ? essentialBenefitMap[id] : '';
                                const rawTitle =
                                    benefit?.title ||
                                    benefit?.label ||
                                    mappedTitle ||
                                    (typeof benefit === 'string' ? benefit : '');
                                return (
                                    <View key={index} style={styles.bulletRow}>
                                        <View style={styles.bullet} />
                                        <Text style={styles.bulletText}>
                                            {String(rawTitle).trim() || '-'}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    );
                })()}
            </ScrollView>

            {/* Post / Update Job Button */}
            {!isReadOnlyPreview && (
                <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + hp(20) }]}>
                    <GradientButton
                        type="Company"
                        title={t(editMode ? 'Update Job' : 'Post Job')}
                        style={styles.postButton}
                        onPress={handlePostJob}
                        disabled={isLoading}
                    />
                </View>
            )}

            {/* Success Modal */}
            <BottomModal
                visible={isSuccessModalVisible && isFocused}
                backgroundColor={colors._FAEED2}
                onClose={() => updateJobForm({ isSuccessModalVisible: false })}>
                <View style={styles.modalIconWrapper}>
                    <LottieView
                        source={animation.success_check}
                        autoPlay
                        loop={false}
                        style={styles.modalCheckIcon}
                        resizeMode="cover"
                    />
                </View>

                <View>
                    <Text style={styles.modalTitle}>
                        {t(editMode ? 'Job Updated Successfully' : 'Job Posted Successfully')}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                        {t(
                            editMode
                                ? "Your changes have been saved. The updated job is now live for candidates."
                                : "We're excited to post your job. get ready to start receiving profiles.",
                        )}
                    </Text>
                </View>

                <GradientButton
                    type="Company"
                    style={styles.modalButton}
                    onPress={handleViewSuggestedEmployees}
                    textStyle={{ textAlign: 'center' }}
                    title={t(editMode ? 'View Job Detail' : 'View Suggested Employees')}
                />

                <Text onPress={handleGoHome} style={styles.modalHomeText}>
                    {t('Home')}
                </Text>
            </BottomModal>

            {showHiringAnimation && (
                <View style={[styles.animationContainer, StyleSheet.absoluteFillObject]}>
                    <LottieView
                        source={animation.hiring}
                        autoPlay
                        loop={false}
                        style={styles.lottie}
                        resizeMode="contain"
                    />
                </View>
            )}
        </LinearContainer >
    );
};

export default JobPreview;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: wp(25),
        paddingTop: hp(26),
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: wp(25),
        paddingBottom: hp(120),
        paddingTop: hp(20),
    },
    jobCard: {
        borderWidth: 1,
        borderColor: '#E2E6F0',
        borderRadius: wp(18),
        padding: wp(16),
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        marginBottom: hp(20),
    },
    jobCardRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    companyLogo: {
        width: wp(56),
        height: wp(56),
        borderRadius: wp(56),
        backgroundColor: '#F5F6FA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp(12),
        overflow: 'hidden',
    },
    logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    companyLogoText: {
        ...commonFontStyle(600, 18, colors._0B3970),
    },
    jobCardInfo: {
        flex: 1,
    },
    jobTitle: {
        ...commonFontStyle(700, 18, colors._0B3970),
    },
    companyName: {
        ...commonFontStyle(400, 14, colors._4A4A4A),
        marginTop: hp(2),
    },
    jobMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(6),
    },
    jobLocation: {
        ...commonFontStyle(400, 13, colors._939393),
        flex: 1,
    },
    jobSalary: {
        ...commonFontStyle(700, 14, colors._0B3970),
    },
    salaryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencyImage: {
        width: wp(18),
        height: hp(18),
        resizeMode: 'contain',
        marginRight: wp(4),
        tintColor: colors._0B3970,
    },
    currencySymbol: {
        ...commonFontStyle(700, 14, colors._0B3970),
        marginRight: wp(2),
    },
    section: {
        marginBottom: hp(20),
    },
    sectionTitle: {
        ...commonFontStyle(600, 16, colors._0B3970),
        marginBottom: hp(8),
    },
    sectionText: {
        ...commonFontStyle(400, 14, colors._4A4A4A),
        lineHeight: hp(22),
    },
    readMore: {
        ...commonFontStyle(600, 14, colors._0B3970),
        marginTop: hp(4),
    },
    rowSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(20),
    },
    halfSection: {
        flex: 1,
    },
    sectionValue: {
        ...commonFontStyle(400, 14, colors._4A4A4A),
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: hp(8),
    },
    bullet: {
        width: wp(8),
        height: wp(8),
        borderRadius: wp(4),
        backgroundColor: colors._0B3970,
        marginRight: wp(10),
        marginTop: hp(6),
    },
    bulletText: {
        ...commonFontStyle(400, 14, colors._4A4A4A),
        flex: 1,
        lineHeight: hp(20),
    },
    bulletItem: {
        ...commonFontStyle(400, 14, colors._4A4A4A),
        marginBottom: hp(6),
    },
    languageContainer: {
        gap: hp(10),
    },
    languageChipWithDots: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E0D7C8',
        backgroundColor: '#F5F5F5',
        borderRadius: wp(12),
        paddingVertical: hp(6),
        paddingHorizontal: wp(12),
        paddingBottom: hp(20),
    },
    languageChipName: {
        ...commonFontStyle(400, 16, colors._0B3970),
        flex: 1,
        marginRight: wp(8),
    },
    languageDotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
    },
    langDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    langDotWrapper: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    langDotLabel: {
        position: 'absolute',
        top: 32,
        ...commonFontStyle(500, 10, colors._0B3970),
        textAlign: 'center',
        width: 80,
        alignSelf: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: wp(25),
        paddingTop: hp(15),
        backgroundColor: colors.white,
    },
    postButton: {
        borderRadius: wp(25),
    },
    modalIconWrapper: {
        width: wp(90),
        height: wp(90),
        overflow: 'hidden',
        alignSelf: 'center',
        borderRadius: wp(90),
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCheckIcon: {
        width: wp(90),
        height: wp(90),
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
    modalButton: {
        marginTop: hp(20),
        borderRadius: wp(25),
        alignSelf: 'stretch',
    },
    modalHomeText: {
        marginTop: hp(15),
        marginBottom: hp(20),
        textAlign: 'center',
        ...commonFontStyle(400, 19, colors._050505),
    },
    animationContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    lottie: {
        width: wp(300),
        height: wp(300),
    },
});
