import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {
  JobCard,
  LinearContainer,
  SearchBar,
  ShareModal,
} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import CustomImage from '../../../component/common/CustomImage';
import {IMAGES} from '../../../assets/Images';
import {errorToast, goBack, navigateTo} from '../../../utils/commonFunction';
import {useRoute} from '@react-navigation/native';
import {AppStyles} from '../../../theme/appStyles';
import {SCREEN_NAMES} from '../../../navigation/screenNames';
import BaseText from '../../../component/common/BaseText';
import {colors} from '../../../theme/colors';
import {
  useAddRemoveFavouriteMutation,
  useGetEmployeeJobsQuery,
} from '../../../api/dashboardApi';
import {useDebounce} from '../../../hooks/useRole';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

const SearchJob = () => {
  const {params} = useRoute<any>();
  const resumeList = params?.data?.resumes;
  const {userInfo} = useSelector((state: RootState) => state.auth);

  const [searchText, setSearchText] = useState('');
  const [modal, setModal] = useState<boolean>(false);
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);

  const [addRemoveFavoriteJob] = useAddRemoveFavouriteMutation({});
  const debouncedSearch = useDebounce(searchText, 300);

  const {data, isLoading, refetch} = useGetEmployeeJobsQuery({
    search: debouncedSearch,
  });

  const jobList = data?.data?.jobs ?? [];

  const handleToggleFavorite = async (job: any) => {
    const jobId = job._id;

    setLocalFavorites(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId],
    );

    try {
      const res = await addRemoveFavoriteJob({
        job_id: jobId,
        user_id: userInfo?._id,
      }).unwrap();

      if (!res?.status) {
        setLocalFavorites(prev =>
          prev.includes(jobId)
            ? prev.filter(id => id !== jobId)
            : [...prev, jobId],
        );
        errorToast(res?.message);
      } else {
        refetch();
      }
    } catch (error) {
      setLocalFavorites(prev =>
        prev.includes(jobId)
          ? prev.filter(id => id !== jobId)
          : [...prev, jobId],
      );
      console.log('error', error);
    }
  };

  useEffect(() => {
    refetch();
  }, [debouncedSearch, refetch]);

  if (isLoading) {
    <ActivityIndicator size={'large'} />;
  }

  return (
    <LinearContainer colors={['#0D468C', '#041326']} containerStyle={{}}>
      <View style={styles.headerContainer}>
        <CustomImage onPress={goBack} size={wp(21)} source={IMAGES.backArrow} />
        <SearchBar
          value={searchText}
          containerStyle={styles.search}
          onChangeText={setSearchText}
          placeholder="Search jobs..."
        />
      </View>

      <KeyboardAwareFlatList
        data={jobList}
        style={AppStyles.flex}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        renderItem={({item, index}: any) => {
          const isFavorite = localFavorites.includes(item?._id);
          return (
            <JobCard
              key={item._id || index}
              item={item}
              onPressShare={() => setModal(true)}
              heartImage={isFavorite}
              onPressFavorite={() => handleToggleFavorite(item)}
              onPress={() =>
                navigateTo(SCREEN_NAMES.JobDetail, {
                  item: item,
                  resumeList: resumeList,
                })
              }
            />
          );
        }}
        keyExtractor={(item, index) => item._id || index.toString()}
        ItemSeparatorComponent={() => <View style={{height: hp(28)}} />}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <BaseText style={styles.emptyText}>{'No jobs found'}</BaseText>
          </View>
        }
        onRefresh={refetch}
        refreshing={isLoading}
      />

      <ShareModal visible={modal} onClose={() => setModal(!modal)} />
    </LinearContainer>
  );
};

export default SearchJob;

const styles = StyleSheet.create({
  headerContainer: {
    gap: wp(20),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(10),
    paddingHorizontal: wp(23),
  },
  search: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: hp(20),
    paddingBottom: '10%',
    paddingHorizontal: wp(25),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    ...commonFontStyle(500, 17, colors.white),
  },
});
