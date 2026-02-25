import React, { FC, useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { commonFontStyle, hp, wp, SCREEN_WIDTH } from '../../theme/fonts';
import { IMAGES } from '../../assets/Images';
import { colors } from '../../theme/colors';
import { getTimeAgo, navigateTo } from '../../utils/commonFunction';
import ExpandableText from '../common/ExpandableText';
import CustomImage from '../common/CustomImage';
import { SCREENS } from '../../navigation/screenNames';
import { useTranslation } from 'react-i18next';
import { useTogglePostLikeMutation } from '../../api/dashboardApi';

type card = {
  onPressCard?: () => void;
  onPressLike?: () => void;
  onPressLogo?: () => void;
  isLiked?: boolean;
  item?: any;
  showMenu?: boolean;
  hideLike?: boolean;
  onScrollToTop?: () => void;
  itemIndex?: number;
  currentCompanyId?: string;
};

const FeedCard: FC<card> = ({
  onPressCard = () => { },
  onPressLike = () => { },
  onPressLogo = () => { },
  isLiked = false,
  item,
  showMenu = false,
  hideLike = false,
  onScrollToTop,
  itemIndex,
  currentCompanyId,
}) => {
  const { t } = useTranslation();
  const hasImage = item?.images?.length > 0;
  const [imageLoading, setImageLoading] = useState(hasImage);
  const [localLiked, setLocalLiked] = useState(item?.is_liked || false);
  const [likesCount, setLikesCount] = useState(item?.likes_count || 0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuButtonRef = useRef<View>(null);
  const [togglePostLike] = useTogglePostLikeMutation();

  useEffect(() => {
    setLocalLiked(item?.is_liked || false);
    setLikesCount(item?.likes_count || 0);
  }, [item]);

  const handleLike = async () => {
    const newLikedState = !localLiked;
    setLocalLiked(newLikedState);
    setLikesCount((prev: number) => (newLikedState ? prev + 1 : prev - 1));
    onPressLike();

    try {
      const formData = new FormData();
      formData.append('post_id', item?._id);
      await togglePostLike(formData).unwrap();
    } catch (error) {
      console.log('Error toggling like:', error);
      setLocalLiked(localLiked);
      setLikesCount((prev: number) => (localLiked ? prev + 1 : prev - 1));
    }
  };

  const itemCompanyId = item?.company_id?._id ?? item?.company_id;
  const canShowMenu =
    showMenu &&
    !!currentCompanyId &&
    !!itemCompanyId &&
    String(currentCompanyId) === String(itemCompanyId);

  const handleEdit = () => {
    setMenuVisible(false);
    navigateTo(SCREENS.CreatePost, {
      editMode: true,
      postData: {
        post_id: item?._id,
        title: item?.title || '',
        description: item?.description || '',
        images: item?.images || [],
      },
    });
  };

  const updateMenuPosition = () => {
    menuButtonRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
      const menuWidth = wp(150);
      const left = Math.max(wp(4), Math.min(x, SCREEN_WIDTH - menuWidth - wp(4)));
      setMenuPosition({ x: left, y: y + height + hp(5) });
    });
  };

  const handleMenuPress = () => {
    updateMenuPosition();
    setMenuVisible(true);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <CustomImage
          onPress={onPressLogo}
          resizeMode={item?.company_id?.logo ? "cover" : "contain"}
          source={IMAGES.logoText}
          uri={item?.company_id?.logo}
          containerStyle={styles.logo}
          imageStyle={{ height: '100%', width: '100%' }}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressLogo}
          style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.hotelName}>
            {item?.company_id?.company_name || 'N/A'}
          </Text>
          <Text style={styles.walkIn}>
            <Text style={{ color: colors._A3A3A3 }}>
              {getTimeAgo(item?.createdAt)}
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Action buttons - outside parent TouchableOpacity so they receive touches */}
        <View style={styles.headerActions}>
          {canShowMenu && (
            <View ref={menuButtonRef} collapsable={false}>
              <TouchableOpacity
                onPress={handleMenuPress}
                style={styles.menuButton}
                activeOpacity={0.7}>
                <Image
                  source={IMAGES.dots}
                  style={styles.dotsIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
          {!hideLike && (
            <TouchableOpacity
              onPress={handleLike}
              style={[styles.actionButton, { flexDirection: 'row', gap: wp(6), alignItems: 'center' }]}
            >
              <CustomImage
                size={wp(26)}
                resizeMode={!localLiked ? "cover" : "contain"}
                source={localLiked ? IMAGES.like : IMAGES.hart}
              />
              {likesCount > 0 && (
                <Text style={styles.likesCountText}>{likesCount}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPressCard()}
        style={styles.cardBody}>
        <Text style={styles.vacancy}>{item?.title || 'N/A'}</Text>

        {hasImage && (
          <View style={styles.banner}>
            <View style={styles.post}>
              {imageLoading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={colors._D5D5D5} />
                </View>
              )}
              <Image
                style={styles.post}
                resizeMode={'cover'}
                source={{ uri: item?.images[0] }}
                onLoad={() => setImageLoading(false)}
                onLoadStart={() => hasImage && setImageLoading(true)}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>

      <ExpandableText
        maxLines={3}
        descriptionStyle={styles.description}
        description={item?.description || 'N/A'}
        onShowLess={() => {
          if (onScrollToTop) {
            onScrollToTop();
          }
        }}
      />

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}>
          <View style={[styles.menuContainer, { top: menuPosition.y, left: menuPosition.x }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleEdit}>
              <Image
                source={IMAGES.edit_icon}
                style={styles.menuIcon}
                resizeMode="contain"
              />
              <Text style={styles.menuText}>{t('Edit Post')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default FeedCard;

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  description: {
    // lineHeight: hp(20),
    paddingVertical: hp(15),
    paddingHorizontal: wp(14),
    ...commonFontStyle(400, 16, colors._6A6A6A),
  },
  card: {
    backgroundColor: '#F4F3F3',
    borderRadius: 10,
  },
  cardBody: {
    flex: 1,
  },
  cardHeader: {
    gap: wp(10),
    padding: wp(10),
    marginBottom: hp(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: wp(56),
    height: wp(56),
    borderRadius: 100,
    overflow: 'hidden',
  },
  hotelName: {
    ...commonFontStyle(700, 18, colors._2F2F2F),
  },
  walkIn: {
    ...commonFontStyle(400, 15, colors._2F2F2F),
    marginTop: hp(6),
  },
  heartIcon: {
    marginLeft: 'auto',
  },
  vacancy: {
    ...commonFontStyle(600, 17, colors._1F1F1F),
    marginBottom: 8,
    paddingHorizontal: wp(14),
  },
  post: {
    width: '100%',
    height: hp(230),
    overflow: 'hidden',
    position: 'relative',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  like: {
    width: wp(26),
    height: wp(26),
  },
  follow: {
    ...commonFontStyle(500, 15, colors.white),
    paddingHorizontal: wp(15),
    paddingVertical: hp(10),
  },
  followBtn: {
    backgroundColor: colors._0B3970,
    borderRadius: 5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: wp(14),
    paddingVertical: hp(12),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: hp(4),
  },
  actionButton: {
    gap: wp(6),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(6),
    paddingHorizontal: wp(8),
  },
  actionIcon: {
    width: wp(26),
    height: wp(24),
    tintColor: colors._6A6A6A,
  },
  actionText: {
    ...commonFontStyle(500, 15, colors._6A6A6A),
  },
  likedText: {
    color: '#FF4458',
  },
  savedText: {
    color: colors._0B3970,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
  menuButton: {
    padding: wp(8),
  },
  dotsIcon: {
    width: wp(20),
    height: wp(20),
    tintColor: colors._6A6A6A,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: wp(12),
    paddingVertical: hp(4),
    minWidth: wp(150),
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(12),
    paddingHorizontal: wp(16),
    gap: wp(10),
  },
  menuIcon: {
    width: wp(18),
    height: wp(18),
    tintColor: colors._0B3970,
  },
  menuText: {
    ...commonFontStyle(500, 15, colors._1F1F1F),
  },
  likesCountText: {
    ...commonFontStyle(600, 16, colors._2F2F2F),
  },
});