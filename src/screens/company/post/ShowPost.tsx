import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Linking,
  Pressable,
  Alert,
} from 'react-native';
import {BackHeader, LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import {goBack} from '../../../utils/commonFunction';
import {useRoute} from '@react-navigation/native';
import CustomImage from '../../../component/common/CustomImage';
import {getTimeAgo} from '../../../utils/commonFunction';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ShowPost = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const post = route.params?.post;
  const [imageLoading, setImageLoading] = useState(!!post?.images?.[0]);
  const hasImage = post?.images?.length > 0;

  if (!post) {
    return (
      <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
        <BackHeader
          onBackPress={goBack}
          type="company"
          title={t('Post')}
          isRight={false}
        />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t('Post not found')}</Text>
        </View>
      </LinearContainer>
    );
  }

  const companyName =
    post?.company_id?.company_name ?? post?.company_id ?? 'N/A';
  const companyLogo = post?.company_id?.logo;
  const externalLink =
    typeof post?.external_link === 'string' ? post.external_link.trim() : '';

  const handleOpenExternalLink = async () => {
    if (!externalLink) return;
    const normalized = /^https?:\/\//i.test(externalLink)
      ? externalLink
      : `https://${externalLink}`;
    try {
      const supported = await Linking.canOpenURL(normalized);
      if (!supported) {
        Alert.alert('Error', 'Invalid link');
        return;
      }
      await Linking.openURL(normalized);
    } catch (error) {
      Alert.alert('Error', 'Could not open link');
    }
  };

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      <View style={styles.headerContainer}>
        <BackHeader
          onBackPress={goBack}
          type="company"
          title={t('Post')}
          isRight={false}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + hp(24)},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Outer: shadow (no overflow:hidden — that clips shadows on iOS) */}
        <View style={styles.cardShadow}>
          <View style={styles.cardInner}>
            {/* Company header */}
            <View style={styles.cardHeader}>
              <CustomImage
                resizeMode={companyLogo ? 'cover' : 'contain'}
                source={IMAGES.logoText}
                uri={companyLogo}
                containerStyle={styles.logo}
                imageStyle={{height: '100%', width: '100%'}}
              />
              <View style={styles.headerTextWrap}>
                <Text numberOfLines={1} style={styles.companyName}>
                  {companyName}
                </Text>
                <Text style={styles.timeText}>
                  {getTimeAgo(post?.createdAt)}
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.postTitle}>{post?.title || 'N/A'}</Text>

            {/* Image */}
            {hasImage && (
              <Pressable
                disabled={!externalLink}
                onPress={handleOpenExternalLink}
                style={styles.imageContainer}>
                {imageLoading && (
                  <View style={styles.imageLoaderContainer}>
                    <ActivityIndicator size="large" color={colors._0B3970} />
                  </View>
                )}
                <Image
                  source={{
                    uri: post?.images?.[0],
                  }}
                  style={styles.postImage}
                  resizeMode="cover"
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                />
              </Pressable>
            )}

            {/* Description */}
            <Text style={styles.postDescription}>
              {post?.description || '–'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearContainer>
  );
};

export default ShowPost;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: wp(25),
    paddingTop: hp(15),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(25),
    paddingTop: hp(12),
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(24),
  },
  emptyText: {
    ...commonFontStyle(500, 16, colors._6A6A6A),
  },
  cardShadow: {
    borderRadius: wp(16),
    backgroundColor: colors.white,
    shadowColor: '#0B3970',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 6},
    elevation: 8,
  },
  cardInner: {
    borderRadius: wp(16),
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(16),
    gap: wp(12),
  },
  logo: {
    width: wp(56),
    height: wp(56),
    borderRadius: 100,
    overflow: 'hidden',
  },
  headerTextWrap: {
    flex: 1,
  },
  companyName: {
    ...commonFontStyle(700, 18, colors._2F2F2F),
  },
  timeText: {
    ...commonFontStyle(400, 14, colors._A3A3A3),
    marginTop: hp(4),
  },
  postTitle: {
    ...commonFontStyle(600, 20, colors._0B3970),
    paddingHorizontal: wp(16),
    paddingBottom: hp(12),
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  postImage: {
    width: '100%',
    height: hp(280),
    backgroundColor: colors._F7F7F7,
  },
  imageLoaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors._F7F7F7,
    zIndex: 1,
    height: hp(280),
  },
  postDescription: {
    ...commonFontStyle(400, 15, colors._4A4A4A),
    paddingHorizontal: wp(16),
    paddingTop: hp(16),
    paddingBottom: hp(24),
    lineHeight: hp(22),
  },
  postExternalLink: {
    ...commonFontStyle(400, 15, colors._0B3970),
    paddingHorizontal: wp(16),
  },
  postExternalLinkText: {
    ...commonFontStyle(400, 15, colors._4A4A4A),
    paddingHorizontal: wp(16),
    paddingBottom: hp(10),
  },
});
