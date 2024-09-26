import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import {getUserDetailsSync} from '../../utils/getUserDetailsSync';
import ChatWithAgent from '../../components/ChatWithAgent';
import {getAgent} from '../../modules/getAgent';

const ChatSearch = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [res, setRes] = useState([]);
  const [twilioToken, setTwilioToken] = useState('');
  const [userDetails, setUserDetails] = useState('');
  const [agentData, setAgentData] = useState('');
  // const [chatModalVisible, setChatModalVisible] = useState(true);

  useEffect(() => {
    if (route.params?.initialMessage && route.params?.agentReply) {
      const initialMessage = route.params.initialMessage;
      const agentReply = route.params.agentReply;
      setRes([
        {type: 1, message: initialMessage},
        {type: 1, message: agentReply},
      ]);
    }
  }, [route.params?.initialMessage, route.params?.agentReply]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetailsSync();
        setUserDetails(userDetails);
        await getTwilioToken(userDetails);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
    getAgentApicall();
  }, []);

  const getAgentApicall = () => {
    dispatch(getAgent()).then(response => {
      if (response.payload.data[0]) {
        setAgentData(response.payload.data);
      } else {
        setAgentData([
          {
            agent_ID: '772785',
            agent_email: 'tester1.webperfection@gmail.com',
            agent_facebook: '',
            agent_instagram: '',
            agent_linkedin: '',
            agent_mobile: '5677767575',
            agent_phone: '6789999655',
            agent_pinterest: '',
            agent_position: 'developer',
            agent_skype: '',
            agent_title: 'Agent test',
            agent_twitter: '',
            agent_whatsapp: '',
            featured_image_url:
              'https://www.surflokal.com/wp-content/uploads/2023/06/user2.png',
            first_name: 'John',
            last_name: 'doe',
            threads: 'https://www.threads.net/?hl=en',
          },
        ]);
      }
    });
  };

  async function getTwilioToken(userDetails) {
    const requestAddress = 'https://meet.surflokal.com/getChatToken';
    if (!requestAddress) {
      throw new Error(
        'REACT_APP_ACCESS_TOKEN_SERVICE_URL is not configured, cannot login',
      );
    }
    try {
      const response = await axios.get(requestAddress, {
        params: {
          emailAddress: userDetails.user_email.toLowerCase(),
          auth_token: userDetails.authToken,
        },
      });
      setTwilioToken(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error(error.response.data ?? 'Authentication error.');
      }
      throw new Error(`ERROR received from ${requestAddress}: ${error}\n`);
    }
  }

  // const chatModal = () => {
  //   setChatModalVisible(!chatModalVisible);
  // };

  return (
    // <Modal
    //   transparent={true}
    //   animationType="slide"
    //   visible={true}
    //   onRequestClose={chatModal}>
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView>
        <View style={styles.mainView}>
          <View style={styles.secondView}>
            <View style={styles.imageview}>
              <Image style={styles.imagestyle} source={Images.user}></Image>

              <Text style={styles.textstyle}> Powered by Cynthia</Text>
            </View>
            <View style={styles.relodimageView}>
              <TouchableOpacity
                onPress={() => {
                  // setChatModalVisible(false);
                  props.route?.params?.from === 'detail'
                    ? navigation.goBack()
                    : navigation.navigate('Home');
                }}
                style={styles.whitecloseStyle}>
                <Image
                  style={styles.whitecloseImage}
                  source={Images.whiteclose}></Image>
              </TouchableOpacity>
            </View>
          </View>

          {agentData && twilioToken && (
            <>
              <Text style={styles.cynthia}>
                {agentData && agentData[0]
                  ? `Hi I'm ${agentData[0]?.first_name} ${agentData[0]?.last_name}. What can I help you with today ?`
                  : 'No agent assigned to you'}
              </Text>
              <ChatWithAgent
                agentData={agentData && agentData[0] ? agentData[0] : {}}
                userData={userDetails}
                token={twilioToken}
              />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    // </Modal>
  );
};

export default ChatSearch;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  mainView: {
    height: '100%',
    position: 'relative',
    backgroundColor: 'white',
  },
  secondView: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#c9c9c5',
  },
  imageview: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
  },
  imagestyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 40,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 40,
    resizeMode: 'contain',
    borderRadius: 50,
    marginRight: 5,
    borderColor: Colors.surfblur,
    borderWidth: 1,
  },
  typingstyle: {marginTop: 25, marginLeft: -3},

  textstyle: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 15,
    fontFamily: 'Poppins-Medium',
    color: Colors.black,
  },
  relodimageView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginRight: 0,
  },
  view1: {flexDirection: 'row'},

  relodTouchableopacity: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  relodImage: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 25,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 25,
    resizeMode: 'contain',
    tintColor: Colors.black,
  },
  whitecloseStyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 35,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 35,
    borderRadius: 100,
    alignItems: 'center',
  },
  whitecloseImage: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 20,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 20,
    top: DeviceInfo.getDeviceType() === 'Tablet' ? 4 : 7,
    resizeMode: 'contain',
    borderRadius: 50,
    marginLeft: 2,
    tintColor: Colors.black,
  },
  cynthia: {
    marginLeft: 15,
    marginRight: 13,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginTop: 22,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  cythiaText: {
    marginLeft: 15,
    marginRight: 13,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginTop: 22,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  messageText: {
    padding: 8,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 16,
    borderRadius: 10,
    maxWidth: '70%',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  dateText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
    marginBottom: 8,
    color: Colors.gray,
    fontFamily: 'Poppins-Medium',
  },
  bottomView: {
    bottom: 0,
    position: 'absolute',
    zIndex: 99,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
  },
  messagetextstyle: {
    padding: 16,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 16,
    borderRadius: 16,
    backgroundColor: Colors.surfblur,
    alignSelf: 'flex-end',
    maxWidth: '70%',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    color: Colors.white,
    fontFamily: 'Poppins-Medium',
  },
  typingStyle: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    maxWidth: '70%',
    marginLeft: 16,
    marginTop: 6,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  textinputView: {
    backgroundColor: Colors.white,
    borderColor: Colors.BorderColor,
    borderWidth: 1,
    borderRadius: 5,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 55 : 45,
    margin: 16,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  textinputstyle: {
    width: '90%',
    backgroundColor: Colors.white,
    color: Colors.black,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 14,
  },
  touchableopacitystyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendimagestyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 25,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 25,
    resizeMode: 'contain',
    tintColor: Colors.primaryBlue,
  },
  imagedata: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.black,
  },
});
