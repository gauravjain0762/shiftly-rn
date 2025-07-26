import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
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
import {errorToast, navigateTo, resetNavigation} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useCreateCompanyPostMutation} from '../../../api/dashboardApi';

const CoPost = () => {
  const {t} = useTranslation();
  const [companyPost, {isLoading: postLoading}] =
    useCreateCompanyPostMutation();
  const [imageModal, setImageModal] = useState(false);
  const [step, setStep] = useState(1);
  const [upload, setUpload] = useState({});
  const [post, setPost] = useState('');
  const [description, setDescription] = useState('');
  const [postImage, setPostImage] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<any>([]);
  const [createPostData, setCreatePostData] = useState({
    title: '',
    description: '',
  });

  const nextStep = () => setStep(prev => prev + 1);

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    }
    setStep(prev => prev - 1);
  };

  const handleUploadPost = async () => {
    if (createPostData?.title === '') {
      errorToast(t('Please enter a valid title'));
    } else if (createPostData?.description === '') {
      errorToast(t('Please enter description'));
    } else {
      let data = {
        title: createPostData?.title.trim(),
        description: createPostData?.description.trim(),
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
      console.log(response, 'response----');
      if (response?.status) {
        resetNavigation(SCREENS.CoTabNavigator);
      }
    }
  };
  const addImage = (newImage: any) => {
    setUploadedImages([
      {
        uri: newImage?.sourceURL,
        type: newImage?.mime,
        name: newImage?.sourceURL.split('/').pop(),
      },
    ]);
    // if (uploadedImages.length < 1) {
    //   setUploadedImages(prev => [...prev, newImage]);
    // } else {
    //   errorToast(t(`Maximum ${1} images allowed`));
    // }
  };

  const render = () => {
    switch (step || 1) {
      case 1:
        return (
          <View style={styles.container}>
            <View>
              {uploadedImages.length === 0 && !uploadedImages[0]?.uri ? (
                <View style={styles.headercontainer}>
                  <BackHeader
                    onBackPress={() => prevStep(step)}
                    type="company"
                    title=""
                    isRight={false}
                  />
                  <Text style={styles.createPost}>{t('Create a post')}</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setUploadedImages([])}>
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
              <View>
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
                  onPress={() => nextStep()}
                />
              </View>
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
                  onBackPress={() => prevStep(step)}
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
                onChangeText={(e: any) =>
                  setCreatePostData({...createPostData, title: e})
                }
                value={createPostData?.title}
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
              onPress={() => nextStep()}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.container}>
            <View>
              <View style={styles.headercontainer}>
                <BackHeader
                  onBackPress={() => prevStep(step)}
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
                onChangeText={(e: any) =>
                  setCreatePostData({...createPostData, description: e})
                }
                value={createPostData?.description}
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
              onPress={() => nextStep()}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.container}>
            <View>
              <View style={styles.headercontainer}>
                <BackHeader
                  onBackPress={() => prevStep(step)}
                  type="company"
                  title=""
                  RightIcon={
                    <TouchableOpacity
                      onPress={() => navigateTo(SCREENS.CoHome)}>
                      <Image
                        source={IMAGES.close}
                        style={[styles.close, {marginVertical: hp(20)}]}
                      />
                    </TouchableOpacity>
                  }
                />
                <Text style={styles.post}>{createPostData?.title}</Text>
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
                {createPostData?.description}
              </Text>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
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
    marginHorizontal: wp(42),
    marginBottom: hp(40),
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
    ...commonFontStyle(400, 22, colors._7B7878),
  },
  scrollConatiner: {
    flex: 1,
  },
  post: {
    ...commonFontStyle(400, 22, colors._7B7878),
  },
});
