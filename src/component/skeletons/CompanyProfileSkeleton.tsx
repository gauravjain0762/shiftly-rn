import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { colors } from '../../theme/colors';
import { hp, wp, SCREEN_WIDTH } from '../../theme/fonts';

const CompanyProfileSkeleton = () => {
    return (
        <View style={styles.container}>
            <SkeletonPlaceholder
                backgroundColor={colors._F7F7F7}
                highlightColor={colors.white}
                borderRadius={4}
            >
                <View>
                    {/* Cover Image */}
                    <View style={{ width: SCREEN_WIDTH, height: hp(250) }} />

                    {/* Profile Section Container (starts below cover) */}
                    <View style={{
                        marginTop: hp(10),
                        paddingHorizontal: wp(20),
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: wp(10)
                    }}>
                        {/* Logo Circle */}
                        <View
                            style={{
                                width: wp(90),
                                height: wp(90),
                                borderRadius: wp(45),
                                borderWidth: 4,
                                borderColor: colors.white
                            }}
                        />

                        {/* Name and Tagline */}
                        <View style={{ flex: 1, gap: hp(8), marginTop: hp(30) }}>
                            <View style={{ width: '70%', height: hp(24), borderRadius: 4 }} />
                            <View style={{ width: '50%', height: hp(16), borderRadius: 4 }} />
                        </View>
                    </View>

                    {/* Description Lines */}
                    <View style={{ marginTop: hp(20), paddingHorizontal: wp(20), gap: hp(8) }}>
                        <View style={{ width: '100%', height: hp(14), borderRadius: 4 }} />
                        <View style={{ width: '90%', height: hp(14), borderRadius: 4 }} />
                        <View style={{ width: '95%', height: hp(14), borderRadius: 4 }} />
                    </View>

                    {/* Tabs */}
                    <View style={{
                        marginTop: hp(25),
                        paddingHorizontal: wp(20),
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{ width: wp(80), height: hp(30), borderRadius: 4 }} />
                        <View style={{ width: wp(80), height: hp(30), borderRadius: 4 }} />
                        <View style={{ width: wp(80), height: hp(30), borderRadius: 4 }} />
                    </View>

                    {/* Divider */}
                    <View style={{ marginTop: hp(15), width: SCREEN_WIDTH, height: 1 }} />

                    {/* Tab Content Placeholder */}
                    <View style={{ marginTop: hp(20), paddingHorizontal: wp(20), gap: hp(15) }}>
                        <View style={{ width: '100%', height: hp(100), borderRadius: 8 }} />
                        <View style={{ width: '100%', height: hp(100), borderRadius: 8 }} />
                    </View>

                </View>
            </SkeletonPlaceholder>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});

export default CompanyProfileSkeleton;
