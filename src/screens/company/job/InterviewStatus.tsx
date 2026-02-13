import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Linking,
} from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { BackHeader, LinearContainer } from '../../../component';
import { navigateTo } from '../../../utils/commonFunction';
import { getCurrencySymbol } from '../../../utils/currencySymbols';
import { SCREENS } from '../../../navigation/screenNames';
import { colors } from '../../../theme/colors';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import CustomImage from '../../../component/common/CustomImage';
import { IMAGES } from '../../../assets/Images';
import InterviewScoresModal from '../../../component/common/InterviewScoresModal';

const InterviewStatus = () => {
    const { t } = useTranslation();
    const route = useRoute<any>();
    const { jobData, candidateData, inviteData } = route.params || {};
    console.log("🔥🔥🔥 ~ InterviewStatus ~ jobData:", jobData)

    const jobTitle = jobData?.title || 'N/A';
    const companyName = jobData?.company_id?.company_name || 'N/A';
    const location = jobData?.address ||
        (jobData?.city || jobData?.country
            ? `${jobData?.city ? jobData?.city + ', ' : ''}${jobData?.country || ''}`
            : 'N/A');
    const contract = jobData?.contract_type || 'N/A';
    const renderSalary = () => {
        const from = jobData?.monthly_salary_from;
        const to = jobData?.monthly_salary_to;
        const cur = (jobData?.currency || 'AED').toUpperCase();
        const sym = getCurrencySymbol(cur);

        if (!from && !to) return <Text style={styles.salary}>N/A</Text>;

        return (
            <View style={styles.salaryRow}>
                {cur === 'AED' ? (
                    <Image source={IMAGES.currency} style={styles.currencyImage} />
                ) : (
                    <Text style={styles.currencySymbol}>{sym}</Text>
                )}
                <Text style={styles.salary}>
                    {from && to
                        ? `${from.toLocaleString()} - ${to.toLocaleString()}`
                        : (from ? from.toLocaleString() : to.toLocaleString())}
                </Text>
            </View>
        );
    };

    // Candidate Data Fallbacks
    const candidateName = candidateData?.name || inviteData?.user_id?.name || 'N/A';
    const candidateRole = candidateData?.responsibility || inviteData?.user_id?.responsibility || 'N/A';
    const candidateImg = candidateData?.picture || inviteData?.user_id?.picture;

    // Interview Status Data
    const rawStatus = inviteData?.status || 'Pending';
    const interviewStatus = rawStatus === 'Interview_completed' ? 'Completed' : rawStatus;
    const isInterviewCompleted = rawStatus === 'Interview_completed';
    const interviewDate = inviteData?.interview_completed
        ? moment(inviteData.interview_completed).format('h:mm A - DDMMM')
        : '';

    // Transcript Data
    const transcriptData = inviteData?.interview_response?.transcript_with_timestamp || [];
    const interviewAudioUrl = inviteData?.interview_response?.audio_url;
    const interviewVideoUrl = inviteData?.interview_response?.video_url;
    const interviewScores = inviteData?.interview_response?.scores;

    const [modalVisible, setModalVisible] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'General' | 'Languages'>('General');

    const handleOpenGeneral = () => {
        setActiveTab('General');
        setModalVisible(true);
    };

    const handleOpenLanguages = () => {
        setActiveTab('Languages');
        setModalVisible(true);
    };

    return (
        <LinearContainer colors={[colors.white, colors.white]}>
            <BackHeader title={t('Interview Status')} containerStyle={styles.header} />
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}>
                {/* Job Card */}
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.logoContainer}>
                            <CustomImage
                                uri={jobData?.company_id?.logo}
                                containerStyle={styles.logoImage}
                                imageStyle={styles.logoImage}
                                resizeMode='cover'
                            />
                        </View>
                        <View style={styles.jobInfo}>
                            <Text style={styles.jobTitle}>{jobTitle}</Text>
                            <Text style={styles.companyName}>{companyName}</Text>
                            <View style={styles.jobMetaRow}>
                                <Text style={styles.jobMeta}>{`${location} - ${contract}`}</Text>
                            </View>
                            {renderSalary()}
                        </View>
                    </View>
                </View>

                {/* Candidate Card */}
                <View style={[styles.card, { backgroundColor: '#BEDEFF3B' }]}>
                    <View style={[styles.row, { alignItems: 'center' }]}>
                        <CustomImage
                            uri={
                                candidateImg ||
                                'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=300&q=80'
                            }
                            containerStyle={styles.avatar}
                            imageStyle={styles.avatar}
                        />
                        <View style={styles.candidateInfo}>
                            <Text style={styles.candidateName}>{candidateName}</Text>
                            <Text style={styles.candidateRole}>{candidateRole}</Text>
                        </View>
                        <View style={styles.statusCol}>
                            <View style={[styles.statusBadge, !isInterviewCompleted && { backgroundColor: '#FFA500' }]}>
                                <Text style={styles.statusText}>{t(interviewStatus)}</Text>
                            </View>
                            {!!interviewDate && <Text style={styles.dateText}>{interviewDate}</Text>}
                        </View>
                    </View>
                </View>

                {/* Media Buttons */}
                <View style={styles.mediaRow}>
                    <TouchableOpacity
                        style={[styles.mediaButton, !isInterviewCompleted && { borderColor: '#D3D3D3' }]}
                        disabled={!isInterviewCompleted || !interviewAudioUrl}
                        onPress={() => {
                            if (interviewAudioUrl) {
                                Linking.openURL(interviewAudioUrl);
                            }
                        }}
                    >
                        <Image source={IMAGES.sound} style={[styles.mediaIcon, !isInterviewCompleted && { tintColor: '#D3D3D3' }]} />
                        <Text style={[styles.mediaText, !isInterviewCompleted && { color: '#D3D3D3' }]}>{t('Listen Audio')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.mediaButton, !isInterviewCompleted && { borderColor: '#D3D3D3' }]}
                        disabled={!isInterviewCompleted || !interviewVideoUrl}
                        onPress={() => {
                            if (interviewVideoUrl) {
                                Linking.openURL(interviewVideoUrl);
                            }
                        }}
                    >
                        <Image source={IMAGES.watch} style={[styles.mediaIcon, !isInterviewCompleted && { tintColor: '#D3D3D3' }]} />
                        <Text style={[styles.mediaText, !isInterviewCompleted && { color: '#D3D3D3' }]}>{t('Watch Interview')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Transcript */}
                <Text style={styles.sectionTitle}>{t('Transcript')}</Text>
                <View style={styles.transcriptBox}>
                    {transcriptData.length > 0 ? (
                        transcriptData.map((item: any, index: number) => (
                            <Text key={index} style={[styles.transcriptText, index > 0 && { marginTop: hp(12) }]}>
                                <Text style={styles.speaker}>{item.role === 'agent' ? t('Agent') : t('User')}: </Text>
                                {item.content}
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.transcriptText}>{t('No transcript available')}</Text>
                    )}
                </View>

                {/* Chat with Admin */}
                <TouchableOpacity
                    style={styles.chatButton}
                    onPress={() => {
                        navigateTo(SCREENS.CoChat, {
                            data: {
                                user_id: inviteData?.user_id,
                            },
                            mainjob_data: jobData,
                            isFromJobDetail: true,
                        });
                    }}
                >
                    <View style={styles.chatIconWrapper}>
                        <Image source={IMAGES.chat} style={styles.chatIcon} resizeMode="contain" />
                    </View>
                    <View>
                        <Text style={styles.chatTitle}>{t('Chat With Candidate')}</Text>
                        <Text style={styles.chatSubtitle}>
                            {t('Start a conversation')}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* View Interview Scores */}
                <Text style={styles.sectionTitle}>{t('View Interview Scores')}</Text>
                <View style={styles.scoreButtonsRow}>
                    <TouchableOpacity
                        style={[styles.scoreButton, styles.scoreButtonActive]}
                        onPress={handleOpenGeneral}>
                        <Text style={styles.scoreButtonTextActive}>{t('General')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.scoreButton, styles.scoreButtonActive]} // Changed to Active as per image looking consistent
                        onPress={handleOpenLanguages}>
                        <Text style={styles.scoreButtonTextActive}>{t('Languages')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <InterviewScoresModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                initialTab={activeTab}
                scores={interviewScores}
            />
        </LinearContainer>
    );
};

export default InterviewStatus;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: wp(25),
        paddingTop: hp(26),
        marginBottom: hp(10),
    },
    container: {
        paddingHorizontal: wp(25),
        paddingBottom: hp(40),
        gap: hp(20),
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: wp(16),
        borderWidth: 1,
        borderColor: '#E2E6F0',
        padding: wp(16),
    },
    row: {
        flexDirection: 'row',
    },
    logoContainer: {
        width: wp(50),
        height: wp(50),
        borderRadius: wp(25), // Circle
        borderWidth: 1,
        borderColor: '#E2E6F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp(12),
    },
    logoImage: {
        width: wp(50),
        height: wp(50),
        borderRadius: wp(25),
    },
    logoText: {
        ...commonFontStyle(600, 18, colors._0B3970),
    },
    jobInfo: {
        flex: 1,
    },
    jobTitle: {
        ...commonFontStyle(700, 18, colors._0B3970),
    },
    companyName: {
        ...commonFontStyle(400, 14, '#666'),
        marginTop: hp(2),
    },
    jobMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(8),
    },
    jobMeta: {
        ...commonFontStyle(400, 13, '#999'),
    },
    salary: {
        ...commonFontStyle(700, 14, colors._0B3970),
    },
    salaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(6),
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
    avatar: {
        width: wp(50),
        height: wp(50),
        borderRadius: wp(8),
    },
    candidateInfo: {
        flex: 1,
        marginLeft: wp(12),
        justifyContent: 'center',
    },
    candidateName: {
        ...commonFontStyle(600, 16, colors._0B3970),
    },
    candidateRole: {
        ...commonFontStyle(400, 14, colors.black),
        marginTop: hp(2),
    },
    statusCol: {
        alignItems: 'flex-end',
        gap: hp(4),
    },
    statusBadge: {
        backgroundColor: '#1C8C4E', // Green similar to image
        paddingHorizontal: wp(14),
        paddingVertical: hp(7),
        borderRadius: wp(16),
    },
    statusText: {
        ...commonFontStyle(500, 12, colors.white),
    },
    dateText: {
        ...commonFontStyle(400, 11, '#999'),
    },
    mediaRow: {
        flexDirection: 'row',
        gap: wp(16),
    },
    mediaButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: colors._0B3970,
        borderRadius: wp(30),
        paddingVertical: hp(12),
        gap: wp(8),
    },
    mediaIcon: {
        width: wp(26),
        height: wp(26),
        resizeMode: 'contain',
        tintColor: colors._0B3970,
    },
    mediaText: {
        ...commonFontStyle(600, 14, colors._0B3970),
    },
    sectionTitle: {
        ...commonFontStyle(600, 18, colors._0B3970),
        marginTop: hp(10),
    },
    transcriptBox: {
        borderWidth: 1,
        borderColor: '#E2E6F0',
        borderRadius: wp(12),
        padding: wp(16),
        backgroundColor: colors.white,
    },
    transcriptText: {
        ...commonFontStyle(400, 14, colors.black),
        lineHeight: hp(22),
    },
    speaker: {
        fontWeight: '700',
    },
    chatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F8FE', // Light blue bg
        borderWidth: 1,
        borderColor: '#B0C4DE',
        borderRadius: wp(40), // Fully rounded
        paddingHorizontal: wp(20),
        paddingVertical: hp(14),
        gap: wp(14),
    },
    chatIconWrapper: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: '#2FB465', // Green circle
        alignItems: 'center',
        justifyContent: 'center'
    },
    chatIcon: {
        width: wp(20),
        height: wp(20),
        tintColor: colors.white,
    },
    chatTitle: {
        ...commonFontStyle(600, 16, colors.black),
    },
    chatSubtitle: {
        ...commonFontStyle(400, 13, '#666'),
    },
    scoreButtonsRow: {
        flexDirection: 'row',
        gap: wp(16),
        marginBottom: hp(20),
    },
    scoreButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(16),
        borderRadius: wp(30),
    },
    scoreButtonActive: {
        backgroundColor: colors._0B3970,
    },
    scoreButtonInactive: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: '#E2E6F0',
    },
    scoreButtonTextActive: {
        ...commonFontStyle(600, 16, colors.white),
    },
    scoreButtonTextInactive: {
        ...commonFontStyle(600, 16, colors.white),
        // If it was inactive it might be different, but image suggests equality or toggle.
    },
});
