import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Modal from 'react-native-modal';
import ImageCropPicker from 'react-native-image-crop-picker';
import {colors} from '../../theme/colors';
import {hp, wp} from '../../theme/fonts';

const ImagePickerModal = ({actionSheet, setActionSheet, onUpdate}: any) => {
  const [image, setImage] = useState<any>(undefined);

  const closeActionSheet = () => setActionSheet(false);

  const openPicker = () => {
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      cropping: true,
    }).then(image => {
      if (Platform.OS === 'android') {
        image.sourceURL = image.path;
      } else if (image.sourceURL == null) {
        image.sourceURL = image.path;
      }
      const temp = {
        ...image,
        name: 'image_' + new Date().getTime() + '.png',
      };
      setImage(temp);
      closeActionSheet();
      onUpdate(temp);
    });
  };

  const openGallery = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      cropping: true,
    }).then(image => {
      if (Platform.OS === 'android') {
        image.sourceURL = image.path;
      } else if (image.sourceURL == null) {
        image.sourceURL = image.path;
      }
      const temp = {...image, name: image.path.split('/').pop()};
      setImage(temp);
      closeActionSheet();
      onUpdate(temp);
    });
  };

  return (
    <Modal
      isVisible={actionSheet}
      onBackdropPress={closeActionSheet}
      style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.optionGroup}>
          <TouchableOpacity style={styles.optionButton} onPress={openGallery}>
            <Text style={styles.text}>Select From Library</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.optionButton} onPress={openPicker}>
            <Text style={styles.text}>Take a Photo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.cancelButton]}
          onPress={closeActionSheet}>
          <Text style={[styles.text, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    padding: wp(16),
  },
  optionGroup: {
    backgroundColor: colors._FAEED2 || '#FAEED2',
    alignItems: 'center',
    borderRadius: wp(16),
    marginBottom: hp(12),
    overflow: 'hidden',
  },
  optionButton: {
    paddingVertical: hp(20),
    alignItems: 'center',
    width: '100%',
  },
  separator: {
    height: 1,
    backgroundColor: colors._050505,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: colors._FAEED2 || '#FAEED2',
    paddingVertical: hp(18),
    alignItems: 'center',
    borderRadius: wp(16),
    marginTop: hp(8),
  },
  text: {
    color: colors.black || '#000000',
    fontSize: wp(16),
  },
  cancelText: {
    fontWeight: '600',
  },
});

export default ImagePickerModal;
