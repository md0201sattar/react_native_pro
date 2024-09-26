import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import {useSelector, useDispatch} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import LottieView from 'lottie-react-native';
import styleSheet from '../../components/Video/styles';
import {getVedioCallToken} from '../../modules/getVedioCallToken';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import BASEURl from '../../services/Api';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ContactSurf = () => {
  const [agentData, setAgentData] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const navigation = useNavigation();
  const styles1 = StyleSheet.create(styleSheet);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState('');
  const twilioRef = useRef(null);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [animation, setAnimatiion] = useState(new Animated.Value(0));
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const handleOpen = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const handleClose = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]).then(result => {
        if (
          result['android.permission.ACCESS_COARSE_LOCATION'] &&
          result['android.permission.CAMERA'] &&
          result['android.permission.ACCESS_FINE_LOCATION'] &&
          result['android.permission.RECORD_AUDIO'] === 'granted'
        ) {
          this.setState({
            permissionsGranted: true,
          });
        } else if (
          result['android.permission.ACCESS_COARSE_LOCATION'] ||
          result['android.permission.CAMERA'] ||
          result['android.permission.ACCESS_FINE_LOCATION'] ||
          result['android.permission.RECORD_AUDIO'] === 'never_ask_again'
        ) {
          this.refs.toast.show(
            'Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue',
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    if (modalVisible) {
      handleOpen();
    } else {
      handleClose();
    }
  }, [modalVisible]);

  const screenHeight = Dimensions.get('window').height;

  const backdrop = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 0.01],
          outputRange: [screenHeight, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0.01, 0.5],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
  };

  const handleModalAnimation = () => {
    Animated.timing(slideAnimation, {
      toValue: modalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    handleModalAnimation();
  }, [modalVisible]);

  useEffect(() => {
    fetchAgentData();
  }, []);

  const getToken = async () => {
    await dispatch(getVedioCallToken({userID: 3, friend: 18}))
      .then(res => {
        twilioRef.current.connect({accessToken: res.payload.data.token});
        setStatus('connecting');
      })
      .catch(e => {});
  };
  const getToken1 = async () => {
    await dispatch(getVedioCallToken({userID: 18, friend: 3}))
      .then(res => {
        twilioRef.current.connect({accessToken: res.payload.data.token});
        setStatus('connecting');
      })
      .catch(e => {
        alert(JSON.stringify('e ==> ' + e));
      });
  };
  const _onConnectButtonPress = () => {
    getToken();
  };

  const _onConnectButtonPress1 = () => {
    getToken1();
  };
  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
    setStatus('disconnected');
    console.log('End Press');
  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
    console.log('Flip Button');
  };

  const _onRoomDidConnect = ({roomName, error}) => {
    console.log('onRoomDidConnect: ', roomName);
    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({roomName, error}) => {
    console.log('[Disconnect]ERROR: ', error);
    setStatus('disconnected');
    setModalVisible(false);
  };

  const _onRoomDidFailToConnect = error => {
    console.log('[FailToConnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          {participantSid: participant.sid, videoTrackSid: track.trackSid},
        ],
      ]),
    );
  };

  const _onParticipantRemovedVideoTrack = ({participant, track}) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);
    setModalVisible(false);
    setVideoTracks(videoTracksLocal);
  };

  useEffect(() => {
    {
      status === 'connected' || status === 'connecting'
        ? setModalVisible(true)
        : setModalVisible(false);
    }
    console.log('status', status);
  }, [status]);
  const fetchAgentData = async () => {
    const id = await AsyncStorage.getItem('userId');

    try {
      const response = await axios.get(
        BASEURl + 'webapi/v1/agent/?userID=' + id,
      );
      if (response.data.success) {
        const agentData = response.data.data[0];
        setAgentData(agentData);
      }
    } catch (error) {}
  };
  const makePhoneCall = () => {
    let phoneNumber = +18885083174;
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const handleEmailLink = () => {
    const email = 'homes@surflokal.com';

    const subject = '';
    const body = '';

    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(error =>
      console.error('Error opening email app:', error),
    );
  };
  const whatsapp = () => {
    const phone = '+18885083174';
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${''}`);
  };

  return (
    <SafeAreaView
      style={[styles.container, Platform.OS === 'android' && {flex: 1}]}>
      <View style={styles.mainheader}>
        <TouchableOpacity
          style={styles.leftcoverarrow}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image style={styles.arrowimage} source={Images.leftnewarrow}></Image>
        </TouchableOpacity>
        <View style={styles.centercover}>
          <Text style={styles.headingtext}>Contact surf lokal</Text>
        </View>
        <TouchableOpacity
          style={styles.menutoggle}
          onPress={() => navigation.goBack()}>
          <Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.maincontent}>
        <View style={styles.applogocover}>
          <Image source={Images.appLogo} style={styles.applogoimg} />
        </View>
        <View style={styles.informationicons}>
          <View style={styles.maininfoicons}>
            <TouchableOpacity
              style={[styles.iconcover, {backgroundColor: '#11b03e'}]}
              onPress={() => {
                makePhoneCall();
              }}>
              <Image style={styles.calldes} source={Images.telephonecall} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconcover, {backgroundColor: '#19a4df'}]}
              onPress={() => {
                navigation.navigate('ChatSearch');
              }}>
              <Image style={styles.calldes} source={Images.messenger} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconcover, {backgroundColor: '#5f3d1c'}]}
              onPress={() => {}}>
              <Image style={styles.calldes} source={Images.videochat} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleEmailLink();
              }}
              style={[styles.iconcover, {backgroundColor: Colors.black}]}>
              <Image style={styles.calldes} source={Images.email} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.textcover}>
          3010 N Military trl {'\n'}
          Suite 310 {'\n'}
          Boca Raton, FL 33431
        </Text>
        <View style={styles.view1}>
          <View>
            <View style={styles.slideOuter}>
              <TouchableOpacity style={styles.buttonscover}>
                <View style={styles.buttonaligned}>
                  <TouchableOpacity
                    onPress={() => makePhoneCall()}
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

          <View style={styles.socialmedia}>
            <TouchableOpacity style={styles.socialcover}>
              <LottieView
                style={styles.socialanimation}
                source={require('../../assets/animations/facebook.json')}
                autoPlay
                loop
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialcover}>
              <LottieView
                style={styles.socialanimation}
                source={require('../../assets/animations/twitter.json')}
                autoPlay
                loop
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialcover}>
              <LottieView
                style={styles.socialanimation}
                source={require('../../assets/animations/instagram.json')}
                autoPlay
                loop
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buscover}>
          <LottieView
            style={styles.busanimation}
            source={require('../../assets/animations/SurfVan.json')}
            autoPlay
            loop
          />
        </View>
      </ScrollView>

      {modalVisible && (
        <Animated.View
          style={[
            backdrop,
            {
              position: 'absolute',
              left: 0,
              right: 0,
              height: screenHeight,
              top: 0,
            },
          ]}>
          <View style={styles.view2}>
            <View style={styles.view3}>
              <View style={styles.view4}>
                {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                  return (
                    <TwilioVideoParticipantView
                      style={styles1.remoteVideo}
                      key={trackSid}
                      trackIdentifier={trackIdentifier}
                    />
                  );
                })}
              </View>

              <View style={styles.view4}>
                <TwilioVideoLocalView
                  enabled={true}
                  style={styles1.localVideo}
                />
              </View>
            </View>
            <View style={styles.viewstyle}>
              <TouchableOpacity
                style={styles.opacity1}
                onPress={() => {
                  setModalVisible(false);
                  _onEndButtonPress();
                }}>
                <View style={styles.twilloviewstyle}>
                  <Image
                    style={styles.calldownstyle}
                    source={require('../../assets/images/calldown.png')}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.opacity1}
                onPress={() => {
                  _onMuteButtonPress();
                }}>
                <View style={styles.muteviewstyle}>
                  <Image
                    style={styles.muteimage}
                    source={require('../../assets/images/mutemc.png')}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.opacity1}>
                <View style={styles.videocallview}>
                  <Image
                    style={styles.videocallimagestyle}
                    source={require('../../assets/images/novideo.png')}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.opacity1}
                onPress={() => {
                  _onFlipButtonPress();
                }}>
                <View style={styles.camerflipstyle}>
                  <Image
                    style={styles.videocallimagestyle}
                    source={require('../../assets/images/flipre.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <TwilioVideo
              ref={twilioRef}
              onRoomDidConnect={_onRoomDidConnect}
              onRoomDidDisconnect={_onRoomDidDisconnect}
              onRoomDidFailToConnect={_onRoomDidFailToConnect}
              onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
              onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
            />
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
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
  view2: {
    backgroundColor: '#252525',
    justifyContent: 'space-between',
  },
  opacity1: {marginHorizontal: 5},
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
  view1: {flexDirection: 'column'},
  view3: {height: '100%'},
  view4: {height: '50%', width: '100%'},
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
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,

    resizeMode: 'contain',
  },
  buttonText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 14,
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

    padding: DeviceInfo.getDeviceType() === 'Tablet' ? 16 : 8,
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
  informationicons: {alignItems: 'center', marginBottom: 50, marginTop: 25},
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
  mainheader: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 2,
  },
  leftcoverarrow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 12,
    justifyContent: 'flex-start',
    top: 13,
    width: 50,
    height: 50,
  },
  arrowimage: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  centercover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menutoggle: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  headingtext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  maincontent: {height: '100%', width: '100%'},
  applogocover: {
    flexDirection: 'column',
    marginTop: 0,
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 10,
  },
  applogoimg: {
    maxWidth: DeviceInfo.getDeviceType() === 'Tablet' ? 280 : 180,
    resizeMode: 'contain',
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 200 : 150,
  },
  calldes: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  textcover: {
    marginBottom: 16,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 32 : 18,
    textAlign: 'center',
    color: Colors.black,
    fontFamily: 'Poppins-Regular',
  },
  buttonscover: {
    width: '100%',
    padding: 12,
  },
  buttonaligned: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    textAlign: 'center',
    marginBottom: 8,
  },
  socialmedia: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialcover: {
    height: 38,
    width: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialanimation: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 64 : 38,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 64 : 38,
  },
  buscover: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewstyle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  twilloviewstyle: {
    backgroundColor: 'rgba(255, 0, 0, 0.4)',
    height: 55,
    width: 55,
    alignSelf: 'center',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calldownstyle: {
    height: 25,
    width: 25,
    tintColor: Colors.white,
    resizeMode: 'contain',
  },
  muteviewstyle: {
    backgroundColor: 'rgba(36, 74, 175, 0.5)',
    height: 55,
    width: 55,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muteimage: {height: 20, width: 20, resizeMode: 'contain'},

  videocallview: {
    backgroundColor: Colors.BorderColor,
    height: 55,
    width: 55,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videocallimagestyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  camerflipstyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: 55,
    width: 55,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busanimation: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 250 : 150,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 250 : 150,
  },
});

export default ContactSurf;
