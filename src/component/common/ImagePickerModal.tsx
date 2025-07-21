import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Modal from 'react-native-modal';
import ImageCropPicker from 'react-native-image-crop-picker';
import {colors} from '../../theme/colors';

const ImagePickerModal = ({actionSheet, setActionSheet, onUpdate}) => {
  const [image, setimage] = useState(undefined);

  const handleSelect = action => {
    console.log(`User selected: ${action}`);
    setActionSheet(false);
    // Add your logic here (e.g., open camera or image picker)
  };

  const closeActionSheet = () => setActionSheet(false);

  const openPicker = () => {
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
      setimage(temp);
      closeActionSheet();
      onUpdate(temp);
    });
  };
  const openGallery = () => {
    ImageCropPicker.openPicker({
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
      let temp = {...image, name: image.path.split('/').pop()};
      setimage(temp);
      closeActionSheet();
      onUpdate(temp);
    });
  };

  return (
    <>
      <Modal
        isVisible={actionSheet}
        onBackdropPress={() => setActionSheet(false)}
        style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.option1}>
            <TouchableOpacity
              style={styles.option2}
              onPress={() => openGallery('library')}>
              <Text style={styles.text}>Select From Library</Text>
            </TouchableOpacity>
            <View
              style={{borderWidth: 0.5, width: '100%', borderColor: '#041428'}}
            />
            <TouchableOpacity
              style={styles.option2}
              onPress={() => openPicker('camera')}>
              <Text style={styles.text}>Take a photo</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.option, styles.cancel]}
            onPress={() => setActionSheet(false)}>
            <Text style={[styles.text, {fontWeight: '600'}]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    padding: 16,
  },
  option1: {
    backgroundColor: '#FAEED2',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 12,
  },
  option2: {
    backgroundColor: '#FAEED2',
    paddingVertical: 21,
    alignItems: 'center',
  },
  option: {
    backgroundColor: '#FAEED2',
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 12,
  },
  cancel: {
    marginTop: 8,
    backgroundColor: '#FAEED2',
  },
  text: {
    color: '#000000',
  },
});

export default ImagePickerModal;
