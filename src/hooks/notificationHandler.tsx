import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setFcmToken, setHasUnreadNotification } from '../features/authSlice';
import { PermissionsAndroid, Platform, Linking } from 'react-native';
import { errorToast, navigateTo } from '../utils/commonFunction';
import { SCREENS } from '../navigation/screenNames';
import { store } from '../store';
import { getAsyncFcmToken, setAsyncFcmToken } from '../utils/asyncStorage';

const ROLE_STORAGE_KEY = 'userRole';

//
// 🔔 Display Notification + Badge Update
//
async function onDisplayNotification(message: any) {
  store.dispatch(setHasUnreadNotification(true)); // Show red dot
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
      pressAction: { id: 'default', launchActivity: 'default' },
    },
    ios: {
      sound: 'default',
      badgeCount: await notifee.getBadgeCount(),
    },
  });
}

//
// 🔑 Request Permissions + Get Token
//
export async function requestNotificationUserPermission(dispatch: any) {
  try {
    console.log('🔔 [FCM] requestNotificationUserPermission called');
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    const authStatus = await messaging().requestPermission();
    console.log('🔔 [FCM] messaging().requestPermission status:', authStatus);
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      errorToast('Please allow notifications permission');
      console.log('🔔 [FCM] Notifications permission NOT enabled, skipping token fetch');
      return;
    }

    await messaging().registerDeviceForRemoteMessages();
    console.log('🔔 [FCM] Device registered for remote messages');
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
    console.log('🔔 [FCM] getFirebaseToken called');
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('🔔 [FCM] Token received:', fcmToken);
      dispatch(setFcmToken(fcmToken));
      await setAsyncFcmToken(fcmToken);
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
// 🎫 Ensure FCM Token - fetches token directly if missing, dispatches to Redux and returns it
//
export const ensureFcmToken = async (dispatch: any, existingToken?: string | null): Promise<string> => {
  if (existingToken) return existingToken;
  try {
    const persistedToken = await getAsyncFcmToken();
    if (persistedToken) {
      dispatch(setFcmToken(persistedToken));
      return persistedToken;
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      if (token) {
        dispatch(setFcmToken(token));
        await setAsyncFcmToken(token);
        return token;
      }
    }
  } catch (e) {
    console.log('🔔 [FCM] ensureFcmToken error:', e);
  }
  return '';
};

// 📩 Foreground Messages
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
  notifee.onForegroundEvent(async ({ type, detail }) => {
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
  store.dispatch(setHasUnreadNotification(true)); // Show red dot

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
    android: { channelId, sound: 'default' },
    ios: { sound: 'default', badgeCount: count },
  });
});

//
// 🔗 Navigate on Notification Press
//
export const navigateToOrderDetails = async (remoteMessage: any) => {
  try {
    const data = remoteMessage?.data;

    if (!data) {
      console.log('No data in notification');
      return;
    }

    console.log('Notification data:>>>>>>>', data);

    // Check if notification type is "interview"
    if (data.type === 'interview' && data.interview_link) {
      console.log('Opening interview link:', data.interview_link);

      // Check if the URL can be opened
      const supported = await Linking.canOpenURL(data.interview_link);

      if (supported) {
        navigateTo(SCREENS.JobInvitationScreen, {
          link: data.interview_link,
          jobDetail: data.job_detail,
        });
      } else {
        console.error('Cannot open URL:', data.interview_link);
        errorToast('Unable to open interview link');
      }
      return;
    }

    // Check if notification type is "chat" or "message"
    if ((data.type === 'chat' || data.type === 'message') && data.id) {
      const chatId = data.id;
      const role = await AsyncStorage.getItem(ROLE_STORAGE_KEY);

      if (role === 'company') {
        navigateTo(SCREENS.CoChat, { data: { chat_id: chatId } });
      } else {
        navigateTo(SCREENS.Chat, {
          data: {
            chat_id: chatId,
            company_name: data.company_name,
            job_id: data.job_id,
            job_title: data.job_title,
            created_at: data.created_at,
          },
        });
      }
      return;
    }

    console.log('Other notification type:', data.type);
  } catch (error) {
    console.error('Error navigating from notification:', error);
    errorToast('Failed to open notification');
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