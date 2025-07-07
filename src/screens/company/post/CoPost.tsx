import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {BackHeader, GradientButton, LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import {navigationRef} from '../../../navigation/RootContainer';

const CoPost = () => {
  const {t} = useTranslation();
  const [imageModal, setImageModal] = useState(false);
  const [step, setStep] = useState(1);
  const [upload, setUpload] = useState({});

  const nextStep = () => setStep(prev => prev + 1);

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    }
    setStep(prev => prev - 1);
  };

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <View style={styles.container}>
        <View>
          {Object?.keys(upload)?.length == 0 ? (
            <View style={styles.headercontainer}>
              <BackHeader type="company" title="" isRight={false} />
              <Text style={styles.createPost}>{t('Create a post')}</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setUpload({})}>
              <Image source={IMAGES.close} style={styles.close} />
            </TouchableOpacity>
          )}
          {Object?.keys(upload)?.length ? (
            <Image source={{uri: upload?.sourceURL}} style={styles.uploadImg} />
          ) : (
            <View style={styles.uploadContainer}>
              <Image style={styles.upload} source={IMAGES.uploadImg} />
              <Text style={styles.uploadTitle}>{t('Upload Images')}</Text>
              <Text style={styles.support}>{'Supported format jpeg, png'}</Text>
            </View>
          )}
        </View>
        {Object?.keys(upload)?.length ? (
          <View>
            <TouchableOpacity style={styles.retakeBtn}>
              <Text style={styles.retake}>{'Retake'}</Text>
            </TouchableOpacity>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Continue')}
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
      <ImagePickerModal
        actionSheet={imageModal}
        setActionSheet={() => {
          setImageModal(false);
        }}
        onUpdate={e => {
          console.log('eeeeeee', e), setUpload(e);
        }}
      />
    </LinearContainer>
  );
};

export default CoPost;

const styles = StyleSheet.create({
  headercontainer: {
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
    marginBottom: hp(20),
  },
  close: {
    width: wp(18),
    height: wp(18),
    tintColor: colors._0B3970,
    marginLeft: wp(42),
    marginVertical: hp(44),
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
});
