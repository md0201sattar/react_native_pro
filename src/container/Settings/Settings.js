import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import ImagePicker from 'react-native-image-crop-picker';
import {getProfile} from '../../modules/getProfile';
import {useSelector, useDispatch} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {logOut} from '../../modules/logOut';
import {uploadImageAPI} from '../../config/apiMethod';
import {loginUser} from '../../modules/loginUser';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Settings = props => {
  const [address, setAddres] = useState('');
  const [mob, setMob] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [toggle, setToggle] = useState(false);
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [threads, setThreads] = useState('');

  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [image, setImage] = useState('');
  const detials = props.route.params.data;
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState('');

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const userDetailsString = await AsyncStorage.getItem('userDetails');
        if (userDetailsString !== null) {
          const userDetails = JSON.parse(userDetailsString);
          setUserDetails(userDetails); // Update state with user details
          dispatch(getProfile(userDetails?.authToken)).then(response => {
            console.log('setting get Profile useEff response', response);
            setLoading(false);
            setFirstName(response.payload.data[0].first_name);
            setLastName(response.payload.data[0].last_name);
            setAddres(response.payload.data[0].address);
            setEmail(response.payload.data[0].user_email);
            setMob(response.payload.data[0].mobile);
            setImage(response.payload.data[0]?.user_image);
            setFacebook(response.payload.data[0]?.facebook);
            setInstagram(response.payload.data[0]?.instagram);
            setThreads(response.payload.data[0]?.threads);
            setTwitter(response.payload.data[0]?.twitter);
            setLinkedin(response.payload.data[0]?.linkedin);
          });
        } else {
          setUserDetails(null); // Update state to indicate no user details found
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUserDetails(); // Call the function in the useEffect
  }, []);

  const getProfileApiCall = () => {
    dispatch(getProfile(userDetails?.authToken))
      .then(response => {
        console.log('setting page getProfile response', response);
        setLoading(false);
        setFirstName(response.payload.data[0].first_name);
        setLastName(response.payload.data[0].last_name);
        setAddres(response.payload.data[0].address);
        setEmail(response.payload.data[0].user_email);
        setMob(response.payload.data[0].mobile);
        setImage(response.payload.data[0]?.user_image);
        setFacebook(response.payload.data[0]?.facebook);
        setInstagram(response.payload.data[0]?.instagram);
        setThreads(response.payload.data[0]?.threads);
        setTwitter(response.payload.data[0]?.twitter);
        setLinkedin(response.payload.data[0]?.linkedin);
      })
      .catch(e => {});
  };

  // useEffect(() => {
  // getProfileApiCall();
  // }, []);

  const _pickImage = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      freeStyleCropEnabled: true,
    })
      .then(res => {
        let uriResponse = res.path;
        let name = res.path.split('/').pop();
        let type = res.mime;
        setImage(uriResponse);
        uploadFile(uriResponse, name, type);
      })
      .catch(error => {});
  };

  const uploadFile = async (uriResponse, name, type) => {
    const userID = await AsyncStorage.getItem('userId');
    let data = new FormData();
    data.append('userID', userID);
    data.append('userimage', {
      uri: uriResponse,
      type: type,
      name: name,
    });
    //
    //
    var myHeaders = new Headers();
    myHeaders.append('security_key', 'SurfLokal52');
    myHeaders.append('access_token', userDetails?.authToken);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow',
    };
    console.log('requestOptions', requestOptions);
    return fetch('https://www.surflokal.com/webapi/v1/profile/', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('profile pic result', result);
        if (result.status === 200) {
          getProfileApiCall();
        }
        return result;
      })
      .catch(error => {
        console.log('profile pic error', error);
        getProfileApiCall();
        Alert.alert('something went wrong!.');
        return error;
      });

    // try {
    //   var res = await axios
    //     .post('https://www.surflokal.com/webapi/v1/profile/', data, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     })
    //     .then(res => {
    //       console.log('res', res);
    //       if (res.status === 200) {
    //         getProfileApiCall();
    //       } else {
    //         Alert.alert('something went wrong!.');
    //         setLoading(false);
    //       }
    //     });
    // } catch (err) {
    //   setLoading(false);
    // }
  };

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setToggle(!isEnabled);
  };
  useEffect(() => {}, []);

  //update profile details APIs call
  const saveFile = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append('first_name', firstName);
      data.append('last_name', lastName);
      data.append('user_address', address);
      data.append('mobile', mob);
      data.append('email_notification', toggle);
      data.append('facebook', facebook);
      data.append('twitter', twitter);
      data.append('linkedin', linkedin);
      data.append('instagram', instagram);
      data.append('threads', threads);

      console.log('data', data);

      var myHeaders = new Headers();
      myHeaders.append('security_key', 'SurfLokal52');
      myHeaders.append('access_token', userDetails?.authToken);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow',
      };
      console.log('requestOptions', requestOptions);
      fetch(
        'https://www.surflokal.com/webapi/v1/userprofile/profileupdate.php',
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log('profile pic result', result);
          if (result.status === 200) {
            getProfileApiCall();
          }
          console.log('MyProfile');
          navigation.navigate('MyProfile', {triggerFlag: Math.random()});
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.log('profile pic error', error);
          Alert.alert('AsyncStorage error: ' + error.message);
        });

      //   try {
      //     const res = await uploadImageAPI(
      //       'https://www.surflokal.com/webapi/v1/userprofile/profileupdate.php',
      //       data,
      //     );

      //     if (res.status === 200) {
      //       setLoading(false);
      //       Alert.alert(res.data.message);
      //       navigation.goBack();
      //     } else {
      //       setLoading(false);
      //       Alert.alert('Something went wrong!');
      //     }
      //   } catch (err) {
      //     setLoading(false);
      //     Alert.alert('Request failed: ' + err.message);
      //   }
    } catch (error) {
      setLoading(false);
      Alert.alert('AsyncStorage error: ' + error.message);
    }
  };

  useEffect(() => {
    const handleBackButton = () => {
      navigation.navigate('MyProfile', {triggerFlag: Math.random()});

      return false; // Allow default behavior (e.g., exit the app)
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.picimageview}>
        <TouchableOpacity
          onPress={() => {
            _pickImage();
          }}
          activeOpacity={0.5}
          style={styles.picimagetouchableopacity}>
          <View style={styles.imageview}>
            {image !== '' ? (
              <>
                <Image style={styles.userimage} source={{uri: image}} />
              </>
            ) : (
              <>
                <Image style={styles.userImageStyle} source={Images.user} />
              </>
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.settingtext}>Settings</Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MyProfile', {triggerFlag: Math.random()})
          }>
          <Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView style={styles.keyboardTypestyle}>
        <View style={styles.notificationview}>
          <Text style={styles.notificationtext}>Allow Notfication ?</Text>

          <Switch
            trackColor={{false: '#767577', true: '#11b03e'}}
            thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.switchstyle}
          />
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.textstyle}>First Name</Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={styles.textinputstyle}
          placeholderTextColor={Colors.black}
          value={firstName}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={firstName => setFirstName(firstName)}
        />

        <View style={styles.textinputview}>
          <Text style={styles.textstyle}>Last Name</Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={styles.textinputstyle}
          placeholderTextColor={Colors.black}
          value={lastName}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={lastName => setLastName(lastName)}
        />

        <View style={styles.textinputview}>
          <Text style={styles.textstyle}>Email</Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={styles.textinputstyle}
          placeholderTextColor={Colors.black}
          value={email}
          keyboardType="default"
          returnKeyType="done"
          editable={false}
          onChangeText={email => setEmail(email)}
        />

        <View style={styles.textinputview}>
          <Text style={styles.textstyle}>Phone</Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={styles.textinputstyle}
          placeholderTextColor={Colors.textColorLight}
          value={mob}
          keyboardType="numeric"
          returnKeyType="done"
          onChangeText={text => setMob(text || '')}
        />

        <View style={styles.textinputview}>
          <Text style={styles.textstyle}>Address</Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={styles.textinputstyle}
          placeholderTextColor={'black'}
          value={address}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={address => setAddres(address)}
        />

        <View style={styles.textinputview}>
          <Text style={styles.textstyle}>Facebook</Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={styles.textinputstyle}
          placeholder="Facebook"
          placeholderTextColor={'black'}
          keyboardType="default"
          returnKeyType="done"
          value={facebook}
          onChangeText={facebook => setFacebook(facebook)}
        />

        <View style={styles.textinputview}>
          <Text style={styles.textstyle}>X (formerly known as twitter)</Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={styles.textinputstyle}
          placeholder="Twitter"
          placeholderTextColor={'black'}
          value={twitter}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={twitter => setTwitter(twitter)}
        />

        <View style={styles.textinputview}>
          <Text style={styles.textstyle}>Instagram</Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={styles.textinputstyle}
          placeholder="Instagram"
          placeholderTextColor={'black'}
          value={instagram}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={instagram => setInstagram(instagram)}
        />

        <View style={styles.textinputview}>
          <Text style={styles.textstyle}>Threads</Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={styles.textinputstyle}
          placeholder="Threads"
          placeholderTextColor={'black'}
          value={threads}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={threads => setThreads(threads)}
        />

        <View style={styles.signoutView}>
          <TouchableOpacity
            onPress={async () => {
              await dispatch(logOut(userDetails?.authToken)).then(response => {
                console.log('response.payload', response.payload);
                if (response.payload?.success) {
                  // dispatch(loginUser());
                  async function RemoveAsyncStorage() {
                    try {
                      AsyncStorage.removeItem('userId');
                      AsyncStorage.removeItem('userDetails');
                    } catch (error) {
                      console.error('Error:', error);
                    }
                  }
                  RemoveAsyncStorage();
                  const resetAction = CommonActions.reset({
                    index: 1,
                    routes: [{name: 'Login'}],
                  });

                  navigation.dispatch(resetAction);
                } else {
                  Alert.alert(response?.payload?.message ?? 'LogOut Error');
                }
              });
            }}
            style={styles.signoutTouchableopacity}>
            <Image source={Images.signOut} style={styles.signoutImage} />
            <Text style={styles.signoutText}>Signout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => saveFile()}
            style={styles.updateTouchableopacity}>
            {loading ? (
              <ActivityIndicator size={'small'} color={'#fff'} />
            ) : (
              <View style={styles.updateView}>
                <Text style={styles.updateText}>Update</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.view1}></View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  picimageview: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 0,
  },

  userImageStyle: {height: 40, width: 40, resizeMode: 'cover'},

  picimagetouchableopacity: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
    borderRadius: 50,
  },
  imageview: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 35,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 35,
    borderRadius: DeviceInfo.getDeviceType() === 'Tablet' ? 100 : 20,
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userimage: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 65 : 40,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 65 : 40,
  },
  staticText: {fontSize: 17, color: Colors.white},

  settingtext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  notificationview: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  notificationtext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 27 : 18,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.darbluec,
  },
  textinputview: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 6,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  switchstyle: {position: 'absolute', right: 10},
  view1: {height: 40},
  textstyle: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 14,
    color: Colors.black,
    fontFamily: 'Poppins-Regular',
    opacity: 0.6,
  },
  textinputstyle: {
    color: Colors.black,
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 8,
    fontFamily: 'Poppins-Regular',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 14,
    padding: 10,
    borderColor: Colors.BorderColor,
    borderWidth: 1,
    marginBottom: 17,
  },
  signoutView: {
    paddingHorizontal: 22,
    marginTop: 20,
    justifyContent: 'space-between',
    marginHorizontal: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  signoutTouchableopacity: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surfblur,
    padding: 7,
    borderRadius: 100,
    width: 135,
    justifyContent: 'center',
  },
  signoutImage: {
    height: 20,
    width: 20,
    tintColor: Colors.surfblur,
  },
  slideOuter: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors,
    borderRadius: 18,
  },
  signoutText: {
    marginLeft: 6,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 16,
    color: Colors.surfblur,
    fontFamily: 'Poppins-Regular',
  },
  updateTouchableopacity: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 45,
    width: 130,
    borderRadius: 100,
    backgroundColor: Colors.surfblur,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateView: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  updateText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 14,

    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  slide: {
    width: screenWidth - 40,
    height: screenHeight / 3,
    borderRadius: 18,
    margin: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    resizeMode: 'contain',
    flexDirection: 'row',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: 'blue',
  },

  filter: {
    height: 60,
  },
  screen1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  imagedata: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 38 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 29,
    resizeMode: 'contain',
  },
  keyboardTypestyle: {height: '100%', width: '100%'},
});

export default Settings;
