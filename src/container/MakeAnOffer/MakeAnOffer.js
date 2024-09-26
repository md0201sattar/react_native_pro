import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import { useDispatch} from 'react-redux';
import Colors from '../../utils/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {makeOffer} from '../../modules/makeOffer';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ScrollView} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import DeviceInfo from 'react-native-device-info';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;



const MakeAnOffer = () => {

  const flatListRef = useRef(null);

  const navigation = useNavigation();

  const dispatch = useDispatch();
  const [priceOffer, setPriceOffer] = useState('');
  const [cashLoan, setCashLoan] = useState('');
  const [legalName, setLegalName] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [userID, setUserID] = useState('');
  const [error, setError] = useState(false);
  const [pricerror, setpricerror] = useState(false);
  const [casherror, setcasherror] = useState(false);
  const [dateerror, setDateerror] = useState(false);
  const [nameerror, setnameerror] = useState(false);
  const [currenterror, setcurrenterror] = useState(false);
  const [emailerror, setemailerror] = useState(false);
  const [phoneerror, setphoneerror] = useState(false);

  const getData = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserID(id);
  };
  useEffect(() => {
    getData();
  }, []);

  const accessRequestAction = () => {
    navigation.navigate('AccessRequest');
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const hideDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || closeDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    setCloseDate(currentDate);
  };

  const validateInputs = () => {
    let valid = true;

    if (priceOffer === '') {
      setpricerror(true);
      valid = false;
    } else {
      setpricerror(false);
    }

    if (cashLoan === '') {
      setcasherror(true);
      valid = false;
    } else {
      setcasherror(false);
    }

    if (closeDate === '') {
      setDateerror(true);
      valid = false;
    } else {
      setDateerror(false);
    }

    if (legalName === '') {
      setnameerror(true);
      valid = false;
    } else {
      setnameerror(false);
    }

    if (currentAddress === '') {
      setcurrenterror(true);
      valid = false;
    } else {
      setcurrenterror(false);
    }

    if (email === '') {
      setemailerror(true);
      valid = false;
    } else {
      setemailerror(false);
    }

    if (!validateEmail(email)) {
      setemailerror(true);
      valid = false;
    } else {
      setemailerror(false);
    }

    if (phone === '') {
      setphoneerror(true);
      valid = false;
    } else {
      setphoneerror(false);
    }

    if (!validatePhoneNumber(phone)) {
      setphoneerror(true);
      valid = false;
    } else {
      setphoneerror(false);
    }

    return valid;
  };

  const validateEmail = email => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = phone => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const makeOfferAPI = async () => {
    const id = await AsyncStorage.getItem('userId');

    if (validateInputs()) {
      try {
        const data = {
          userid: id,
          property_address: address,
          property_price_offer: priceOffer,
          case_loan: cashLoan,
          full_legal_name: legalName,
          current_address: currentAddress,
          email: email,
          phone: phone,
          closeing_date: selectedDate,
        };

        const response = await axios.post(
          'https://surf.topsearchrealty.com/webapi/v1/makeoffer/',
          data,
        );

        setAddress('');
        setPriceOffer('');
        setCashLoan('');
        setCloseDate('');
        setLegalName('');
        setCurrentAddress('');
        setEmail('');
        setPhone('');
        setError(false);

        if (response.status === 200) {
          if (response.data.success) {
            Alert.alert('Offer submitted');
            navigation.navigate('MyProfile');
          } else {
            Alert.alert('Offer submit');
          }
        }
      } catch (error) {
        setError(true);
        Alert.alert(error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headercover}>
        <TouchableOpacity
          style={styles.leftheaderstyle}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image style={styles.arrowimage} source={Images.leftnewarrow}></Image>
        </TouchableOpacity>
        <View style={styles.maincenter}>
          <Text style={styles.centertext}>Make an offer</Text>
        </View>
        <TouchableOpacity
          style={styles.rightmenu}
          onPress={() => navigation.goBack()}>
          <Animatable.Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={90}>
        <View style={styles.cardContainer}>
          <View style={styles.formContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Property Address*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Property Address"
                  fontFamily="Poppins-Light"
                  placeholderTextColor={'gray'}
                  value={address}
                  onChangeText={text => setAddress(text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Offer Price*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Offer Price"
                  fontFamily="Poppins-Light"
                  placeholderTextColor={'gray'}
                  keyboardType="default"
                  value={priceOffer}
                  onChangeText={text => setPriceOffer(text)}
                />
                {pricerror && (
                  <Text style={styles.errorText}>
                    Please enter a valid price
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Cash Loan*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Cash Loan"
                  fontFamily="Poppins-Light"
                  placeholderTextColor={'gray'}
                  keyboardType="default"
                  value={cashLoan}
                  onChangeText={text => setCashLoan(text)}
                />
                {casherror && (
                  <Text style={styles.errorText}>
                    Please enter a valid cash loan
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Close Date*</Text>
                <TouchableOpacity
                  style={styles.datePickerContainer}
                  onPress={showDatepicker}>
                  <Text style={styles.datePickerText}>
                    {selectedDate ? selectedDate.toDateString() : 'Select Date'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate || new Date()}
                    mode="date"
                    fontFamily="Poppins-Light"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                {dateerror && (
                  <Text style={styles.errorText}>
                    Please select a close date
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Legal Name*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Legal Name"
                  fontFamily="Poppins-Light"
                  placeholderTextColor={'gray'}
                  value={legalName}
                  onChangeText={text => setLegalName(text)}
                />
                {nameerror && (
                  <Text style={styles.errorText}>
                    Please enter a valid legal name
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Current Address*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Current Address"
                  fontFamily="Poppins-Light"
                  placeholderTextColor={'gray'}
                  value={currentAddress}
                  onChangeText={text => setCurrentAddress(text)}
                />
                {currenterror && (
                  <Text style={styles.errorText}>
                    Please enter a valid address
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Email*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  fontFamily="Poppins-Light"
                  placeholderTextColor={'gray'}
                  value={email}
                  onChangeText={text => setEmail(text)}
                />
                {emailerror && (
                  <Text style={styles.errorText}>
                    Please enter a valid email address
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Phone*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  fontFamily="Poppins-Light"
                  placeholderTextColor={'gray'}
                  keyboardType="numeric"
                  value={phone}
                  onChangeText={text => setPhone(text)}
                />
                {phoneerror && (
                  <Text style={styles.errorText}>
                    Please enter a valid phone number
                  </Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.buttoncover}>
              <TouchableOpacity
                onPress={() => makeOfferAPI()}
                style={styles.buttoninner}>
                <Text style={styles.submittext}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  viewStyle: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginLeft: 0,
  },
  formContainer: {
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 14,
    marginBottom: 0,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 40,
    borderColor: Colors.BorderColor,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    width: '100%',
    color: Colors.textColorDark,
    paddingBottom: 5,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
  },
  datePickerContainer: {
    width: '100%',
    justifyContent: 'center',
    borderColor: Colors.BorderColor,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    fontFamily: 'Poppins-Regular',
  },
  datePickerText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
    color: 'gray',
    fontFamily: 'Poppins-Light',
    height: 40,
    lineHeight: 40,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    height: 30,
    borderRadius: 8,
    width: 100,
    marginTop: 10,
    backgroundColor: Colors.surfblur,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  imagedata: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,

    resizeMode: 'contain',
  },
  headercover: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 2,
    marginBottom: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 20,
  },
  leftheaderstyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 5,
    justifyContent: 'flex-start',
    top: 13,
    width: 50,
    height: 50,
  },
  arrowimage: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  maincenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centertext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 43 : 22,
  },
  rightmenu: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  buttoncover: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttoninner: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 55 : 45,
    width: 130,
    borderRadius: 100,
    backgroundColor: Colors.surfblur,
    marginTop: 10,
    lineHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  submittext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
});

export default MakeAnOffer;
