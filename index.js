/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {store} from './src/store';
import {setHasUnreadNotification} from './src/features/authSlice';
import {navigateToOrderDetails} from './src/hooks/notificationHandler';

// Must be registered before AppRegistry for killed-state handling
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background FCM:', remoteMessage);

  let count = await notifee.getBadgeCount();
  count++;
  await notifee.setBadgeCount(count);

  store.dispatch(setHasUnreadNotification(false));
  store.dispatch(setHasUnreadNotification(true));

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    vibration: true,
    badge: true,
  });

  await notifee.displayNotification({
    title: remoteMessage?.data?.title || remoteMessage?.notification?.title || 'Notification',
    body: remoteMessage?.data?.body || remoteMessage?.notification?.body || '',
    android: {channelId, pressAction: {id: 'default', launchActivity: 'default'}},
    ios: {sound: 'default', badgeCount: count},
  });
});

// Must be registered before AppRegistry for notifee background events
notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.PRESS) {
    console.log('User pressed background notification', detail.notification);
    await navigateToOrderDetails(detail.notification);
  }
});

AppRegistry.registerComponent(appName, () => App);
