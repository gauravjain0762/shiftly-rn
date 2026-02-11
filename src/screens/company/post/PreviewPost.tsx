import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
    BackHeader,
    GradientButton,
    LinearContainer,
} from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../assets/Images';
import {
    errorToast,
    goBack,
    navigateTo,
    resetNavigation,
    successToast,
} from '../../../utils/commonFunction';
import { navigationRef } from '../../../navigation/RootContainer';
import { SCREENS } from '../../../navigation/screenNames';
import { useCreateCompanyPostMutation, useEditCompanyPostMutation } from '../../../api/dashboardApi';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
    resetPostFormState,
    selectPostForm,
    setCoPostSteps,
} from '../../../features/companySlice';
import BottomModal from '../../../component/common/BottomModal';
import usePostFormUpdater from '../../../hooks/usePostFormUpdater';
import ExpandableText from '../../../component/common/ExpandableText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PreviewPost = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const [companyPost] = useCreateCompanyPostMutation();
    const [editPost] = useEditCompanyPostMutation();
    const {
        title,
        description,
        uploadedImages,
        isPostModalVisible,
        isPostUploading,
        postEditMode,
        postId,
    } = useAppSelector(state => selectPostForm(state as any));
    const { updatePostForm } = usePostFormUpdater();
    const [imageLoading, setImageLoading] = useState(false);

    const hasValidImage = () => {
        return uploadedImages.length > 0 && uploadedImages[0]?.uri;
    };

    const handlePublishPost = async () => {
        try {
            if (!title.trim()) {
                return errorToast(t('Please enter a valid title'));
            }
            if (!description.trim()) {
                return errorToast(t('Please enter a description'));
            }
            if (!hasValidImage()) {
                return errorToast(t('Please upload an image'));
            }

            updatePostForm({ isPostUploading: true });

            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('description', description.trim());

            // For edit mode, add post_id
            if (postEditMode && postId) {
                formData.append('post_id', postId);
            }

            // Only append image if it's a new image (not an existing URL)
            const imageData = uploadedImages[0];
            if (imageData && !imageData.isExisting) {
                formData.append('images', {
                    uri: imageData.uri,
                    type: imageData.type || 'image/jpeg',
                    name: imageData.name,
                });
            }

            let response;
            if (postEditMode && postId) {
                response = await editPost(formData).unwrap();
            } else {
                response = await companyPost(formData).unwrap();
            }

            if (response?.status) {
                // successToast(response?.message);
                updatePostForm({ isPostModalVisible: true });
            } else {
                errorToast(response?.message || (postEditMode ? 'Failed to update post' : 'Failed to create post'));
            }
        } catch (e: any) {
            console.error('handlePublishPost error', e);
            errorToast(e?.data?.message || 'Something went wrong');
        } finally {
            updatePostForm({ isPostUploading: false });
        }
    };

    const handleGoHome = () => {
        dispatch(setCoPostSteps(0));
        dispatch(resetPostFormState());

        // Reset navigation to CoPost tab screen
        if (navigationRef.current?.isReady()) {
            navigationRef.current.reset({
                index: 0,
                routes: [
                    {
                        name: SCREENS.CoStack,
                        state: {
                            routes: [
                                {
                                    name: SCREENS.CoTabNavigator,
                                    state: {
                                        routes: [{ name: SCREENS.CoPost }],
                                        index: 0,
                                    },
                                },
                            ],
                            index: 0,
                        },
                    },
                ],
            });
        } else {
            resetNavigation(SCREENS.CoStack, SCREENS.CoTabNavigator);
            setTimeout(() => {
                navigateTo(SCREENS.CoPost);
            }, 100);
        }
    };

    return (
        <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
            <View style={styles.headerContainer}>
                <BackHeader
                    onBackPress={goBack}
                    type="company"
                    title={t('Preview Post')}
                    isRight={false}
                />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                {/* Post Preview Card */}
                <View style={styles.previewCard}>
                    {hasValidImage() && (
                        <View style={styles.imageContainer}>
                            {imageLoading && (
                                <View style={styles.imageLoaderContainer}>
                                    <ActivityIndicator size="large" color={colors._0B3970} />
                                </View>
                            )}
                            <Image
                                source={{
                                    uri: (Platform.OS === 'ios' && uploadedImages[0]?.uri && !uploadedImages[0]?.uri.startsWith('file://') && !uploadedImages[0]?.uri.startsWith('http') && !uploadedImages[0]?.uri.startsWith('ph://'))
                                        ? `file://${uploadedImages[0]?.uri}`
                                        : uploadedImages[0]?.uri
                                }}
                                style={styles.postImage}
                                onLoadStart={() => setImageLoading(true)}
                                onLoadEnd={() => setImageLoading(false)}
                            />
                        </View>
                    )}

                    {/* Title */}
                    <Text style={styles.postTitle}>{title}</Text>

                    {/* Description */}
                    <ExpandableText
                        description={description}
                        descriptionStyle={styles.postDescription}
                        maxLines={6}
                        showStyle={styles.showMoreBtn}
                    />
                </View>
            </ScrollView>

            {/* Publish Post Button */}
            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + hp(20) }]}>
                <GradientButton
                    style={styles.publishBtn}
                    type="Company"
                    title={postEditMode ? t('Update Post') : t('Publish Post')}
                    onPress={() => {
                        ReactNativeHapticFeedback.trigger('impactLight', {
                            enableVibrateFallback: true,
                            ignoreAndroidSystemSettings: false,
                        });
                        handlePublishPost();
                    }}
                    disabled={isPostUploading}
                />
            </View>

            {/* Success Modal */}
            <BottomModal
                visible={isPostModalVisible}
                backgroundColor={colors._FAEED2}
                onClose={() => { }}>
                <View style={styles.modalIconWrapper}>
                    <Image
                        source={IMAGES.check}
                        tintColor={colors._FAEED2}
                        style={styles.modalCheckIcon}
                    />
                </View>

                <View>
                    <Text style={styles.modalTitle}>
                        {postEditMode ? t('Post Updated Successfully') : t('Post Created Successfully')}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                        {t('Your post has been published. View it now or return to the home screen.')}
                    </Text>
                </View>

                <GradientButton
                    style={styles.modalBtn}
                    type="Company"
                    title={t('Home')}
                    onPress={handleGoHome}
                />
                <View style={{ paddingBottom: insets.bottom }} />
            </BottomModal>
        </LinearContainer>
    );
};

export default PreviewPost;

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
        paddingTop: hp(20),
        paddingBottom: hp(120),
    },
    previewCard: {
        backgroundColor: colors.white,
        borderRadius: wp(16),
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    postImage: {
        width: '100%',
        height: hp(220),
        resizeMode: 'cover',
    },
    imageContainer: {
        position: 'relative',
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
        height: hp(220),
    },
    postTitle: {
        ...commonFontStyle(600, 20, colors._0B3970),
        paddingHorizontal: wp(16),
        paddingTop: hp(16),
    },
    postDescription: {
        ...commonFontStyle(400, 15, colors._4A4A4A),
        paddingHorizontal: wp(16),
        paddingTop: hp(10),
        paddingBottom: hp(16),
        lineHeight: hp(22),
    },
    showMoreBtn: {
        paddingHorizontal: wp(16),
        paddingBottom: hp(16),
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: wp(25),
        paddingTop: hp(15),
        backgroundColor: colors.white,
    },
    publishBtn: {
        borderRadius: wp(25),
    },
    modalIconWrapper: {
        width: wp(90),
        height: hp(90),
        alignSelf: 'center',
        borderRadius: wp(90),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors._0B3970,
    },
    modalCheckIcon: {
        width: wp(30),
        height: hp(30),
        borderRadius: wp(30),
    },
    modalTitle: {
        textAlign: 'center',
        marginVertical: hp(16),
        ...commonFontStyle(600, 25, colors.black),
    },
    modalSubtitle: {
        textAlign: 'center',
        ...commonFontStyle(400, 18, colors._6B6B6B),
    },
    modalBtn: {
        marginTop: hp(20),
        borderRadius: wp(25),
    },
});
