import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from "react-native";
import React, { Component, useEffect, useRef, useState } from "react";
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from "react-native-twilio-video-webrtc";
import { useSelector, useDispatch } from "react-redux";

import styleSheet from "./styles";
import { getVedioCallToken } from "../../modules/getVedioCallToken";

const styles = StyleSheet.create(styleSheet);

const Video = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState("disconnected");
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState("");
  const twilioRef = useRef(null);
  const dispatch = useDispatch();


  const getToken = async () => {
    await dispatch(getVedioCallToken({ userID: 3, friend: 18 })).then((res) => {
      twilioRef.current.connect({ accessToken: res.payload.data.token });
      setStatus("connecting" + token);
    }).catch((e) => {
      alert(JSON.stringify(e))
    })
  }
  const getToken1 = async () => {
    await dispatch(getVedioCallToken({ userID: 18, friend: 3 })).then((res) => {
      twilioRef.current.connect({ accessToken: res.payload.data.token });
      setStatus("connecting" + token);
    }).catch((e) => {
      alert(JSON.stringify(e))
    })
  }
  const _onConnectButtonPress = () => {
    getToken()
  };

  const _onConnectButtonPress1 = () => {
    getToken1()
  };
  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();

  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
  };

  const _onRoomDidConnect = ({ roomName, error }) => {
    console.log("onRoomDidConnect: ", roomName);
    setStatus("connected");
  };

  const _onRoomDidDisconnect = ({ roomName, error }) => {
    console.log("[Disconnect]ERROR: ", error);

    setStatus("disconnected");
  };

  const _onRoomDidFailToConnect = (error) => {
    console.log("[FailToConnect]ERROR: ", error);

    setStatus("disconnected");
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log("onParticipantAddedVideoTrack: ", participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ])
    );
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log("onParticipantRemovedVideoTrack: ", participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
  };

  return (
    <View style={styles.container}>
      {status === "disconnected" && (
        <View>
          <Text style={styles.welcome}>React Native Twilio Video {status}</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={token}
            defaultValue="728080da0f44511d889eaeaae32a2ced"
            onChangeText={(text) => setToken('728080da0f44511d889eaeaae32a2ced')}
          ></TextInput>
          <Button
            title="Connect"
            style={styles.button}
            onPress={_onConnectButtonPress}
          ></Button>

          <Button
            title="Connect1"
            style={styles.button}
            onPress={_onConnectButtonPress1}
          ></Button>
        </View>
      )}

      {(status === "connected" || status === "connecting") && (
        <View style={styles.callContainer}>
          {status === "connected" && (
            <View style={styles.remoteGrid}>
              {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                return (
                  <TwilioVideoParticipantView
                    style={styles.remoteVideo}
                    key={trackSid}
                    trackIdentifier={trackIdentifier}
                  />
                );
              })}
            </View>
          )}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onEndButtonPress}
            >
              <Text style={{ fontSize: 12 }}>End</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onMuteButtonPress}
            >
              <Text style={{ fontSize: 12 }}>
                {isAudioEnabled ? "Mute" : "Unmute"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onFlipButtonPress}
            >
              <Text style={{ fontSize: 12 }}>Flip</Text>
            </TouchableOpacity>
            <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
          </View>
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
}

export default Video