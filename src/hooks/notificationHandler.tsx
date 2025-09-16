import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {setFcmToken} from '../features/authSlice';
import {PermissionsAndroid, Platform} from 'react-native';
import {errorToast} from '../utils/commonFunction';

//
// 🔔 Display Notification + Badge Update
//
async function onDisplayNotification(message: any) {
  await notifee.requestPermission();

  // ✅ update badge BEFORE showing
  await updateBadgeCount();

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    sound: 'default',
    importance: AndroidImportance.HIGH,
    badge: true,
    vibration: true,
  });

  await notifee.displayNotification({
    title:
      message?.notification?.title ?? message?.data?.title ?? 'Notification',
    body: message?.notification?.body ?? message?.data?.body ?? '',
    data: message?.data,
    android: {
      channelId,
      sound: 'default',
      pressAction: {id: 'default', launchActivity: 'default'},
    },
    ios: {
      sound: 'default',
      badgeCount: await notifee.getBadgeCount(), // keep it in sync
    },
  });
}

//
// 🔑 Request Permissions + Get Token
//
export async function requestNotificationUserPermission(dispatch: any) {
  try {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      errorToast('Please allow notifications permission');
      return;
    }

    await messaging().registerDeviceForRemoteMessages();
    await getFirebaseToken(dispatch);
  } catch (e) {
    console.log('Permission error:', e);
    errorToast('Failed to request notification permission');
  }
}

//
// 🎫 Get FCM Token
//
const getFirebaseToken = async (dispatch: any) => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('---fcmToken---\n', fcmToken);
      dispatch(setFcmToken(fcmToken));
      resetBadgeCount();
    } else {
      errorToast('[FCMService] User does not have a device token');
    }
  } catch (error) {
    console.log('FCM token error:', error);
    // errorToast('Failed to get FCM token');
  }
};

//
// 📩 Foreground Messages
//
export const onMessage = () =>
  messaging().onMessage(async (remoteMessage: any) => {
    console.log('FCM foreground message:', remoteMessage);
    await onDisplayNotification(remoteMessage);
  });

//
// ⏮ Background Tap
//
export const onBackgroundNotificationPress = () =>
  messaging().onNotificationOpenedApp((remoteMessage: any) => {
    console.log('App opened from BACKGROUND by notification:', remoteMessage);
    if (remoteMessage) {
      navigateToOrderDetails(remoteMessage);
      resetBadgeCount();
    }
  });

//
// ⏹ Killed State Tap
//
export const onNotificationPress = () =>
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'App opened from KILLED state by notification:',
          remoteMessage,
        );
        navigateToOrderDetails(remoteMessage);
        resetBadgeCount();
      }
    });

//
// 🟢 Foreground Event Listener (tap, dismiss)
//
export const openAppNotificationEvent = () =>
  notifee.onForegroundEvent(async ({type, detail}) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        navigateToOrderDetails(detail.notification);
        break;
    }
  });

//
// 📩 Background Message Handler
//
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background FCM:', remoteMessage);

  // Increment badge
  let count = await notifee.getBadgeCount();
  count++;
  await notifee.setBadgeCount(count);

  // Create Android channel
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    badge: true,
  });

  // Show notification
  await notifee.displayNotification({
    title: (remoteMessage?.data?.title as string) || 'Notification',
    body: (remoteMessage?.data?.body as string) || '',
    android: {channelId, sound: 'default'},
    ios: {sound: 'default', badgeCount: count},
  });
});

//
// 🔗 Navigate on Notification Press
//
export const navigateToOrderDetails = (remoteMessage: any) => {
  if (remoteMessage?.data) {
    // Add your navigation logic here
  }
};

//
// 🔄 Reset Badge
//
const resetBadgeCount = async () => {
  await notifee.setBadgeCount(0);
};

//
// 🔢 Update Badge Count (iOS & Android)
//
async function updateBadgeCount() {
  let badgeCount = await notifee.getBadgeCount();
  const newCount = badgeCount + 1;

  await notifee.setBadgeCount(newCount);
  console.log('Updated badge count:', newCount);
}
