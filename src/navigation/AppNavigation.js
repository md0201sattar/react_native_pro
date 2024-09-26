import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './RootNavigation';

import Login from '../container/Login/Login';
import Register from '../container/Register/Register';
import ForgotPassword from '../container/ForgotPassword/ForgotPassword';
import OtpScreen from '../container/OtpScreen/OtpScreen';
import BottomTabNavigator from './TabNavigator';
import ViewPropertiy from '../container/ViewPropertiy/ViewPropertiy';
import ViewProperty2 from '../container/ViewPropertiy/ViewProperty2';
import ViewPropertiyImage from '../container/ViewPropertiyImage/ViewPropertiyImage';
import ViewImage from '../container/ViewImage/ViewImage';
import ChatSearch from '../container/Chat/ChatSearch';
import SingleImage from '../container/ViewImage/SingleImage';
import Videoplay from '../container/ViewPropertiy/Videoplay';
import Challenges from '../container/MyRewards/Challenges';
import Leaderboard from '../container/MyRewards/Leaderboard';
import Schoolinfo from '../container/ViewPropertiy/Schoolinfo';
import RecycleBin from '../container/RecycleBin/RecycleBin';
import ChatHistory from '../container/ChatHistory/ChatHistory';
import ContactSurf from '../container/ContactMyAgent/ContactSurf';
import AppIntro from '../container/AppIntro/AppIntro';
import Video from '../components/Video/video';
import BookaTour from '../container/Chat/BookaTour';

const Stack = createStackNavigator();
const screenOptions = {
  headerShown: false,
};

const initialState = {
  isAudioEnabled: true,
  status: 'disconnected',
  participants: new Map(),
  videoTracks: new Map(),
  userName: '',
  roomName: '',
  token: '',
};

const AppContext = React.createContext(initialState);

export const SignedOutStack = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="AppIntro" component={AppIntro} />
        <Stack.Screen name="BookaTour" component={BookaTour} />
        <Stack.Screen name="Tabs" component={BottomTabNavigator} />
        <Stack.Screen name="ViewPropertiy" component={ViewPropertiy} />
        <Stack.Screen
          name="ViewPropertiyImage"
          component={ViewPropertiyImage}
        />
        <Stack.Screen name="ViewImage" component={ViewImage} />
        <Stack.Screen name="ChatSearch" component={ChatSearch} />
        <Stack.Screen name="SingleImage" component={SingleImage} />
        <Stack.Screen name="Videoplay" component={Videoplay} />
        <Stack.Screen name="Challenges" component={Challenges} />
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
        <Stack.Screen name="RecycleBin" component={RecycleBin} />
        <Stack.Screen name="ChatHistory" component={ChatHistory} />
        <Stack.Screen name="ContactSurf" component={ContactSurf} />
        <Stack.Screen name="Video" component={Video} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export const SignedInStack = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="AppIntro"
        screenOptions={screenOptions}>
        <Stack.Screen name="AppIntro" component={AppIntro} />
        <Stack.Screen name="BookaTour" component={BookaTour} />
        <Stack.Screen name="Tabs" component={BottomTabNavigator} />
        <Stack.Screen name="ViewPropertiy" component={ViewPropertiy} />
        <Stack.Screen
          name="ViewPropertiyImage"
          component={ViewPropertiyImage}
        />
        <Stack.Screen name="ViewImage" component={ViewImage} />
        <Stack.Screen name="ChatSearch" component={ChatSearch} />
        <Stack.Screen name="SingleImage" component={SingleImage} />
        <Stack.Screen name="Videoplay" component={Videoplay} />
        <Stack.Screen name="Challenges" component={Challenges} />
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
        <Stack.Screen name="RecycleBin" component={RecycleBin} />
        <Stack.Screen name="ChatHistory" component={ChatHistory} />
        <Stack.Screen name="ContactSurf" component={ContactSurf} />
        <Stack.Screen name="Video" component={Video} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
