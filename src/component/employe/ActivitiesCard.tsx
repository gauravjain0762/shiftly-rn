import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import CustomImage from '../common/CustomImage';
import {getTimeAgo, navigateTo} from '../../utils/commonFunction';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {SCREENS} from '../../navigation/screenNames';

type props = {
  item?: any;
};

const ActivitiesCard: FC<props> = ({item}) => {
  return (
    <Pressable style={styles.card}>
      <View style={styles.header}>
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
            <Text style={styles.jobSector} numberOfLines={1}>
              {item?.job_sector}
            </Text>
            <View style={styles.locationRow}>
              <CustomImage
                size={wp(16)}
                resizeMode="contain"
                source={IMAGES.distance}
              />
              <Text style={styles.locationText} numberOfLines={1}>
                {item?.area}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.timeText}>
            {`${getTimeAgo(item?.created_at)} ago`}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.jobTypeContainer}>
          <Text style={styles.jobTypeText}>{item?.job_type}</Text>
        </View>

        <View style={styles.tagsContainer}>
          <View style={styles.statusTag}>
            <Text style={styles.statusText}>
              {item?.type?.charAt(0)?.toUpperCase() + item?.type?.slice(1)}
            </Text>
          </View>

          {item?.chat_status === 'chat' && (
            <Pressable
              onPress={() => {
                navigateTo(SCREENS.Chat, {data: item});
              }}
              style={styles.chatTag}>
              <Text style={styles.chatText}>Chat</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ActivitiesCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors._0B3970,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors._104686,
    padding: wp(16),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(16),
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: wp(12),
  },

  logo: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(12),
    marginRight: wp(16),
  },

  companyInfo: {
    flex: 1,
    gap: hp(4),
  },

  companyName: {
    ...commonFontStyle(600, 20, colors.white),
  },

  jobSector: {
    ...commonFontStyle(400, 14, colors.white),
    opacity: 0.8,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
    marginTop: hp(2),
  },

  locationText: {
    ...commonFontStyle(400, 14, colors.white),
    opacity: 0.7,
    flex: 1,
  },

  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },

  timeText: {
    ...commonFontStyle(400, 13, colors.white),
    opacity: 0.7,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp(12),
    borderTopWidth: 1,
    borderTopColor: colors._104686,
  },

  jobTypeContainer: {
    flex: 1,
  },

  jobTypeText: {
    ...commonFontStyle(400, 13, colors.white),
    opacity: 0.8,
  },

  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
  },

  statusTag: {
    backgroundColor: colors.white,
    borderRadius: hp(20),
    paddingVertical: hp(8),
    paddingHorizontal: wp(16),
    minWidth: wp(70),
    alignItems: 'center',
  },

  statusText: {
    ...commonFontStyle(600, 12, '#003C8F'),
  },

  chatTag: {
    backgroundColor: colors.white,
    borderRadius: hp(20),
    paddingVertical: hp(8),
    paddingHorizontal: wp(16),
    minWidth: wp(60),
    alignItems: 'center',
  },

  chatText: {
    ...commonFontStyle(600, 12, '#003C8F'),
  },
});
