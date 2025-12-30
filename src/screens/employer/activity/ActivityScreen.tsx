import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import { ActivitiesCard, BackHeader, LinearContainer } from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { useTranslation } from 'react-i18next';
import { AppStyles } from '../../../theme/appStyles';
import NoDataText from '../../../component/common/NoDataText';
import { useGetActivitiesQuery } from '../../../api/dashboardApi';

const ActivityScreen = () => {
  const { t } = useTranslation();
  const { data: activitiesData, isLoading, refetch } = useGetActivitiesQuery({});
  const activities = activitiesData?.data?.activities || [];
  console.log("🔥 ~ ActivityScreen ~ activities:", activities)

  return (
    <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
      <View style={styles.topConrainer}>
        <BackHeader
          containerStyle={styles.header}
          title={t('My Activities')}
          titleStyle={styles.headerTitle}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator size={'large'} color={colors._D5D5D5} />
      ) : (
        <FlatList
          data={activities}
          style={AppStyles.flex}
          keyExtractor={(_, index) => index.toString()}
          renderItem={(item: any) => <ActivitiesCard {...item} />}
          contentContainerStyle={styles.scrollContainer}
          ItemSeparatorComponent={() => <View style={{ height: hp(22) }} />}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={refetch}
          ListEmptyComponent={() => {
            return (
              <NoDataText
                text="You don’t have any activity yet. Once you post jobs or content, updates will appear here."
                textStyle={{ color: colors._0B3970 }}
              />
            );
          }}
        />
      )}
    </LinearContainer>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tab: {
    backgroundColor: colors.white,
    paddingVertical: hp(14),
    borderRadius: 10,
    alignItems: 'center',
    marginTop: hp(22),
  },
  activeTabText: {
    ...commonFontStyle(700, 20, colors._0B3B75),
  },
  topConrainer: {
    paddingHorizontal: wp(25),
    paddingTop: hp(18),
    // borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  header: {
    paddingLeft: wp(13),
  },
  activitiesTitle: {
    ...commonFontStyle(700, 20, colors.white),
    marginTop: hp(22),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: hp(22),
    paddingHorizontal: wp(25),
  },
  headerTitle: {
    ...commonFontStyle(600, 22, colors._0B3970),
  },
});
