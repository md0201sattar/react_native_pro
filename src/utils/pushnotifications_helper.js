import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import {navigationRef} from '../navigation/RootNavigation';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
    getFCMToken();
  }
}

async function getFCMToken() {
  let fcmtoken = AsyncStorage.getItem('fcmToken');

  try {
    const fcmtoken = await messaging().getToken();
    if (fcmtoken) {
      // console.log('FCMTOken', fcmtoken);
      // return fcmtoken;
    }
  } catch (error) {
    console.log('Errr to get FCM token');
    // throw error;
  }
}

export const NotificationListerner = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage?.notification?.title) {
    }
    console.log('Notiction App Open', remoteMessage?.notification);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notiction App Open on Quit State',
          remoteMessage?.notification,
        );
      }
    });

  messaging().onMessage(async remoteMessage => {
    // console.log('Notiction of foregournd state', remoteMessage)
  });
};
