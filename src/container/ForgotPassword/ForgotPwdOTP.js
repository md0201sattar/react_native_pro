import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {useDispatch} from 'react-redux';
import AppButton from '../../components/AppButton';
import Styles from './Styles';
import {emailCheck} from '../../modules/emailCheck';
import {forgotPassword} from '../../modules/forgotPassword';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';

export default function ForgotPwdOTP({route}) {
  const {email} = route?.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [OTPvalues, setOTPvalues] = useState('');
  const [loader, setLoader] = useState(false);
  const [firebaseDB, setFirebaseDB] = useState('');

  console.log('email', email);
  useEffect(() => {
    console.log('userRR =>?');
    database()
      .ref('/User')
      .on(
        'value',
        snapshot => {
          console.log('User data: ', snapshot.val());
          setFirebaseDB(snapshot.val());
        },
        error => {
          console.error('Error fetching data:', error);
        },
      );
  }, []);

  console.log('firebaseDB', firebaseDB);

  const handleVerifyOTP = () => {
    // Implement OTP verification logic here
    if (OTPvalues === firebaseDB?.OTP && email === firebaseDB?.email) {
      // OTP is correct
      // alert('OTP is correct');
      navigation.navigate('ChangeNewPwd');
    } else {
      // OTP is incorrect
      alert('OTP is incorrect');
    }
  };

  return (
    <SafeAreaView style={Styles.safearea}>
      <ScrollView style={Styles.container}>
        <View style={Styles.mainView}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={Styles.touchableStyle}>
            <Image
              source={Images.leftnewarrow}
              style={Styles.logoStyle}></Image>
          </TouchableOpacity>
        </View>
        <Image source={Images.appLogo} style={Styles.appLogo}></Image>
        <View style={Styles.loginView}>
          <Text style={Styles.loginText}>
            Welcome to your local real estate search engine!
          </Text>
        </View>
        <View style={Styles.loginLine}></View>
        <View style={Styles.loginView}>
          <Text style={Styles.signUpText}>Enter OTP</Text>
        </View>

        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Enter OTP'}
            value={OTPvalues}
            keyboardType="email-address"
            returnKeyType="done"
            onChangeText={OTPvalues => setOTPvalues(OTPvalues)}
          />
        </View>

        <AppButton
          //   onPress={() => accessRequestAction()}
          onPress={() => {
            handleVerifyOTP();
          }}
          btnText={'Verify'}
          btnStyle={{
            marginTop: 50,
          }}
          loading={loader}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
