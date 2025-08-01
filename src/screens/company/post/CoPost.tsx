import React, {useState} from 'react';
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
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import {navigationRef} from '../../../navigation/RootContainer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AppStyles} from '../../../theme/appStyles';
import {
  errorToast,
  navigateTo,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useCreateCompanyPostMutation} from '../../../api/dashboardApi';
import {useAppDispatch, useAppSelector} from '../../../redux/hooks';
import {
  resetPostFormState,
  selectPostForm,
  setCoPostSteps,
} from '../../../features/companySlice';
import BottomModal from '../../../component/common/BottomModal';
import usePostFormUpdater from '../../../hooks/usePostFormUpdater';

const CoPost = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [companyPost, {isLoading: postLoading}] =
    useCreateCompanyPostMutation();
  const steps = useAppSelector((state: any) => state.company.coPostSteps);
  const [imageModal, setImageModal] = useState(false);
  // const [step, setStep] = useState(1);
  // const [uploadedImages, setUploadedImages] = useState<any>([]);
  // const [createPostData, setCreatePostData] = useState({
  //   title: '',
  //   description: '',
  // });
  // const [isPostModalVisible, setIsPostModalVisible] = useState<boolean>(false);
  const {description, isPostModalVisible, uploadedImages, title} =
    useAppSelector(selectPostForm);
  const {updatePostForm} = usePostFormUpdater();

  const nextStep = () => dispatch(setCoPostSteps(steps + 1));

  const prevStep = (num?: any) => {
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
          images: uploadedImages,
        };
        console.log(data, 'datadatadata');
        // const formData = new FormData();
        // formData.append('title', createPostData?.title.trim());
        // formData.append('description', createPostData?.description.trim());
        // if (uploadedImages?.length > 0) {
        //   formData.append('images', uploadedImages);
        // }

        const response = await companyPost(data).unwrap();
        console.log(response, 'response----companyPost');
        if (response?.status) {
          // successToast(response?.message);
          updatePostForm({isPostModalVisible: true});
          // resetNavigation(SCREENS.CoTabNavigator);
          // setTimeout(() => {
          //   dispatch(setCoPostSteps(0));
          //   setUploadedImages([]);
          //   setCreatePostData({title: '', description: ''});
          // }, 300);
        }
      }
    } catch (e) {
      console.error('handleUploadPost error', e);
      errorToast(e?.data?.message);
    } finally {
    }
  };

  const addImage = (newImage: any) => {
    const updated = [
      {
        uri: newImage?.sourceURL,
        type: newImage?.mime,
        name: newImage?.sourceURL.split('/').pop(),
      },
    ];
    updatePostForm({uploadedImages: updated});

    setTimeout(() => {
      setImageModal(false);
      nextStep();
    }, 100);
  };

  const render = () => {
    switch (steps || 1) {
      case 1:
        return (
          <View style={styles.container}>
            <View>
              {uploadedImages.length === 0 && !uploadedImages[0]?.uri ? (
                <View style={styles.headercontainer}>
                  <Text style={styles.createPost}>{t('Create a post')}</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={resetUploadImages}>
                  <Image source={IMAGES.close} style={styles.close} />
                </TouchableOpacity>
              )}
              {uploadedImages.length > 0 &&
              Object?.keys(uploadedImages[0])?.length ? (
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
            {uploadedImages.length > 0 &&
            Object?.keys(uploadedImages[0])?.length ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setImageModal(!imageModal);
                  }}
                  style={styles.retakeBtn}>
                  <Text style={styles.retake}>{'Retake'}</Text>
                </TouchableOpacity>
                <GradientButton
                  style={styles.btn}
                  type="Company"
                  title={t('Continue')}
                  onPress={() => {
                    nextStep();
                  }}
                />
              </>
            ) : (
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Upload Image')}
                onPress={() => setImageModal(!imageModal)}
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
                  onBackPress={() => prevStep(steps)}
                  type="company"
                  title=""
                  isRight={false}
                />
                <Text style={styles.createPost}>
                  {t('Write your post title')}
                </Text>
              </View>
              <CustomTextInput
                placeholder={t('Walk-in Interview')}
                placeholderTextColor={colors._4A4A4A}
                onChangeText={(e: any) => updatePostForm({title: e})}
                value={title}
                style={styles.input1}
                containerStyle={[
                  styles.Inputcontainer,
                  {marginTop: hp(65), marginHorizontal: wp(35)},
                ]}
                numberOfLines={1}
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
                  onBackPress={() => prevStep(steps)}
                  type="company"
                  title=""
                  // isRight={false}
                  RightIcon={
                    <TouchableOpacity
                      onPress={() => {
                        prevStep();
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
                placeholder={t('Enter Description')}
                placeholderTextColor={colors._4A4A4A}
                onChangeText={(e: any) => updatePostForm({description: e})}
                value={description}
                style={[styles.input1, {maxHeight: 200}]}
                multiline
                containerStyle={[
                  styles.Inputcontainer,
                  {marginTop: hp(65), marginHorizontal: wp(35)},
                ]}
                // numberOfLines={1}
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
                  onBackPress={() => prevStep(steps)}
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
              <Image
                source={{uri: uploadedImages[0]?.uri ?? ''}}
                style={[styles.uploadImg, {marginTop: hp(20)}]}
              />
              <Text
                numberOfLines={5}
                style={[
                  styles.post,
                  {paddingHorizontal: wp(26), marginTop: hp(20)},
                ]}>
                {description}
              </Text>
            </View>
            <GradientButton
              type="Company"
              style={styles.btn}
              title={t('Create Post')}
              onPress={handleUploadPost}
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
        // scrollEnabled={false}
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
          setImageModal(false);
        }}
        onUpdate={(e: any) => {
          addImage(e);
          // setUpload(e);
          //   if (currentImageIndex !== null) {
          //     // Replace existing image
          //     replaceImage(currentImageIndex, e);
          //   } else {
          //     // Add new image
          //     addImage(e);
          //   }
          //   setCurrentImageIndex(null);
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
            dispatch(setCoPostSteps(0));
            resetPostFormState();
            updatePostForm({isPostModalVisible: false, uploadedImages: []});
            resetNavigation(SCREENS.CoTabNavigator);
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
    paddingHorizontal: wp(35),
  },
  createPost: {
    ...commonFontStyle(500, 25, colors._0B3970),
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: '#7B78784D',
    marginTop: hp(16),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(417),
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
    marginVertical: hp(40),
    marginHorizontal: wp(42),
  },
  close: {
    width: wp(18),
    height: wp(18),
    marginLeft: wp(42),
    marginVertical: hp(44),
    tintColor: colors._0B3970,
  },
  uploadImg: {
    height: hp(417),
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
    marginBottom: hp(30),
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
    ...commonFontStyle(400, 22, colors._7B7878),
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
