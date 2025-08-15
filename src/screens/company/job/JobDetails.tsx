import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BackHeader, GradientButton, LinearContainer} from '../../../component';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../../../theme/fonts';
import {IMAGES} from '../../../assets/Images';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import ApplicantCard from '../../../component/common/ApplicantCard';
import {
  useAddShortlistEmployeeMutation,
  useGetCompanyJobDetailsQuery,
} from '../../../api/dashboardApi';
import {useRoute} from '@react-navigation/native';
import {errorToast, successToast} from '../../../utils/commonFunction';

const Tabs = ['Applicants', 'Invited', 'Shortlisted'];

const CoJobDetails = () => {
  const {t} = useTranslation();
  const {params} = useRoute<any>();
  const job_id = params?._id as any;
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const {data} = useGetCompanyJobDetailsQuery('689b160b3f2e282e35e9e06b');
  const [addShortListEmployee] = useAddShortlistEmployeeMutation({});
  const jobDetail = data?.data;
  const JobDetailsArr = {
    'Job Type': jobDetail?.job_type,
    Vacancy: jobDetail?.no_positions,
    'Expiry Date': '31 July',
    Duration: jobDetail?.duration,
    'Job Industry': jobDetail?.job_sector,
    Salary: `${jobDetail?.monthly_salary_from} - ${jobDetail?.monthly_salary_to}`,
  };
  const keyValueArray = Object.entries(JobDetailsArr);

  const handleShortListEmployee = async (item: any) => {
    try {
      const res = await addShortListEmployee({
        applicant_id: item?._id,
        job_id: job_id,
      }).unwrap();

      if (res?.status) {
        successToast(res?.message);
      } else {
        errorToast(res?.message);
      }
    } catch (error) {
      console.error('Error shortlisting employee:', error);
    }
  };

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackHeader
          type="company"
          isRight={false}
          title={jobDetail?.title || 'Restaurant Manager'}
          titleStyle={styles.title}
          containerStyle={styles.header}
          RightIcon={
            <TouchableOpacity style={styles.iconButton}>
              <Image
                source={IMAGES.share}
                resizeMode="contain"
                style={styles.icon}
              />
            </TouchableOpacity>
          }
        />

        <View style={styles.bodyContainer}>
          <Text style={styles.jobId}>{`Job ID: ${jobDetail?._id}`}</Text>

          <Text style={styles.location}>
            {jobDetail?.address || 'Atlantis, The Palm, Dubai'}
          </Text>

          <Text style={styles.description}>
            {jobDetail?.description ||
              'As the Resort Manager, you will primarily be focused on ensuring the Front Office and VIP Services are operated to the highest standards and guest service delivery standards and are nothing short of 5 stars for both guests and colleagues.'}
          </Text>

          <View style={styles.jobDetailsContainer}>
            <Text style={styles.sectionTitle}>{t('Job Details')}</Text>

            <FlatList
              numColumns={3}
              scrollEnabled={false}
              data={keyValueArray}
              style={styles.flatlist}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={styles.flatListContent}
              renderItem={({item, index}) => {
                const [key, value] = item;

                return (
                  <View key={index} style={styles.detailItem}>
                    <Text style={styles.detailKey}>{key}</Text>
                    <Text style={styles.detailValue}>{value}</Text>
                  </View>
                );
              }}
            />
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.tabContainer}>
              {Tabs.map((item, index) => (
                <Pressable
                  key={index}
                  style={styles.tabItem}
                  onPress={() => setSelectedTabIndex(index)}>
                  <Text style={styles.tabText}>{item}</Text>
                  {selectedTabIndex === index && (
                    <View style={styles.tabIndicator} />
                  )}
                </Pressable>
              ))}
            </View>

            <View style={styles.divider} />

            {selectedTabIndex === 0 &&
              jobDetail?.applicants?.map((item: any, index: number) => (
                <ApplicantCard key={index} item={item} />
              ))}

            {selectedTabIndex === 1 &&
              jobDetail?.invited_users?.map((item: any, index: number) => {
                if (item) {
                  return (
                    <ApplicantCard
                      key={index}
                      item={item}
                      handleShortListEmployee={() => {
                        handleShortListEmployee(item);
                      }}
                    />
                  );
                } else {
                  return null;
                }
              })}

            {selectedTabIndex === 2 &&
              jobDetail?.shortlisted?.map((item: any, index: number) => {
                if (item) {
                  return (
                    <ApplicantCard
                      key={index}
                      item={item}
                      showShortListButton={false}
                    />
                  );
                } else {
                  return null;
                }
              })}

            <GradientButton
              type="Company"
              style={styles.button}
              title={t('Edit Post')}
              onPress={() => {
                // navigateTo(SCREENS.CoPost);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </LinearContainer>
  );
};

export default CoJobDetails;

const styles = StyleSheet.create({
  header: {
    paddingTop: hp(26),
    paddingHorizontal: wp(22),
  },
  title: {
    right: '22%',
    marginLeft: '5%',
  },
  iconButton: {
    width: wp(32),
    height: hp(32),
    borderRadius: hp(32),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors._0B3970,
  },
  icon: {
    width: wp(15),
    height: wp(15),
    tintColor: colors.white,
  },
  bodyContainer: {
    paddingHorizontal: wp(23),
  },
  jobId: {
    flex: 1,
    bottom: hp(10),
    marginLeft: '10%',
    ...commonFontStyle(400, 18, colors.black),
  },
  location: {
    marginTop: hp(32),
    ...commonFontStyle(400, 15, colors.black),
  },
  description: {
    marginTop: hp(13),
    ...commonFontStyle(400, 15, colors._3C3C3C),
  },
  jobDetailsContainer: {
    marginTop: hp(32),
  },
  sectionTitle: {
    ...commonFontStyle(600, 20, colors._0B3970),
  },
  flatlist: {
    marginTop: hp(27),
  },
  flatListContent: {
    gap: hp(34),
  },
  detailItem: {
    gap: hp(15),
    width: SCREEN_WIDTH / 3,
  },
  detailKey: {
    ...commonFontStyle(600, 17, colors._0B3970),
  },
  detailValue: {
    ...commonFontStyle(400, 16, colors.black),
  },
  bottomContainer: {
    marginTop: hp(48),
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(10),
    justifyContent: 'space-between',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    ...commonFontStyle(600, 17, colors._0B3970),
  },
  tabIndicator: {
    bottom: '-85%',
    height: hp(4),
    width: '50%',
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: hp(20),
    backgroundColor: colors._0B3970,
  },
  divider: {
    height: 1,
    width: '150%',
    alignSelf: 'center',
    marginVertical: hp(16),
    backgroundColor: '#D9D9D9',
  },
  button: {
    marginVertical: hp(45),
  },
});
