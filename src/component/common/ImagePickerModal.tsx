import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import {colors} from '../../theme/colors';
import {hp, wp} from '../../theme/fonts';

const ImagePickerModal = ({
  actionSheet,
  setActionSheet,
  onUpdate,
  allowDocument = false,
}: any) => {
  const [image, setImage] = useState<any>(undefined);

  const closeActionSheet = () => setActionSheet(false);

  const openCamera = async () => {
    try {
      ImageCropPicker.openCamera({
        mediaType: 'photo',
        cropping: true,
      }).then(image => {
        if (Platform.OS == 'android') {
          image.sourceURL = image.path;
        } else {
          if (image.sourceURL == null) {
            image.sourceURL = image.path;
          }
        }
        let temp = {...image, name: 'image_' + new Date().getTime() + '.png'};
        setImage(temp);
        closeActionSheet();
        onUpdate(temp);

        closeActionSheet();
      });
    } catch (err) {
      console.log('Camera cancelled or error', err);
    }
  };

  const openGallery = async () => {
    try {
      const res = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
      });

      const temp = {
        ...res,
        uri: res.path,
        name: res.path.split('/').pop(),
        type: res.mime || 'image/jpeg',
      };
      setImage(temp);
      closeActionSheet();
      onUpdate(temp);
    } catch (err) {
      console.log('Gallery cancelled or error', err);
    }
  };

  const openDocument = async () => {
    console.log('opening document>>>>>>');
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Storage permission is required');
          return;
        }
      }

      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
      });

      const file = res[0];
      console.log("🔥 ~ openDocument ~ file:", file)
      const temp = {
        uri: file.uri,
        name: file.name,
        type: file.type,
        size: file.size,
      };
      closeActionSheet();
      onUpdate(temp);
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picker cancelled');
      } else {
        console.log('Document picker error', err);
      }
    }
  };

  return (
    <Modal
      isVisible={actionSheet}
      onBackdropPress={closeActionSheet}
      style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.optionGroup}>
          <TouchableOpacity style={styles.optionButton} onPress={openGallery}>
            <Text style={styles.text}>Select From Gallery</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
            <Text style={styles.text}>Take a Photo</Text>
          </TouchableOpacity>
          {allowDocument && (
            <>
              <View style={styles.separator} />
              <TouchableOpacity
                style={styles.optionButton}
                onPress={openDocument}>
                <Text style={styles.text}>Select Document</Text>
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
  modal: {justifyContent: 'flex-end', margin: 0},
  container: {padding: wp(16)},
  optionGroup: {
    backgroundColor: colors._FAEED2,
    alignItems: 'center',
    borderRadius: wp(16),
    marginBottom: hp(12),
    overflow: 'hidden',
  },
  optionButton: {paddingVertical: hp(20), alignItems: 'center', width: '100%'},
  separator: {height: 1, backgroundColor: colors._050505, width: '100%'},
  cancelButton: {
    backgroundColor: colors._FAEED2,
    paddingVertical: hp(18),
    alignItems: 'center',
    borderRadius: wp(16),
    marginTop: hp(8),
  },
  text: {color: colors.black, fontSize: wp(16)},
  cancelText: {fontWeight: '600'},
});

export default ImagePickerModal;
