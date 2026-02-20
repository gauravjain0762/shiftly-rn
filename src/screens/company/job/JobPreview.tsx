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
import { useRoute } from '@react-navigation/native';
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
import {
    errorToast,
    navigateTo,
    resetNavigation,
    successToast,
    goBack,
} from '../../../utils/commonFunction';
import { getCurrencySymbol } from '../../../utils/currencySymbols';
import { SCREENS } from '../../../navigation/screenNames';
import { useEditCompanyJobMutation } from '../../../api/dashboardApi';
import { useCreateJobMutation } from '../../../api/authApi';
import { useAppSelector } from '../../../redux/hooks';
import { resetJobFormState, selectJobForm, setCoPostJobSteps } from '../../../features/companySlice';
import useJobFormUpdater from '../../../hooks/useJobFormUpdater';
import { navigationRef } from '../../../navigation/RootContainer';

const JobPreview = () => {
    const { t } = useTranslation();
    const route = useRoute<any>();
    const dispatch = useDispatch<any>();
    const insets = useSafeAreaInsets();
    const { updateJobForm } = useJobFormUpdater();
    const [createJob] = useCreateJobMutation();
    const [editJob] = useEditCompanyJobMutation();

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
        requirements,
        editMode,
        job_id,
        expiry_date,
        isSuccessModalVisible,
        education,
        experience,
        certification,
        language,
        other_requirements,
    } = useAppSelector((state: any) => selectJobForm(state));

    const { userInfo } = useAppSelector((state: any) => state.auth);

    const {
        userAddress,
        skillId,
        location,
    } = route.params || {};

    const [createdJobId, setCreatedJobId] = useState<string>('');
    const [createdJobData, setCreatedJobData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showHiringAnimation, setShowHiringAnimation] = useState(false);

    const formatSalary = () => {
        if (!salary?.value) return null;
        const [from, to] = salary.value.split('-').map((s: string) => s.trim());
        if (from && to) {
            const currencyCode = currency?.value || 'AED';
            return (
                <View style={styles.salaryContainer}>
                    {currencyCode === 'AED' ? (
                        <Image source={IMAGES.currency} style={styles.currencyImage} />
                    ) : (
                        <Text style={styles.currencySymbol}>{getCurrencySymbol(currencyCode)}</Text>
                    )}
                    <Text style={styles.jobSalary}>
                        {`${Number(from.replace(/,/g, '')).toLocaleString()} - ${Number(to.replace(/,/g, '')).toLocaleString()}`}
                    </Text>
                </View>
            );
        }
        return null;
    };

    // Animation finish handler - called after 3.5 seconds
    const handleAnimationFinish = () => {
        setTimeout(() => {
            const jobIdToUse = createdJobId || job_id;
            const jobDataToUse = createdJobData;

            setShowHiringAnimation(false);
            dispatch(resetJobFormState());
            dispatch(setCoPostJobSteps(1));

            if (jobIdToUse) {
                navigateTo(SCREENS.SuggestedEmployee, {
                    jobId: jobIdToUse,
                    jobData: jobDataToUse,
                });
            } else {
                navigationRef?.current?.goBack();
            }
        }, 3500);
    };

    const handlePostJob = async () => {
        setIsLoading(true);

        const finalLat = userAddress?.lat || location?.latitude || userInfo?.lat;
        const finalLng = userAddress?.lng || location?.longitude || userInfo?.lng;

        const [from, to] = salary?.value?.split('-') || [];

        const params = {
            title: title,
            contract_type: contract_type?.label || contract_type?.value || '',
            area: area?.value,
            description: describe,
            address: userAddress?.address || userInfo?.address || '',
            city: userAddress?.state || userInfo?.state || '',
            country: userAddress?.country || userInfo?.country || '',
            lat: finalLat,
            lng: finalLng,
            people_anywhere: true,
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
            educations: education?.value || '',
            experiences: experience?.value || '',
            certifications: certification?.value || '',
            languages: language?.value || '',
            job_requirements: Array.isArray(other_requirements) ? other_requirements.filter(Boolean).join(',') : '',
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
        // Navigation will be handled by onAnimationFinish callback
    };

    const handleGoHome = () => {
        dispatch(resetJobFormState());
        dispatch(setCoPostJobSteps(1));
        updateJobForm({ isSuccessModalVisible: false });
        resetNavigation(SCREENS.CoStack, SCREENS.CoTabNavigator);
    };

    const locationDisplay = () => {
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
                            {userInfo?.logo ? (
                                <Image source={{ uri: userInfo.logo }} style={styles.logoImage} />
                            ) : (
                                <Text style={styles.companyLogoText}>
                                    {userInfo?.company_name?.[0]?.toUpperCase() || 'C'}
                                </Text>
                            )}
                        </View>
                        <View style={styles.jobCardInfo}>
                            <Text style={styles.jobTitle}>{title || 'Job Title'}</Text>
                            <Text style={styles.companyName}>
                                {userInfo?.company_name || 'Company Name'}
                            </Text>
                            <View style={styles.jobMetaRow}>
                                <Text style={styles.jobLocation}>
                                    {locationDisplay()} - {contract_type?.label || contract_type?.value || 'Full Time'}
                                </Text>
                                {formatSalary()}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Job Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('Job Description')}</Text>
                    <Text style={styles.sectionText} numberOfLines={4}>
                        {describe || 'No description provided'}
                    </Text>
                    {describe && describe.length > 150 && (
                        <Text style={styles.readMore}>{t('Read More...')}</Text>
                    )}
                </View>

                {/* Job Duration & Sector */}
                <View style={styles.rowSection}>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>{t('Job Duration')}</Text>
                        <Text style={styles.sectionValue}>{duration?.label || duration?.value || '-'}</Text>
                    </View>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>{t('Job Sector/Industry')}</Text>
                        <Text style={styles.sectionValue}>{job_sector?.label || (job_sector as any)?.title || '-'}</Text>
                    </View>
                </View>

                {/* Start Date & Positions */}
                <View style={styles.rowSection}>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>{t('Start date')}</Text>
                        <Text style={styles.sectionValue}>{startDate?.label || startDate?.value || '-'}</Text>
                    </View>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>{t('Number of positions available')}</Text>
                        <Text style={styles.sectionValue}>{position?.value ? `${position.value} Positions` : '-'}</Text>
                    </View>
                </View>

                {/* Job Required Skills */}
                {jobSkills && jobSkills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('Job Required Skills')}</Text>
                        {jobSkills.map((skill: any, index: number) => (
                            <Text key={index} style={styles.bulletItem}>
                                {skill?.title || skill?.label || skill}
                            </Text>
                        ))}
                    </View>
                )}

                {/* Job Requirements */}
                {requirements && requirements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('Job Requirements')}</Text>
                        {requirements.filter((req: string) => req && req.trim()).map((req: string, index: number) => (
                            <View key={index} style={styles.bulletRow}>
                                <View style={styles.bullet} />
                                <Text style={styles.bulletText}>{req}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Key Job Benefits */}
                {selected && selected.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('Key Job Benefits')}</Text>
                        {selected.map((benefit: any, index: number) => (
                            <View key={index} style={styles.bulletRow}>
                                <View style={styles.bullet} />
                                <Text style={styles.bulletText}>{benefit?.title || benefit?.label || '-'}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Post Job Button */}
            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + hp(20) }]}>
                <GradientButton
                    type="Company"
                    title={t('Post Job')}
                    style={styles.postButton}
                    onPress={handlePostJob}
                    disabled={isLoading}
                />
            </View>

            {/* Success Modal */}
            <BottomModal
                visible={isSuccessModalVisible}
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
                    <Text style={styles.modalTitle}>{t('Job Posted Successfully')}</Text>
                    <Text style={styles.modalSubtitle}>
                        {t("We're excited to post your job. get ready to start receiving profiles.")}
                    </Text>
                </View>

                <GradientButton
                    type="Company"
                    style={styles.modalButton}
                    onPress={handleViewSuggestedEmployees}
                    textStyle={{ textAlign: 'center', alignSelf: 'center' }}
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
                        autoPlay={true}
                        loop={false}
                        style={styles.lottie}
                        resizeMode="contain"
                        onAnimationFinish={handleAnimationFinish}
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
        borderRadius: wp(12),
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
        width: wp(14),
        height: hp(11),
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
