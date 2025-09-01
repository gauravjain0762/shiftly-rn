import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {BackHeader, LinearContainer, SearchBar} from '../../../component';
import {useTranslation} from 'react-i18next';
import MessageList from '../../../component/employe/MessageList';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {hp, wp} from '../../../theme/fonts';
import {useGetCompanyChatsQuery} from '../../../api/dashboardApi';
import BaseText from '../../../component/common/BaseText';

const CoMessage = () => {
  const {t} = useTranslation();
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
