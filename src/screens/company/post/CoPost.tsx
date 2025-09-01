import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  BackHeader,
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AppStyles} from '../../../theme/appStyles';
import {
  errorToast,
  goBack,
  navigateTo,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useCreateCompanyPostMutation} from '../../../api/dashboardApi';
import {useAppDispatch, useAppSelector} from '../../../redux/hooks';
import {
  incrementCoPostSteps,
  resetPostFormState,
  selectPostForm,
  setCoPostSteps,
} from '../../../features/companySlice';
import BottomModal from '../../../component/common/BottomModal';
import usePostFormUpdater from '../../../hooks/usePostFormUpdater';
import ExpandableText from '../../../component/common/ExpandableText';
import CharLength from '../../../component/common/CharLength';

const CoPost = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [companyPost] = useCreateCompanyPostMutation();
  const steps = useAppSelector((state: any) => state.company.coPostSteps);
  const [imageModal, setImageModal] = useState(false);
  const {
    description,
    isPostModalVisible,
    uploadedImages,
    title,
    isPostUploading,
  } = useAppSelector(state => selectPostForm(state as any));
  const {updatePostForm} = usePostFormUpdater();

  const nextStep = () => dispatch(setCoPostSteps(steps + 1));

  const prevStep = () => {
    dispatch(setCoPostSteps(steps - 1));
  };

  const resetUploadImages = () => {
    updatePostForm({uploadedImages: []});
    dispatch(setCoPostSteps(1));
  };

  const handleUploadPost = async () => {
    try {
      if (title === '') {
        errorToast(t('Please enter a valid title'));
      } else if (description === '') {
        errorToast(t('Please enter description'));
      } else {
        let data = {
          title: title.trim(),
          description: description.trim(),
          images: uploadedImages?.map(
            (item: any) => item?.name || item?.uri?.split('/').pop(),
          ),
        };
        console.log(data, 'handleUploadPost datadatadata >>>>>>>>');

        updatePostForm({isPostUploading: true});

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('images', {
          uri: uploadedImages[0]?.uri,
          type: uploadedImages[0]?.type || 'image/jpeg',
          name: uploadedImages[0]?.name,
        });

        const response = await companyPost(formData).unwrap();
        console.log(response, 'response----companyPost');
        if (response?.status) {
          successToast(response?.message);
          updatePostForm({isPostModalVisible: true});
        }
      }
    } catch (e: any) {
      console.error('handleUploadPost error', e);
      errorToast(e?.data?.message);
    } finally {
      updatePostForm({isPostUploading: false});
    }
  };

  const addImage = (newImage: any) => {
    console.log('New image received:', newImage);

    const imageObject = {
      uri: newImage?.sourceURL || newImage?.path || newImage?.uri,
      type: newImage?.mime || newImage?.type || 'image/jpeg',
      name:
        (newImage?.sourceURL || newImage?.path || newImage?.uri)
          ?.split('/')
          .pop() || `image_${Date.now()}.jpg`,
    };

    console.log('Formatted image object:', imageObject);

    const updatedImages =
      uploadedImages.length > 0 ? [imageObject] : [imageObject];

    updatePostForm({uploadedImages: updatedImages});

    setTimeout(() => {
      setImageModal(false);
    }, 200);
  };

  const postInputContainer = React.useMemo(
    () => ({
      marginTop: hp(65),
      marginHorizontal: wp(35),
    }),
    [],
  );

  const hasValidImage = () => {
    return uploadedImages.length > 0 && uploadedImages[0]?.uri;
  };

  const render = () => {
    switch (steps || 1) {
      case 1:
        return (
          <View style={{flex: 1}}>
            {uploadedImages?.length < 1 && (
              <BackHeader
                onBackPress={goBack}
                type="company"
                title=""
                isRight={false}
                containerStyle={{paddingHorizontal: wp(33), marginTop: hp(15)}}
              />
            )}

            <View>
              {uploadedImages?.length < 1 ? (
                <View style={styles.headercontainer}>
                  <Text style={styles.createPost}>{t('Create a post')}</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={resetUploadImages}>
                  <Image
                    source={IMAGES.close}
                    style={[styles.close, {marginVertical: hp(30)}]}
                  />
                </TouchableOpacity>
              )}
              {uploadedImages?.length > 0 ? (
                <Image
                  source={{uri: uploadedImages[0]?.uri}}
                  style={styles.uploadImg}
                />
              ) : (
                <View style={styles.uploadContainer}>
                  <Image style={styles.upload} source={IMAGES.uploadImg} />
                  <Text style={styles.uploadTitle}>{t('Upload Images')}</Text>
                  <Text style={styles.support}>
                    {'Supported format jpeg, png'}
                  </Text>
                </View>
              )}
            </View>
            {uploadedImages?.length > 0 ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    console.log('Retake button pressed');
                    setImageModal(true);
                  }}
                  style={styles.retakeBtn}>
                  <Text style={styles.retake}>{t('Retake')}</Text>
                </TouchableOpacity>
                <GradientButton
                  style={styles.btn}
                  type="Company"
                  title={t('Continue')}
                  onPress={() => {
                    console.log('Tap one time >>>>>');
                    dispatch(incrementCoPostSteps());
                  }}
                />
              </>
            ) : (
              <GradientButton
                style={[styles.btn]}
                type="Company"
                title={t('Upload Image')}
                onPress={() => {
                  console.log('Upload Image button pressed');
                  setImageModal(true);
                }}
              />
            )}
          </View>
        );
      case 2:
        return (
          <View style={styles.container}>
            <View>
              <View style={styles.headercontainer}>
                <BackHeader
                  onBackPress={() => prevStep()}
                  type="company"
                  title=""
                  isRight={false}
                />
                <Text style={styles.createPost}>
                  {t('Write your post title')}
                </Text>
              </View>
              <CustomTextInput
                value={title}
                maxLength={50}
                inputStyle={styles.input1}
                placeholderTextColor={colors._7B7878}
                placeholder={t('Enter the post title')}
                onChangeText={(e: any) => updatePostForm({title: e})}
                containerStyle={[styles.Inputcontainer, postInputContainer]}
              />
              <CharLength
                chars={50}
                value={title}
                style={{paddingHorizontal: wp(30)}}
              />
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Continue')}
              onPress={() => {
                if (!title.trim()) {
                  return errorToast(t('Please enter a valid title'));
                }
                nextStep();
              }}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.container}>
            <View>
              <View style={styles.headercontainer}>
                <BackHeader
                  onBackPress={() => prevStep()}
                  type="company"
                  title=""
                  RightIcon={
                    <TouchableOpacity
                      onPress={() => {
                        resetUploadImages();
                        updatePostForm({
                          title: '',
                          description: '',
                        });
                      }}>
                      <Image source={IMAGES.close} style={styles.close} />
                    </TouchableOpacity>
                  }
                />
                <Text style={styles.createPost}>
                  {t('Would you like to add a short description?')}
                </Text>
              </View>
              <CustomTextInput
                multiline
                value={description}
                placeholderTextColor={colors._7B7878}
                placeholder={t('Enter the description')}
                onChangeText={(e: any) => updatePostForm({description: e})}
                inputStyle={[styles.input1, {maxHeight: hp(180)}]}
                containerStyle={[
                  styles.Inputcontainer,
                  {marginTop: hp(65), marginHorizontal: wp(35)},
                ]}
                maxLength={200}
              />
              <CharLength
                chars={200}
                value={description}
                style={{paddingHorizontal: wp(30)}}
              />
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Continue')}
              onPress={() => {
                if (!description.trim()) {
                  return errorToast(t('Please enter a description'));
                }
                nextStep();
              }}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.container}>
            <View>
              <View style={styles.headercontainer}>
                <BackHeader
                  onBackPress={() => prevStep()}
                  type="company"
                  title=""
                  RightIcon={
                    <TouchableOpacity
                      onPress={() => {
                        resetUploadImages();
                        navigateTo(SCREENS.CoHome);
                      }}>
                      <Image
                        source={IMAGES.close}
                        style={[styles.close, {marginVertical: hp(20)}]}
                      />
                    </TouchableOpacity>
                  }
                />
                <Text style={styles.post}>{title}</Text>
              </View>
              {hasValidImage() && (
                <Image
                  source={{uri: uploadedImages[0]?.uri}}
                  style={[styles.uploadImg, {marginTop: hp(20)}]}
                />
              )}
              <ExpandableText
                descriptionStyle={[
                  styles.post,
                  {marginHorizontal: wp(26), marginTop: hp(20)},
                ]}
                description={description}
                maxLines={5}
                showStyle={{
                  paddingVertical: hp(8),
                  marginHorizontal: wp(26),
                }}
              />
            </View>
            <GradientButton
              type="Company"
              style={styles.btn}
              disabled={isPostUploading}
              onPress={handleUploadPost}
              title={t(isPostUploading ? 'Creating...' : 'Create Post')}
            />
          </View>
        );

      default:
        break;
    }
  };

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <KeyboardAwareScrollView
        enableAutomaticScroll
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={AppStyles.flexGrow}
        style={styles.scrollConatiner}>
        {render()}
      </KeyboardAwareScrollView>
      <ImagePickerModal
        actionSheet={imageModal}
        setActionSheet={() => {
          console.log('ImagePickerModal closing');
          setImageModal(false);
        }}
        onUpdate={(e: any) => {
          console.log('ImagePickerModal onUpdate called with:', e);
          addImage(e);
        }}
      />
      <BottomModal
        visible={isPostModalVisible}
        backgroundColor={colors._FAEED2}
        onClose={() => {}}>
        <View style={styles.modalIconWrapper}>
          <Image
            source={IMAGES.check}
            tintColor={colors._FAEED2}
            style={styles.modalCheckIcon}
          />
        </View>

        <View>
          <Text style={styles.modalTitle}>{'Post Created Successfully'}</Text>
          <Text style={styles.modalSubtitle}>
            {
              'Your post has been published. View it now or return to the home screen.'
            }
          </Text>
        </View>

        <GradientButton
          style={styles.btn}
          type="Company"
          title={t('Home')}
          onPress={() => {
            dispatch(setCoPostSteps(1));
            updatePostForm({
              isPostModalVisible: false,
              uploadedImages: [],
              title: '',
              description: '',
            });
            resetNavigation(SCREENS.CoStack, SCREENS.CoTabNavigator);
          }}
        />
      </BottomModal>
    </LinearContainer>
  );
};

export default CoPost;

const styles = StyleSheet.create({
  headercontainer: {
    gap: hp(10),
    marginTop: hp(15),
    paddingHorizontal: wp(35),
  },
  createPost: {
    ...commonFontStyle(500, 25, colors._0B3970),
  },
  uploadContainer: {
    marginTop: hp(16),
    borderWidth: hp(1),
    borderColor: colors._7B7878,
    justifyContent: 'center',
    alignItems: 'center',
    height: '70%',
    marginHorizontal: wp(2),
  },
  upload: {
    width: wp(70),
    height: wp(70),
    resizeMode: 'contain',
    tintColor: '#234F85',
  },
  uploadTitle: {
    ...commonFontStyle(500, 20, colors._234F86),
    marginTop: hp(35),
  },
  support: {
    ...commonFontStyle(400, 15, colors.black),
    marginTop: hp(10),
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  btn: {
    marginVertical: hp(30),
    marginHorizontal: wp(42),
  },
  close: {
    width: wp(18),
    height: wp(18),
    marginLeft: wp(42),
    tintColor: colors._0B3970,
  },
  uploadImg: {
    height: hp(390),
    resizeMode: 'cover',
  },
  retake: {
    ...commonFontStyle(500, 20, colors._0B3970),
    paddingVertical: hp(12),
  },
  retakeBtn: {
    borderRadius: 100,
    borderColor: colors._0B3970,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(42),
    marginTop: '20%',
  },
  Inputcontainer: {
    flex: 1,
    marginBottom: 0,
    borderBottomWidth: 2,
    borderBottomColor: colors._7B7878,
    paddingBottom: 4,
  },
  input1: {
    ...commonFontStyle(400, 22, colors._1F1F1F),
  },
  scrollConatiner: {
    flex: 1,
  },
  post: {
    ...commonFontStyle(400, 20, colors._181818),
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
  modalHomeText: {
    marginBottom: hp(20),
    textAlign: 'center',
    ...commonFontStyle(400, 19, colors._B4B4B4),
  },
});
