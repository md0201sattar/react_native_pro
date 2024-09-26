import {createStackNavigator} from '@react-navigation/stack';
import Login from '../container/Login/Login';
import Colors from '../utils/Colors';
import AppIntro from '../container/AppIntro/AppIntro';
import OtpScreen from '../container/OtpScreen/OtpScreen';
import ViewPropertiy from '../container/ViewPropertiy/ViewPropertiy';
import ViewPropertiyImage from '../container/ViewPropertiyImage/ViewPropertiyImage';
import ViewImage from '../container/ViewImage/ViewImage';
import Register from '../container/Register/Register';
import ForgotPassword from '../container/ForgotPassword/ForgotPassword';
import ChatSearch from '../container/Chat/ChatSearch';
import SingleImage from '../container/ViewImage/SingleImage';
import Videoplay from '../container/ViewPropertiy/Videoplay';
import Leaderboard from '../container/MyRewards/Leaderboard';
import Challenges from '../container/MyRewards/Challenges';
import RecycleBin from '../container/RecycleBin/RecycleBin';
import BookaTour from '../container/Chat/BookaTour';
import ChatHistory from '../container/ChatHistory/ChatHistory';
import ContactSurf from '../container/ContactMyAgent/ContactSurf';
import Video from '../components/Video/video';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {navigationRef} from './RootNavigation';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabNavigator from './TabNavigator';
import {store} from '../redux/store';
import ForgotPwdOTP from '../container/ForgotPassword/ForgotPwdOTP';
import ChangeNewPwd from '../container/ForgotPassword/ChangeNewPwd';
import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
const Stack = createStackNavigator();

const StackNavigator = () => {
  const userDetailsData = useSelector(state => state.UserDetails);
  const [userDetails, setUserDetails] = useState('');

  useEffect(() => {
    const fetchDataFromAsyncStorage = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const userDetails = await AsyncStorage.getItem('userDetails');
        setUserDetails(JSON.parse(userDetails));
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchDataFromAsyncStorage();

    // If cleanup is needed, you can return a function
    return () => {
      // Cleanup code goes here (if needed)
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaProvider style={{backgroundColor: Colors.PrimaryColor}}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: {backgroundColor: Colors.white},
          }}
          initialRouteName={
            // store?.getState()?.loginUserReducer?.loginData?.success === true
            userDetails?.device_token ? 'Tabs' : 'Login'
          }>
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
          {/*  */}
          {/*  */}
          <Stack.Screen name="ForgotPwdOTP" component={ForgotPwdOTP} />
          <Stack.Screen name="ChangeNewPwd" component={ChangeNewPwd} />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};
export default StackNavigator;
