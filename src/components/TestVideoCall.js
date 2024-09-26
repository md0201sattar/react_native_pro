import React, {Component, useEffect, useRef, useState} from 'react';
import {Alert, Image, PermissionsAndroid, StyleSheet} from 'react-native';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';
import {useDispatch} from 'react-redux';

import axios from 'axios';
import moment from 'moment';
import {Modal} from 'react-native';

export const TestVideoCall = ({
  agentName,
  setShowVideoCall,
  userDetailsData,
  Token,
  agentData,
}) => {
  const dispatch = useDispatch();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState('');
  const twilioRef = useRef(null);
  const [isButtonDisplay, setIsButtonDisplay] = useState(true);
  const [connectedRoomID, setConnectedRoomID] = useState('');
  const [newRoomID, setNewRoomID] = useState('');
  const [userDetails, setUserDetails] = useState(userDetailsData ?? '');
  //
  //
  //
  const [createRoomError, setCreateRoomError] = useState(false);
  const [chatShowError, setChatShowError] = useState(false);
  const [notificationError, setNotificationError] = useState(false);
  const [triggerFlag, setTriggerFlag] = useState(0);

  // console.log(
  //   'createRoomError',
  //   createRoomError,
  //   'chatShowError',
  //   chatShowError,
  //   'notificationError',
  //   notificationError,
  // );

  useEffect(() => {
    if (createRoomError || chatShowError || notificationError) {
      setTriggerFlag(Math.random() * 101);
    }
  }, [createRoomError, chatShowError, notificationError]);

  useEffect(() => {
    // Ask for permissions when the component mounts
    async function requestPermissions() {
      try {
        const userResponse = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        // You can handle the permission responses here
      } catch (err) {
        console.log('Permissions Error :', err);
      }
    }
    requestPermissions();
  }, []);

  useEffect(() => {
    const APIFunctions = async () => {
      axios
        .get(
          `https://meet.surflokal.com/getToken?userName=${userDetails?.authToken}&roomName=${userDetails?.ID}`,
        )
        .then(async res => {
          if (res?.status === 200) {
            // console.log('getToken res', res);
            setToken(res.data);

            const formData = new FormData();
            formData.append('agentId', agentData?.agent_ID);
            formData.append('userId', userDetails?.ID);
            formData.append('roomId', userDetails?.ID);
            formData.append('date', moment().format('YYYY-MM-DD HH:MM:SS'));
            formData.append('status', 'scheduled');
            formData.append('userName', userDetails?.display_name);
            var myHeaders = new Headers();
            myHeaders.append('security_key', 'SurfLokal52');
            myHeaders.append('access_token', userDetails?.authToken);
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: formData,
              redirect: 'follow',
            };

            await fetch(
              'https://www.surflokal.com/webapi/v1/twilio/room/create.php',
              requestOptions,
            )
              .then(response => {
                // console.log(
                //   'Create Room API => Server Response Status:',
                //   response.status,
                // );
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                  return response.json();
                } else {
                  return response.text();
                }
              })
              .then(async data => {
                if (typeof data === 'string') {
                  console.log('Non-JSON response:', data);
                } else {
                  console.log('twilio/room/create JSON Data:', data);
                  if (data?.status === 'success') {
                    setCreateRoomError(false);
                    var myHeaders = new Headers();
                    myHeaders.append('security_key', 'SurfLokal52');
                    myHeaders.append('access_token', userDetails?.authToken);
                    var requestOptions = {
                      method: 'GET',
                      headers: myHeaders,
                      redirect: 'follow',
                    };
                    await fetch(
                      `https://surf-lokal-middleware.vercel.app/webapi/v1/twilio/chat/show.php?userId=${agentData?.agent_email}`,
                      requestOptions,
                    )
                      .then(chatResult => chatResult.json())
                      .then(async chatResult => {
                        console.log('twilio/chat/show', chatResult);
                        if (chatResult?.data[0]?.token) {
                          setChatShowError(false);
                          var myHeaders = new Headers();
                          myHeaders.append('security_key', 'SurfLokal52');
                          myHeaders.append(
                            'access_token',
                            userDetails?.authToken,
                          );
                          myHeaders.append('Content-Type', 'application/json');
                          var raw = JSON.stringify({
                            title: userDetails?.user_email,
                            body: agentData?.agent_ID,
                            fcmTokens: chatResult?.data[0]?.token,
                          });
                          var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow',
                          };
                          return fetch(
                            'https://surf-lokal-middleware.vercel.app/firebase/notification',
                            requestOptions,
                          )
                            .then(response => {
                              console.log(
                                'Notification API => Server Response Status:',
                                response.status,
                              );
                              if (!response.ok) {
                                throw new Error(
                                  `HTTP error! Status: ${response.status}`,
                                );
                              }
                              // Check if the response is JSON before attempting to parse
                              const contentType =
                                response.headers.get('content-type');
                              if (
                                contentType &&
                                contentType.includes('application/json')
                              ) {
                                return response.json();
                              } else {
                                // Handle non-JSON response (e.g., plain text error message)
                                return response.text();
                              }
                            })
                            .then(data => {
                              console.log(
                                'firebase/notification JSON Data:',
                                data,
                              );
                              setNotificationError(false);
                              return data;
                            })
                            .catch(error => {
                              console.error(
                                'firebase/notification Error:',
                                error,
                              );
                              setNotificationError(true);
                            });
                        } else {
                          setChatShowError(true);
                          Alert.alert('Network Error, Try again later..');
                        }
                      })
                      .catch(error => {
                        console.log('twilio/chat/show error', error);
                        setChatShowError(true);
                      });

                    _onConnectButtonPress(agentData?.agent_ID, res.data);
                  } else {
                    setCreateRoomError(true);
                  }
                }
              })
              .catch(error => {
                console.error('room/create Error:', error);
                setCreateRoomError(true);
              });
            // ===========================================================================================================================
          } else {
            Alert.alert('Client token can`t get..');
          }
        })
        .catch(err => {
          console.log('Token Error:', err);
        });
    };
    APIFunctions();
  }, [triggerFlag]);

  const _onConnectButtonPress = (newRoomID, token) => {
    if (newRoomID !== '') {
      twilioRef.current.connect({roomName: newRoomID, accessToken: token});
    } else {
      twilioRef.current.connect({accessToken: token});
    }
    setStatus('connecting');
  };

  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
    setShowVideoCall(false);
  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
  };

  const _onRoomDidConnect = ({roomName, error}) => {
    console.log('onRoomDidConnect: ', roomName);
    setConnectedRoomID(roomName);
    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({roomName, error}) => {
    console.log('[Disconnect]roomName: ', roomName);
    console.log('[Disconnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = error => {
    console.log('[FailToConnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log('onParticipant AddedVideoTrack: ', participant, track);

    setVideoTracks(originalVideoTracks => {
      originalVideoTracks.set(track.trackSid, {
        participantSid: participant.sid,
        videoTrackSid: track.trackSid,
      });
      return new Map(originalVideoTracks);
    });
  };

  const _onParticipantRemovedVideoTrack = ({participant, track}) => {
    console.log('onParticipant RemovedVideoTrack: ', participant, track);

    setVideoTracks(originalVideoTracks => {
      originalVideoTracks.delete(track.trackSid);
      return new Map(originalVideoTracks);
    });
  };

  return (
    <View style={styles.container}>
      {status === 'disconnected' && (
        <View
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 26,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {' '}
            Loading....
          </Text>
        </View>
      )}

      {(status === 'connected' || status === 'connecting') && (
        <View style={styles.callContainer}>
          {status === 'connected' && (
            <View style={styles.remoteGrid}>
              <TouchableOpacity
                style={styles.remoteVideo}
                onPress={() => setIsButtonDisplay(!isButtonDisplay)}>
                {videoTracks?.size ? (
                  <>
                    {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                      return (
                        <>
                          <TwilioVideoParticipantView
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              height: '100%',
                              width: '85%',
                            }}
                            key={trackSid}
                            trackIdentifier={trackIdentifier}
                          />
                        </>
                      );
                    })}
                  </>
                ) : (
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      marginTop: '40%',
                    }}>
                    <Text style={[styles.userName, {fontSize: 26}]}>
                      {agentName}
                    </Text>
                    <Text style={styles.userName}>Calling...</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            // onRequestClose={() => {
            // setModalVisible(!isModalVisible);
            // }}
          >
            <View style={styles.overlayContainer}>
              <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
            </View>
            <View
              style={{
                display: isButtonDisplay ? 'flex' : 'none',
                position: 'absolute',
                left: 0,
                bottom: 0,
                right: 0,
                height: 100,
                flexDirection: 'row',
                alignItems: 'center',
                // justifyContent: 'space-evenly',
                // zIndex: isButtonDisplay ? 2 : 0,
                backgroundColor: '#F2F2F2',
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                // padding: 10,

                // height: 100,

                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  display: isButtonDisplay ? 'flex' : 'none',
                  width: 45,
                  height: 45,
                  marginLeft: 10,
                  marginRight: 10,
                  borderRadius: 100 / 2,
                  backgroundColor: 'grey',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={_onMuteButtonPress}>
                {!isAudioEnabled ? (
                  <Image
                    source={require('../assets/images/mute-microphone.png')}
                    style={styles.Icon_Styles}
                  />
                ) : (
                  <Image
                    source={require('../assets/images/microphone.png')}
                    style={styles.Icon_Styles}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: isButtonDisplay ? 'flex' : 'none',
                  width: 45,
                  height: 45,
                  marginLeft: 10,
                  marginRight: 10,
                  borderRadius: 100 / 2,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={_onEndButtonPress}>
                <Image
                  source={require('../assets/images/end-call.png')}
                  style={[styles.Icon_Styles, {}]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: isButtonDisplay ? 'flex' : 'none',
                  width: 45,
                  height: 45,
                  marginLeft: 10,
                  marginRight: 10,
                  borderRadius: 100 / 2,
                  backgroundColor: 'grey',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={_onFlipButtonPress}>
                <Image
                  source={require('../assets/images/flip.png')}
                  style={styles.Icon_Styles}
                />
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      )}

      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  callContainer: {
    flex: 1,
    position: 'relative',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },

  remoteGrid: {
    flex: 1,
    // flexDirection: 'column',
    // position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // width: '100%',
    // height: '100%',
    // position: 'relative',
  },

  Icon_Styles: {
    height: '40%',
    width: '40%',
    tintColor: 'white',
  },
  userName: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    paddingTop: 16,
    textAlign: 'center',
  },

  localVideo: {
    // flex: 1,
    height: '100%',
    width: '100%',
    // height: '30%',
    // width: '50%',
    // position: 'absolute',
    // bottom: '17%',
    // // top: '5%',
    // right: '5%',
    // backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 500,
    // backgroundColor: 'red',
    // padding: 10,
    backgroundColor: 'green',
  },
  overlayContainer: {
    // flex: 1,
    height: '25%',
    width: '40%',
    // position: 'absolute',
    bottom: '-60%',
    // top: '5%',
    right: '5%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    // borderRadius: 500,
    // backgroundColor: 'red',
    padding: 10,
    alignSelf: 'flex-end',
  },
});
