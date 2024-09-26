import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import LottieView from 'lottie-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getAgent} from '../../modules/getAgent';
import {getUserDetailsSync} from '../../utils/getUserDetailsSync';
import {TestVideoCall} from '../../components/TestVideoCall';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const identity = Platform.select({
  ios: 'Steve',
  android: 'Larry',
});

const from = Platform.select({
  ios: 'client:Steve',
  android: 'client:Larry',
});

const callKeepOptions = {
  ios: {
    appName: 'TwilioPhone Example',
    supportsVideo: false,
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'OK',
    additionalPermissions: [],
    // Required to get audio in background when using Android 11
    foregroundService: {
      channelId: 'com.example.reactnativetwiliophone',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running on background',
    },
  },
};

const ContactMyAgent = () => {
  const [agentData, setAgentData] = useState();
  const dispatch = useDispatch();
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState('');
  const [checkPermission, setCheckPermission] = useState('');
  const [profileDetails, setProfileDetails] = useState([]);
  const [permissionAsk, setPermissionAsk] = useState(false);
  const [callInProgress, setCallInProgress] = React.useState(false);
  const [to, setTo] = React.useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const NotificationData = useSelector(state => state?.HandleNotification);

  useEffect(() => {
    setShowVideoCall(false);
    if (NotificationData?.status === 'success') {
      setShowVideoCall(true);
    }
  }, []);

  useEffect(async () => {
    const fetchUserDetails = async () => {
      const userDetails = await getUserDetailsSync();
      setUserDetails(userDetails);
      dispatch(getAgent()).then(response => {
        if (response.payload.data[0]) {
          setAgentData(response.payload.data[0]);
        } else {
          setAgentData({
            agent_ID: '772785',
            agent_email: 'tester1.webperfection@gmail.com',
            agent_facebook: '',
            agent_instagram: '',
            agent_linkedin: '',
            agent_mobile: '5677767575',
            agent_phone: '6789999655',
            agent_pinterest: '',
            agent_position: 'developer',
            agent_skype: '',
            agent_title: 'Agent test',
            agent_twitter: '',
            agent_whatsapp: '',
            featured_image_url:
              'https://www.surflokal.com/wp-content/uploads/2023/06/user2.png',
            first_name: 'John',
            last_name: 'doe',
            threads: 'https://www.threads.net/?hl=en',
          });
        }
      });
    };
    fetchUserDetails();
  }, []);

  // ================================ Make Phone Call ================================
  const makePhoneCall = () => {
    let phoneNumber = agentData?.agent_phone;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailLink = () => {
    const email = agentData?.agent_email;
    const subject = '';
    const body = '';
    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(error =>
      console.error('Error opening email app:', error),
    );
  };

  const videoCall = () => {
    setShowVideoCall(true);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {showVideoCall ? (
          <View>
            <TestVideoCall
              agentData={agentData}
              userDetailsData={userDetails}
              agentName={agentData?.first_name + ' ' + agentData?.last_name}
              setShowVideoCall={setShowVideoCall}
            />
          </View>
        ) : (
          <>
            <View style={styles.headermain}>
              <TouchableOpacity
                style={styles.leftarrow}
                onPress={() => {
                  navigation.goBack();
                }}>
                <Image
                  style={styles.siderleftimage}
                  source={Images.leftnewarrow}></Image>
              </TouchableOpacity>
              <View style={styles.centertext}>
                <Text style={styles.centertextmain}>Contact My Agent</Text>
              </View>
              <TouchableOpacity
                style={styles.rightmenu}
                onPress={() => navigation.goBack()}>
                <Image
                  source={Images.menu}
                  style={styles.imagedata}
                  animation="flipInY"
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.covertop}>
              <View style={[styles.userText, {}]}>
                <View style={styles.userimagecover}>
                  {agentData?.featured_image_url ? (
                    <Image
                      source={{uri: agentData?.featured_image_url}}
                      style={styles.imagemain}
                    />
                  ) : (
                    <Image style={styles.imagemain} source={Images.user} />
                  )}
                </View>
                <Text style={styles.titleuser}>
                  {agentData
                    ? agentData?.first_name + ' ' + agentData?.last_name ??
                      '--- ---'
                    : '--- ---'}
                </Text>
              </View>
              <View style={styles.informationicons}>
                <View style={styles.maininfoicons}>
                  <TouchableOpacity
                    style={[styles.iconcover, {backgroundColor: '#11b03e'}]}
                    onPress={() => {
                      makePhoneCall();
                    }}>
                    <Image
                      style={styles.iconscovermain}
                      source={Images.telephonecall}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.iconcover, {backgroundColor: '#19a4df'}]}
                    onPress={() => {
                      navigation.navigate('ChatSearch');
                      setShowVideoCall(false);
                    }}>
                    <Image
                      style={styles.iconscovermain}
                      source={Images.messenger}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconcover, {backgroundColor: '#5f3d1c'}]}
                    onPress={() => {
                      agentData && userDetails
                        ? setShowVideoCall(true)
                        : Alert.alert('Loading');
                    }}>
                    <Image
                      style={styles.iconscovermain}
                      source={Images.videochat}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleEmailLink();
                    }}
                    style={[styles.iconcover, {backgroundColor: Colors.black}]}>
                    <Image
                      style={styles.iconscovermain}
                      source={Images.email}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.textdes}>
                3010 N Military trl {'\n'}
                Suite 310 {'\n'}
                Boca Raton, FL 33431
              </Text>
              <View style={styles.view1}>
                <View>
                  <View style={styles.slideOuter}>
                    <TouchableOpacity style={styles.buttonscover}>
                      <View style={styles.buttoninnercovermain}>
                        <TouchableOpacity
                          onPress={() => {
                            makePhoneCall();
                            // startsCall();
                          }}
                          style={styles.buttonview}>
                          <Text style={styles.buttonText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleEmailLink()}
                          style={styles.buttonview}>
                          <Text style={styles.buttonText}>E-mail</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('ChatSearch')}
                          style={styles.buttonview}>
                          <Text style={styles.buttonText}>Chat</Text>
                        </TouchableOpacity>
                      </View>
                      <View></View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.bottomelement}>
                <LottieView
                  style={styles.vanimage}
                  source={require('../../assets/animations/SurfVan.json')}
                  autoPlay
                  loop
                />
              </View>
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)',
  },
  buttonview: {
    textAlign: 'center',
    borderRadius: 100,
    backgroundColor: Colors.surfblur,
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    marginBottom: 8,
    marginRight: 6,
    alignSelf: 'center',
    paddingHorizontal: 18,
    textAlign: 'center',
    justifyContent: 'center',
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
  view1: {flexDirection: 'column'},
  imagedata: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,
    resizeMode: 'contain',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  mainareacover: {marginHorizontal: 7},
  iconcover: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,

    padding: 8,
    display: 'flex',
    borderRadius: 100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },

  modalOverlay1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '98%',
    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)',
  },
  iconcover2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    padding: 8,
    backgroundColor: Colors.PrimaryColor,
    borderRadius: 100,
    position: 'absolute',
    right: 0,
    top: 0,
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
  informationicons: {alignItems: 'center', marginBottom: 30, marginTop: 20},
  maininfoicons: {flexDirection: 'row', alignItems: 'center'},
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
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
  headermain: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 2,
  },
  leftarrow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 12,
    justifyContent: 'flex-start',
    top: 13,
    width: 50,
    height: 50,
  },
  siderleftimage: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
  },

  userImageStyle: {height: 40, width: 40, resizeMode: 'cover'},

  centertext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centertextmain: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  rightmenu: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  covertop: {width: '100%', height: '100%'},
  userText: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  userimagecover: {
    flexDirection: 'column',
    marginTop: 0,
    borderRadius: 100,
    maxWidth: 122,
    height: 122,
    width: 122,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagemain: {
    resizeMode: 'contain',
    maxWidth: 122,
    height: 122,
    width: 122,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleuser: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    paddingTop: 16,
    textAlign: 'center',
  },
  iconscovermain: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  textdes: {
    marginBottom: 16,
    fontSize: 18,
    textAlign: 'center',
    color: Colors.black,
    fontFamily: 'Poppins-Regular',
  },
  buttonscover: {
    width: '100%',
    padding: 12,
  },
  buttoninnercovermain: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    textAlign: 'center',
    marginBottom: 8,
  },
  bottomelement: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vanimage: {height: 150, width: 200},
});

export default ContactMyAgent;
