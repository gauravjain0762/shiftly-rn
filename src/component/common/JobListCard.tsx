import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Eye } from 'lucide-react-native';
import moment from 'moment';

import { colors } from '../../theme/colors';
import { IMAGES } from '../../assets/Images';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { getCurrencySymbol } from '../../utils/currencySymbols';
import { getTimeAgo } from '../../utils/commonFunction';

export type JobListCardProps = {
  /** Job object - for employee, may come from item.job_id or item.job */
  job: any;
  /** Raw list item - for passing to onShare, onPressView (e.g. has interview_link) */
  rawItem?: any;
  /** Date display: 'relative' = getTimeAgo, 'short' = DD MMM */
  dateFormat?: 'relative' | 'short';
  /** Callback when card is pressed (e.g. Interviews tab navigates) */
  onPress?: () => void;
  /** Callback when View button is pressed */
  onPressView: () => void;
  /** Callback when share is pressed */
  onShare: () => void;
  /** Callback when company header is pressed (employee - go to company profile) */
  onPressCompany?: () => void;
  /** Status badge - useImageBg uses IMAGES.tag; tintColor e.g. '#ED494E' for Closed */
  statusBadge?: { text: string; useImageBg?: boolean; tintColor?: string };
  /** Show closed date + Closed tag (company closed jobs) */
  showClosedInfo?: boolean;
  /** ISO date string for closed date display */
  closedDate?: string | null;
  /** Disable card press (make it not touchable) */
  disabled?: boolean;
  /** 'company' = show only logo, name, location, title, description, View, date, and closed info/tag */
  variant?: 'employee' | 'company';
};

const JobListCard = ({
  job,
  rawItem,
  dateFormat = 'relative',
  onPress,
  onPressView,
  onShare,
  onPressCompany,
  statusBadge,
  showClosedInfo,
  closedDate,
  disabled = false,
  variant = 'employee',
}: JobListCardProps) => {
  const isCompanyFlow = variant === 'company';
  const companyName = job?.company_id?.company_name || job?.company?.name || 'N/A';
  const companyLogo = job?.company_id?.logo || job?.company?.logo;
  const location = (job?.city || job?.country)
    ? `${job?.city || ''}${job?.city && job?.country ? ', ' : ''}${job?.country || ''}`
    : (job?.location || job?.address || job?.area || job?.company?.location || 'N/A');

  const dateText =
    dateFormat === 'relative'
      ? getTimeAgo(job?.createdAt) || 'N/A'
      : moment(job?.createdAt).format('DD MMM');

  const CardWrapper = onPress && !disabled ? TouchableOpacity : View;
  const wrapperProps = onPress && !disabled ? { activeOpacity: 0.7, onPress } : {};

  return (
    <CardWrapper {...wrapperProps}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.header}
          onPress={onPressCompany}
          disabled={!onPressCompany}
          activeOpacity={onPressCompany ? 0.7 : 1}
        >
          <View style={styles.logoContainer}>
            {companyLogo ? (
              <FastImage
                source={{ uri: companyLogo }}
                style={styles.logoImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.logoText}>{companyName.charAt(0)}</Text>
            )}
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.headerTopRow}>
              <Text style={styles.companyName} numberOfLines={1}>
                {companyName}
              </Text>
              <TouchableOpacity onPress={onShare}>
                <Image source={IMAGES.share} style={styles.shareIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <Text style={styles.location} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {job?.title || 'N/A'}
            </Text>
            <TouchableOpacity style={styles.viewButton} onPress={onPressView}>
              <Eye size={wp(14)} color={colors.white} />
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.descriptionRow}>
            <Text style={styles.description} numberOfLines={2}>
              {job?.description || 'N/A'}
            </Text>
            <Text style={styles.timeAgo}>{dateText}</Text>
          </View>

          {showClosedInfo && closedDate && (
            <Text style={styles.closedDate}>
              Closed Date: {moment(closedDate).format('DD MMM')}
            </Text>
          )}

          {!isCompanyFlow && job?.contract_type && (
            <View style={[styles.tag, { backgroundColor: '#F0F4F8', alignSelf: 'flex-start' }]}>
              <Text style={[styles.tagText, { color: '#0B1C39' }]}>{job?.contract_type}</Text>
            </View>
          )}

          {!isCompanyFlow && (
            <View style={styles.tagsRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: wp(8) }}
              >
                {(job?.monthly_salary_from || job?.monthly_salary_to) && (
                  <View style={[styles.tag, { backgroundColor: '#2CCF54' }]}>
                    <View style={styles.salaryRow}>
                      {job?.currency?.toUpperCase() === 'AED' ? (
                        <Image source={IMAGES.currency} style={styles.currencyImage} />
                      ) : (
                        <Text style={styles.currencySymbol}>
                          {getCurrencySymbol(job?.currency || 'AED')}
                        </Text>
                      )}
                      <Text style={styles.tagText}>
                        {`${job?.monthly_salary_from?.toLocaleString()} - ${job?.monthly_salary_to?.toLocaleString()}`}
                      </Text>
                    </View>
                  </View>
                )}
                {(job?.contract_period || job?.duration) && (
                  <View style={[styles.tag, { backgroundColor: '#2196F3' }]}>
                    <Text style={styles.tagText}>
                      {job?.contract_period || job?.duration}
                      {!(job?.contract_period || job?.duration)?.toLowerCase().includes('contract')
                        ? ' Contract'
                        : ''}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          {statusBadge?.text && statusBadge?.useImageBg && (
            <ImageBackground
              source={IMAGES.tag}
              style={styles.tagImage}
              imageStyle={statusBadge?.tintColor ? { tintColor: statusBadge.tintColor } : undefined}
              resizeMode="cover">
              <Text style={styles.appliedTagText}>{statusBadge.text}</Text>
            </ImageBackground>
          )}
          {statusBadge?.text && !statusBadge?.useImageBg && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{statusBadge.text}</Text>
            </View>
          )}
        </View>
      </View>
    </CardWrapper>
  );
};

export default JobListCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: wp(16),
    marginBottom: hp(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
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
    marginRight: wp(12),
  },
  logoImage: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
  },
  logoText: {
    ...commonFontStyle(600, 18, colors._0B3970),
  },
  headerInfo: { flex: 1 },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyName: {
    ...commonFontStyle(600, 16, colors.black),
  },
  shareIcon: {
    width: wp(18),
    height: wp(18),
    tintColor: colors.black,
  },
  location: {
    ...commonFontStyle(400, 13, colors._656464),
    marginTop: hp(2),
  },
  body: { gap: hp(8) },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    gap: wp(4),
  },
  viewText: {
    ...commonFontStyle(500, 12, colors.white),
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
  timeAgo: {
    ...commonFontStyle(400, 11, colors._656464),
    marginTop: hp(2),
  },
  closedDate: {
    ...commonFontStyle(500, 12, '#E53935'),
    marginTop: hp(8),
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
    marginTop: hp(4),
    flexWrap: 'wrap',
  },
  tag: {
    paddingVertical: hp(6),
    paddingHorizontal: wp(12),
    borderRadius: 20,
  },
  tagText: {
    ...commonFontStyle(500, 10, colors.white),
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyImage: {
    width: wp(13),
    height: hp(10),
    resizeMode: 'contain',
    marginHorizontal: wp(2),
    tintColor: colors.white,
  },
  currencySymbol: {
    ...commonFontStyle(500, 10, colors.white),
    marginRight: wp(2),
  },
  tagImage: {
    position: 'absolute',
    bottom: 0,
    right: -wp(16),
    width: wp(75),
    height: hp(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  appliedTagText: {
    ...commonFontStyle(600, 11, colors.white),
    textAlign: 'center',
    paddingLeft: '25%',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2CCF54',
    paddingVertical: hp(6),
    paddingHorizontal: wp(12),
    borderRadius: 20,
  },
  statusBadgeText: {
    ...commonFontStyle(600, 11, colors.white),
  },
});
