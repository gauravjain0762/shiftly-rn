import React, { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'

import { colors } from '../../../theme/colors'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { SCREENS } from '../../../navigation/screenNames'
import BaseText from '../../../component/common/BaseText'
import { navigateTo } from '../../../utils/commonFunction'
import { SafeAreaView } from 'react-native-safe-area-context'
import { commonFontStyle, hp, wp } from '../../../theme/fonts'
import { getCurrencySymbol } from '../../../utils/currencySymbols';
import { getJobMonthlySalaryRangeText } from '../../../utils/monthlySalaryRange';
import { BackHeader, LinearContainer } from '../../../component'
import CommonButton from '../../../component/common/CommonButton'
import BottomModal from '../../../component/common/BottomModal';
import { IMAGES } from '../../../assets/Images';
import CustomImage from '../../../component/common/CustomImage';
import { useGetInterviewsQuery, useOpenInterviewMutation } from '../../../api/dashboardApi';
import { errorToast } from '../../../utils/commonFunction';

const JobInvitationScreen = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const [showInterviewSetupModal, setShowInterviewSetupModal] = useState(false);
    const [openInterview, { isLoading: isOpeningInterview }] = useOpenInterviewMutation();
    const hasStartedInterviewRef = useRef(false);

    const route = useRoute();
    const { jobDetail, link, invitationStatus, invitationId } = route.params as {
        jobDetail: any;
        link: string;
        invitationStatus?: string;
        invitationId?: string;
    };
    const job = jobDetail?.job || jobDetail;
    console.log("🔥 ~ JobInvitationScreen ~ job:", JSON.stringify(job, null, 2))

    const company = job?.company_id || jobDetail?.company_id;
    const { data: interviewsData, refetch: refetchInterviews } = useGetInterviewsQuery(
        { page: 1 },
        { refetchOnFocus: true, refetchOnMountOrArgChange: true },
    );
    const allInvitations = React.useMemo(() => {
        const list =
            interviewsData?.data?.invitations || interviewsData?.data?.interviews || [];
        return Array.isArray(list) ? list : [];
    }, [interviewsData]);

    const matchedInvitation = React.useMemo(() => {
        if (!allInvitations.length) return null;

        if (invitationId) {
            const byId = allInvitations.find((inv: any) => String(inv?._id) === String(invitationId));
            if (byId) return byId;
        }

        if (link) {
            const byLink = allInvitations.find((inv: any) => String(inv?.interview_link || '') === String(link));
            if (byLink) return byLink;
        }

        const routeJobId = job?._id || jobDetail?._id || jobDetail?.job_id;
        if (routeJobId) {
            const byJobId = allInvitations.find((inv: any) => {
                const invJobId = inv?.job_id?._id || inv?.job_id;
                return String(invJobId || '') === String(routeJobId);
            });
            if (byJobId) return byJobId;
        }

        return null;
    }, [allInvitations, invitationId, link, job?._id, jobDetail?._id, jobDetail?.job_id]);
    const hasValidRouteInvitationId = React.useMemo(
        () =>
            Boolean(
                invitationId &&
                allInvitations.some((inv: any) => String(inv?._id) === String(invitationId)),
            ),
        [invitationId, allInvitations],
    );
    const effectiveInvitationId =
        (hasValidRouteInvitationId ? invitationId : undefined) ||
        jobDetail?.invitation?._id ||
        job?.invitation?._id ||
        matchedInvitation?._id;
    const effectiveInvitationStatus = matchedInvitation?.status || invitationStatus;
    const canJoinInterview =
        String(effectiveInvitationStatus || '').trim().toLowerCase() === 'invited';

    const callOpenInterviewApi = useCallback(async () => {
        if (!effectiveInvitationId) {
            errorToast('Invitation not found');
            return false;
        }
        try {
            console.log('openInterview payload >>>', { invitation_id: effectiveInvitationId });
            const res: any = await openInterview({
                invitation_id: effectiveInvitationId,
            }).unwrap();
            if (!res?.status) {
                errorToast(res?.message || 'Failed to open interview');
                return false;
            }
            return true;
        } catch (e: any) {
            errorToast(e?.data?.message || e?.message || 'Failed to open interview');
            return false;
        }
    }, [effectiveInvitationId, openInterview]);

    // Re-call openInterview when user returns from WebView to this screen.
    useFocusEffect(
        useCallback(() => {
            refetchInterviews();
            if (hasStartedInterviewRef.current) {
                callOpenInterviewApi();
            }
        }, [callOpenInterviewApi, refetchInterviews]),
    );

    return (
        <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(25) }} edges={['bottom']}>
                <View style={styles.topConrainer}>
                    <BackHeader
                        type="employe"
                        isRight={false}
                        title={'Invited For Interview'}
                        containerStyle={styles.header}
                        RightIcon={<View style={{ width: 20 }} />}
                    />
                </View>

                <View style={styles.card}>
                    <CustomImage
                        uri={company?.logo}
                        containerStyle={styles.avatar}
                        imageStyle={styles.avatar}
                        resizeMode='cover'
                    />

                    <View style={styles.textContainer}>
                        <BaseText style={styles.empTitle}>
                            {job?.title}
                        </BaseText>

                        <View style={styles.empRow}>
                            <BaseText style={[styles.location, { flex: 1 }]}>
                                {[job?.city, job?.country].filter(Boolean).join(', ')}
                            </BaseText>
                        </View>
                        <BaseText style={styles.location}>
                            {job?.contract_type}
                        </BaseText>
                        {/* <BaseText style={styles.salary}>
                            {`${job?.currency?.toUpperCase()} `}
                            {job?.currency?.toUpperCase() === 'AED' ? (
                                <Image source={IMAGES.currency} style={styles.currencyImage} />
                            ) : (
                                getCurrencySymbol(job?.currency)
                            )}
                            {` ${getJobMonthlySalaryRangeText(job)}`}
                        </BaseText> */}
                        <View style={styles.salaryRow}>
                            {job?.currency?.toUpperCase() === 'AED' ? (
                                <Image source={IMAGES.currency} style={styles.currencyImage} />
                            ) : (
                                <Text style={styles.currencySymbol}>{getCurrencySymbol(job?.currency)}</Text>
                            )}
                            <BaseText style={styles.salary} numberOfLines={1}>
                                {getJobMonthlySalaryRangeText(job)}
                            </BaseText>
                        </View>
                    </View>
                </View>

                <View style={{ marginTop: hp(50), flex: 1, }}>
                    <BaseText style={{ ...commonFontStyle(700, 20, colors._0B3970) }}>{`Dear ${userInfo?.name || 'Candidate'},`}</BaseText>
                    <BaseText style={{ ...commonFontStyle(400, 16, colors._0B3970), marginTop: hp(12), lineHeight: hp(25) }}>{"Thank you for applying for the "}
                        <BaseText style={{ ...commonFontStyle(700, 16, colors._0B3970) }}>
                            {`${job?.title} `}
                        </BaseText>
                        position at{" "}
                        <BaseText style={{ ...commonFontStyle(700, 16, colors._0B3970) }}>
                            {`${company?.company_name} `}
                        </BaseText>
                    </BaseText>
                    <BaseText style={{ ...commonFontStyle(500, 16, colors._0B3970), marginTop: hp(10), lineHeight: hp(25) }}>{"You are invited to complete your "}
                        <BaseText style={{ ...commonFontStyle(700, 16, colors._0B3970) }}>
                            {'AI video interview, '}
                        </BaseText>
                        {"which is the next step of the selection process. This short interview will help us better understand your experience, communication skills, and suitability for the role."}</BaseText>
                    <BaseText style={{ ...commonFontStyle(500, 16, colors._0B3970), marginTop: hp(5), lineHeight: hp(25) }}>{"We recommend completing the interview within the "}
                        <BaseText style={{ ...commonFontStyle(700, 16, colors._0B3970) }}>
                            {'next 48 hours '}
                        </BaseText>
                        {"to maximize your chances of progressing to the next stage. "}
                        <BaseText style={{ ...commonFontStyle(700, 16, colors._0B3970) }}>
                            {"Best of luck!"}</BaseText>
                    </BaseText>
                </View>

                {canJoinInterview && (
                    <CommonButton
                        title='Join  Interview'
                        textStyle={{ ...commonFontStyle(500, 20, colors.white) }}
                        btnStyle={{
                            marginVertical: hp(20), backgroundColor: colors._0B3970, borderRadius: hp(50),
                        }}
                        onPress={() => {
                            setShowInterviewSetupModal(true);
                        }}
                    />
                )}

                <BottomModal
                    visible={showInterviewSetupModal}
                    onClose={() => setShowInterviewSetupModal(false)}
                    backgroundColor={colors.white}>
                    <ScrollView
                        style={styles.setupScroll}
                        contentContainerStyle={styles.setupScrollContent}
                        showsVerticalScrollIndicator={false}>
                        <View style={styles.setupModalHeader}>
                            <View style={styles.setupIconCircle}>
                                <Image source={IMAGES.frame_person_mic} style={styles.setupHeaderIcon} />
                            </View>
                            <BaseText style={styles.setupTitle}>Interview Setup</BaseText>
                        </View>

                        <BaseText style={styles.setupSubtitle}>
                            Before starting your AI interview, please follow these steps:
                        </BaseText>

                        <View style={styles.setupList}>
                            <View style={styles.setupRow}>
                                <Image source={IMAGES.mic} style={styles.setupRowIcon} />
                                <BaseText style={styles.setupRowText}>
                                    Speak out loud to check if your microphone is working.
                                </BaseText>
                            </View>
                            <View style={styles.setupRow}>
                                <Image source={IMAGES.record_voice_over} style={styles.setupRowIcon} />
                                <BaseText style={styles.setupRowText}>
                                    Click &quot;Test Speakers&quot; to confirm you can hear the sound.
                                </BaseText>
                            </View>
                            <View style={styles.setupRow}>
                                <Image source={IMAGES.brand_awareness} style={styles.setupRowIcon} />
                                <BaseText style={styles.setupRowText}>
                                    Once you hear it, click &quot;I confirm I hear the sound.&quot;
                                </BaseText>
                            </View>
                            <View style={styles.setupRow}>
                                <Image source={IMAGES.video_cam} style={styles.setupRowIcon} />
                                <BaseText style={styles.setupRowText}>
                                    Ensure your camera is working properly.
                                </BaseText>
                            </View>
                            <View style={styles.setupRow}>
                                <Image source={IMAGES.priority_high} style={styles.setupRowIcon} />
                                <View style={{ flex: 1 }}>
                                    <BaseText style={[styles.setupRowText, styles.setupImportant]}>
                                        Important Reminder:
                                    </BaseText>
                                    <BaseText style={styles.setupRowText}>
                                        If you leave this page, the interview link will expire. Once completed, you&apos;re ready to start your interview!
                                    </BaseText>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <CommonButton
                        title={isOpeningInterview ? 'Please wait...' : 'Continue'}
                        textStyle={{ ...commonFontStyle(500, 20, colors.white) }}
                        btnStyle={{
                            marginTop: hp(10),
                            marginBottom: hp(8),
                            backgroundColor: colors._0B3970,
                            borderRadius: hp(50),
                            opacity: isOpeningInterview ? 0.8 : 1,
                        }}
                        isLoading={isOpeningInterview}
                        disabled={isOpeningInterview}
                        onPress={async () => {
                            if (isOpeningInterview) return;
                            const ok = await callOpenInterviewApi();
                            if (!ok) return;
                            hasStartedInterviewRef.current = true;
                            setShowInterviewSetupModal(false);
                            navigateTo(SCREENS.WebviewScreen, {
                                link: link,
                                title: 'Interview',
                                type: 'interview',
                            });
                        }}
                    />
                </BottomModal>
            </SafeAreaView>
        </LinearContainer >
    )
}

export default JobInvitationScreen

const styles = StyleSheet.create({
    topConrainer: {
        paddingVertical: hp(18),
    },
    header: {
        marginBottom: hp(1),
    },
    card: {
        gap: wp(14),
        borderWidth: 1,
        padding: hp(14),
        marginTop: hp(10),
        flexDirection: 'row',
        borderRadius: wp(20),
        alignItems: 'center',
        borderColor: colors._0B3970,
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
        ...commonFontStyle(400, 15, colors._939393),
    },
    salary: {
        ...commonFontStyle(700, 16, colors._0D468C),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    salaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencyImage: {
        width: wp(14),
        height: hp(14),
        resizeMode: 'contain',
        tintColor: colors._0B3970,
    },
    currencySymbol: {
        ...commonFontStyle(400, 14, colors._0D468C),
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
    setupModalHeader: {
        alignItems: 'center',
        marginBottom: hp(12),
    },
    setupScroll: {
        maxHeight: hp(500),
    },
    setupScrollContent: {
        paddingBottom: hp(8),
    },
    setupIconCircle: {
        width: wp(74),
        height: wp(74),
        borderRadius: wp(37),
        backgroundColor: colors._0B3970,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(10),
    },
    setupHeaderIcon: {
        width: wp(40),
        height: wp(40),
        resizeMode: 'contain',
        tintColor: colors.white,
    },
    setupTitle: {
        ...commonFontStyle(600, 25, '#111111'),
        textAlign: 'center',
    },
    setupSubtitle: {
        ...commonFontStyle(400, 14, '#1A1A1A'),
        textAlign: 'center',
        marginBottom: hp(16),
    },
    setupList: {
        gap: hp(10),
        marginBottom: hp(10),
    },
    setupRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(10),
    },
    setupRowIcon: {
        width: wp(19),
        height: wp(19),
        resizeMode: 'contain',
        tintColor: colors._0B3970,
        marginTop: hp(2),
    },
    setupRowText: {
        ...commonFontStyle(400, 14, '#1A1A1A'),
        flex: 1,
        lineHeight: hp(20),
    },
    setupImportant: {
        ...commonFontStyle(700, 14, '#1A1A1A'),
        marginBottom: hp(2),
    },
})