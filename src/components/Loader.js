import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';
const Loader = () => {
  const rotation = useSharedValue(0);
  const rotation1 = useSharedValue(0);
  const rotation3 = useSharedValue(0);

  useEffect(() => {
    startRotationAnimation(rotation, 2000);
    startRotationAnimation(rotation1, 1500);
    startRotationAnimation(rotation3, 1000);

    return () => {
      cancelAnimation(rotation);
      cancelAnimation(rotation1);
      cancelAnimation(rotation3);
    };
  }, []);

  const startRotationAnimation = (animatedValue, duration) => {
    animatedValue.value = withRepeat(
      withTiming(360, {
        duration: duration,
        easing: Easing.linear,
      }),
      -1,
    );
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  const animatedStyles1 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation1.value}deg`,
        },
      ],
    };
  });

  const animatedStyles3 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation3.value}deg`,
        },
      ],
    };
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 999,
      }}>
      <View style={styles.container}>
        <LottieView
          style={{
            height: DeviceInfo.getDeviceType() === 'Tablet' ? 300 : 200,
            width: DeviceInfo.getDeviceType() === 'Tablet' ? 300 : 200,
          }}
          source={require('../assets/animations/loaderactivity.json')}
          autoPlay
          loop
        />
      </View>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
    backgroundColor: 'transparent',
  },
  spinner: {
    height: 80,
    width: 80,
    borderRadius: 100,
    borderWidth: 2,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#244aaf',
    position: 'absolute',
  },
  spinner2: {
    height: 70,
    width: 70,
    borderRadius: 100,
    borderWidth: 2,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#b07d8c',
    position: 'absolute',
  },
  spinner3: {
    height: 60,
    width: 60,
    borderRadius: 100,
    borderWidth: 2,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#0dc3f8',
    position: 'absolute',
  },
});
