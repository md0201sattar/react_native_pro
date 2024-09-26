import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Colors from '../../utils/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {store} from '../../redux/store';
import {TypingAnimation} from 'react-native-typing-animation';
import {AutoScrollFlatList} from 'react-native-autoscroll-flatlist';
import Images from '../../utils/Images';
import AsyncStorage from '@react-native-community/async-storage';
import {pushNotificaton} from '../../modules/pushNotificaton';
import {isRead} from '../../modules/isRead';
import {getChatDetail} from '../../modules/getChatDetail';
import {sendMessage} from '../../modules/sendMessage';
import DatePicker from 'react-native-date-picker';
import DeviceInfo from 'react-native-device-info';
import Loader from '../../components/Loader';
import {getUserDetailsSync} from '../../utils/getUserDetailsSync';
import moment from 'moment';
const BookaTour = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const [message, setMessage] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [getMesg, setGetMessg] = useState([]);
  const [userID, setUserID] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const postid = props.route.params;
  const property_details = useSelector(
    state => state?.getPopertiesDetailsReducer?.getPopertiesDetails?.data,
  );

  const [userDetails, setUserDetails] = useState('');

  // console.log('userDetails', userDetails);
  // console.log('property_details', property_details);

  useEffect(() => {
    getChatDetailApiCall();
  }, []);

  useEffect(async () => {
    const fetchUserDetails = async () => {
      const userDetails = await getUserDetailsSync();
      setUserDetails(userDetails);
    };
    fetchUserDetails();
  }, []);

  const getChatDetailApiCall = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('propid', postid?.PropID);
    await dispatch(getChatDetail(formData)).then(response => {
      console.log('response?.payload?.data', response?.payload?.data);
      console.log(
        'response?.payload?.data?.length',
        response?.payload?.data?.length,
      );
      if (response?.payload?.data?.length) {
        console.log('getChatDetail response?.payload?.data', response?.payload);
        setGetMessg(response?.payload?.data);
      }
      setLoading(false);
    });
  };

  const getUserID = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserID(id);
  };

  const visit_requested_API = date => {
    var myHeaders = new Headers();
    myHeaders.append('security_key', 'SurfLokal52');
    myHeaders.append('access_token', userDetails?.authToken);
    var formdata = new FormData();
    formdata.append('user_id', userDetails?.ID);
    formdata.append('user_name', userDetails?.display_name);
    formdata.append('user_email', userDetails?.user_email);
    formdata.append('user_phone', userDetails?.mobile);
    formdata.append('properties_interested_in', property_details?.title);
    formdata.append('visit_requested', moment(date).format('YYYY-MM-DD'));
    formdata.append('properties_id', property_details?.ID);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    fetch('https://www.surflokal.com/webapi/v1/leads/create/', requestOptions)
      .then(response => response.text())
      .then(result => console.log('result', result))
      .catch(error => console.log('error', error));
  };

  return (
    <SafeAreaView>
      <View style={styles.mainView}>
        <View style={styles.arrowView}>
          <TouchableOpacity
            style={styles.arrowTouchablopacity}
            onPress={() => navigation.goBack()}>
            <Image
              style={styles.imagestyle}
              source={Images.leftnewarrow}></Image>
          </TouchableOpacity>
          <Text style={styles.scheduleText}>Schedule a Tour</Text>
        </View>
        <Text style={styles.cythiaText}>Hi! What can I help you with?</Text>
        <AutoScrollFlatList
          nestedScrollEnabled={true}
          inverted
          data={getMesg}
          threshold={20}
          renderItem={({item, index}) => {
            return (
              <View style={styles.lokalmsg}>
                {item.message ===
                'A Lokal agent will confirm with you within the next 2 hours' ? (
                  <Text style={styles.messageText}>{item.message}</Text>
                ) : (
                  <Text
                    style={[
                      styles.msgtxt,
                      {
                        backgroundColor:
                          item.user_id === userID
                            ? Colors.white
                            : Colors.surfblur,
                        alignSelf:
                          item.user_id === userID ? 'flex-start' : 'flex-end',
                        alignContent:
                          item.user_id === userID ? 'center' : 'center',
                        color:
                          item.user_id === userID ? Colors.white : Colors.black,
                        color:
                          item.user_id === userID ? Colors.white : Colors.white,
                      },
                    ]}>
                    {item.message}
                  </Text>
                )}
              </View>
            );
          }}></AutoScrollFlatList>

        <View style={styles.viewstyle}>
          {loading && getMesg?.length > 2 && (
            <Text style={styles.textmessage}>{message}</Text>
          )}

          {loading && getMesg?.length > 2 && (
            <View style={styles.view1}>
              <Text style={styles.textstyle}>typing</Text>
              <TypingAnimation
                dotColor="black"
                dotMargin={3}
                dotAmplitude={2}
                dotSpeed={0.15}
                dotRadius={1}
                dotX={8}
                dotY={0}
                style={styles.typingstyle}
              />
            </View>
          )}

          <View style={styles.textinputview}>
            <TextInput
              style={styles.textinputstyle}
              placeholder={
                getMesg?.length < 1
                  ? 'Select Date from Calender'
                  : ' Type here ....'
              }
              placeholderTextColor={Colors.textColorLight}
              fontFamily="Poppins-Regular"
              value={message}
              // editable={getMesg?.length >1 ? false : true}
              editable={false}
              onChangeText={setMessage}
            />
            {getMesg?.length < 1 ? (
              <TouchableOpacity
                disabled={getMesg.length < 2 ? false : true}
                onPress={() => {
                  setOpen(true);

                  setDate(new Date());
                }}
                style={styles.touchableopacitystyle}>
                <Image style={styles.colastyle} source={Images.cola} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                // disabled={getMesg?.length >= 2 ? false : true}
                disabled={true}
                onPress={() => {
                  const now = date.toDateString();
                  const time = date.getHours() + ':' + date.getMinutes();
                  setLoading(true);
                  {
                    const formData = new FormData();
                    formData.append(
                      'propid',
                      props?.route?.params?.PropID
                        ? props?.route?.params?.PropID
                        : postid.PropID,
                    );
                    formData.append(
                      'user2_id',
                      props?.route?.params?.user2_id
                        ? props?.route?.params?.user2_id
                        : 18,
                    );
                    formData.append('message', now + ',' + time);
                    dispatch(
                      sendMessage({
                        user_id: props?.route?.params?.user_id
                          ? props?.route?.params?.user_id
                          : userID,
                        propid: props?.route?.params?.PropID
                          ? props?.route?.params?.PropID
                          : postid.PropID,
                        user2_id: props?.route?.params?.user2_id
                          ? props?.route?.params?.user2_id
                          : '',
                        message: message,
                      }),
                    ).then(res => {
                      setLoading(false);
                      setMessage('');
                      console.log('msg sent res.payload.success', res.payload);
                      if (res.payload.data?.code === 200) {
                        getChatDetailApiCall();
                      }
                    });
                  }
                }}
                style={styles.touchableopacitystyle}>
                <Image style={styles.sendimage} source={Images.sendm} />
              </TouchableOpacity>
            )}
          </View>
          <DatePicker
            modal
            open={open}
            date={date}
            accessibilityLiveRegion="en"
            minimumDate={new Date()}
            locale="en-GB"
            theme="light"
            mode="datetime"
            onConfirm={date => {
              setLoading(true);
              setOpen(false);
              visit_requested_API(date);

              const now = date.toDateString();
              const time = date.getHours() + ':' + date.getMinutes();
              {
                const formData = new FormData();
                formData.append(
                  'propid',
                  props?.route?.params?.PropID
                    ? props?.route?.params?.PropID
                    : postid.PropID,
                );
                formData.append(
                  'user2_id',
                  props?.route?.params?.user2_id
                    ? props?.route?.params?.user2_id
                    : 18,
                );
                formData.append('message', now + ',' + time);
                dispatch(sendMessage(formData))
                  .then(res => {
                    setMessage('');
                    if (res.payload.data.success) {
                      getChatDetailApiCall();
                      {
                        const payload = {
                          propid: postid?.PropID,
                          schedule_hour: time,
                          schedule_day: now,
                          user_mobile:
                            store.getState().loginUserReducer?.loginData?.data
                              ?.mobile,
                        };
                        dispatch(pushNotificaton(payload));
                        setOpen(false);
                      }
                    }
                  })
                  .catch(e => {
                    setLoading(false);
                  });
              }
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BookaTour;

const styles = StyleSheet.create({
  screen1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  scheduleText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: Colors.black,
  },
  cythiaText: {
    marginLeft: 15,
    marginRight: 13,
    fontSize: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginTop: 22,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  messageText: {
    fontSize: 16,
    borderRadius: 16,
    backgroundColor: '#D3D3D3',
    alignSelf: 'flex-start',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    maxWidth: '70%',
    marginLeft: 8,
    marginRight: 8,
    paddingHorizontal: 8,
    minHeight: 50,
    color: Colors.black,
  },
  view1: {flexDirection: 'row'},

  viewstyle: {
    bottom: 10,
    position: 'absolute',
    zIndex: 99,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
  },
  textmessage: {
    padding: 16,
    fontSize: 16,
    borderRadius: 16,
    backgroundColor: Colors.surfblur,
    alignSelf: 'flex-end',
    maxWidth: '70%',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 0,
    color: Colors.white,
  },
  textstyle: {
    padding: 16,
    fontSize: 16,
    borderRadius: 16,
    backgroundColor: Colors.surfblur,

    alignSelf: 'flex-end',
    maxWidth: '70%',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 0,
    color: Colors.white,
  },
  lokalmsg: {marginBottom: 5},
  textinputview: {
    backgroundColor: Colors.white,
    borderColor: Colors.BorderColor,
    borderWidth: 1,
    borderRadius: 5,
    height: 45,
    margin: 16,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  msgtxt: {
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '70%',
    marginLeft: 8,
    marginRight: 8,
    paddingHorizontal: 8,
    minHeight: 50,
    fontSize: 16,
    borderRadius: 16,
  },
  textinputstyle: {
    width: '80%',
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  typingstyle: {marginTop: 25, marginLeft: -3},

  touchableopacitystyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colastyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  sendimage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    tintColor: Colors.primaryBlue,
  },
  mainView: {
    height: '100%',
    position: 'relative',
    paddingBottom: 100,
  },
  arrowView: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: Colors.BorderColor,
    borderBottomWidth: 1,
  },
  arrowTouchablopacity: {
    position: 'absolute',
    left: 5,

    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'flex-start',
    width: 50,
    height: 50,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  imagestyle: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 57 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 57 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
    tintColor: '#D3D3D3',
  },
  imagedata: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.black,
  },
});
