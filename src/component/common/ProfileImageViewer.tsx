import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {
  View, Image, TouchableOpacity, Modal, StyleSheet,
  Animated, Dimensions, StatusBar, Text, PanResponder,
} from 'react-native';

const {width, height} = Dimensions.get('window');

export interface ProfileImageViewerRef {
  open: () => void;
}

interface Props {
  imageUri: string | null;
  userName?: string;
}

const ProfileImageViewer = forwardRef<ProfileImageViewerRef, Props>(
  ({imageUri, userName}, ref) => {
    const [modalVisible, setModalVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const lastScale = useRef(1);
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const lastTranslateX = useRef(0);
    const lastTranslateY = useRef(0);

    // ✅ Expose open() to parent via ref
    useImperativeHandle(ref, () => ({
      open: openImage,
    }));

    const openImage = () => {
      if (!imageUri) return; // don't open if no image
      setModalVisible(true);
      StatusBar.setHidden(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {toValue: 1, duration: 250, useNativeDriver: true}),
        Animated.spring(scaleAnim, {toValue: 1, tension: 60, friction: 8, useNativeDriver: true}),
      ]).start();
    };

    const closeImage = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {toValue: 0, duration: 200, useNativeDriver: true}),
        Animated.timing(scaleAnim, {toValue: 0.5, duration: 200, useNativeDriver: true}),
      ]).start(() => {
        setModalVisible(false);
        StatusBar.setHidden(false);
        scale.setValue(1);
        lastScale.current = 1;
        translateX.setValue(0);
        translateY.setValue(0);
      });
    };

    const pinchResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (!(pinchResponder as any)._startDistance) {
            (pinchResponder as any)._startDistance = distance;
          }
          const newScale = Math.max(
            0.5,
            Math.min(4, lastScale.current * (distance / (pinchResponder as any)._startDistance)),
          );
          scale.setValue(newScale);
        } else if (touches.length === 1 && lastScale.current > 1) {
          translateX.setValue(lastTranslateX.current + gestureState.dx);
          translateY.setValue(lastTranslateY.current + gestureState.dy);
        }
      },
      onPanResponderRelease: () => {
        lastScale.current = (scale as any)._value;
        lastTranslateX.current = (translateX as any)._value;
        lastTranslateY.current = (translateY as any)._value;
        (pinchResponder as any)._startDistance = null;
        if (lastScale.current < 1) {
          Animated.spring(scale, {toValue: 1, useNativeDriver: true}).start();
          Animated.spring(translateX, {toValue: 0, useNativeDriver: true}).start();
          Animated.spring(translateY, {toValue: 0, useNativeDriver: true}).start();
          lastScale.current = 1;
          lastTranslateX.current = 0;
          lastTranslateY.current = 0;
        }
      },
    });

    if (!imageUri) return null;

    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeImage}
        statusBarTranslucent>
        <Animated.View style={[styles.overlay, {opacity: fadeAnim}]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={closeImage} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            {userName && <Text style={styles.userName}>{userName}</Text>}
          </View>

          {/* Zoomable Image */}
          <Animated.View
            style={[styles.imageContainer, {transform: [{scale: scaleAnim}]}]}
            {...pinchResponder.panHandlers}>
            <Animated.Image
              source={{uri: imageUri}}
              style={[styles.fullImage, {transform: [{scale}, {translateX}, {translateY}]}]}
              resizeMode="contain"
            />
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  },
);

export default ProfileImageViewer;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  userName: {color: '#fff', fontSize: 18, fontWeight: '600', marginLeft: 14},
  imageContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: width,
  },
});