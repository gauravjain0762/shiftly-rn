import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {BackHeader, LinearContainer, SearchBar} from '../../../component';
import {useTranslation} from 'react-i18next';
import MessageList from '../../../component/employe/MessageList';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {hp, wp} from '../../../theme/fonts';
import {useGetCompanyChatsQuery} from '../../../api/dashboardApi';
import BaseText from '../../../component/common/BaseText';
import {useSelector} from 'react-redux';

// const messages = [
//   {
//     id: '1',
//     logo: 'https://content.presspage.com/templates/658/2042/729924/royal-atlantis-logo.png',
//     title: 'Atlantis Resort',
//     sender: 'Bilal Izhar HR Admin',
//     preview:
//       'Please apply through our job portal at so your CV can be reviewed.',
//     date: 'Apr 15',
//     unreadCount: 5,
//   },
//   {
//     id: '2',
//     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Marriott_hotels_logo14.svg/512px-Marriott_hotels_logo14.svg.png',
//     title: 'Marriott Banvoy Hotels',
//     sender: 'Kane Bezobada',
//     preview: 'Would you like to share with me your best website profile?',
//     date: 'Apr 14',
//   },
//   {
//     id: '3',
//     logo: 'https://content.presspage.com/templates/658/2042/729924/royal-atlantis-logo.png',
//     title: 'Gevora Hotel',
//     sender: 'Bilal Izhar HR Admin',
//     preview:
//       'Please apply through our job portal at so your CV can be reviewed.',
//     date: 'Apr 10',
//   },
//   {
//     id: '4',
//     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Marriott_hotels_logo14.svg/512px-Marriott_hotels_logo14.svg.png',
//     title: 'Elite Hotels',
//     sender: 'Bilal Izhar HR Admin',
//     preview:
//       'Please apply through our job portal at so your CV can be reviewed.',
//     date: 'Apr 09',
//     unreadCount: 2,
//   },
//   {
//     id: '5',
//     logo: 'https://content.presspage.com/templates/658/2042/729924/royal-atlantis-logo.png',
//     title: 'Rose Palace Hotels',
//     sender: 'Bilal Izhar HR Admin',
//     preview: 'Would you like to share with me your best website profile?',
//     date: 'Apr 14',
//   },
//   {
//     id: '6',
//     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Marriott_hotels_logo14.svg/512px-Marriott_hotels_logo14.svg.png',
//     title: 'Marriott Banvoy Hotels',
//     sender: 'Kane Bezobada',
//     preview: 'Would you like to share with me your best website profile?',
//     date: 'Apr 14',
//   },
//   {
//     id: '7',
//     logo: 'https://content.presspage.com/templates/658/2042/729924/royal-atlantis-logo.png',
//     title: 'Gevora Hotel',
//     sender: 'Bilal Izhar HR Admin',
//     preview:
//       'Please apply through our job portal at so your CV can be reviewed.',
//     date: 'Apr 10',
//   },
// ];

const CoMessage = () => {
  const {t, i18n} = useTranslation();
  const [value, setValue] = useState('');
  const {data: chats} = useGetCompanyChatsQuery({});
  const chatList = chats?.data?.chats || [];
  console.log('🔥🔥 ~ CoMessage ~ chatList:', chatList);

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <View style={styles.headerContainer}>
        <BackHeader
          title={t('Messages')}
          type="company"
          isRight={false}
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
        data={chatList}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}: any) => (
          <MessageList
            key={index}
            onPressMessage={e => navigateTo(SCREENS.CoChat, {data: e})}
            item={item}
            type="company"
          />
        )}
        ListEmptyComponent={() => {
          return (
            <View>
              <BaseText style={{textAlign: 'center'}} text={'No Chats found'} />
            </View>
          );
        }}
        keyExtractor={item => item.id}
      />
    </LinearContainer>
  );
};

export default CoMessage;

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
    paddingBottom: hp(25),
  },
  search: {
    marginTop: hp(10),
  },
});
