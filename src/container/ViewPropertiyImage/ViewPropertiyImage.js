import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {store} from '../../redux/store';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ViewPropertiyImage = props => {
  const [data, setData] = useState([]);

  const [orientation, setOrientation] = useState('portrait');
  const [agentData, setAgentData] = useState([0]);

  const scrollViewRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({y: 0, animated: true});
  };
  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 0);
  };
  const property = data;
  useEffect(() => {
    const ddd =
      store.getState().getPopertiesDetailsReducer.getPopertiesDetails?.data;
    setData(ddd);
    setAgentData(store.getState().getAgentReducer.getAgentData.data);

    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };

    const handleChangeOrientation = () => {
      setOrientation(isPortrait() ? 'portrait' : 'landscape');
    };
    Dimensions.addEventListener('change', handleChangeOrientation);
  }, []);

  const makePhoneCall = () => {
    let phoneNumber = agentData[0]?.agent_phone;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const navigation = useNavigation();

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <View style={styles.innercontainer}>
          <ScrollView ref={scrollViewRef} onScroll={handleScroll}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SingleImage', {
                  imageUri: property?.featured_image_src,
                })
              }>
              <Image
                source={{uri: property?.featured_image_src}}
                style={styles.slide}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Videoplay', {
                  videoView: property.property_gallery.property_video,
                })
              }>
              <Image
                source={{uri: property?.featured_image_src}}
                style={styles.slide}
              />
              <View style={styles.videoplayer}>
                <Image
                  source={Images.VideoPlay}
                  style={styles.videoplaterstyle}
                />
              </View>
            </TouchableOpacity>
            {property?.property_gallery?.Gallery.length > 0 ? (
              property?.property_gallery.Gallery.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate('ViewImage', {image})}
                  style={styles.slideOuter}>
                  <Image source={{uri: image.guid}} style={styles.slide} />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.nofound}>No images found.</Text>
            )}
          </ScrollView>
          {isScrolled && (
            <TouchableOpacity onPress={scrollToTop} style={styles.buttonscroll}>
              <Image source={Images.downArrow} style={styles.toptoup} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.leftarrowicon}
            onPress={() => navigation.goBack()}>
            <Image
              style={styles.leftinnerarrow}
              source={Images.leftnewarrow}></Image>
          </TouchableOpacity>

          <View
            style={styles.bottomview}>
            <View
              style={styles.secondbottom}>
              <TouchableOpacity
                style={styles.opacity1}
                onPress={() => {
                  makePhoneCall();
                }}>
                <Image
                  source={Images.newcall}
                  style={styles.callstyle}></Image>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.right}
                onPress={() => navigation.navigate('ChatSearch')}>
                <Image
                  source={Images.chatnew}
                  style={styles.callstyle}></Image>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('BookaTour', {
                  ID: '',
                  PropID: postid?.ID,
                  user_id: '',
                  user2_id: '',
                });
              }}
              style={styles.booktourtouchableopacity}>
              <Text
                style={styles.textstyle}>
                Schedule a Tour
              </Text>
              <LottieView
                style={styles.lottiegif}
                source={require('../../assets/animations/SurfVan.json')}
                autoPlay
                loop
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.white,
  },
  loaderstyle: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,.7)',
    position: 'absolute',
    zIndex: 99,
    left: 0,
    top: 0,
  },
  slideOuter: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  mr10: {marginRight: 10},
  slide: {
    width: screenWidth,
    height: screenHeight / 2.5,

    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  opacity1:{
    marginRight: 16,
  },
  right:{
    right: 20,
  },
  lottiegif:{
    height: 100,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 300 : 90,
    position: 'relative',
  },
  imagedata: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.black,
    transform: [{rotate: '90deg'}],
  },
  booktourtouchableopacity:{
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 50,
    lineHeight: 12,
    borderWidth: 2,
    backgroundColor: Colors.surfblur,
    borderColor: Colors.white,
    height: 45,
    width: '62%',
  },
 
  textstyle:{
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 30 : 18,
    color: Colors.white,
    textAlign: 'center',
    left: 10,
    fontFamily: 'Poppins-Medium',
    position: 'relative',
    letterSpacing: 0,
  },
  callstyle:{
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 68 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 68 : 26,
    resizeMode: 'contain',
  },
  submitcover: {
    height: 35,
    width: '45%',
    borderRadius: 5,
    backgroundColor: Colors.PrimaryColor,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoplayer: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    transform: [{translateX: -12}, {translateY: -12}],
  },
  submittxt: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  leftarrowicon: {
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: 50,
    height: 50,
  },
  buttonscroll: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray,
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  bottomview:{
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 8,
    height: 55,
  },
  secondbottom:{
    alignItems: 'center',
    flexDirection: 'row',
    width: '30.33%',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  innercontainer: {
    height: '100%',
    width: '100%',
  },
  videoplaterstyle: {width: 80, height: 80, tintColor: 'white'},
  toptoup: {
    transform: [{rotate: '180deg'}],
    width: 12,
    height: 12,
    tintColor: Colors.black,
    resizeMode: 'contain',
  },
  leftinnerarrow: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 57 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 57 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
    tintColor: 'white',
  },
  nofound: {
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    color: 'black',
  },

});

export default ViewPropertiyImage;
