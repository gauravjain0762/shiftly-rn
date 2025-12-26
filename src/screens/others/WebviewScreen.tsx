/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View, StatusBar } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import WebViewRender from '../../component/common/WebViewRender';
import { BackHeader, LinearContainer, Loader } from '../../component';
import { useTranslation } from 'react-i18next';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { colors } from '../../theme/colors';
import CustomImage from '../../component/common/CustomImage';
import BaseText from '../../component/common/BaseText';
import { goBack } from '../../utils/commonFunction';
import { IMAGES } from '../../assets/Images';

const WebViewScreen = () => {
  const { t } = useTranslation();
  const { params } = useRoute<any>();
  const type = params?.type;

  const [isLoading, setIsLoading] = React.useState(true);
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors._F7F7F7} />
      <LinearContainer
        colors={[colors._F7F7F7, colors.white]}>
        <View style={styles.headerContainer}>
          <CustomImage
            size={wp(20)}
            onPress={goBack}
            source={IMAGES.backArrow}
            tintColor={colors._0B3970}
          />
          <BaseText
            style={[
              styles.headerTitle,
              { color: colors._0B3970 },
            ]}>
            {t(params?.title)}
          </BaseText>
        </View>

        <View style={{ flex: 1 }}>
          <WebViewRender
            url={params?.link}
            onLoadEnd={() => setIsLoading(false)}
          />
          {isLoading && <Loader />}
        </View>
      </LinearContainer>
    </>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  header: {
    paddingTop: hp(24),
    marginBottom: hp(28),
    paddingHorizontal: wp(35),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(12),
    paddingHorizontal: wp(20),
    backgroundColor: colors._F7F7F7,
  },
  headerTitle: {
    marginLeft: wp(15),
    ...commonFontStyle(600, 20, colors._0B3970),
  },
});
