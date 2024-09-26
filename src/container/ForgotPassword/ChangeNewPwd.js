import React, {useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';

export default function ChangeNewPwd({route}) {
  const {user_Id} = route?.params;
  console.log('user_Id', user_Id);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState(user_Id);
  const [loader, setLoader] = useState(false);

  const go = () => {
    if (password == '') {
      Alert.alert('Enter password');
    } else if (confirmPassword == '') {
      Alert.alert('Enter confirm password');
    } else if (password != confirmPassword) {
      Alert.alert("Password and Confirm password doesn't match");
    } else {
      setLoader(true);
      let data = {
        userID: userId,
        password: password,
        confirm_pass: confirmPassword,
      };
      dispatch(forgotPassword(data)).then(response => {
        if (response.payload.success) {
          navigation.navigate('Login');
        } else {
          Alert.alert('Yor are not register with us please register ');
        }
        setLoader(false);
      });
    }
  };

  return (
    <SafeAreaView style={Styles.safearea}>
      <ScrollView style={Styles.container}>
        <Image source={Images.appLogo} style={Styles.appLogo}></Image>
        <View style={Styles.loginView}>
          <Text style={Styles.loginText}>
            Welcome to your local real estate search engine!
          </Text>
        </View>
        <View style={Styles.loginLine}></View>
        <View style={Styles.loginView}>
          <Text style={Styles.signUpText}>Change Password</Text>
        </View>

        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Password'}
            keyboardType="default"
            returnKeyType="done"
            secureTextEntry={true}
            onChangeText={password => setPassword(password)}
          />
        </View>
        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Confirm Password'}
            keyboardType="default"
            returnKeyType="done"
            secureTextEntry={true}
            onChangeText={confirmPassword =>
              setConfirmPassword(confirmPassword)
            }
          />
        </View>

        <AppButton
          onPress={() => go()}
          btnText={'Continue'}
          btnStyle={{
            marginTop: 50,
          }}
          loading={loader}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
