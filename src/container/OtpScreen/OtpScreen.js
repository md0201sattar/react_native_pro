import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import {verifyOTP} from '../../modules/verifyOTP';
import AppButton from '../../components/AppButton';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {loginPhoneUser} from '../../modules/phonelogin';
import messaging from '@react-native-firebase/messaging';

const screenHeight = Dimensions.get('window').height;
const fontSizeRatio = screenHeight / 1000;
const OtpInput = props => {
  const [loading, setLoading] = useState(false);
  const {navigation} = props;
  const [otp, setOtp] = useState('');
  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();
  const input4 = useRef();
  const input5 = useRef();
  const input6 = useRef();
  const dispatch = useDispatch();
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [userID, setUserID] = useState('');
  const [userDetails, setUserDetails] = useState('');
  const handleOtpChange = (value, ref) => {
    setOtp(value);
    if (value.length == 1) {
      input2.current.focus();
    } else if (value.length == 2) {
      input3.current.focus();
    } else if (value.length == 3) {
      input4.current.focus();
    } else if (value.length == 4) {
      input5.current.focus();
    } else if (value.length == 5) {
      input6.current.focus();
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const resendOTP = () => {
    setMinutes(1);
    setSeconds(59);
  };
  useEffect(() => {
    getUsrID();
  }, []);

  const getUsrID = async () => {
    const id = await AsyncStorage.getItem('userId');
    const userDetails = await AsyncStorage.getItem('userDetails');

    setUserID(JSON.parse(id));
    setUserDetails(JSON.parse(userDetails));
  };

  // console.log('userDetails => authToken', userDetails);

  const verify_OTP = () => {
    if (otp.length < 6) {
      alert('Enter Valid OTP');
    } else {
      setLoading(true);
      var formdata = new FormData();
      formdata.append('user_id', userID);
      formdata.append('otp', otp);
      console.log('verifyOTP formdata', formdata);
      dispatch(
        verifyOTP({formdata: formdata, authToken: userDetails?.authToken}),
      )
        .unwrap()
        .then(response => {
          console.log('response', response);
          setLoading(false);
          if (response.success) {
            navigation.navigate('AppIntro');
          } else {
            Alert.alert(response?.message);
          }
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainWrapper}>
        <View style={styles.topWrapper}>
          <TouchableOpacity
            onPress={() => {
              clearTimeout();
              navigation.goBack();
            }}>
            <Image source={Images.downArrow} style={styles.image}></Image>
          </TouchableOpacity>
          <Text style={styles.titleText}>surf lokal CRM</Text>
        </View>
        <View style={styles.otpText}>
          <Text style={styles.otpTextView}>
            Enter OTP sent to +{props.route.params.cc}{' '}
            {props.route.params.phone}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.changeNumber}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={styles.changeNumberText}>Change Number</Text>
        </TouchableOpacity>
        <View style={styles.otpInputArea}>
          <TextInput
            ref={input1}
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={value => handleOtpChange(value)}
            value={otp[0]}
          />
          <TextInput
            ref={input2}
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={value => handleOtpChange(otp[0] + value)}
            value={otp[1]}
          />
          <TextInput
            ref={input3}
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={value => handleOtpChange(otp.slice(0, 2) + value)}
            value={otp[2]}
          />
          <TextInput
            ref={input4}
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={value => handleOtpChange(otp.slice(0, 3) + value)}
            value={otp[3]}
          />
          <TextInput
            ref={input5}
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={value => handleOtpChange(otp.slice(0, 4) + value)}
            value={otp[4]}
          />
          <TextInput
            ref={input6}
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={value => handleOtpChange(otp.slice(0, 5) + value)}
            value={otp[5]}
          />
        </View>

        <TouchableOpacity
          disabled={seconds > 0 || minutes > 0}
          style={{alignSelf: 'center', width: '90%', marginTop: 10}}
          onPress={async () => {
            const fcmtoken = await messaging().getToken();
            resendOTP();
            setLoading(true);
            var formdata = new FormData();
            formdata.append('county_code', props.route.params.cc);
            formdata.append('phone_number', props.route.params.phone);
            formdata.append('device_type', Platform.OS === 'android' ? 1 : 2);
            formdata.append('device_token', fcmtoken);
            dispatch(loginPhoneUser(formdata)).then(response => {
              if (response.payload.success === true) {
                setLoading(false);
                alert('Otp sent');
              } else {
                setLoading(false);
                Alert.alert(response.payload.message);
              }
            });
          }}>
          <View style={styles.resendOTPView}>
            <Text style={styles.resendOtpTextView}>
              {seconds > 0 || minutes > 0
                ? `Resend OTP again after`
                : 'Resend OTP '}
            </Text>
            {seconds > 0 && (
              <Text style={styles.resendOtpTextView}>
                {minutes}:{seconds}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <AppButton
          onPress={() => verify_OTP()}
          loading={loading}
          btnText={'Verify'}
          btnStyle={{
            marginTop: 50,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  resendOtpTextView: {
    fontSize: 20 * fontSizeRatio,
    fontWeight: '500',
    color: Colors.PrimaryColor,
    fontFamily: 'Poppins-Regular',
  },
  resendOTPView: {flexDirection: 'row'},
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.PrimaryColor,
    fontSize: 24,
    width: '14%',
    textAlign: 'center',
    color: Colors.PrimaryColor,
    fontFamily: 'Poppins-Regular',
  },
  otpInputArea: {
    height: 60,
    width: '90%',
    flexDirection: 'row',
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 20,
  },
  changeNumberText: {
    fontSize: 20 * fontSizeRatio,
    fontWeight: '500',
    color: Colors.PrimaryColor,
    fontFamily: 'Poppins-Regular',
  },
  changeNumber: {alignSelf: 'center', width: '90%', marginTop: 5},
  otpTextView: {
    fontSize: 24 * fontSizeRatio,
    color: Colors.black,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
  },
  otpText: {width: '90%', alignSelf: 'center', marginTop: 100},
  titleText: {
    fontSize: 26 * fontSizeRatio,
    color: Colors.black,
    fontWeight: 'bold',
    textAlign: 'center',
    alignContent: 'center',
    marginTop: -6,
    width: '60%',
    fontFamily: 'Poppins-Regular',
  },
  image: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: Colors.black,
    transform: [{rotate: '90deg'}],
  },
  topWrapper: {
    alignSelf: 'center',
    width: '90%',
    marginTop: 20,
    flexDirection: 'row',
    alignContent: 'center',
  },
  mainWrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.white,
  },
});

export default OtpInput;
