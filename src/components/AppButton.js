import React from 'react';
import {

  Text,

  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Colors from '../utils/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

export default function AppButton(props) {
  return (
    <TouchableOpacity
      disabled={props.loading}
      style={[
        {
          width: '85%',
          height: 55,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.primaryBlue,
          borderRadius: 6,
          alignSelf: 'center',
        },
        props.btnStyle,
      ]}
      onPress={props.onPress}>
      {props.loading ? (
        <ActivityIndicator size={'small'} color={'#fff'} />
      ) : (
        <Text
          allowFontScaling={false}
          style={[
            {
              color: Colors.white,
              fontSize: 20 * fontSizeRatio,
              fontWeight: '500',
              color: Colors.white,
              fontFamily: 'Poppins-Regular'
            },
            props.textStyle,
          ]}>
          {props.btnText}
        </Text>
      )}
    </TouchableOpacity>
  );
}
