import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppIntroSlider from 'react-native-app-intro-slider';
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';
import {CommonActions} from '@react-navigation/native';
import {ScreenHeight} from 'react-native-elements/dist/helpers';

const slides = [
  {
    key: 3,
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image:
      DeviceInfo.getDeviceType() === 'Tablet' ? Images.tab3 : Images.tutorial3,
    backgroundColor: '#22bcb5',
    renderContent: () => (
      <View style={{height: '100%'}}>
        <Image style={styles.imageView} source={Images.tutorial3} />
        <LottieView
          style={styles.lottieView}
          source={require('../../assets/animations/SwipeRight.json')}
          autoPlay
          loop
        />
      </View>
    ),
  },
  {
    key: 4,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image:
      DeviceInfo.getDeviceType() === 'Tablet' ? Images.tab4 : Images.tutorial4,
    renderContent: () => (
      <View style={{height: '100%'}}>
        <Image style={styles.imageView} source={Images.tutorial4} />
        <LottieView
          style={styles.lottieView}
          source={require('../../assets/animations/Swipeleft.json')}
          autoPlay
          loop
        />
      </View>
    ),
    backgroundColor: 'black',
  },
];
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export default function AppIntro({navigation}) {
  const renderItem = ({item}) => {
    return (
      <View style={styles.mainWrapper}>
        {item.renderContent ? (
          item.renderContent()
        ) : (
          <Image style={styles.image} source={item.image} />
        )}
      </View>
    );
  };

  const onDone = () => {
    const resetAction = CommonActions.reset({
      index: 1,
      routes: [{name: 'Tabs', params: {screen: 'Home'}}],
    });
    navigation.dispatch(resetAction);
  };

  const renderDone = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          onDone();
        }}
        style={[styles.lottieopacity, {height: screenHeight}]}>
        <View style={styles.renderDone}>
          <LottieView
            style={styles.vanView}
            source={require('../../assets/animations/SurfVan.json')}
            autoPlay
            loop
          />
          <LottieView
            style={styles.leftarrow2}
            source={require('../../assets/animations/leftarrow.json')}
            autoPlay
            loop
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView
      style={{
        height: ScreenHeight,
        width: screenWidth,
      }}>
      <AppIntroSlider
        renderItem={renderItem}
        data={slides}
        activeDotStyle={{backgroundColor: '#707070'}}
        dotClickEnabled={true}
        renderDoneButton={renderDone}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  vanView: {
    height: 100,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 350 : 120,
    position: 'relative',
    left: 30,
  },
  renderDone: {
    height: 100,
    width: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mainWrapper: {height: '100%', position: 'relative'},
  lottieView: {
    height: screenHeight,
    width:
      DeviceInfo.getDeviceType() === 'Tablet' ? screenWidth - 80 : screenWidth,
  },
  imageView: {
    height: ScreenHeight,
    width: screenWidth,
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'stretch',
  },
  image: {
    height: screenHeight,
    width: screenWidth,
    resizeMode: 'contain',
  },
  leftarrow2: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 99 : 99,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 89 : 89,
    marginRight: 30,
    transform: [{rotate: '-180deg'}],
    marginTop: 0,
    position: 'relative',
  },
  lottieopacity: {
    position: 'absolute',
    right: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : -50,
    top: 0,
    marginTop: -30,
  },
});
