import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Progress from 'react-native-progress';
import { colors } from '../../theme/colors';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import BottomModal from './BottomModal';

interface InterviewScoresModalProps {
    visible: boolean;
    onClose: () => void;
    initialTab?: 'General' | 'Languages';
}

const InterviewScoresModal = ({
    visible,
    onClose,
    initialTab = 'General',
}: InterviewScoresModalProps) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'General' | 'Languages'>(initialTab);

    useEffect(() => {
        if (visible) {
            setActiveTab(initialTab);
        }
    }, [visible, initialTab]);

    const renderScoreItem = (
        title: string,
        score: number,
        maxScore: number,
        description: string,
        color: string
    ) => {
        return (
            <View style={styles.scoreItem}>
                <View style={styles.scoreHeader}>
                    <Text style={styles.scoreTitle}>{title}</Text>
                    <View style={styles.scoreRightContainer}>
                        <Text style={styles.scoreValue}>
                            {score} Out of {maxScore}
                        </Text>
                        <View style={styles.progressBarContainer}>
                            <Progress.Bar
                                progress={score / maxScore}
                                width={wp(65)}
                                height={hp(4)}
                                color={color}
                                unfilledColor="#E2E6F0"
                                borderWidth={0}
                                borderRadius={hp(4)}
                            />
                        </View>
                    </View>
                </View>
                <Text style={styles.description}>
                    {description}{' '}
                    <Text style={styles.readMore}>{t('Read More...')}</Text>
                </Text>
            </View>
        );
    };

    const generalScores = [
        {
            title: t('Overall'),
            score: 3,
            max: 5,
            desc: t('Candidate demonstrates the core competencies required for the role & shows potential for success within the organization. Consider'),
            color: '#2FB465',
        },
        {
            title: t('Enthusiasm & Motivation'),
            score: 5,
            max: 5,
            desc: t('Candidate displays genuine interest in the role & Ribbon AI’s mission. Evaluate their energy level during the interview, curiosity'),
            color: '#2FB465',
        },
        {
            title: t('Skills and Experience'),
            score: 4,
            max: 5,
            desc: t('Candidate displays genuine interest in the role & Ribbon AI’s mission. Evaluate their energy level during the interview, curiosity'),
            color: '#2FB465',
        },
        {
            title: t('Communication'),
            score: 5,
            max: 5,
            desc: t('Candidate expresses ideas clearly and listens effectively. Evaluate their ability to articulate thoughts, respond thoughtfully'),
            color: '#2FB465',
        },
    ];

    const languageScores = [
        {
            title: t('Comprehension'),
            score: 3,
            max: 5,
            desc: t('Candidate demonstrates ability to understand spoken & written English in professional contexts. Assess their comprehension'),
            color: '#2FB465',
        },
        {
            title: t('Fluency and pace'),
            score: 5,
            max: 5,
            desc: t('Candidate communicates in English with appropriate fluency & natural pace. Evaluate their ability to express'),
            color: '#2FB465',
        },
        {
            title: t('Grammar and structure'),
            score: 4,
            max: 5,
            desc: t('Candidate uses correct English grammar and sentence structures appropriate for professional environments. Assess their consistent'),
            color: '#2FB465',
        },
        {
            title: t('Vocabulary & expressions'),
            score: 5,
            max: 5,
            desc: t('Candidate possesses sufficient English vocabulary & expressions for professional use. Evaluate their command of industry-appropriate'),
            color: '#2FB465',
        },
    ];

    const currentData = activeTab === 'General' ? generalScores : languageScores;
    const title = activeTab === 'General' ? t('General Scores') : t('Language Proficiency');

    return (
        <BottomModal
            visible={visible}
            onClose={onClose}
            style={styles.modalContent}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {currentData.map((item, index) => (
                    <View key={index} style={styles.itemWrapper}>
                        {renderScoreItem(item.title, item.score, item.max, item.desc, item.color)}
                    </View>
                ))}
            </ScrollView>
        </BottomModal>
    );
};

export default InterviewScoresModal;

const styles = StyleSheet.create({
    modalContent: {
        maxHeight: '85%',
        paddingHorizontal: wp(20),
        paddingTop: hp(20),
        paddingBottom: hp(30),
    },
    header: {
        marginBottom: hp(20),
        paddingHorizontal: wp(5),
    },
    title: {
        ...commonFontStyle(700, 20, colors._0B3970),
    },
    scrollContent: {
        paddingBottom: hp(20),
    },
    itemWrapper: {
        marginBottom: hp(16),
        backgroundColor: colors.white,
        borderRadius: wp(12),
        borderWidth: 1,
        borderColor: '#E2E6F0',
        padding: wp(16),
    },
    scoreItem: {
        gap: hp(8),
    },
    scoreHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    scoreTitle: {
        ...commonFontStyle(600, 16, colors._0B3970),
        flex: 1,
        marginRight: wp(10),
    },
    scoreRightContainer: {
        alignItems: 'flex-end',
    },
    scoreValue: {
        ...commonFontStyle(500, 14, colors.black),
    },
    scoreMax: {
        ...commonFontStyle(500, 12, '#999'),
    },
    progressBarContainer: {
        marginTop: hp(6),
    },
    description: {
        ...commonFontStyle(400, 13, '#666'),
        lineHeight: hp(20),
        marginTop: hp(4),
    },
    readMore: {
        ...commonFontStyle(600, 13, colors._0B3970),
    },
});
