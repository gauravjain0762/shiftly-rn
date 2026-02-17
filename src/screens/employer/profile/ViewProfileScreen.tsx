import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { LinearContainer } from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../assets/Images';
import { goBack, navigateTo, successToast, errorToast } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import { useGetEmployeeProfileQuery, useUpdateAboutMeMutation } from '../../../api/dashboardApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flag } from 'react-native-country-picker-modal';
import { callingCodeToCountryCode } from '../../../utils/countryFlags';
import CustomImage from '../../../component/common/CustomImage';
import { useFocusEffect } from '@react-navigation/native';
import { getInitials, hasValidImage } from '../../../utils/commonFunction';
import { useAppDispatch } from '../../../redux/hooks';
import { setUserInfo } from '../../../features/authSlice';

export const callingCodeToCountry = (callingCode: any) => {
  const cleanCode = callingCode
    ?.toString()
    ?.replace('+', '') as keyof typeof callingCodeToCountryCode;
  return callingCodeToCountryCode[cleanCode] || 'AE';
};

const ViewProfileScreen = () => {
  const dispatch = useAppDispatch();
  const {
    data: getProfile,
    refetch,
  } = useGetEmployeeProfileQuery({});
  const userInfo = getProfile?.data?.user;
  const [updateAboutMe, { isLoading: isUpdating }] = useUpdateAboutMeMutation();
  const [isOpenForWork, setIsOpenForWork] = useState(userInfo?.open_for_job || false);

  const countryCode = userInfo?.phone_code || 'AE';

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Update local state when userInfo changes
  React.useEffect(() => {
    if (userInfo?.open_for_job !== undefined) {
      setIsOpenForWork(userInfo?.open_for_job);
    }
  }, [userInfo?.open_for_job]);

  const handleToggleOpenForWork = async () => {
    try {
      const newValue = !isOpenForWork;
      const formData = new FormData();
      formData.append('open_for_job', newValue);

      const response = await updateAboutMe(formData).unwrap();
      console.log(">>>>>>>>>>> ~ handleToggleOpenForWork ~ response:", response)

      if (response?.status) {
        setIsOpenForWork(newValue);
        // Update userInfo in Redux if response contains updated user data
        if (response?.data?.user) {
          dispatch(setUserInfo(response.data.user));
        }
        successToast(response?.message || 'Status updated successfully');
        // Refetch to get latest data
        refetch();
      } else {
        errorToast(response?.message || 'Failed to update status');
      }
    } catch (error: any) {
      console.error('Error updating open for work status:', error);
      errorToast(error?.data?.message || 'Failed to update status');
    }
  };

  return (
    <LinearContainer
      SafeAreaProps={{ edges: ['top'] }}
      colors={[colors._F7F7F7, colors._F7F7F7]}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Pressable
            onPress={() => goBack()}
            style={{ padding: wp(23), paddingBottom: 0 }}>
            <Image
              source={IMAGES.backArrow}
              style={{ height: hp(20), width: wp(24), tintColor: colors._0B3970 }}
            />
          </Pressable>
          <View style={styles.container}>
            <CustomImage
              uri={userInfo?.picture}
              source={IMAGES.logoText}
              imageStyle={{ height: '100%', width: '100%', borderRadius: 100 }}
              containerStyle={styles.avatar}
              resizeMode={userInfo?.picture ? "cover" : "contain"}
            />
            <Text style={styles.name}>{userInfo?.name}</Text>
            <View style={styles.locationRow}>
              <Image
                source={IMAGES.marker}
                style={[styles.locationicon, { tintColor: colors._0B3970 }]}
              />
              <Text style={styles.location}>{userInfo?.country || 'N/A'}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <TouchableOpacity
                onPress={handleToggleOpenForWork}
                disabled={isUpdating}
                style={[
                  styles.editButton,
                  isOpenForWork && styles.editButtonActive
                ]}>
                {isUpdating ? (
                  <ActivityIndicator size="small" color={isOpenForWork ? colors.white : colors._0B3970} />
                ) : (
                  <>
                    {isOpenForWork && (
                      <Image
                        source={IMAGES.check}
                        style={{
                          width: wp(16),
                          height: wp(16),
                          tintColor: colors.white,
                          marginRight: wp(5)
                        }}
                        resizeMode='contain'
                      />
                    )}
                    <Text style={[
                      styles.editButtonText,
                      isOpenForWork && styles.editButtonTextActive
                    ]}>
                      Open to Work
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigateTo(SCREENS.ProfileScreen);
                }}
                style={styles.editButton}>
                <Text style={styles.editButtonText}>View Profile</Text>
              </TouchableOpacity>
            </View>
            {/* <Text style={styles.decText}>
              {userInfo?.about ||
                'Sed ut perspiciatis unde omns iste natus error site voluptatem accusantum dolorem queitters lipsum lipslaudantiuml ipsum text.'}
            </Text> */}
          </View>
          <View style={styles.detailsContainer}>
            <FlatList
              data={[
                { label: 'About me', value: userInfo?.about },
                {
                  label: 'Nationality',
                  value: userInfo?.nationality,
                },
                { label: 'Email', value: userInfo?.email },
                {
                  label: 'Phone',
                  value: `+${userInfo?.phone_code || "N/A"} ${userInfo?.phone || "N/A"}`,
                  showFlag: true,
                },
              ]}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={{ gap: hp(23) }}
              renderItem={({ item }) => (
                <View style={{ gap: hp(2) }}>
                  <Text style={{ ...commonFontStyle(600, 20, colors._0B3970) }}>
                    {item.label}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {item?.showFlag && (
                      <Flag
                        withEmoji
                        withFlagButton
                        flagSize={wp(30)}
                        countryCode={callingCodeToCountry(countryCode) as any}
                      />
                    )}
                    <Text style={{ ...commonFontStyle(400, 18, colors._4A4A4A) }}>
                      {item.value || '-'}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>

          <TouchableOpacity
            onPress={() => navigateTo(SCREENS.EditAccount)}
            style={[
              styles.editButton,
              {
                width: '70%',
                alignSelf: 'center',
                marginHorizontal: wp(23),
              },
            ]}>
            <Text
              style={[
                styles.editButtonText,
                {
                  textAlign: 'center',
                  ...commonFontStyle(400, 18, colors._0B3970),
                },
              ]}>
              Edit Details
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearContainer>
  );
};

export default ViewProfileScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: hp(30),
    alignItems: 'center',
    borderRadius: hp(12),
    paddingHorizontal: wp(50),
  },
  avatar: {
    width: wp(115),
    height: wp(115),
    borderRadius: 100,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    marginTop: hp(8),
    textAlign: 'center',
    ...commonFontStyle(600, 25, colors._0B3970),
  },
  locationRow: {
    flexDirection: 'row',
    gap: wp(6),
    marginTop: hp(8),
  },
  location: {
    ...commonFontStyle(400, 20, colors._0B3970),
  },
  editButton: {
    marginTop: hp(25),
    paddingVertical: hp(12),
    paddingHorizontal: wp(21),
    borderRadius: 10,
    backgroundColor: '#E6E6E6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonActive: {
    backgroundColor: colors._0B3970,
  },
  editButtonText: {
    ...commonFontStyle(400, 17, colors._0B3970),
  },
  editButtonTextActive: {
    ...commonFontStyle(400, 17, colors.white),
  },
  decText: {
    ...commonFontStyle(400, 17, '#E7E7E7'),
    marginHorizontal: 23,
    lineHeight: 30,
    marginTop: 32,
    alignSelf: 'flex-start',
  },
  locationicon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },
  detailsContainer: {
    gap: hp(23),
    marginTop: hp(40),
    marginVertical: hp(20),
    alignItems: 'flex-start',
    paddingHorizontal: wp(23),
  },
  editAccountBtn: {
    gap: wp(4),
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: hp(20),
    paddingVertical: hp(16),
    paddingHorizontal: wp(8),
    backgroundColor: colors._F4E2B8,
  },
  editAccountBtnText: {
    ...commonFontStyle(500, 16, '#0A376D'),
  },
  avatarPlaceholder: {
    backgroundColor: colors._0B3970,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: wp(22),
    fontWeight: '700',
  },
});
