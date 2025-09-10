import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {hp, wp} from '../../../theme/fonts';
import {useTranslation} from 'react-i18next';
import {SCREENS} from '../../../navigation/screenNames';
import {navigateTo} from '../../../utils/commonFunction';
import MessageList from '../../../component/employe/MessageList';
import {useEmployeeGetChatsQuery} from '../../../api/dashboardApi';
import {BackHeader, LinearContainer, SearchBar} from '../../../component';

const Messages = () => {
  const [value, setValue] = useState('');
  const {data: chats, isLoading, refetch} = useEmployeeGetChatsQuery({});
  const chatList = chats?.data?.chats || [];

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <View style={styles.headerContainer}>
        <BackHeader
          title={'Messages'}
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
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item, index}: any) => (
          <MessageList
            key={index}
            item={item}
            onPressMessage={e => navigateTo(SCREENS.Chat, {data: e})}
          />
        )}
        onRefresh={refetch}
        refreshing={isLoading}
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
