import React, {useCallback, useState} from 'react';
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
import {
  BackHeader,
  GradientButton,
  LinearContainer,
  ShareModal,
} from '../../../component';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../../../theme/fonts';
import {IMAGES} from '../../../assets/Images';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import ApplicantCard from '../../../component/common/ApplicantCard';
import {
  useAddShortlistEmployeeMutation,
  useGetCompanyJobDetailsQuery,
} from '../../../api/dashboardApi';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {
  errorToast,
  navigateTo,
  successToast,
} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useDispatch} from 'react-redux';
import {setJobFormState} from '../../../features/companySlice';
import moment from 'moment';
import BaseText from '../../../component/common/BaseText';

const Tabs = ['Applicants', 'Invited', 'Shortlisted'];

const CoJobDetails = () => {
  const {t} = useTranslation();
  const {params} = useRoute<any>();
  const dispatch = useDispatch();
  const job_id = params?._id as any;
  console.log('🔥🔥 ~ CoJobDetails ~ job_id:', job_id);
  const [isShareModalVisible, setIsShareModalVisible] =
    useState<boolean>(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const {data, refetch} = useGetCompanyJobDetailsQuery(job_id);
  const [addShortListEmployee] = useAddShortlistEmployeeMutation({});
  const jobDetail = data?.data;
  console.log('🔥🔥🔥 ~ CoJobDetails ~ jobDetail:', jobDetail);
  console.log('🔥 ~ CoJobDetails ~ jobDetail:', jobDetail?.invite_users);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const JobDetailsArr = {
    'Job Type': jobDetail?.job_type,
    Salary: `${jobDetail?.monthly_salary_from} - ${jobDetail?.monthly_salary_to}`,
    'Expiry Date':
      jobDetail?.expiry_date !== null
        ? moment(jobDetail?.expiry_date).format('D MMMM')
        : '-',
    Duration: jobDetail?.duration,
    'Job Industry': jobDetail?.job_sector,
    Vacancy: jobDetail?.no_positions,
  };
  const keyValueArray = Object.entries(JobDetailsArr);

  const handleShortListEmployee = async (item: any) => {
    console.log('🔥🔥🔥 ~ handleShortListEmployee ~ item:', item);
    const params = {
      applicant_id: item?._id,
      job_id: job_id,
    };
    console.log('🔥🔥🔥 ~ handleShortListEmployee ~ params:', params);
    try {
      const res = await addShortListEmployee(params).unwrap();
      console.log('🔥🔥🔥 ~ handleShortListEmployee ~ res:', res);

      if (res?.status === true) {
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
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <BackHeader
          type="company"
          isRight={false}
          title={jobDetail?.title || 'Restaurant Manager'}
          titleStyle={styles.title}
          containerStyle={styles.header}
          RightIcon={
            <TouchableOpacity
              onPress={() => {
                setIsShareModalVisible(true);
              }}
              style={styles.iconButton}>
              <Image
                source={IMAGES.share}
                resizeMode="contain"
                style={styles.icon}
              />
            </TouchableOpacity>
          }
        />

        <View style={styles.bodyContainer}>
          <Text style={styles.jobId}>{`Job ID: ${jobDetail?._id || '-'}`}</Text>

          <View style={styles.addressContainer}>
            <Image source={IMAGES.location} style={styles.locationIcon} />
            <Text style={styles.location}>{jobDetail?.address}</Text>
          </View>

          <Text style={styles.description}>{jobDetail?.description}</Text>

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

                    <View style={styles.valueWrapper}>
                      {key === 'Salary' && <Image source={IMAGES.currency} />}
                      <Text style={styles.detailValue}>{value || '-'}</Text>
                    </View>
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
            {selectedTabIndex === 0 ? (
              jobDetail?.applicants?.length > 0 ? (
                jobDetail?.applicants?.map((item: any, index: number) => {
                  if (item === null) return null;
                  return (
                    <ApplicantCard
                      key={index}
                      item={item}
                      handleShortListEmployee={() =>
                        handleShortListEmployee(item)
                      }
                      showShortListButton={!item?.status}
                    />
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <BaseText>There are no applicants</BaseText>
                </View>
              )
            ) : null}

            {selectedTabIndex === 1 &&
              (jobDetail?.invited_users?.length > 0 ? (
                jobDetail?.invited_users?.map((item: any, index: number) => {
                  if (item === null) return null;
                  return (
                    <ApplicantCard
                      key={index}
                      item={item}
                      showShortListButton={false}
                    />
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <BaseText>There are no invited users</BaseText>
                </View>
              ))}

            {selectedTabIndex === 2 &&
              (jobDetail?.shortlisted?.length > 0 ? (
                jobDetail.shortlisted.map((item: any, index: number) => {
                  if (item === null) return null;
                  return (
                    <ApplicantCard
                      key={index}
                      item={item}
                      showShortListButton={false}
                    />
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <BaseText>No shortlisted applicants</BaseText>
                </View>
              ))}

            <GradientButton
              type="Company"
              style={styles.button}
              title={t('Edit Job')}
              onPress={() => {
                console.log('job_type>>>>>.', jobDetail?.job_type);
                dispatch(
                  setJobFormState({
                    job_id: job_id,
                    title: jobDetail?.title,
                    job_type:
                      typeof jobDetail?.job_type === 'string'
                        ? {
                            label: jobDetail?.job_type,
                            value: jobDetail?.job_type,
                          }
                        : jobDetail?.job_type,
                    area:
                      typeof jobDetail?.area === 'string'
                        ? {label: jobDetail?.area, value: jobDetail?.area}
                        : jobDetail?.area,
                    duration:
                      typeof jobDetail?.duration === 'string'
                        ? {
                            label: jobDetail?.duration,
                            value: jobDetail?.duration,
                          }
                        : jobDetail?.duration,
                    job_sector:
                      typeof jobDetail?.job_sector === 'string'
                        ? {
                            label: jobDetail?.job_sector,
                            value: jobDetail?.job_sector,
                          }
                        : jobDetail?.job_sector,
                    startDate:
                      typeof jobDetail?.start_date === 'string'
                        ? {
                            label: jobDetail?.start_date,
                            value: jobDetail?.start_date,
                          }
                        : jobDetail?.start_date,
                    contract:
                      typeof jobDetail?.contract_type === 'string'
                        ? {
                            label: jobDetail?.contract_type,
                            value: jobDetail?.contract_type,
                          }
                        : jobDetail?.contract_type,
                    salary: {
                      label: `${Number(
                        jobDetail?.monthly_salary_from,
                      ).toLocaleString()} - ${Number(
                        jobDetail?.monthly_salary_to,
                      ).toLocaleString()}`,
                      value: `${Number(
                        jobDetail?.monthly_salary_from,
                      ).toLocaleString()} - ${Number(
                        jobDetail?.monthly_salary_to,
                      ).toLocaleString()}`,
                    },
                    position: {
                      label: String(jobDetail?.no_positions),
                      value: String(jobDetail?.no_positions),
                    },
                    describe: jobDetail?.description,
                    selected: jobDetail?.facilities || [],
                    jobSkills:
                      jobDetail?.skills?.map((s: any) => s.title) || [],
                    skillId: jobDetail?.skills?.map((s: any) => s._id) || [],
                    requirements: jobDetail?.requirements || [],
                    invite_users:
                      jobDetail?.invited_users?.map((u: any) => u?._id) || [],
                    canApply: jobDetail?.people_anywhere,
                    editMode: true,
                  }),
                );
                navigateTo(SCREENS.PostJob);
              }}
            />
          </View>
        </View>
      </ScrollView>

      <ShareModal
        visible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
      />
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
    width: '75%',
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
  addressContainer: {
    gap: wp(14),
    marginTop: hp(32),
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: wp(20),
    height: hp(20),
    tintColor: colors.black,
  },
  location: {
    paddingRight: wp(15),
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
    gap: hp(8),
    width: '34%',
    alignItems: 'center',
    justifyContent: 'center',
    // marginHorizontal: wp(10),
    // width: SCREEN_WIDTH / 4.2,
  },
  valueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // flexWrap: 'wrap',
  },
  detailKey: {
    ...commonFontStyle(600, 17, colors._0B3970),
    textAlign: 'center',
  },
  detailValue: {
    ...commonFontStyle(400, 16, colors.black),
    textAlign: 'center',
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
  emptyState: {
    alignItems: 'center',
    marginVertical: hp(20),
  },
  salaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
