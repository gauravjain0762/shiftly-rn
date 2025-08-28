import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {BackHeader, LinearContainer, SearchBar} from '../../../component';
import {hp, wp} from '../../../theme/fonts';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import MessageList from '../../../component/employe/MessageList';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useEmployeeGetChatsQuery} from '../../../api/dashboardApi';

const Messages = () => {
  const {t, i18n} = useTranslation();
  const [value, setValue] = useState('');
  const {data: chats} = useEmployeeGetChatsQuery({});
  const chatList = chats?.data?.chats || [];

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
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
        data={chatList}
        renderItem={({item, index}: any) => (
          <MessageList
            key={index}
            item={item}
            onPressMessage={e => navigateTo(SCREENS.Chat, {data: e})}
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
