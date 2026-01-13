import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

import { colors } from '../../../theme/colors'
import { useRoute } from '@react-navigation/native'
import { SCREENS } from '../../../navigation/screenNames'
import BaseText from '../../../component/common/BaseText'
import { navigateTo } from '../../../utils/commonFunction'
import { SafeAreaView } from 'react-native-safe-area-context'
import { commonFontStyle, hp, wp } from '../../../theme/fonts'
import { BackHeader, LinearContainer } from '../../../component'
import CommonButton from '../../../component/common/CommonButton'

const JobInvitationScreen = () => {

    const route = useRoute();
    const { jobDetail, link } = route.params as {
        jobDetail: any;
        link: string;
    };
    console.log("🔥 ~ JobInvitationScreen ~ link:", link)
    const job = jobDetail?.job;
    const company = job?.company_id;

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
                    <Image
                        style={styles.avatar}
                        source={{ uri: company?.logo }}
                    />

                    <View style={styles.textContainer}>
                        <BaseText style={styles.empTitle}>
                            {job?.title}
                        </BaseText>

                        <View style={styles.empRow}>
                            <BaseText style={[styles.location, {flex: 1}]}>
                                {`${job?.area ?? ''}, ${job?.country ?? ''}`}
                            </BaseText>
                        </View>
                        <BaseText style={styles.location}>
                            {job?.contract_type}
                        </BaseText>
                        <BaseText style={styles.salary}>
                            {`${job?.currency} ${job?.monthly_salary_from} - ${job?.monthly_salary_to}`}
                        </BaseText>
                    </View>
                </View>

                <View style={{ marginTop: hp(50), flex: 1, }}>
                    <BaseText style={{ ...commonFontStyle(700, 20, colors._0B3970) }}>{"Dear David,"}</BaseText>
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

                <CommonButton
                    title='Join  Interview'
                    textStyle={{ ...commonFontStyle(500, 20, colors.white) }}
                    btnStyle={{
                        marginVertical: hp(20), backgroundColor: colors._0B3970, borderRadius: hp(50),
                    }}
                    onPress={() => {
                        navigateTo(SCREENS.WebviewScreen, {
                            link: link,
                            title: 'Interview',
                            type: 'interview',
                        });
                    }}
                />
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
})