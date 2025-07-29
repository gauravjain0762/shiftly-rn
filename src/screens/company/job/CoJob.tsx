import React, {useCallback, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BackHeader,
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../../../theme/fonts';
import {IMAGES} from '../../../assets/Images';
import {colors} from '../../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import MyJobCard from '../../../component/common/MyJobCard';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import BottomModal from '../../../component/common/BottomModal';
import Slider from '@react-native-community/slider';
import {Dropdown} from 'react-native-element-dropdown';
import {useGetCompanyJobsQuery} from '../../../api/dashboardApi';
import {useFocusEffect} from '@react-navigation/native';

const jobTypes = [
  {label: 'Full Time', value: 'fulltime'},
  {label: 'Part Time', value: 'parttime'},
  {label: 'Internship', value: 'internship'},
];
const SLIDER_WIDTH = SCREEN_WIDTH - 70;

const CoJob = () => {
  const {t} = useTranslation();
  const {refetch} = useGetCompanyJobsQuery({});
  const [isFilterModalVisible, setIsFilterModalVisible] =
    useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [value, setValue] = useState<any>(null);
  const [latestJobList, setLatestJobList] = useState<any>([]);

  useFocusEffect(
    useCallback(() => {
      const loadJobs = async () => {
        const result = await refetch();
        if (result.data?.data?.jobs) {
          setLatestJobList(result.data.data.jobs);
        }
      };
      loadJobs();
    }, []),
  );

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <BackHeader
        type="company"
        isRight={false}
        title={t('My Jobs')}
        titleStyle={styles.title}
        containerStyle={styles.header}
        RightIcon={
          <View style={styles.rightSection}>
            <LinearGradient
              colors={['#024AA1', '#041428']}
              style={styles.gradient}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigateTo(SCREENS.PostJob)}
                style={styles.postJobButton}>
                <View style={styles.plusIconContainer}>
                  <Image source={IMAGES.pluse} style={styles.plusIcon} />
                </View>
                <Text style={styles.postJobText}>{t('Post Job')}</Text>
              </TouchableOpacity>
            </LinearGradient>

            <Pressable onPress={() => setIsFilterModalVisible(true)}>
              <Image source={IMAGES.post_filter} />
            </Pressable>
          </View>
        }
      />

      <View style={styles.outerContainer}>
        <FlatList
          data={latestJobList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          renderItem={({item, index}) => {
            return (
              <>
                <View key={index} style={{marginBottom: hp(10)}}>
                  <MyJobCard
                    title={item?.title}
                    address={item.address}
                    jobType={item.job_type}
                    jobDescription={item.description}
                    // totalApplicants={item.totalApplicants}
                  />
                </View>
              </>
            );
          }}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>

      {isFilterModalVisible && (
        <BottomModal
          visible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>{t('Filters')}</Text>
              <Pressable onPress={() => setIsFilterModalVisible(false)}>
                <Image source={IMAGES.close} style={styles.closeIcon} />
              </Pressable>
            </View>

            <View style={styles.inputWrapper}>
              <CustomTextInput
                placeholder={t('Location')}
                inputStyle={styles.locationInput}
              />
              <View style={styles.underline} />
            </View>

            <View style={styles.salarySection}>
              <Text style={styles.salaryLabel}>{'Salary Range'}</Text>
              <View style={styles.sliderWrapper}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={20000}
                  value={sliderValue}
                  onValueChange={value => setSliderValue(value)}
                  minimumTrackTintColor={colors._7B7878}
                  maximumTrackTintColor={colors._7B7878}
                  thumbTintColor={colors.white}
                />
                <View style={styles.sliderTextWrapper}>
                  <Text
                    style={[
                      styles.sliderValueText,
                      {
                        left: (sliderValue / 20000) * SLIDER_WIDTH - 35,
                      },
                    ]}>
                    ₹{Math.round(sliderValue)}
                  </Text>
                </View>
              </View>
            </View>

            <Dropdown
              data={jobTypes}
              labelField="label"
              valueField="value"
              placeholder="Job Type"
              value={value}
              onChange={item => setValue(item.value)}
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              renderRightIcon={() => (
                <Image source={IMAGES.dropdown} style={styles.dropdownIcon} />
              )}
            />

            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Apply')}
              onPress={() => setIsFilterModalVisible(false)}
            />
          </View>
        </BottomModal>
      )}
    </LinearContainer>
  );
};

export default CoJob;

const styles = StyleSheet.create({
  header: {
    paddingTop: hp(26),
    paddingHorizontal: wp(35),
  },
  title: {
    right: '22%',
    marginLeft: wp(((SCREEN_WIDTH - 70) / 2) * 0.5),
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(18),
  },
  gradient: {
    borderRadius: hp(100),
  },
  postJobButton: {
    gap: wp(10),
    padding: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(12),
  },
  plusIconContainer: {
    width: wp(18),
    height: hp(18),
    borderRadius: hp(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  plusIcon: {
    width: '50%',
    height: '50%',
  },
  postJobText: {
    ...commonFontStyle(500, 12, colors.white),
  },
  outerContainer: {
    marginTop: hp(14),
    paddingHorizontal: wp(21),
  },
  modalContent: {
    paddingHorizontal: wp(15),
    paddingVertical: hp(4),
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterTitle: {
    ...commonFontStyle(600, 25, colors.black),
  },
  closeIcon: {
    height: hp(20),
    width: wp(20),
    right: '-5%',
  },
  inputWrapper: {
    marginTop: hp(30),
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
    ...commonFontStyle(400, 18, colors._7B7878),
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
    marginVertical: hp(40),
  },
});
