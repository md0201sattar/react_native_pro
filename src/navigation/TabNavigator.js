import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, Image, StyleSheet} from 'react-native';
import {store} from '../redux/store';
import {useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {useIsFocused} from '@react-navigation/native';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
//
import Images from '../utils/Images';
import Colors from '../utils/Colors';
import Home from '../container/Home/Home';
import MyProfile from '../container/MyProfile/MyProfile';
import Settings from '../container/Settings/Settings';
import ChatSearch from '../container/Chat/ChatSearch';
import MyRewards from '../container/MyRewards/MyRewards';
import RecycleBin from '../container/RecycleBin/RecycleBin';
import Notification from '../container/Notification/Notification';
import MyFavorites from '../container/MyFavorites/MyFavorites';
import MakeAnOffer from '../container/MakeAnOffer/MakeAnOffer';
import SavedSearches from '../container/SavedSearches/SavedSearches';
import {requestUserPermission} from '../utils/pushnotifications_helper';
import ContactMyAgent from '../container/ContactMyAgent/ContactMyAgent';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabNavigator = () => {
  const isFocused = useIsFocused();
  const [data, setdata] = useState();
  const [tabshow, setTabshow] = useState(true);
  const NotificationData = useSelector(state => state?.HandleNotification);

  useEffect(() => {
    if (
      store?.getState()?.loginUserReducer?.loginData?.data?.user_role ===
      'administrator'
    ) {
      setTabshow(true);
    }
    requestUserPermission();
  }, []);

  useEffect(() => {
    setdata(store.getState()?.getUserScore?.getUserScoreData?.data?.points);
  }, [store.getState()?.getUserScore?.getUserScoreData?.data]);

  return (
    <>
      <Tab.Navigator
        tabBarHideOnKeyboard={true}
        initialRouteName={
          NotificationData?.status === 'success' ? 'MyProfileTab' : 'Home'
        }
        screenOptions={{headerShown: false, keyboardHidesTabBar: true}}
        tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen
          name="MyProfileTab"
          component={MyProfileTab}
          initialParams={{triggerFlag: Math.random()}}
          options={{
            tabBarLabel: (
              <Text style={styles.labelmenu} allowFontScaling={false}>
                Profile
                <View style={{position: 'relative'}}>
                  <View style={styles.bedgecover}>
                    <Text style={styles.bedgetext}>2</Text>
                  </View>
                </View>
              </Text>
            ),
            tabBarIcon: Images.newprofile,
            keyboardHidesTabBar: true,
            tabBarHideOnKeyboard: true,
          }}
        />
        {tabshow ? (
          <Tab.Screen
            name="Rewards"
            component={MyRewards}
            options={{
              tabBarLabel: (
                <>
                  <View style={{}}>
                    <Text style={styles.rebatemenu} allowFontScaling={true}>
                      {data ? '$' + data : '$' + 0}
                    </Text>
                    <Text
                      style={[
                        styles.labelmenu,
                        {
                          color: isFocused ? Colors.textColorDark : null,
                        },
                      ]}
                      allowFontScaling={false}>
                      Rebate
                    </Text>
                  </View>
                </>
              ),
              keyboardHidesTabBar: true,
              tabBarHideOnKeyboard: true,
            }}
          />
        ) : null}
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: null,

            tabBarIcon: Images.homebig,

            keyboardHidesTabBar: true,
            tabBarHideOnKeyboard: true,
          }}
        />
        {tabshow ? (
          <Tab.Screen
            name="Favorites"
            component={MyFavorites}
            options={({route}) => ({
              tabBarLabel: (
                <Text style={styles.labelmenu} allowFontScaling={false}>
                  Favorites
                </Text>
              ),
              tabBarIcon: Images.upthumb,
              keyboardHidesTabBar: true,
              tabBarHideOnKeyboard: true,
              // triggerFlag: Math.random() * 100,
            })}
            initialParams={{triggerFlag: Math.random() * 100}}
          />
        ) : null}

        <Tab.Screen
          name="ChatSearch"
          component={ChatSearch}
          options={{
            tabBarLabel: (
              <Text style={styles.labelmenu} allowFontScaling={false}>
                Chat
              </Text>
            ),
            tabBarIcon: Images.chatnew,
            keyboardHidesTabBar: true,
            tabBarHideOnKeyboard: true,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const MyProfileTab = ({route}) => {
  const {triggerFlag} = route.params;
  const NotificationData = useSelector(state => state?.HandleNotification);

  return (
    <Stack.Navigator
      initialRouteName={
        NotificationData?.status === 'success' ? 'ContactMyAgent' : 'MyProfile'
      }
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        initialParams={{triggerFlag: triggerFlag}}
      />
      <Stack.Screen name="Settings" component={Settings} />
      {/* <Stack.Screen
        name="MyFavorites"
        component={MyFavorites}
        initialParams={{triggerFlag: Math.random(100 * 3)}}
      /> */}
      <Stack.Screen name="SavedSearches" component={SavedSearches} />

      <Stack.Screen name="ContactMyAgent" component={ContactMyAgent} />
      <Stack.Screen name="MakeAnOffer" component={MakeAnOffer} />
      <Stack.Screen name="MyRewards" component={MyRewards} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="RecycleBinTab" component={RecycleBin} />
    </Stack.Navigator>
  );
};

function CustomTabBar({state, descriptors, navigation}) {
  return (
    <View style={styles.customtabview}>
      <View
        style={[
          styles.secondcustomview,
          {
            ...ifIphoneX(
              {
                marginBottom: 15,
              },
              {
                marginBottom: 5,
              },
            ),
          },
        ]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const image =
            options.tabBarIcon !== undefined ? options.tabBarIcon : route.name;
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({name: route.name, merge: true});
            }
          };
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          const getIconStyle = () => {
            if (route.name === 'Home') {
              return {
                height: 52,
                width: 52,
              };
            }
            return {
              height: 50,
              width: 30,
              marginTop: 15,
              tintColor: isFocused ? Colors.primaryBlue : Colors.textColorDark,
            };
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.bgbottom}>
              <View style={styles.bottomview}>
                {image !== route.name ? (
                  <Image
                    source={image}
                    resizeMode="contain"
                    style={getIconStyle()}
                  />
                ) : null}
              </View>
              {label ? (
                <Text
                  style={[
                    styles.labelstyle,
                    {
                      color: isFocused
                        ? Colors.primaryBlue
                        : Colors.textColorDark,
                    },
                  ]}>
                  {label}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customtabview: {
    width: '100%',
    height: '12%',
    justifyContent: 'space-between',
    //
    //
    //
    backgroundColor: '#F2F2F2',
  },
  bottomview: {
    height: 60,
    // height: '100%',
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelstyle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
    color: '#000000',
  },
  secondcustomview: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignContent: 'center',
    // backgroundColor: '#F2F2F2',
  },
  labelmenu: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
    fontFamily: 'Poppins-Regular',
  },
  rebatemenu: {
    fontFamily: 'Poppins-Bold',
    position: 'absolute',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 16,
    top: -31,
    color: Colors.black,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    left: 0,
    right: 0,
  },
  bgbottom: {
    height: '100%',

    backgroundColor: '#F2F2F2',
    // backgroundColor: '#0000000D',
    // backgroundColor: '#00000029',
    // backgroundColor: '#FDFDFD',
    // backgroundColor: 'yellow',
    // backgroundColor: '#FDFDFD',
    width: '20%',
    // maxHeight: 100,

    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    // marginVertical: -15,
    // marginTop: 1,
    //
    //
    //
    // backgroundColor: '#FDFDFD',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.13,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  bedgetext: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: 'white',
    borderRadius: 100,
  },
  bedgecover: {
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 100,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    top: 50,
    marginLeft: 0,
  },
});

export default BottomTabNavigator;
