import React from 'react';
import {
  Alert,
  Linking,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import ImageCropPicker from 'react-native-image-crop-picker';
import { pick, types, isErrorWithCode } from '@react-native-documents/picker';
import { colors } from '../../theme/colors';
import { hp, wp } from '../../theme/fonts';

type CropSize = {
  width: number;
  height: number;
};
const ImagePickerModal = ({
  actionSheet,
  setActionSheet = () => { },
  onUpdate = () => { },
  allowDocument = false,
  isGalleryEnable = true,
  cropSize
}: {
  actionSheet?: boolean;
  setActionSheet?: (value: boolean) => void;
  onUpdate?: (value: any) => void;
  allowDocument?: boolean;
  isGalleryEnable?: boolean;
  cropSize?: CropSize;
}) => {
  const pendingAction = React.useRef<'camera' | null>(null);
  const closeActionSheet = () => setActionSheet(false);

  const getCropOptions = () => {
    if (cropSize) {
      return {
        cropping: true,
        width: cropSize.width,
        height: cropSize.height,
        cropperToolbarTitle: `Crop (${cropSize.width} x ${cropSize.height})`,
        enableRotationGesture: false,
        freeStyleCropEnabled: false, // lock to exact ratio
      };
    }
    return {cropping: true};
  };
  const launchCamera = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        mediaType: 'photo',
        // compressImageQuality: 1,
        cropperToolbarTitle: 'Edit Photo',
        cropperStatusBarColor: '#000000',
        cropperToolbarColor: '#000000',
        cropperActiveWidgetColor: '#0B3970',
        cropperToolbarWidgetColor: '#FFFFFF',
        cropperCancelText: 'Cancel',
        cropperChooseText: 'Done',
        ...(Platform.OS === 'android' && {
          // Android-specific options
          includeBase64: false,
          freeStyleCropEnabled: false,
        }),
        ...(Platform.OS === 'ios' && {
          cropperStatusBarTranslucent: false,
        }),
         ...getCropOptions(),
      });

      // Validate image object
      if (!image || (!image.path && !image.sourceURL)) {
        console.error('Invalid image object from camera:', image);
        return;
      }

      // Handle Android path/URI issues
      let imageUri = image.path;
      if (Platform.OS === 'android') {
        // For Android, ensure we have a valid URI
        if (image.path) {
          // Ensure path starts with file:// if it doesn't already
          imageUri = image.path.startsWith('file://') ? image.path : `file://${image.path}`;
          image.sourceURL = imageUri;
        } else if (image.sourceURL) {
          imageUri = image.sourceURL;
        } else {
          console.error('No valid path or sourceURL found for Android image');
          return;
        }
      } else {
        // iOS handling
        if (image.sourceURL == null && image.path) {
          image.sourceURL = image.path;
          imageUri = image.path;
        } else if (image.sourceURL) {
          imageUri = image.sourceURL;
        }
      }

      // Create image object with all required properties
      const temp = {
        ...image,
        uri: imageUri,
        path: imageUri,
        sourceURL: imageUri,
        name: image.filename || `image_${new Date().getTime()}.${image.mime?.split('/')[1] || 'jpg'}`,
        filename: image.filename || `image_${new Date().getTime()}.${image.mime?.split('/')[1] || 'jpg'}`,
        type: image.mime || 'image/jpeg',
        mime: image.mime || 'image/jpeg',
      };

      onUpdate(temp);
    } catch (err: any) {
      if (err?.code === 'E_PICKER_CANCELLED' || err?.message?.includes('cancel')) {
        // user cancelled — no-op
      } else if (
        err?.code === 'E_NO_CAMERA_PERMISSION' ||
        err?.message?.toLowerCase().includes('permission')
      ) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access in Settings to take a photo.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
      } else {
        console.error('Camera error:', err);
      }
    }
  };

  const openCamera = () => {
    pendingAction.current = 'camera';
    closeActionSheet();
  };

  const handleModalHide = () => {
    if (pendingAction.current === 'camera') {
      pendingAction.current = null;
      // Delay gives iOS time to fully release the modal's UIViewController
      // before presenting the camera. Without this, iOS silently rejects the
      // camera presentation and no permission prompt appears.
      setTimeout(() => launchCamera(), 300);
    }
  };

  const openGallery = async () => {
    try {
      const res = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        // compressImageQuality: 1,
        cropperToolbarTitle: 'Edit Photo',
        cropperStatusBarColor: '#000000',
        cropperToolbarColor: '#000000',
        cropperActiveWidgetColor: '#0B3970',
        cropperToolbarWidgetColor: '#FFFFFF',
        cropperCancelText: 'Cancel',
        cropperChooseText: 'Done',
        ...(Platform.OS === 'ios' && {
          cropperStatusBarTranslucent: false,
        }),
        ...getCropOptions(),
      });
console.log(res,'resresres');

      const temp = {
        ...res,
        uri: res.path,
        name: res.path.split('/').pop(),
        type: res.mime || 'image/jpeg',
      };
      closeActionSheet();
      onUpdate(temp);
    } catch (err) {
      console.log('Gallery cancelled or error', err);
    }
  };

  const openDocument = async () => {
    try {
      console.log('📄 Opening document picker...');

      const result = await pick({
        type: [types.pdf, types.doc, types.docx],
        allowMultiSelection: false,
        copyTo: 'cachesDirectory',
      });

      console.log('📄 Document picker result:', result);

      if (!result || result.length === 0) {
        console.log('❌ No document selected');
        return;
      }

      const file = result[0];
      console.log('📄 Selected file:', file);

      if (!file?.uri) {
        console.log('❌ No URI in selected file');
        return;
      }

      // Handle different URI formats
      let fileUri = file.uri;

      // For Android, sometimes we need to use the fileCopyUri
      if (Platform.OS === 'android' && file.fileCopyUri) {
        fileUri = file.fileCopyUri;
      }

      const temp = {
        uri: fileUri,
        path: fileUri,
        name: file.name || 'document.pdf',
        type: file.type || 'application/pdf',
        size: file.size || 0,
        filename: file.name || 'document.pdf',
        file_name: file.name || 'document.pdf',
      };

      console.log('✅ Formatted document data:', temp);

      closeActionSheet();
      onUpdate(temp);
    } catch (err: any) {
      if (isErrorWithCode(err) && err.code === 'DOCUMENTS_PICKER_CANCELED') {
        console.log('User canceled document picker');
      } else {
        console.error('❌ Document picker error:', err);
        console.error('Error details:', {
          message: err.message,
          code: err.code,
          stack: err.stack,
        });
      }
    }
  };

  return (
    <Modal
      isVisible={actionSheet}
      onBackdropPress={closeActionSheet}
      onModalHide={handleModalHide}
      style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.optionGroup}>
          {isGalleryEnable && (
            <TouchableOpacity style={styles.optionButton} onPress={openGallery}>
              <Text style={styles.text}>Select From Gallery</Text>
            </TouchableOpacity>
          )}
          {isGalleryEnable && (
            <>
              <View style={styles.separator} />
              <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
                <Text style={styles.text}>Take a Photo</Text>
              </TouchableOpacity>
            </>
          )}
          {allowDocument && (
            <>
              <View style={styles.separator} />
              <TouchableOpacity
                style={styles.optionButton}
                onPress={openDocument}>
                <Text style={styles.text}>Select Document (PDF/Word)</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={closeActionSheet}>
          <Text style={[styles.text, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: { padding: wp(16) },
  optionGroup: {
    backgroundColor: colors._FAEED2,
    alignItems: 'center',
    borderRadius: wp(16),
    marginBottom: hp(12),
    overflow: 'hidden',
  },
  optionButton: { paddingVertical: hp(20), alignItems: 'center', width: '100%' },
  separator: { height: 1, backgroundColor: colors._050505, width: '100%' },
  cancelButton: {
    backgroundColor: colors._FAEED2,
    paddingVertical: hp(18),
    alignItems: 'center',
    borderRadius: wp(16),
    marginTop: hp(8),
  },
  text: { color: colors.black, fontSize: wp(16) },
  cancelText: { fontWeight: '600' },
});

export default ImagePickerModal;