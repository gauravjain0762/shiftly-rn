import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  CustomTextInput,
  GradientButton,
  JobCard,
  LinearContainer,
} from '../../../component';
import {SCREEN_WIDTH, commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import {AppStyles} from '../../../theme/appStyles';
import Carousel from 'react-native-reanimated-carousel';
import {errorToast, navigateTo} from '../../../utils/commonFunction';
import {SCREEN_NAMES, SCREENS} from '../../../navigation/screenNames';
import {useTranslation} from 'react-i18next';
import {useGetEmployeeJobsQuery} from '../../../api/dashboardApi';
import BottomModal from '../../../component/common/BottomModal';
import RangeSlider from '../../../component/common/RangeSlider';
import {Dropdown} from 'react-native-element-dropdown';
import {SLIDER_WIDTH} from '../../company/job/CoJob';
import CustomBtn from '../../../component/common/CustomBtn';

const carouselImages = [
  'https://images.unsplash.com/photo-1636137628585-db2f13cad125?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGxhbmRzY2FwZSUyMGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1551598305-fe1be9fe579e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGxhbmRzY2FwZSUyMGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFuZHNjYXBlfGVufDB8fDB8fHww',
];

const jobTypes: string[] = [
  'Full Time',
  'Part Time',
  'Temporary',
  'Internship',
];

const departments: string[] = ['Management', 'Marketing', 'Chef', 'Cleaner'];

const JobsScreen = () => {
  const {t, i18n} = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const {data} = useGetEmployeeJobsQuery({});
  const jobList = data?.data?.jobs;
  const [isFilterModalVisible, setIsFilterModalVisible] =
    useState<boolean>(false);
  const [filters, setFilters] = useState<{}>({
    departments: [],
    job_types: [],
    salary_from: 0,
    salary_to: 0,
    location: '',
    employer_type: '',
  });

  const [location, setLocation] = useState<string>('');
  const [range, setRange] = useState<number[]>([1000, 20000]);

  const handleApplyFilter = async () => {
    try {
      setFilters(prev => ({
        ...prev,
        salary_from: range[0],
        salary_to: range[1],
      }));
      setIsFilterModalVisible(false);
      // await refetch();
    } catch (error) {
      console.error('Error applying filter:', error);
      errorToast('Failed to apply filter');
    }
  };

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('Search Jobs')}</Text>
        <View style={styles.headerImgBar}>
          <TouchableOpacity>
            <Image style={styles.headerIcons} source={IMAGES.search} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
            <Image style={styles.headerIcons} source={IMAGES.filter} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateTo(SCREENS.NotificationScreen)}>
            <Image style={styles.headerIcons} source={IMAGES.notification} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.carouselWrapper}>
        <Carousel
          loop
          width={SCREEN_WIDTH - 32}
          height={180}
          autoPlay={true}
          data={carouselImages}
          scrollAnimationDuration={2500}
          onSnapToItem={index => setActiveIndex(index)}
          renderItem={({item}) => (
            <Image
              source={{uri: item}}
              style={styles.carouselImage}
              resizeMode="cover"
            />
          )}
        />
      </View>

      <View
        style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
        {carouselImages?.map((_, index) => (
          <View
            key={index}
            style={{
              width: index === activeIndex ? 17 : 6,
              height: 6,
              borderRadius: 5,
              backgroundColor: colors.white,
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>
      <Text style={styles.sectionTitle}>{t('Recent Jobs')}</Text>
      <FlatList
        data={jobList}
        style={AppStyles.flex}
        showsVerticalScrollIndicator={false}
        renderItem={(item: any, index: number) => (
          <JobCard
            key={index}
            onPress={() =>
              navigateTo(SCREEN_NAMES.JobDetail, {data: item?.item})
            }
            {...item}
          />
        )}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={{height: hp(28)}} />}
        contentContainerStyle={styles.scrollContainer}
      />

      {/* Filter Modal */}
      <BottomModal
        visible={isFilterModalVisible}
        backgroundColor={colors._FBE7BD}
        onClose={() => setIsFilterModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.filterTitle}>{t('Search Filter')}</Text>

          <Text style={styles.sectionLabel}>{t('Department')}</Text>
          <View style={styles.pillRow}>
            {departments.map(dept => {
              const isSelected = filters.departments.includes(dept);
              return (
                <Pressable
                  key={dept}
                  style={[styles.pill, isSelected && styles.pillSelected]}
                  onPress={() => {
                    setFilters(prev => ({
                      ...prev,
                      departments: isSelected
                        ? prev.departments.filter(d => d !== dept)
                        : [...prev.departments, dept],
                    }));
                  }}>
                  <Text
                    style={[
                      styles.pillText,
                      isSelected && styles.pillTextSelected,
                    ]}>
                    {dept}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.inputWrapper}>
            <CustomTextInput
              value={filters.location}
              onChangeText={txt =>
                setFilters(prev => ({...prev, location: txt}))
              }
              placeholder={t('Location')}
              placeholderTextColor={colors.black}
              inputStyle={styles.locationInput}
            />
            <View style={styles.underline} />
          </View>

          <Text style={styles.sectionLabel}>{t('Job Type')}</Text>
          <View style={styles.pillRow}>
            {jobTypes.map(type => {
              const isSelected = filters.job_types.includes(type);
              return (
                <Pressable
                  key={type}
                  style={[styles.pill, isSelected && styles.pillSelected]}
                  onPress={() => {
                    setFilters(prev => ({
                      ...prev,
                      job_types: isSelected
                        ? prev.job_types.filter(j => j !== type)
                        : [...prev.job_types, type],
                    }));
                  }}>
                  <Text
                    style={[
                      styles.pillText,
                      isSelected && styles.pillTextSelected,
                    ]}>
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Salary Range */}
          <View style={styles.salarySection}>
            <Text style={styles.salaryLabel}>{t('Salary Range')}</Text>
            <RangeSlider range={range} setRange={setRange} />
          </View>

          {/* Employer Type */}
          <View style={styles.inputWrapper}>
            <CustomTextInput
              value={filters.employer_type}
              onChangeText={txt =>
                setFilters(prev => ({...prev, employer_type: txt}))
              }
              placeholder={t('Employer Type')}
              placeholderTextColor={colors.black}
              inputStyle={styles.locationInput}
            />
            <View style={styles.underline} />
          </View>

          <View
            style={{
              gap: wp(12),
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: hp(40),
            }}>
            <Pressable
              onPress={() =>
                setFilters({
                  departments: [],
                  job_types: [],
                  location: '',
                  employer_type: '',
                })
              }
              style={{
                borderWidth: hp(1),
                borderRadius: hp(30),
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: wp(28),
                paddingVertical: hp(18),
              }}>
              <Text>{'Clear'}</Text>
            </Pressable>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Apply Filter')}
              onPress={handleApplyFilter}
            />
          </View>
        </View>
      </BottomModal>
    </LinearContainer>
  );
};

export default JobsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(25),
    paddingVertical: hp(32),
  },
  headerTitle: {
    ...commonFontStyle(600, 22, colors.white),
  },
  headerIcons: {
    width: wp(26),
    height: wp(26),
    tintColor: '#F4E2B8',
  },
  icon: {
    fontSize: 20,
    color: '#fff',
  },
  headerImgBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(18),
  },
  sectionTitle: {
    ...commonFontStyle(500, 20, colors.white),
    paddingVertical: hp(12),
    paddingHorizontal: wp(25),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: wp(25),
  },
  carouselWrapper: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  carouselImage: {
    width: '100%',
    height: 180,
  },
  inputWrapper: {
    marginTop: hp(30),
  },
  modalContent: {
    paddingHorizontal: wp(15),
    paddingVertical: hp(4),
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterTitle: {
    textAlign: 'center',
    ...commonFontStyle(500, 20, colors.black),
  },
  closeIcon: {
    height: hp(20),
    width: wp(20),
    right: '-5%',
  },
  locationInput: {
    ...commonFontStyle(400, 18, colors._7B7878),
  },
  underline: {
    height: hp(1.5),
    backgroundColor: colors._7B7878,
  },
  salarySection: {
    marginTop: hp(35),
  },
  salaryLabel: {
    ...commonFontStyle(400, 18, colors.black),
  },
  sliderWrapper: {
    width: SLIDER_WIDTH,
  },
  slider: {
    marginTop: hp(13),
    borderColor: colors._7B7878,
  },
  sliderTextWrapper: {
    position: 'relative',
    height: hp(20),
  },
  sliderValueText: {
    position: 'absolute',
    marginTop: hp(8),
    textAlign: 'center',
    ...commonFontStyle(600, 18, colors._0A0A0A),
  },
  dropdown: {
    height: hp(50),
    marginTop: hp(5),
    borderBottomWidth: hp(1.5),
    borderColor: colors._7B7878,
  },
  placeholderStyle: {
    fontSize: hp(14),
    color: colors._7B7878,
  },
  selectedTextStyle: {
    fontSize: hp(14),
    color: colors.black,
  },
  dropdownIcon: {
    width: wp(16),
    height: wp(16),
    resizeMode: 'contain',
    tintColor: colors._7B7878,
  },
  btn: {
    flex: 1,
  },
  sectionLabel: {
    ...commonFontStyle(500, 16, colors.black),
    marginTop: hp(36),
    marginBottom: hp(8),
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
    marginBottom: hp(10),
  },
  pill: {
    paddingHorizontal: wp(14),
    paddingVertical: hp(8),
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors._1F1F1F,
    backgroundColor: colors._FBE7BD,
  },
  pillText: {
    ...commonFontStyle(400, 14, colors.black),
  },
  pillSelected: {
    backgroundColor: colors._1F1F1F,
    borderColor: colors._1F1F1F,
  },
  pillTextSelected: {
    color: colors.white,
  },
});
