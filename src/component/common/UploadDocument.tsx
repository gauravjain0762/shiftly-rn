import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

// import DocumentPicker from 'react-native-document-picker';
import {IMAGES} from '../../assets/Images';
import BaseText from './BaseText';

type Props = {
  value: any;
  onSelect?: (text: any) => void;
  title?: any;
};

const UploadDocument = ({value, onSelect = () => {}, title}: Props) => {
  const openDocPicker = async () => {
    // try {
    //   const pickerResult = await DocumentPicker.pickSingle({
    //     presentationStyle: 'fullScreen',
    //     type: [
    //       DocumentPicker.types.doc,
    //       DocumentPicker.types.pdf,
    //       DocumentPicker.types.images,
    //       DocumentPicker.types.zip,
    //       DocumentPicker.types.docx,
    //       DocumentPicker.types.ppt,
    //       DocumentPicker.types.pptx,
    //       DocumentPicker.types.xls,
    //       DocumentPicker.types.xlsx,
    //       DocumentPicker.types.plainText,
    //     ],
    //   });
    //   console.log('pickerResult', pickerResult);
    //   const newFile = {
    //     uri: pickerResult.uri,
    //     name: pickerResult.name,
    //     type: pickerResult.type,
    //   };
    //   onSelect(newFile);
    // } catch (e) {
    //   console.log('error--', e);
    // }
  };

  return (
    <TouchableOpacity
      style={styles.innerUploadView}
      onPress={() => openDocPicker()}>
      {value ? (
        value?.type.includes('image') ? (
          <Image
            style={styles.uploadMultiImagePic}
            source={{uri: value?.uri || ''}}
          />
        ) : (
          <Image style={styles.pdfIcon} source={IMAGES.pdfIcon} />
        )
      ) : (
        <>
          <View style={styles.boxContainer}>
            <Image
              style={styles.uploadImage}
              source={value ? {uri: value.path} : IMAGES.upload}
            />
          </View>
          <BaseText style={styles.uploadText} text={title} />
        </>
      )}
    </TouchableOpacity>
  );
};

export default UploadDocument;

const styles = StyleSheet.create({
  innerUploadView: {
    gap: wp(21),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(15),
    backgroundColor: Colors._F9F9F9,
    height: hp(147),
    width: wp(170),
  },
  boxContainer: {
    height: hp(50),
    width: hp(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors._BEBEBE,
  },
  uploadImage: {
    height: 32,
    width: 32,
    borderRadius: 5,
    resizeMode: 'contain',
  },
  uploadMultiImagePic: {
    height: hp(147),
    width: wp(170),
    marginBottom: hp(2),
    borderRadius: 15,
    resizeMode: 'contain',
    borderColor: Colors._D3D3D3,
    borderWidth: 1,
  },
  uploadText: {
    ...commonFontStyle(500, 1.8, Colors._525252),
  },

  pdfIcon: {
    height: hp(50),
    width: hp(50),
  },
});
