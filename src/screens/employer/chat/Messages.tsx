import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { hp, wp } from '../../../theme/fonts';
import { useGetActivitiesQuery } from '../../../api/dashboardApi';
import { ActivitiesCard, BackHeader, LinearContainer, SearchBar } from '../../../component';
import NoDataText from '../../../component/common/NoDataText';
import { colors } from '../../../theme/colors';

const Messages = () => {
  const [value, setValue] = useState('');
  const { data: activitiesData, isLoading, refetch } = useGetActivitiesQuery({});
  const activities = activitiesData?.data?.activities || [];

  const filteredActivities = activities.filter((item: any) =>
    item?.company_name?.toLowerCase().includes(value.toLowerCase())
  );
  console.log("🔥 ~ Messages ~ activities:", activities)

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      <View style={styles.headerContainer}>
        <BackHeader
          title={'Messages'}
          isRight={false}
          type="company"
          containerStyle={styles.header}
        />
        <SearchBar
          value={value}
          type="company"
          containerStyle={styles.search}
          onChangeText={e => setValue(e)}
        />
      </View>
      <FlatList
        data={filteredActivities}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <ActivitiesCard item={item} />}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ height: hp(15) }} />}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={() => {
          return (
            <NoDataText
              text="You don’t have any activity yet."
              textStyle={{ color: colors._0B3970 }}
            />
          );
        }}
      />
    </LinearContainer>
  );
};

export default Messages;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'flex-start',
    gap: wp(20),
    paddingTop: hp(18),
  },
  headerContainer: {
    paddingHorizontal: wp(22),
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  search: {
    marginTop: hp(10),
  },
  listContainer: {
    paddingHorizontal: wp(22),
    paddingBottom: hp(20),
    paddingTop: hp(20),
  },
});
