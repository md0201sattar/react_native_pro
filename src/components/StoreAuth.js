import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setUserDetails} from '../modules/UserDetails';
import messaging from '@react-native-firebase/messaging';
import {HandleNotification} from '../modules/HandleNotification';

export const StoreAuth = ({setAppLoader}) => {
  const dispatch = useDispatch();
  // const My_Auth_Data = useSelector(state => state?.auth);
  // const routeName = useSelector(state => state?.auth);

  useEffect(() => {
    const fetchDataFromAsyncStorage = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const userDetails = await AsyncStorage.getItem('userDetails');
        setAppLoader(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    messaging().setBackgroundMessageHandler(remoteMessage => {
      console.log('setBackgroundMessageHandler OK =>', remoteMessage);
      if (remoteMessage) {
        // console.log(
        //   'Notification caused app to open from background state:',
        //   remoteMessage,
        // );
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('onNotificationOpenedApp Ok =>', remoteMessage);
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from onNotificationOpenedApp:',
          remoteMessage,
        );
        dispatch(HandleNotification(remoteMessage));
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
        }
      })
      .catch(e => {
        console.log('Notification error', e);
      });

    messaging().onMessage(async remoteMessage => {
      console.log(
        'Notification of foregournd state {onMessage} OK =>',
        remoteMessage,
      );
      if (remoteMessage) {
        dispatch(HandleNotification(remoteMessage));
      }
    });

    setTimeout(() => {
      // setAppLoader(false);
    }, 100);
    fetchDataFromAsyncStorage();
  }, []);

  return null;
};
