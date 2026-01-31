import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BackHeader,
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../assets/Images';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppStyles } from '../../../theme/appStyles';
import { errorToast, goBack, navigateTo } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import { useAppSelector } from '../../../redux/hooks';
import { selectPostForm } from '../../../features/companySlice';
import usePostFormUpdater from '../../../hooks/usePostFormUpdater';
import CharLength from '../../../component/common/CharLength';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

const CreatePost = () => {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const [imageModal, setImageModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const { title, description, uploadedImages, postEditMode, postId } = useAppSelector(state =>
    selectPostForm(state as any),
  );
  const { updatePostForm } = usePostFormUpdater();

  // Handle edit mode from navigation params
  useEffect(() => {
    const params = route.params;
    if (params?.editMode && params?.postData) {
      const { post_id, title: postTitle, description: postDesc, images } = params.postData;

      // Convert existing image URLs to uploadedImages format
      const existingImages = images?.length > 0
        ? [{
          uri: images[0],
          type: 'image/jpeg',
          name: images[0].split('/').pop() || 'image.jpg',
          isExisting: true
        }]
        : [];

      updatePostForm({
        title: postTitle || '',
        description: postDesc || '',
        uploadedImages: existingImages,
        postEditMode: true,
        postId: post_id,
      });
    }
  }, [route.params]);

  const addImage = (newImage: any) => {
    const imageObject = {
      uri: newImage?.sourceURL || newImage?.path || newImage?.uri,
      type: newImage?.mime || newImage?.type || 'image/jpeg',
      name:
        (newImage?.sourceURL || newImage?.path || newImage?.uri)
          ?.split('/')
          .pop() || `image_${Date.now()}.jpg`,
      isExisting: false,
    };

    updatePostForm({ uploadedImages: [imageObject] });

    setTimeout(() => {
      setImageModal(false);
    }, 200);
  };

  const removeImage = () => {
    updatePostForm({ uploadedImages: [] });
  };

  const hasValidImage = () => {
    return uploadedImages.length > 0 && uploadedImages[0]?.uri;
  };

  const handleReviewPost = () => {
    if (!title.trim()) {
      return errorToast(t('Please enter a post title'));
    }
    if (!description.trim()) {
      return errorToast(t('Please enter a description'));
    }
    if (!hasValidImage()) {
      return errorToast(t('Please upload an image'));
    }
    navigateTo(SCREENS.PreviewPost);
  };

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      <View style={styles.headerContainer}>
        <BackHeader
          onBackPress={goBack}
          type="company"
          title=""
          isRight={false}
        />
        <Text style={styles.screenTitle}>
          {postEditMode ? t('Edit Post') : t('Create a post')}
        </Text>
      </View>

      <KeyboardAwareScrollView
        enableAutomaticScroll
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        style={AppStyles.flex}>

        {/* Image Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('Post Image')}</Text>
          {hasValidImage() ? (
            <View style={styles.imagePreviewContainer}>
              {imageLoading && (
                <View style={styles.imageLoaderContainer}>
                  <ActivityIndicator size="large" color={colors._0B3970} />
                </View>
              )}
              <Image
                source={{ uri: uploadedImages[0]?.uri }}
                style={styles.uploadedImage}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
              <View style={styles.imageActions}>
                <TouchableOpacity
                  style={styles.changeImageBtn}
                  onPress={() => setImageModal(true)}>
                  <Text style={styles.changeImageText}>{t('Change')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={removeImage}>
                  <Image
                    source={IMAGES.close}
                    style={styles.removeIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadPlaceholder}
              onPress={() => setImageModal(true)}>
              <Image style={styles.uploadIcon} source={IMAGES.uploadImg} />
              <Text style={styles.uploadText}>{t('Upload Image')}</Text>
              <Text style={styles.supportText}>
                {t('Supported format jpeg, png')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('Post Title')}</Text>
          <CustomTextInput
            value={title}
            maxLength={60}
            inputStyle={styles.input}
            placeholderTextColor={colors._7B7878}
            placeholder={t('Enter the post title')}
            onChangeText={(e: any) => updatePostForm({ title: e })}
            containerStyle={styles.inputContainer}
          />
          <CharLength chars={60} value={title} style={styles.charLength} />
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('Description')}</Text>
          <CustomTextInput
            multiline
            maxLength={200}
            value={description}
            inputStyle={[styles.input, styles.descriptionInput]}
            placeholderTextColor={colors._7B7878}
            placeholder={t('What do you want to share with job seekers?')}
            onChangeText={(e: any) => updatePostForm({ description: e })}
            containerStyle={styles.inputContainer}
          />
          <CharLength chars={200} value={description} style={styles.charLength} />
        </View>
      </KeyboardAwareScrollView>

      {/* Review Post Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + hp(20) }]}>
        <GradientButton
          style={styles.reviewBtn}
          type="Company"
          title={t('Review Post')}
          onPress={handleReviewPost}
        />
      </View>

      <ImagePickerModal
        actionSheet={imageModal}
        setActionSheet={() => setImageModal(false)}
        onUpdate={(e: any) => addImage(e)}
      />
    </LinearContainer>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: wp(25),
    paddingTop: hp(15),
    gap: hp(10),
  },
  screenTitle: {
    ...commonFontStyle(600, 24, colors._0B3970),
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(25),
    paddingBottom: hp(120),
  },
  section: {
    marginTop: hp(24),
  },
  sectionLabel: {
    ...commonFontStyle(500, 16, colors._0B3970),
    marginBottom: hp(12),
  },
  uploadPlaceholder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors._7B7878,
    borderRadius: wp(12),
    paddingVertical: hp(40),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors._F7F7F7,
  },
  uploadIcon: {
    width: wp(50),
    height: wp(50),
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  uploadText: {
    ...commonFontStyle(500, 16, colors._0B3970),
    marginTop: hp(12),
  },
  supportText: {
    ...commonFontStyle(400, 13, colors._7B7878),
    marginTop: hp(4),
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: wp(12),
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: hp(200),
    borderRadius: wp(12),
    resizeMode: 'cover',
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
  },
  imageActions: {
    position: 'absolute',
    top: hp(10),
    right: wp(10),
    flexDirection: 'row',
    gap: wp(8),
  },
  changeImageBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: wp(8),
  },
  changeImageText: {
    ...commonFontStyle(500, 13, colors._0B3970),
  },
  removeImageBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: wp(6),
    borderRadius: wp(8),
  },
  removeIcon: {
    width: wp(14),
    height: wp(14),
    tintColor: colors._0B3970,
  },
  inputContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors._7B7878,
    marginBottom: 0,
    paddingBottom: hp(8),
  },
  input: {
    ...commonFontStyle(400, 18, colors._1F1F1F),
    padding: 0,
  },
  descriptionInput: {
    minHeight: hp(80),
    maxHeight: hp(150),
    textAlignVertical: 'top',
  },
  charLength: {
    marginTop: hp(4),
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp(25),
    paddingVertical: hp(20),
    backgroundColor: colors.white,
  },
  reviewBtn: {
    borderRadius: wp(25),
  },
});
