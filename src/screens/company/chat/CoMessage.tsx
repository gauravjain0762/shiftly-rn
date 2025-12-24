import React, {useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';

import {BackHeader, LinearContainer, SearchBar} from '../../../component';
import {useTranslation} from 'react-i18next';
import MessageList from '../../../component/employe/MessageList';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {useGetCompanyChatsQuery} from '../../../api/dashboardApi';
import NoDataText from '../../../component/common/NoDataText';

const CoMessage = () => {
  const {t} = useTranslation();
  const [value, setValue] = useState<string>('');
  const {data: chats, isLoading, refetch} = useGetCompanyChatsQuery({});
  const chatList = chats?.data?.chats || [];

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
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
      {isLoading ? (
        <ActivityIndicator size={'large'} color={colors._D5D5D5} />
      ) : (
        <FlatList
          data={chatList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}: any) => (
            <MessageList
              key={index}
              item={item}
              type="company"
              onPressMessage={e =>
                navigateTo(SCREENS.CoChat, {
                  data: e,
                  accessChatId: true,
                  isFromJobDetail: false,
                })
              }
            />
          )}
          ListEmptyComponent={() => {
            return <NoDataText text="No chats found" />;
          }}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
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
