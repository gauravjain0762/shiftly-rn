import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { pick, types, isErrorWithCode } from '@react-native-documents/picker';
import { IMAGES } from '../../assets/Images';
import BaseText from './BaseText';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { colors } from '../../theme/colors';

type Props = {
  value: any;
  onSelect?: (file: any) => void;
  title?: string;
};

const UploadDocument = ({ value, onSelect = () => {}, title }: Props) => {
  const openDocPicker = async () => {
    try {
      const result = await pick({
        presentationStyle: 'fullScreen',
        type: [
          types.doc,
          types.docx,
          types.pdf,
          types.images,
          types.zip,
          types.ppt,
          types.pptx,
          types.xls,
          types.xlsx,
          types.plainText,
        ],
      });

      if (!result?.uri) return;

      const file = {
        uri: result.uri,
        name: result.name ?? 'Document',
        type: result.type ?? 'application/octet-stream',
      };

      console.log('📄 File selected:', file);
      onSelect(file);
    } catch (e: any) {
      if (isErrorWithCode(e) && e.code === 'DOCUMENTS_PICKER_CANCELED') {
        console.log('User canceled document picker');
      } else {
        console.error('❌ Document picker error:', e);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.innerUploadView} onPress={openDocPicker}>
      {value ? (
        value?.type?.includes('image') ? (
          <Image
            style={styles.uploadMultiImagePic}
            source={{ uri: value.uri }}
          />
        ) : (
          <Image style={styles.pdfIcon} source={IMAGES.pdfIcon} />
        )
      ) : (
        <>
          <View style={styles.boxContainer}>
            <Image
              style={styles.uploadImage}
              source={IMAGES.upload}
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
    backgroundColor: colors._F9F9F9,
    height: hp(147),
    width: wp(170),
  },
  boxContainer: {
    height: hp(50),
    width: hp(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors._BEBEBE,
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
    borderColor: colors._D3D3D3,
    borderWidth: 1,
  },
  uploadText: {
    ...commonFontStyle(500, 1.8, colors._525252),
  },
  pdfIcon: {
    height: hp(50),
    width: hp(50),
  },
});
