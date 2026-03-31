import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { IMAGES } from '../../assets/Images';
import { getExpiryDays, getTimeAgo, navigateTo } from '../../utils/commonFunction';
import { getCurrencySymbol } from '../../utils/currencySymbols';
import { getJobMonthlySalaryRangeText } from '../../utils/monthlySalaryRange';
import Share from 'react-native-share';
import { Eye } from 'lucide-react-native';
import { SCREENS } from '../../navigation/screenNames';
import { normalizeUrl } from '../../utils/shareUtils';

type Props = {
    item: any;
    onPress: () => void;
    onPressView: () => void;
};

const RecentJobCard: FC<Props> = ({ item, onPress, onPressView }) => {
    const logoUri = item?.company_id?.logo;

    const handleShare = async () => {
        try {
            const title = item?.title || 'Job Opportunity';
            const description = item?.description || '';
            const salary = getJobMonthlySalaryRangeText(item)
                ? `Salary: ${getCurrencySymbol(item?.currency || 'USD')}${getJobMonthlySalaryRangeText(item)}`
                : '';

            const shareUrl = normalizeUrl(item?.share_url);
            const shareUrlText = shareUrl ? `\n\n${shareUrl}` : '';

            const message = `${title}\n\n${description}\n\n${salary}${shareUrlText}`;

            const shareOptions = {
                title: title,
                message: message,
                url: shareUrl,
            };

            await Share.open(shareOptions);
        } catch (err: any) {
            if (err?.message !== 'User did not share') {
                console.log('❌ Share error:', err);
            }
        }
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.header}
                onPress={() => {
                    const companyId = item?.company_id?._id;
                    navigateTo(SCREENS.ViewCompanyProfile, { companyId });
                }}
            >
                <View style={styles.logoContainer}>
                    <Image
                        resizeMode="cover"
                        style={styles.logo}
                        source={logoUri ? { uri: logoUri } : IMAGES.logoText}
                    />
                </View>
                <View style={styles.headerInfo}>
                    <View style={styles.headerTopRow}>
                        <Text style={styles.companyName} numberOfLines={1}>
                            {item?.company_id?.company_name || 'N/A'}
                        </Text>
                        <TouchableOpacity onPress={handleShare}>
                            <Image source={IMAGES.share} style={[styles.shareIcon, { tintColor: colors.black }]} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.location} numberOfLines={1}>
                        {(item?.city || item?.country) ? `${item?.city}${item?.city && item?.country ? ', ' : ''}${item?.country}` : (item?.location || 'N/A')}
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.body}>
                <View style={styles.titleRow}>
                    <Text style={styles.jobTitle}>{item?.title}</Text>
                    <TouchableOpacity style={styles.viewButton} onPress={onPressView}>
                        <Eye size={wp(14)} color={colors.white} />
                        <Text style={styles.viewText}>View</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.descriptionRow}>
                    <Text style={styles.description} numberOfLines={2}>
                        {item?.description || 'N/A'}
                    </Text>
                    <View style={styles.rightMeta}>
                        <Text style={styles.timeAgo}>
                            {getTimeAgo(item?.createdAt) || 'N/A'}
                        </Text>
                    </View>
                </View>

                {item?.contract_type && (
                    <View style={[styles.tag, { backgroundColor: '#F0F4F8', alignSelf: 'flex-start' }]}>
                        <Text style={[styles.tagText, { color: '#0B1C39' }]}>{item?.contract_type}</Text>
                    </View>
                )}

                <View style={styles.tagsRow}>
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: wp(8) }}
                        >
                            {getJobMonthlySalaryRangeText(item) && (
                                <View style={[styles.tag, { backgroundColor: '#2CCF54' }]}>
                                    <View style={styles.salaryRow}>
                                        {item?.currency?.toUpperCase() === 'AED' ? (
                                            <Image source={IMAGES.currency} style={styles.currencyImage} />
                                        ) : (
                                            <Text style={styles.currencySymbol}>{getCurrencySymbol(item?.currency || 'AED')}</Text>
                                        )}
                                        <Text style={styles.tagText}>
                                            {getJobMonthlySalaryRangeText(item)}
                                        </Text>
                                    </View>
                                </View>
                            )}
                     

                        </ScrollView>
                    </View>
                    {item?.expiry_date && String(item?.status || '').toLowerCase() !== 'closed' && (
                        <Text style={styles.expiryText}>
                            {getExpiryDays(item?.expiry_date)}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default RecentJobCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: wp(16),
        marginBottom: hp(16),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(12),
    },
    logoContainer: {
        width: wp(48),
        height: wp(48),
        borderRadius: wp(24),
        borderWidth: 1,
        borderColor: '#EFEFEF',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginRight: wp(12),
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    headerInfo: {
        flex: 1,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    companyName: {
        ...commonFontStyle(600, 16, colors.black),
    },
    location: {
        ...commonFontStyle(400, 13, colors._656464),
        marginTop: hp(2),
    },
    shareIcon: {
        width: wp(18),
        height: wp(18)
    },
    body: {
        gap: hp(8),
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    jobTitle: {
        ...commonFontStyle(600, 16, colors.black),
    },
    viewButton: {
        backgroundColor: '#0F2E60',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(6),
        paddingHorizontal: wp(12),
        borderRadius: 20,
        gap: wp(4)
    },
    viewText: {
        ...commonFontStyle(500, 12, colors.white)
    },
    descriptionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: wp(10),
    },
    description: {
        flex: 1,
        ...commonFontStyle(400, 13, colors._656464),
        lineHeight: hp(18),
    },
    tagsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        marginTop: hp(4),
        flexWrap: 'wrap'
    },
    tag: {
        paddingVertical: hp(6),
        paddingHorizontal: wp(12),
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagText: {
        ...commonFontStyle(500, 10, colors.white),
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencyImage: {
        width: wp(12),
        height: hp(12),
        resizeMode: 'contain',
        marginHorizontal: wp(2),
        tintColor: colors.white,
    },
    timeAgo: {
        ...commonFontStyle(400, 11, colors._656464),
        marginTop: hp(2),
    },
    rightMeta: {
        alignItems: 'flex-end',
    },
    expiryText: {
        ...commonFontStyle(500, 11, colors._EE4444),
        marginBottom: hp(2),
        marginLeft: wp(8),
    },
    salaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        ...commonFontStyle(500, 10, colors.white),
        marginRight: wp(2),
    },
});
