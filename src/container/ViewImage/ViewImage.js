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
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import DeviceInfo from 'react-native-device-info';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const ViewImage = props => {




  const flatListRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height
  );
  const windowDimensions = useWindowDimensions();
  const image = props.route.params
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
          style={styles.secondview}>

<TouchableOpacity
            style={styles.whitecloseTouchableopacity}
            onPress={() => navigation.goBack()}  >
             <Image
            style={styles.leftarrow}
            source={Images.leftnewarrow}></Image>
          </TouchableOpacity>
        </View>
        <View>


          <Image source={{ uri: image.image.guid }} style={styles.slide}

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

  secondview:{
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

  whitecloseTouchableopacity:{
    alignItems: 'center',
    position: "absolute",
    left:-15,
    top: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
width:50,
height:50,
  },
  leftarrow:{
    width: DeviceInfo.getDeviceType() === 'Tablet'?57:27,
    height: DeviceInfo.getDeviceType() === 'Tablet'?57:27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode:"contain",
  
  },
  slideOuter: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
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

export default ViewImage;
