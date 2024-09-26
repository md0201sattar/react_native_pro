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
import { useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const SingleImage = props => {



  const flatListRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height
  );
  const windowDimensions = useWindowDimensions();
  const route = useRoute();
  const { imageUri } = route.params;

  useEffect(() => {
    const updateOrientation = () => {
      setIsLandscape(windowDimensions.width > windowDimensions.height);
    };

    Dimensions.addEventListener('change', updateOrientation);


  }, [windowDimensions]);


  const navigation = useNavigation();


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstview}>
      <View
          style={styles.whitecloseview}>

          <TouchableOpacity
            style={styles.whitecloseTouchableopacity}
            onPress={() => navigation.goBack()}
          >
            <Animatable.Image
              source={Images.whiteclose}
              style={styles.imagestyle}
              animation="flipInY"
            />
          </TouchableOpacity>
        </View>
        <View>


          <Image source={{ uri: imageUri }} style={styles.slide}

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
  firstview:{ height: '100%', width: '100%', justifyContent: 'center' },

  whitecloseview:{
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
    right:-12,
    top: -6,
    backgroundColor: Colors.surfblur,
    height: 25,
    width: 25,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  slideOuter: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagestyle:{
    height: 10,
    width: 10,
    resizeMode: 'contain',
    tintColor: Colors.white,
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




export default SingleImage