/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Linking,
  Text,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import WebView from 'react-native-webview';
import CustomImage from '../../component/common/CustomImage';
import BaseText from '../../component/common/BaseText';
import { LinearContainer } from '../../component';
import { IMAGES } from '../../assets/Images';
import { colors } from '../../theme/colors';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { goBack } from '../../utils/commonFunction';
import { useTranslation } from 'react-i18next';

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i;

const AttachmentViewerScreen: React.FC = () => {
  const { t } = useTranslation();
  const { params } = useRoute<any>();
  const url = params?.url || '';
  const [loading, setLoading] = useState(true);

  const isImage =
    params?.type === 'image' ||
    IMAGE_EXTENSIONS.test(url) ||
    (!url.includes('pdf') && !url.includes('doc'));

  useEffect(() => {
    if (!url) goBack();
  }, [url]);

  if (!url) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors._0B3970} />
      </View>
    );
  }

  if (isImage) {
    return (
      <Modal visible={true} transparent animationType="fade" statusBarTranslucent>
        <StatusBar barStyle="light-content" backgroundColor="transparent" />
        <View style={styles.imageViewerContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={goBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CustomImage
              source={IMAGES.backArrow}
              size={wp(21)}
              tintColor={colors.white}
              onPress={goBack}
            />
          </TouchableOpacity>
          <ImageViewer
            imageUrls={[{ url }]}
            index={0}
            onCancel={goBack}
            onClick={goBack}
            enableSwipeDown
            onSwipeDown={goBack}
            backgroundColor="rgba(0,0,0,0.9)"
            renderHeader={() => <View />}
            renderFooter={() => <View />}
            renderIndicator={() => <View />}
            renderArrowLeft={() => <View />}
            renderArrowRight={() => <View />}
            loadingRender={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.white} />
              </View>
            )}
          />
        </View>
      </Modal>
    );
  }

  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    url,
  )}&embedded=true`;

  return (
    <LinearContainer colors={[colors._F7F7F7, colors.white]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors._F7F7F7} />
      <View style={styles.headerContainer}>
        <CustomImage
          size={wp(20)}
          onPress={goBack}
          source={IMAGES.backArrow}
          tintColor={colors._0B3970}
        />
        <BaseText
          style={[styles.headerTitle, { color: colors._0B3970 }]}
          numberOfLines={1}>
          {t('Document')}
        </BaseText>
        <TouchableOpacity
          style={styles.openInBrowserButton}
          onPress={() => Linking.openURL(url).catch(() => {})}>
          <Text style={styles.openInBrowserText}>{t('Open in Browser')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.webViewContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors._0B3970} />
          </View>
        )}
        <WebView
          source={{ uri: googleDocsUrl }}
          style={styles.webView}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled
          originWhitelist={['*']}
          mixedContentMode="compatibility"
          domStorageEnabled
          onError={(e) => {
            console.log('WebView error:', e.nativeEvent);
            setLoading(false);
          }}
        />
        <View style={styles.fallbackHint}>
          <Text style={styles.fallbackHintText}>
            {t('Document not loading?')} <Text style={styles.fallbackHintLink} onPress={() => Linking.openURL(url).catch(() => {})}>{t('Open in Browser')}</Text>
          </Text>
        </View>
      </View>
    </LinearContainer>
  );
};

export default AttachmentViewerScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(12),
    paddingHorizontal: wp(20),
    backgroundColor: colors.white,
  },
  headerTitle: {
    marginLeft: wp(15),
    flex: 1,
    ...commonFontStyle(600, 20, colors._0B3970),
  },
  openInBrowserButton: {
    paddingVertical: hp(6),
    paddingHorizontal: wp(10),
    marginLeft: wp(8),
  },
  openInBrowserText: {
    ...commonFontStyle(500, 13, colors._0B3970),
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  fallbackHint: {
    paddingHorizontal: wp(20),
    paddingVertical: hp(8),
    backgroundColor: colors._F7F7F7,
  },
  fallbackHintText: {
    ...commonFontStyle(400, 12, colors._6A6A6A),
  },
  fallbackHintLink: {
    ...commonFontStyle(600, 12, colors._0B3970),
  },
  webView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: hp(55),
    left: wp(20),
    zIndex: 10,
    padding: wp(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
