import React from 'react';
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
import {LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import {goBack, navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useGetEmployeeProfileQuery} from '../../../api/dashboardApi';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Flag} from 'react-native-country-picker-modal';
import {callingCodeToCountryCode} from '../../../utils/countryFlags';
import CustomImage from '../../../component/common/CustomImage';

export const callingCodeToCountry = (callingCode: any) => {
  const cleanCode = callingCode
    ?.toString()
    ?.replace('+', '') as keyof typeof callingCodeToCountryCode;
  return callingCodeToCountryCode[cleanCode] || 'AE';
};

const ViewProfileScreen = () => {
  const {data: getProfile} = useGetEmployeeProfileQuery({});
  const userInfo = getProfile?.data?.user;

  const countryCode = userInfo?.phone_code || 'AE';

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['top']}}
      colors={['#0D468C', '#041326']}>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Pressable
            onPress={() => goBack()}
            style={{padding: wp(23), paddingBottom: 0}}>
            <Image
              source={IMAGES.backArrow}
              style={{height: hp(20), width: wp(24)}}
            />
          </Pressable>
          <View style={styles.container}>
            <CustomImage
              uri={userInfo?.picture}
              imageStyle={{height: '100%', width: '100%'}}
              containerStyle={styles.avatar}
              resizeMode="cover"
            />
            <Text style={styles.name}>{userInfo?.name}</Text>
            <View style={styles.locationRow}>
              <Image source={IMAGES.marker} style={styles.locationicon} />
              <Text style={styles.location}>{userInfo?.location || 'N/A'}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Open to Work</Text>
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
                {label: 'About me', value: userInfo?.about},
                {
                  label: 'Nationality',
                  value: userInfo?.nationality,
                },
                {label: 'Email', value: userInfo?.email},
                {
                  label: 'Phone',
                  value: `+${userInfo?.phone_code} ${userInfo?.phone}`,
                  showFlag: true,
                },
              ]}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={{gap: hp(23)}}
              renderItem={({item}) => (
                <View style={{gap: hp(2)}}>
                  <Text style={{...commonFontStyle(600, 20, colors.white)}}>
                    {item.label}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {item?.showFlag && (
                      <Flag
                        withEmoji
                        flagSize={wp(30)}
                        withFlagButton
                        countryCode={callingCodeToCountry(countryCode) as any}
                      />
                    )}
                    <Text style={{...commonFontStyle(400, 18, colors._F4E2B8)}}>
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
                  ...commonFontStyle(400, 18, '#0A376D'),
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
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 30,
  },
  avatar: {
    width: wp(115),
    height: wp(115),
    borderRadius: 100,
    overflow: 'hidden',
  },
  name: {
    ...commonFontStyle(600, 25, colors.white),
    marginTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    gap: wp(6),
    marginTop: hp(8),
  },
  location: {
    ...commonFontStyle(400, 20, colors.white),
  },
  editButton: {
    marginTop: hp(25),
    paddingVertical: hp(12),
    paddingHorizontal: wp(21),
    borderRadius: 10,
    backgroundColor: colors._F4E2B8,
  },
  editButtonText: {
    ...commonFontStyle(400, 17, '#0A376D'),
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
});
