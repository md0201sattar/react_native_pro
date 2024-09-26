import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {StatusBar} from 'react-native';
import {initializeApp} from 'firebase/app';
import {ThemeProvider} from 'styled-components';
import messaging from '@react-native-firebase/messaging';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';
import {QueryClientProvider, QueryClient} from 'react-query';
//
import {store, persistor} from './src/redux/store';
import StackNavigator from './src/navigation/StackNavigator';
import Colors from './src/utils/Colors';
import Splash from './src/components/Splash';
import {navigationTheme} from './src/theme/theme';
import firebaseConfig from './firebaseConfig';
import {StoreAuth} from './src/components/StoreAuth';
import Loader from './src/components/Loader';

messaging().setBackgroundMessageHandler(async remoteMessage => {});

const queryClient = new QueryClient();

const App = () => {
  const app = initializeApp(firebaseConfig);
  const [appLoader, setAppLoader] = useState(true);
  const [splash, setSplash] = useState(true);

  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
  const setToken = async () => {
    axios.interceptors.request.use(function (config) {
      config.headers['security_key'] = 'SurfLokal52';
      config.headers['access_token'] =
        store?.getState()?.loginUserReducer?.loginData?.data?.authToken;
      return config;
    });
  };
  setToken();

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (
        remoteMessage &&
        remoteMessage?.notification &&
        remoteMessage?.notification.title
      ) {
        // Your code here
      }
      console.log('Notification App Open1', remoteMessage?.notification);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage && remoteMessage?.notification) {
          console.log('Notification App.js on Quit State');
        }
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 3000);
  }, []);

  if (splash) {
    return <Splash />;
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Provider store={store}>
          <StatusBar style="light" backgroundColor={Colors.PrimaryColor} />
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider theme={navigationTheme.light}>
                <StoreAuth setAppLoader={setAppLoader} />
                {appLoader ? <Loader /> : <StackNavigator />}
              </ThemeProvider>
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </SafeAreaView>
    );
  }
};

export default App;
