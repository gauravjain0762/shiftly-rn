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
  console.log("🔥 ~ Messages ~ activities:", activities)

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <View style={styles.headerContainer}>
        <BackHeader
          title={'Messages'}
          isRight={false}
          containerStyle={styles.header}
        />
        <SearchBar
          value={value}
          containerStyle={styles.search}
          onChangeText={e => setValue(e)}
        />
      </View>
      <FlatList
        data={activities}
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
              textStyle={{ color: colors.white }}
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
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
