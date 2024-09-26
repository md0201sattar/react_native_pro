import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import jwt_decode from 'jwt-decode';
import 'react-native-gesture-handler';
import {styled} from 'styled-components/native';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import CountryPicker from 'react-native-country-picker-modal';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
//
import Styles from './Styles';
import Colors from '../../utils/Colors';
import {useDispatch} from 'react-redux';
import Images from '../../utils/Images';
import AppButton from '../../components/AppButton';
import {loginUser} from '../../modules/loginUser';
import ModalLoader from '../../utils/ModalLoader';
import {googleUser} from '../../modules/googleLogin';
import {loginPhoneUser} from '../../modules/phonelogin';
import {
  requestUserPermission,
  NotificationListerner,
} from '../../utils/pushnotifications_helper';

export default function Login({navigation}) {
  const dispatch = useDispatch();
  const screenHeight = Dimensions.get('window').height;
  const fontSizeRatio = screenHeight / 1000;
  const viewSizeRatio = screenHeight / 1000;
  const imageSizeRatio = screenHeight / 1000;
  // access@wpkraken.io
  // CherryPicker1!
  //
  //
  //
  // taxacam504@bixolabs.com
  // fihire3160@eachart.com
  //betifi3785@cabose.com
  // citenid453@nexxterp.com
  const [emailId, setEmailId] = useState('citenid453@nexxterp.com');
  const [password, setPassword] = useState('123456');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [cc, setCC] = useState('');
  const [withEmail, setWithEmail] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);
  const [fcmtoken, setFcmtoken] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fcmtoken_ = await messaging()?.getToken();
        setFcmtoken(fcmtoken_);
      } catch (error) {
        console.error('Error fetching FCMtoken:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    NotificationListerner();
    requestUserPermission();
  }, []);

  // useEffect(() => {
  //   return (
  //     Platform.OS === 'ios' &&
  //     appleAuthAndroid.isSupported &&
  //     appleAuth.onCredentialRevoked(async () => {})
  //   );
  // }, []);

  useEffect(() => {
    const setupAppleAuthListener = async () => {
      if (Platform.OS === 'ios' && appleAuthAndroid.isSupported) {
        const onCredentialRevoked = async () => {
          // Your logic when the Apple Auth credential is revoked
        };

        const subscription = appleAuth.onCredentialRevoked(onCredentialRevoked);

        return () => {
          // Clean up the subscription when the component unmounts
          subscription.remove();
        };
      }
    };

    setupAppleAuthListener();
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        '681904798882-imtrbvtauorckhqv4sibieoi51rasda4.apps.googleusercontent.com',
      webClientId:
        '681904798882-r41s7mipcih0gdmsau2ds4c21pq4p476.apps.googleusercontent.com',
    });
  }, []);

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
      var formdata = new FormData();
      formdata.append('email', userInfo.user.email);
      formdata.append('username', userInfo.user.name);
      formdata.append('social_id', userInfo.user.id);
      formdata.append('social_token', userInfo.idToken);
      formdata.append('device_type', Platform.OS === 'android' ? 1 : 2);
      formdata.append('device_token', fcmtoken);
      formdata.append('user_type', 1);
      setModalLoader(true);
      console.log('gg 1 payload', formdata);
      dispatch(googleUser(formdata)).then(response => {
        if (response.payload.success) {
          console.log('gg 2 success');
          setModalLoader(false);
          navigation.replace('AppIntro');
        } else {
          console.log('gg 3 failed');
          setModalLoader(false);
          Alert.alert(response.payload.message);
        }
      });
    } catch (error) {
      console.log('gg 4 Error');
      setModalLoader(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('gg 5');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('gg 6');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('gg 7');
      } else {
        console.log('gg 8');
      }
    }
  };

  const handleEmailLogin = () => {
    setWithEmail(true);
  };

  const handleAppleLogin = async () => {
    var formdata = new FormData();
    Platform.OS === 'ios';
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,

      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    // console.log('credentialState', credentialState);

    if (credentialState === appleAuth.State.AUTHORIZED) {
      // console.log('user is authenticated', credentialState);
      // console.log(
      //   'appleAuthRequestResponse ===> ',
      //   appleAuthRequestResponse.identityToken,
      // );
      var decoded = jwt_decode(appleAuthRequestResponse.identityToken);
      formdata.append('email', decoded.email);
      formdata.append('username', decoded.email);
      formdata.append('social_id', decoded.nonce);
      formdata.append('social_token', appleAuthRequestResponse.identityToken);
      formdata.append('device_type', Platform.OS === 'android' ? 1 : 2);
      formdata.append('device_token', fcmtoken);
      console.log('formData ', formdata);
      dispatch(googleUser(formdata)).then(response => {
        if (response.payload.success) {
          setLoading(false);
          navigation.navigate('AppIntro');
        } else {
          setLoading(false);
          Alert.alert(response.payload.message);
        }
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );
      // console.log('credentialState', credentialState);

      if (credentialState === appleAuth.State.AUTHORIZED) {
        // console.log('user is authenticated', credentialState);
        // console.log(
        //   'appleAuthRequestResponse ===> ',
        //   appleAuthRequestResponse.identityToken,
        // );
        var decoded = jwt_decode(appleAuthRequestResponse.identityToken);
        formdata.append('email', decoded.email);
        formdata.append('username', decoded.email);
        formdata.append('social_id', decoded.nonce);
        formdata.append('social_token', appleAuthRequestResponse.identityToken);
        formdata.append('device_type', Platform.OS === 'android' ? 1 : 2);
        formdata.append('device_token', fcmtoken);
        console.log('formData ', formdata);
        dispatch(googleUser(formdata)).then(response => {
          if (response.payload.success) {
            setLoading(false);
            navigation.navigate('AppIntro');
          } else {
            setLoading(false);
            Alert.alert(response.payload.message);
          }
        });
      }
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining the access token');
      }
    } catch (error) {}
  };

  const accessRequestAction = async LoginType => {
    if (LoginType === 'PhoneNo') {
      if (phone && cc) {
        setLoading(true);
        var formdata = new FormData();
        formdata.append('county_code', cc);
        formdata.append('phone_number', phone);
        formdata.append('device_type', Platform.OS === 'android' ? 1 : 2);
        formdata.append('device_token', fcmtoken);
        console.log('formdata', formdata);
        await dispatch(loginPhoneUser(formdata)).then(async response => {
          if (response?.payload?.success) {
            setLoading(false);
            navigation.navigate('OtpScreen', {cc: cc, phone: phone});
          } else {
            setLoading(false);
            Alert.alert(
              response?.payload?.message
                ? response?.payload?.message
                : 'Login error',
            );
          }
        });
      } else {
        if (!phone) alert('Enter Phone number');
        else alert('Please select country');
      }
    } else if (emailId && password != '') {
      if (withEmail) {
        let data = {
          username: emailId,
          password: password,
          device_type: Platform.OS === 'android' ? 1 : 2,
          device_token: fcmtoken,
          user_type: 1,
        };
        setLoading(true);
        dispatch(loginUser(data)).then(response => {
          setLoading(false);
          if (response.payload.success) {
            navigation.navigate('AppIntro');
          } else {
            Alert.alert(response?.payload?.message ?? 'Login Error');
          }
        });
      }
    } else {
      Alert.alert('Enter email and password');
    }
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MainWrapper>
          <Image
            source={Images.appLogo}
            resizeMode="contain"
            style={{
              height: 200 * imageSizeRatio,
              width: 250 * imageSizeRatio,
              alignItems: 'center',
              alignSelf: 'center',
            }}
          />
          <ModalLoader visible={modalLoader} />
          {!withEmail ? (
            <RegionUpperView height={300 * viewSizeRatio}>
              <View
                style={{
                  height: 160 * viewSizeRatio,
                  width: '85%',
                  borderRadius: 8,
                  borderWidth: 1 * viewSizeRatio,
                  borderColor: Colors.textColorLight,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                }}>
                {/* <LoginContainer
                height={160 * viewSizeRatio}
                borderWidth={1 * viewSizeRatio}
                borderColor={Colors.textColorLight}> */}
                <RegionView
                  height={80 * viewSizeRatio}
                  borderColor={Colors.textColorLight}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <CountryPickerView>
                    <TextWrapper
                      fontWeight={300}
                      allowFontScaling={false}
                      color={Colors.textColorLight}
                      fontSize={16 * fontSizeRatio}>
                      Country/Region
                    </TextWrapper>
                    <CountryPickerChildView>
                      <CountryPicker
                        withFilter={true}
                        visible={modalVisible}
                        withCallingCodeButton={true}
                        withCountryNameButton={true}
                        withAlphaFilter={true}
                        withCallingCode={true}
                        onSelect={data => {
                          setCountryCode(data.cca2);
                          setCC(data.callingCode[0]);
                        }}
                        withModal={true}
                        onClose={() => {
                          setModalVisible(false);
                        }}
                        countryCode={countryCode}
                      />
                      <ImageView
                        source={Images.downArrow}
                        height={18 * imageSizeRatio}
                        width={18 * imageSizeRatio}></ImageView>
                    </CountryPickerChildView>
                  </CountryPickerView>
                </RegionView>
                <PhoneInputView
                  height={80 * viewSizeRatio}
                  borderTopWidth={1 * viewSizeRatio}
                  borderColor={Colors.textColorLight}>
                  <TextInput
                    style={Styles.inputStyle}
                    placeholderTextColor={Colors.textColorLight}
                    placeholder={'Phone Number'}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    secureTextEntry={false}
                    maxLength={12}
                    value={phone}
                    onChangeText={value => {
                      setPhone(value);
                    }}
                  />
                </PhoneInputView>
                {/* </LoginContainer> */}
              </View>
              <View style={{width: '85%', marginTop: 20 * viewSizeRatio}}>
                <Text allowFontScaling={false} style={Styles.alertText}>
                  We''ll call or text to confirm your number. Standard {'\n'}
                  message and data rates apply.
                </Text>
              </View>
            </RegionUpperView>
          ) : (
            <RegionUpperView height={300 * viewSizeRatio}>
              <View
                style={{
                  height: 160 * viewSizeRatio,
                  width: '85%',
                  borderRadius: 8, // Note: Use 'borderRadius' instead of 'borderradius'
                  borderWidth: 1 * viewSizeRatio,
                  borderColor: Colors.textColorLight,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                }}>
                {/* <LoginContainer
                height={160 * viewSizeRatio}
                borderWidth={1 * viewSizeRatio}
                borderColor={Colors.textColorLight}> */}
                <TextInput
                  allowFontScaling={false}
                  style={Styles.inputStyle}
                  placeholderTextColor={Colors.textColorLight}
                  placeholder={'Email'}
                  keyboardType="default"
                  returnKeyType="done"
                  value={emailId}
                  onChangeText={emailId => setEmailId(emailId)}
                />
                <View style={Styles.phoneInputView}>
                  <TextInput
                    allowFontScaling={false}
                    style={Styles.inputStyle}
                    placeholderTextColor={Colors.textColorLight}
                    placeholder={'Password'}
                    keyboardType="default"
                    returnKeyType="done"
                    value={password}
                    secureTextEntry={true}
                    onChangeText={password => setPassword(password)}
                  />
                </View>
                {/* </LoginContainer> */}
              </View>
              <View style={Styles.textvIew}>
                <Text
                  allowFontScaling={false}
                  style={[
                    Styles.alertText,
                    {
                      fontSize:
                        DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
                    },
                  ]}>
                  Please enter your email & password registerd with us and start
                  surfing
                </Text>
              </View>
            </RegionUpperView>
          )}

          <AppButton
            onPress={() => accessRequestAction(withEmail ? '' : 'PhoneNo')}
            loading={loading}
            btnText={'Continue'}
          />
          <View style={Styles.actionView}>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <TextWrapper
                fontWeight={400}
                fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
                color={Colors.primaryBlue}>
                Sign Up
              </TextWrapper>
            </TouchableOpacity>
            <View style={{width: '5%', alignItems: 'center'}}>
              <View style={Styles.divider}></View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}>
              <TextWrapper
                fontWeight={400}
                fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
                color={Colors.primaryBlue}>
                Forgot Password
              </TextWrapper>
            </TouchableOpacity>
          </View>

          {!withEmail ? (
            <TouchableOpacity
              onPress={() => handleEmailLogin()}
              style={Styles.socialMediaButtons}>
              <Image
                source={Images.email}
                style={Styles.socialMediaButtonsImage}></Image>
              <TextWrapper
                fontWeight={500}
                allowFontScaling={false}
                fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
                color={Colors.black}>
                {'  '}Continue with Email
              </TextWrapper>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setWithEmail(false)}
              style={Styles.socialMediaButtons}>
              <Image
                source={Images.contactAgent}
                style={Styles.socialMediaButtonsImage}></Image>
              <TextWrapper
                fontWeight={500}
                allowFontScaling={false}
                fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
                color={Colors.black}>
                {'  '}Continue with Phone
              </TextWrapper>
            </TouchableOpacity>
          )}

          {Platform.OS != 'android' ? (
            <TouchableOpacity
              onPress={() => handleAppleLogin()}
              style={Styles.socialMediaButtons}>
              <Image
                source={Images.apple}
                style={Styles.socialMediaButtonsImage}></Image>
              <TextWrapper
                fontWeight={500}
                allowFontScaling={false}
                fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
                color={Colors.black}>
                {'  '}Continue with Apple
              </TextWrapper>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => googleLogin()}
            style={Styles.socialMediaButtons}>
            <Image
              source={Images.google}
              style={Styles.socialMediaButtonsImage}></Image>
            <TextWrapper
              fontWeight={500}
              allowFontScaling={false}
              fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
              color={Colors.black}>
              {'  '}Continue with Google
            </TextWrapper>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => handleFacebookLogin()}
            style={Styles.socialMediaButtons}>
            <Image
              source={Images.facebook}
              style={Styles.socialMediaButtonsImage}></Image>
            <TextWrapper
              fontWeight={500}
              allowFontScaling={false}
              fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
              color={Colors.black}>
              {'  '}Continue with Facebook
            </TextWrapper>
          </TouchableOpacity> */}
        </MainWrapper>
      </ScrollView>
    </SafeAreaView>
  );
}

const PhoneInputView = styled.View`
  height: ${props => props.height}px;
  width: 100%;
  border-top-width: ${props => props.borderTopWidth}px;
  border-color: ${props => props.borderColor};
  justify-content: center;
  align-items: center;
  flex-direction: row;
  font-size: 14px;
`;

const CountryPickerChildView = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
`;

const TextWrapper = styled.Text`
  color: ${props => props.color};
  font-size: ${props => props.fontSize}px;
  font-family: Poppins-Regular;
  font-weight: ${props => props.fontWeight};
`;

const CountryPickerView = styled.View`
  width: 100%;
  justify-content: space-between;
  padding-horizontal: 16px;
`;

const RegionView = styled.TouchableOpacity`
  height: ${props => props.height}px;
  width: 100%;
  flexdirection: row;
  border-color: ${props => props.borderColor};
  justify-content: center;
  align-items: center;
`;

const LoginContainer = styled.View`
  height: ${props => props.height}px;
  width: 85%;
  borderradius: 8px;
  border-width: ${props => props.borderWidth}px;
  border-color: ${props => props.borderColor};
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const RegionUpperView = styled.View`
  height: ${props => props.height}px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ImageView = styled.Image`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  alignself: center;
  resizemode: contain;
`;

const MainWrapper = styled.View`
  flex: 1;
`;
