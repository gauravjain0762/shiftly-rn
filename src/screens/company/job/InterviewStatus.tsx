import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { BackHeader, LinearContainer } from '../../../component';
import { colors } from '../../../theme/colors';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import CustomImage from '../../../component/common/CustomImage';
import { IMAGES } from '../../../assets/Images';
import InterviewScoresModal from '../../../component/common/InterviewScoresModal';

const InterviewStatus = () => {
    const { t } = useTranslation();
    const route = useRoute<any>();
    const { jobData, candidateData } = route.params || {};

    // Mock data fallbacks for UI visualization
    const jobTitle = jobData?.title || 'Restaurant Manager';
    const companyName = jobData?.company_name || 'Atlantis, The Palm, Dubai';
    const location =
        jobData?.city || jobData?.location
            ? `${jobData?.city || ''} ${jobData?.country || ''}`
            : 'Dubai, UAE';
    const contract = jobData?.contract_type || 'Full Time';
    const salary =
        jobData?.monthly_salary_to
            ? `${jobData?.currency} ${jobData?.monthly_salary_to / 1000}k`
            : 'AED 10k';

    const candidateName = candidateData?.name || 'Tafnol Theresa';
    const candidateRole = candidateData?.responsibility || 'Hotel Management';
    const candidateImg = candidateData?.picture;

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
                            <Text style={styles.logoText}>{companyName?.[0] || 'A'}</Text>
                        </View>
                        <View style={styles.jobInfo}>
                            <Text style={styles.jobTitle}>{jobTitle}</Text>
                            <Text style={styles.companyName}>{companyName}</Text>
                            <View style={styles.jobMetaRow}>
                                <Text style={styles.jobMeta}>{`${location} - ${contract}`}</Text>
                                <Text style={styles.salary}>{salary}</Text>
                            </View>
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
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{t('Completed')}</Text>
                            </View>
                            <Text style={styles.dateText}>2:30 PM - 04Jan</Text>
                        </View>
                    </View>
                </View>

                {/* Media Buttons */}
                <View style={styles.mediaRow}>
                    <TouchableOpacity style={styles.mediaButton}>
                        <Image source={IMAGES.sound} style={styles.mediaIcon} />
                        <Text style={styles.mediaText}>{t('Listen Audio')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediaButton}>
                        <Image source={IMAGES.watch} style={styles.mediaIcon} />
                        <Text style={styles.mediaText}>{t('Watch Interview')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Transcript */}
                <Text style={styles.sectionTitle}>{t('Transcript')}</Text>
                <View style={styles.transcriptBox}>
                    <Text style={styles.transcriptText}>
                        <Text style={styles.speaker}>{t('Agent')}: </Text>
                        Hi, I'm from Emirates Catering calling about your AI-powered
                        interview. How are you doing?
                    </Text>
                    <Text style={[styles.transcriptText, { marginTop: hp(12) }]}>
                        <Text style={styles.speaker}>{t('User')}: </Text>
                        I'm very good. Thank you so much. How are you?
                    </Text>
                    <Text style={[styles.transcriptText, { marginTop: hp(12) }]}>
                        <Text style={styles.speaker}>{t('Agent')}: </Text>
                        I'm doing great, thanks for asking! I appreciate you taking the time
                        to chat today. So, thanks for your interest in the Flight Attendant
                        position with us. I'm really looking forward to learning more about
                        your background and seeing how this role Read More...
                    </Text>
                </View>

                {/* Chat with Admin */}
                <TouchableOpacity style={styles.chatButton}>
                    <View style={styles.chatIconWrapper}>
                        <Image source={IMAGES.chat} style={styles.chatIcon} resizeMode="contain" />
                    </View>
                    <View>
                        <Text style={styles.chatTitle}>{t('Chat With Admin')}</Text>
                        <Text style={styles.chatSubtitle}>
                            {t('Get feel free information')}
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
