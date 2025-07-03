import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {BackHeader, LinearContainer, SearchBar} from '../../../component';
import {hp, wp} from '../../../theme/fonts';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import MessageList from '../../../component/employe/MessageList';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';

const Messages = () => {
  const {t, i18n} = useTranslation();
  const [value, setValue] = useState('');

  const messages = [
    {
      id: '1',
      logo: 'https://content.presspage.com/templates/658/2042/729924/royal-atlantis-logo.png',
      title: 'Atlantis Resort',
      sender: 'Bilal Izhar HR Admin',
      preview:
        'Please apply through our job portal at so your CV can be reviewed.',
      date: 'Apr 15',
      unreadCount: 5,
    },
    {
      id: '2',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Marriott_hotels_logo14.svg/512px-Marriott_hotels_logo14.svg.png',
      title: 'Marriott Banvoy Hotels',
      sender: 'Kane Bezobada',
      preview: 'Would you like to share with me your best website profile?',
      date: 'Apr 14',
    },
    {
      id: '3',
      logo: 'https://content.presspage.com/templates/658/2042/729924/royal-atlantis-logo.png',
      title: 'Gevora Hotel',
      sender: 'Bilal Izhar HR Admin',
      preview:
        'Please apply through our job portal at so your CV can be reviewed.',
      date: 'Apr 10',
    },
    {
      id: '4',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Marriott_hotels_logo14.svg/512px-Marriott_hotels_logo14.svg.png',
      title: 'Elite Hotels',
      sender: 'Bilal Izhar HR Admin',
      preview:
        'Please apply through our job portal at so your CV can be reviewed.',
      date: 'Apr 09',
      unreadCount: 2,
    },
    {
      id: '5',
      logo: 'https://content.presspage.com/templates/658/2042/729924/royal-atlantis-logo.png',
      title: 'Rose Palace Hotels',
      sender: 'Bilal Izhar HR Admin',
      preview: 'Would you like to share with me your best website profile?',
      date: 'Apr 14',
    },
    {
      id: '6',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Marriott_hotels_logo14.svg/512px-Marriott_hotels_logo14.svg.png',
      title: 'Marriott Banvoy Hotels',
      sender: 'Kane Bezobada',
      preview: 'Would you like to share with me your best website profile?',
      date: 'Apr 14',
    },
    {
      id: '7',
      logo: 'https://content.presspage.com/templates/658/2042/729924/royal-atlantis-logo.png',
      title: 'Gevora Hotel',
      sender: 'Bilal Izhar HR Admin',
      preview:
        'Please apply through our job portal at so your CV can be reviewed.',
      date: 'Apr 10',
    },
  ];

  return (
    <LinearContainer  colors={['#0D468C', '#041326']}>
      <View style={styles.headerContainer}>
        <BackHeader
          title={t('Messages')}
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
        data={messages}
        renderItem={({item}) => (
          <MessageList
            onPressMessage={e => navigateTo(SCREENS.Chat, {data: e})}
            item={item}
          />
        )}
        keyExtractor={item => item.id}
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
    paddingBottom: hp(25),
  },
  search: {
    marginTop: hp(10),
  },
});
