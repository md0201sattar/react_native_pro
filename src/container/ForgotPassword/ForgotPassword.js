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
import auth from '@react-native-firebase/auth';

export default function ForgotPassword({navigation}) {
  const dispatch = useDispatch();
  // tester1.webperfection@gmail.com
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [resetPasswordScreen, setresetPasswordScreen] = useState(true);
  const [loader, setLoader] = useState(false);

  const setDataInFirebase = data => {
    // Reference to the 'User' node in the database
    const userRef = database().ref('/User');

    // Use the 'set' method to set the data
    userRef
      .set(data)
      .then(() => {
        console.log('Data has been successfully set in Firebase.');
        navigation.navigate('ForgotPwdOTP', {email: emailId});
      })
      .catch(error => {
        console.error('Error setting data in Firebase:', error);
      });
  };

  const accessRequestAction = () => {
    setLoader(true);
    if (emailId != '') {
      // let data = {
      //   email: emailId,
      // };

      const data = new FormData();
      data.append('email', emailId);

      dispatch(emailCheck(data)).then(response => {
        console.log('response', response);
        if (response.payload.code === 200) {
          // setresetPasswordScreen(false);
          // navigation.navigate('ForgotPwdOTP');
          navigation.navigate('ChangeNewPwd', {
            user_Id: response.payload?.data?.UserID,
          });

          setUserId(response?.payload?.data?.UserID);
          setLoader(false);
        } else {
          setLoader(false);
          Alert.alert('Yor are not register with us please register ');
        }
        // let payload = {
        //   email: emailId,
        //   OTP: '123456',
        // };
        // setDataInFirebase(payload);
      });
    } else {
      setLoader(false);
      Alert.alert('Enter email');
    }
  };

  // Function to send an OTP to the user's email
  const sendOTPToEmail = async email => {
    try {
      // Send a sign-in link to the user's email
      await auth().sendSignInLinkToEmail(email, {
        handleCodeInApp: true, // Open the app when the link is clicked
        url: 'YOUR_DEEP_LINK_URL', // The deep link URL in your app
      });

      // You can also store the email in local storage or state for verification later
      // For example, you can store the email in AsyncStorage or Redux state.

      // After sending the OTP, you can navigate to a screen where the user can enter the OTP for verification.
      // You can use navigation.navigate() here.
    } catch (error) {
      console.error('Error sending OTP:', error);
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
        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Email'}
            value={emailId}
            keyboardType="email-address"
            returnKeyType="done"
            onChangeText={emailId => setEmailId(emailId)}
          />
        </View>

        <AppButton
          onPress={() => accessRequestAction()}
          btnText={'Continue'}
          btnStyle={{
            marginTop: 50,
          }}
          loading={loader}
        />
        {/* <AppButton
          onPress={() => sendOTPToEmail('user@example.com')}
          btnText={'Send Mail'}
          btnStyle={{
            marginTop: 50,
          }}
          loading={loader}
        /> */}
      </ScrollView>
      {/* {resetPasswordScreen ? resetPassword() : changePassword()} */}
    </SafeAreaView>
  );
}
