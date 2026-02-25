import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { IMAGES } from '../../assets/Images';
import { colors } from '../../theme/colors';
import { commonFontStyle, hp, wp } from '../../theme/fonts';

type Props = {
    interviewCount?: number;
    appliedCount?: number;
    matchedCount?: number;
    onPressInterview?: () => void;
    onPressApplied?: () => void;
    onPressMatched?: () => void;
};

const DashboardStats: FC<Props> = ({
    interviewCount = 0,
    appliedCount = 0,
    matchedCount = 0,
    onPressInterview,
    onPressApplied,
    onPressMatched,
}) => {
    return (
        <View style={styles.container}>
            {/* Left Large Card - Interview Requests */}
            <TouchableOpacity
                onPress={onPressInterview}
                style={[styles.card, styles.largeCard, { backgroundColor: '#FFEBEB' }]}
            >
                <View style={styles.iconContainer}>
                    <Image
                        source={IMAGES.star1}
                        style={[styles.largeIcon, { tintColor: '#9F8BFF' }]} // Purple Main Star
                        resizeMode="contain"
                    />
                    <Image
                        source={IMAGES.star1}
                        style={styles.absoluteIcon} // Blue Small Star
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.cardTitle}>Interview Requests</Text>
                <Text style={styles.cardCount}>{interviewCount}</Text>
            </TouchableOpacity>

            {/* Right Column */}
            <View style={styles.rightColumn}>
                <TouchableOpacity
                    onPress={onPressApplied}
                    style={[styles.card, styles.smallCard, { backgroundColor: '#EBE3FF' }]}
                >
                    <View style={styles.smallCardContent}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFFFFF' }]}>
                            <Image
                                source={IMAGES.appliedjob}
                                style={[styles.smallIcon, { tintColor: '#5B36B0' }]}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.cardTitleSmall}>Applied Jobs</Text>
                            <Text style={styles.cardCountSmall}>{appliedCount}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Bottom Small Card - Matched Jobs */}
                <TouchableOpacity
                    onPress={onPressMatched}
                    style={[styles.card, styles.smallCard, { backgroundColor: '#DFFCE6' }]}
                >
                    <View style={styles.smallCardContent}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFFFFF' }]}>
                            <Image
                                source={IMAGES.suggested_candidate}
                                style={[styles.smallIcon, { tintColor: '#1D963F' }]}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.cardTitleSmall}>Matched Jobs</Text>
                            <Text style={styles.cardCountSmall}>{matchedCount}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DashboardStats;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: wp(10), // Keep gap small
        marginTop: hp(15),
    },
    card: {
        borderRadius: 14,
        paddingVertical: hp(15),
        paddingHorizontal: wp(10),
    },
    largeCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightColumn: {
        flex: 1,
        gap: hp(12), // Reduced gap between small cards
        justifyContent: 'space-between',
    },
    smallCard: {
        flex: 1, // Will split height equally
        justifyContent: 'center',
    },
    smallCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
    },

    // Icon Styles
    iconContainer: {
        marginTop: hp(4),
        marginBottom: hp(6),
        position: 'relative',
        height: wp(35),
        width: wp(40),
        alignItems: 'center',
        justifyContent: 'center'
    },
    largeIcon: {
        width: wp(26),
        height: wp(26),
        marginLeft: wp(8), // Offset slightly right to make room for small star
    },
    absoluteIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: wp(16),
        height: wp(16),
        tintColor: '#91C8FF' // Light Blue
    },

    smallIcon: {
        width: wp(16),
        height: wp(16),
    },
    iconCircle: {
        width: wp(32),
        height: wp(32),
        borderRadius: wp(16),
        justifyContent: 'center',
        alignItems: 'center',
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: hp(5)
    },
    cardTitle: {
        ...commonFontStyle(400, 14, colors.black),
        textAlign: 'center',
        marginBottom: hp(2),
    },
    cardCount: {
        ...commonFontStyle(500, 26, colors.black),
        lineHeight: hp(50),
    },
    cardTitleSmall: {
        ...commonFontStyle(400, 14, colors.black),
    },
    cardCountSmall: {
        ...commonFontStyle(500, 18, colors.black),
    },
});
