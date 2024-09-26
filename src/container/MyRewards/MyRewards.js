import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Slider from 'react-native-slider';
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';

import Fonts from '../../utils/Fonts';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';

const App = ({route}) => {
  // const {triggerFlag} = route?.params;
  const navigation = useNavigation();
  const [meterValue, setMeterValue] = useState(500);
  const [isRewardsSelected, setIsRewardsSelected] = useState(false);
  const [infoShow, setInfoShow] = useState(false);

  const handlePress = () => {
    setIsRewardsSelected(!isRewardsSelected);
  };
  const infoShowFunction = () => {
    setInfoShow(!infoShow);
  };

  return (
    <SafeAreaView style={styles.safeareaviewstyle}>
      <View style={styles.headercover}>
        <TouchableOpacity
          style={styles.headerleftside}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={styles.headerleftimage}
            source={Images.leftnewarrow}></Image>
        </TouchableOpacity>
        <View style={styles.centertext}>
          <Text style={styles.centermaintext}>Surf Rewards</Text>
        </View>
        <TouchableOpacity
          style={styles.rightsidemenu}
          onPress={() => navigation.goBack()}>
          <Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View>
          <View style={styles.mt15}>
            <View style={styles.covermain}>
              <Text style={styles.purchasetext}>Purchase Price</Text>
              <View style={styles.purchasevalue}>
                <Text style={styles.metervaluetext}>${'500000'}</Text>
              </View>
              <View style={styles.slidercover}>
                <Text style={styles.zerotext}>$50,000</Text>

                <Text style={styles.endtext}> $10,000,000</Text>
              </View>
              <Slider
                style={styles.mainslider}
                minimumValue={1000}
                maximumValue={10000}
                minimumTrackTintColor={Colors.darbluec}
                maximumTrackTintColor={Colors.gray}
                thumbTintColor={Colors.white}
                value={meterValue}
                onValueChange={value => setMeterValue(value)}
                step={500}
                thumbStyle={styles.thummain}
                trackStyle={styles.trackmain}
              />
            </View>
          </View>
          <Text style={styles.rebatetext}>Your Rebate </Text>
          <View style={styles.metervalueview}>
            <View
              style={[
                styles.rebatevaluecover,
                {
                  width: '50%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                },
              ]}>
              <Text style={[styles.valuereabtemain]}>
                $
                <Text numberOfLines={1} style={[styles.valuereabtemain]}>
                  {meterValue * 0.0032}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.value1}>
            <View style={styles.buttonscover}>
              <TouchableOpacity
                onPress={() => {
                  handlePress, navigation.navigate('Challenges');
                }}
                style={[
                  styles.rew,
                  {
                    backgroundColor: isRewardsSelected
                      ? 'transparent'
                      : 'transparent',
                    borderColor: isRewardsSelected
                      ? Colors.surfblur
                      : Colors.surfblur,
                  },
                ]}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: isRewardsSelected
                        ? Colors.surfblur
                        : Colors.surfblur,
                      fontFamily: 'Poppins-Regular',
                      fontSize:
                        DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
                    },
                  ]}>
                  Challenges
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handlePress, navigation.navigate('Leaderboard');
                }}
                style={[
                  styles.rew,
                  {
                    backgroundColor: isRewardsSelected
                      ? 'trasnparent'
                      : 'transparent',
                    borderColor: isRewardsSelected
                      ? Colors.surfblur
                      : Colors.surfblur,
                  },
                ]}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: isRewardsSelected
                        ? Colors.surfblur
                        : Colors.surfblur,
                      fontFamily: 'Poppins-Regular',
                      fontSize:
                        DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
                    },
                  ]}>
                  Leaderboard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomelement}>
        <View style={styles.w100}>
          <View style={styles.centerplacement}>
            <LottieView
              style={styles.girlbubble}
              source={require('../../assets/animations/RewardsBubbleGumGirl.json')}
              autoPlay
              loop
            />
            <TouchableOpacity
              style={styles.opacity1}
              onPress={() => {
                infoShowFunction();
              }}>
              <Image source={Images.Information} style={styles.infoalt}></Image>
            </TouchableOpacity>
          </View>
        </View>
        {infoShow ? (
          <View style={styles.InfoMainView}>
            <View style={styles.InfoView}>
              <Text style={styles.mainhead}>
                The rebate is the amount of money surf lokal will give you when
                you close on a property!
              </Text>

              <View style={styles.TriangleView}></View>
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  safeareaviewstyle: {
    backgroundColor: Colors.white,
    height: '100%',
  },

  InfoMainView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '90%',
    backgroundColor: '#EC7B23',
    borderRadius: 10,
    position: 'absolute',
    padding: 12,
    top: -100,
    right: 10,
  },
  mainhead: {
    textAlign: 'center',
    color: 'black',
    fontFamily: 'poppins-Medium',
    fontSize: 16,
  },
  TriangleView: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#EC7B23',
    position: 'absolute',
    bottom: -30,
    right: '50%',
    transform: [{rotate: '180deg'}],
  },
  InfoView: {
    padding: 10,

    marginTop: -2,
  },
  opacity1: {position: 'relative'},

  container: {
    height: '100%',
    backgroundColor: Colors.white,
  },

  textInput: {
    height: 25,
    fontSize: 16,
    marginTop: 30,
    borderBottomWidth: 0.3,
    borderBottomColor: 'black',
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

  rew: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 55 : 45,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 160 : 130,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 18,
    backgroundColor: Colors.surfblur,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  imagedata: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,
    resizeMode: 'contain',
  },
  headercover: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 2,
  },
  headerleftside: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 12,
    justifyContent: 'flex-start',
    top: 13,
    width: 50,
    height: 50,
  },
  headerleftimage: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  centertext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centermaintext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  rightsidemenu: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  mt15: {marginTop: 15},
  covermain: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  purchasetext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 26 : 16,
    fontFamily: Fonts.light,
    color: 'black',
    marginBottom: 0,
    width: '90%',
    textAlign: 'center',
  },
  purchasevalue: {
    flexDirection: 'row',
    width: '33.33%',
    justifyContent: 'center',
  },
  value1: {alignItems: 'center'},
  metervalueview: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metervaluetext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 36 : 16,
    color: '#0165C5',
    fontFamily: 'Poppins-SemiBold',
  },
  slidercover: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  zerotext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 14,
    fontFamily: Fonts.regular,
    color: 'black',
    width: '33.33%',
    marginTop: 22,
  },
  endtext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 14,
    fontFamily: Fonts.regular,
    color: 'black',
    width: '33.33%',
    textAlign: 'right',
    marginTop: 22,
  },
  mainslider: {width: '90%', justifyContent: 'center'},
  thummain: {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.darbluec,
    marginHorizontal: 2,
  },
  trackmain: {
    height: 10,
    borderRadius: 100,
  },
  rebatetext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 32 : 16,
    fontFamily: Fonts.light,
    textAlign: 'center',
    color: 'black',
    paddingTop: 10,
  },

  rebatevaluecover: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingTop: 0,
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: 8,
  },
  dollarstyle: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 123 : 60,
    fontFamily: Fonts.extrabold,
    color: 'black',
  },
  valuereabtemain: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 123 : 60,
    fontFamily: Fonts.extrabold,
    color: 'black',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 100,
  },
  buttonscover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: DeviceInfo.getDeviceType() === 'Tablet' ? '70%' : '90%',
  },
  bottomelement: {position: 'relative', alignItems: 'flex-end', width: '100%'},
  centerplacement: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    width: '50%',
  },
  girlbubble: {height: 150, width: 150},
  w100: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  infoalt: {position: 'absolute', top: 0, right: 0},
});
