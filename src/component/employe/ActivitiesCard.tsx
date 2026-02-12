import React, { FC } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import CustomImage from '../common/CustomImage';
import { getTimeAgo, navigateTo } from '../../utils/commonFunction';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { SCREENS } from '../../navigation/screenNames';
import { IMAGES } from '../../assets/Images';
import { useGetEmployeeJobDetailsQuery } from '../../api/dashboardApi';

type props = {
  item?: any;
};

const ActivitiesCard: FC<props> = ({ item }) => {
  console.log(">>>>>>>>>>>>>>... ~ ActivitiesCard ~ item:", item)
  const { data: jobDetail } = useGetEmployeeJobDetailsQuery(
    item?.job_id,
    {
      skip: !item?.job_id,
    }
  );
  console.log("🔥🔥🔥 ~ ActivitiesCard ~ jobDetail:", jobDetail)

  const getStatusText = () => {
    if (item?.type) {
      return item.type.charAt(0).toUpperCase() + item.type.slice(1);
    }
    return '';
  };

  const handleViewPress = () => {
    const interviewLink = item?.interview_link || jobDetail?.data?.interview_link;
    console.log("🔥🔥🔥 ~ handleViewPress ~ interviewLink:", interviewLink)

    if (jobDetail?.data) {
      navigateTo(SCREENS.JobInvitationScreen, {
        link: interviewLink || '',
        jobDetail: jobDetail.data,
      });
    } else if (item?.job_id) {
      navigateTo(SCREENS.JobInvitationScreen, {
        link: interviewLink || '',
        jobDetail: {
          job: {
            title: item?.job_title,
            contract_type: item?.contract_type,
            area: item?.area,
            country: item?.country,
            monthly_salary_from: item?.monthly_salary_from,
            monthly_salary_to: item?.monthly_salary_to,
            currency: item?.currency,
          },
          company_id: {
            company_name: item?.company_name,
            logo: item?.company_logo,
          },
        },
      });
    }
  };

  return (
    <Pressable style={styles.card}>
      {/* Header with Logo, Company Name and Time */}
      <View style={styles.headerRow}>
        <View style={styles.leftSection}>
          <CustomImage
            resizeMode="cover"
            imageStyle={styles.logo}
            uri={item?.company_logo}
          />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName} numberOfLines={1}>
              {item?.company_name}
            </Text>
          </View>
        </View>
        <Text style={styles.timeAgo}>
          {getTimeAgo(item?.created_at)} ago
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={{ flex: 1, gap: hp(6) }}>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {item?.job_title} - {item?.contract_type || "N/A"}
          </Text>

          {(item?.monthly_salary_from || item?.monthly_salary_to || jobDetail?.data?.job?.monthly_salary_from) && (
            <View style={styles.salaryContainer}>
              <Image
                source={IMAGES.currency}
                style={styles.salaryIcon}
                tintColor={colors._656464}
              />
              <Text style={styles.salaryText}>
                {`${item?.currency || jobDetail?.data?.job?.currency || 'AED'} ${item?.monthly_salary_from || jobDetail?.data?.job?.monthly_salary_from?.toLocaleString()} - ${item?.monthly_salary_to || jobDetail?.data?.job?.monthly_salary_to?.toLocaleString()}`}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: colors.white }
            ]}>
            <Text
              style={[
                styles.statusText,
                { color: colors._0B3970 }
              ]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {item?.chat_status == 'chat' && (
            <Pressable
              onPress={() => {
                navigateTo(SCREENS.Chat, { data: item });
              }}
              style={styles.button}>
              <Image
                source={IMAGES.chat2}
                style={styles.buttonIcon}
              />
              <Text style={styles.chatButtonText}>Chat</Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleViewPress}
            style={styles.button}>
            <Image
              source={IMAGES.eye_on}
              style={styles.buttonIcon}
              tintColor={colors.white}
            />
            <Text style={styles.viewButtonText}>View</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default ActivitiesCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: wp(16),
    gap: hp(8),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: wp(12),
  },
  logo: {
    width: wp(42),
    height: wp(42),
    marginRight: wp(12),
    borderRadius: wp(40),
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    ...commonFontStyle(600, 16, colors._0B3970),
  },
  timeAgo: {
    ...commonFontStyle(400, 12, colors._7B7878),
  },
  jobTitle: {
    ...commonFontStyle(400, 14, colors._0B3970),
    marginTop: hp(4),
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingVertical: hp(6),
    paddingHorizontal: wp(12),
    borderRadius: hp(7),
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors._0B3970,
  },
  statusText: {
    ...commonFontStyle(500, 12, colors._0B3970),
  },
  actionButtons: {
    gap: wp(8),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors._0B3970,
    borderRadius: hp(50),
    paddingVertical: hp(6),
    paddingHorizontal: wp(12),
    gap: wp(6),
  },
  chatButtonText: {
    ...commonFontStyle(500, 12, colors.white),
  },
  viewButtonText: {
    ...commonFontStyle(500, 12, colors.white),
  },
  buttonIcon: {
    width: wp(14),
    height: wp(14),
    tintColor: colors.white,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  salaryIcon: {
    width: wp(14),
    height: hp(14),
    resizeMode: 'contain',
  },
  salaryText: {
    ...commonFontStyle(600, 12, colors.black),
  },
});