import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions
} from 'react-native';
import 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const Videoplay = props => {
  const flatListRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height
  );
  const windowDimensions = useWindowDimensions();
  const route = useRoute();
  const { videoView } = route.params;

  useEffect(() => {
    const updateOrientation = () => {
      setIsLandscape(windowDimensions.width > windowDimensions.height);
    };
    Dimensions.addEventListener('change', updateOrientation);
  }, [windowDimensions]);
  const navigation = useNavigation();


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstView}>
      <View
          style={styles.arrowview}>

<TouchableOpacity
            style={styles.arrowTouchableopacity}
            onPress={() => navigation.goBack()}  >
             <Image
            style={styles.imagestyle}
            source={Images.leftnewarrow}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.webviewstyle}>

            <WebView
              style={styles.webstyle}
              source={{ uri: videoView }}
              mediaPlaybackRequiresUserAction={false}
            />

          </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  firstView:{ height: '100%', width: '100%', justifyContent: 'center' },
  slideOuter: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowview:{
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    overflow: 'visible',
    zIndex: 99,
    position: 'absolute',
    top: 10,
  },
  imagestyle:{
    width:27,
    height: 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode:"contain",
    tintColor:"#D3D3D3"
  },
  webviewstyle:{ height: 200, width: '100%' },

  webstyle:{ height: 400, width: '100%' },
  arrowTouchableopacity:{
    alignItems: 'center',
    position: "absolute",
    left:10,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
width:50,
height:50,
  },
  slide: {
    width: "110%",
    height: screenHeight,
    resizeMode: 'contain',
    alignSelf: 'center'

  },
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
});




export default Videoplay