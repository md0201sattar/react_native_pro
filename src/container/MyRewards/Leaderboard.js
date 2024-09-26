import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {getLeaderboard} from '../../modules/getLeaderboard';
import {getProfile} from '../../modules/getProfile';
import DeviceInfo from 'react-native-device-info';
import { ScrollView } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';

const Leaderboard = () => {
   
  const [leaderboarddata, setleaderboarddata] = useState([]);
  const [getProfileData, setgetProfileData] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    getLeaderboardApicall();
    getProfileApiCall();
  }, []);

  const getProfileApiCall = () => {
    dispatch(getProfile()).then(response => {
      setgetProfileData(response.payload.data);
    });
  };

  const getLeaderboardApicall = () => {
    dispatch(getLeaderboard()).then(response => {
      setleaderboarddata(response.payload.data);
    });
  };

  const createAbbreviation = username => {
  if(username){
    const names = username.split("");
    const firstLetterFirstName = names.find(char => char !== ' ');
     const lastSpaceIndex = names.lastIndexOf(' ');
     const firstLetterLastName = lastSpaceIndex !== -1 ? names[lastSpaceIndex + 1] :null;
    const nameparts = [
      firstLetterFirstName ? firstLetterFirstName.toUpperCase() : '',
      firstLetterLastName ? firstLetterLastName.toUpperCase() : ''
    ];
     return nameparts
  }
  };

  const top5Leaderboard =
    leaderboarddata.length > 0
      ? [...leaderboarddata].sort((a, b) => b.points - a.points).slice(0, 5)
      : [];

  return (
    <SafeAreaView style={styles.safeareastyle}>
  
      <View style={styles.headermain}>
        <TouchableOpacity
          style={styles.leftcover}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image style={styles.innerarrow} source={Images.leftnewarrow}></Image>
        </TouchableOpacity>
        <View style={styles.centertext}>
          <Text style={styles.centermaintext}>Leader Board</Text>
        </View>
        <TouchableOpacity
          style={styles.rightmenu}
          onPress={() => navigation.goBack()}>
          <Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <ScrollView styles={{}}>
      <View style={styles.screencover}>
        <View style={styles.surfcover}>
          <Image source={Images.searcfrank} style={styles.surfimage} />
        </View>
        <View style={styles.cover}>
          <View style={styles.topmain}>
            <Text style={styles.maintopheading}>Rank</Text>
            <Text style={styles.maintopheading}>Score</Text>
            <Text style={styles.maintopheading}>Surfer</Text>
          </View>
          {top5Leaderboard.map((user, index) => (
            <View key={index} style={styles.resultcover}>
              <Text
                style={[styles.leaderboardtextstyle,{
                  color:
                    user.username === getProfileData[0]?.username
                      ? '#2fff05'
                      : Colors.white,
               
                }]}>
                {index + 1}
              </Text>
              <Text
                style={[styles.leaderboardtextstyle,{
                  color:
                    user.username === getProfileData[0]?.username
                      ? '#2fff05'
                      : Colors.white,
                
                }]}>
                {user.points}
              </Text>
              <Text
                style={[styles.leaderboardtextstyle,{
                  
                  color:
                    user.username === getProfileData[0]?.username
                      ? '#2fff05'
                      : Colors.white,
                  
                }]}>
                {createAbbreviation(user.username)}
              </Text>
            </View>
          ))}
        </View>
        {
          top5Leaderboard? <View style={styles.coffecover}>
          <LottieView
            style={styles.imagesize}
            source={require('../../assets/animations/LeaderBoard.json')}
            autoPlay
            loop
          />
        </View>:null
        }
       
        <View style={styles.bottomtext}>
          <Text style={styles.firstbottomtext}>
            We think home buying should be fun!
          </Text>
          <Text style={styles.bottombottext}>Here is where you rank.</Text>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeareastyle:{
    backgroundColor: Colors.darbluec,
    height:"100%"
  },
  screen1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  imagedata: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,
    tintColor: Colors.white,
    resizeMode: 'contain',
  },
  headermain: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 2,
  },
  leftcover: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 12,
    justifyContent: 'flex-start',
    top: 13,
    width: 50,
    height: 50,
  },
  innerarrow: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  centertext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightmenu: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  centermaintext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.white,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  maintopheading: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: '33.33%',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 32 : 16,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  topmain: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 14,
    alignItems: 'flex-start',
  },
  cover: {width: '100%', marginTop: 12},
  surfimage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '90%',
    marginTop: 2,
    resizeMode: 'contain',
    marginHorizontal: 6,
  },
  surfcover: {justifyContent: 'center', alignItems: 'center', width: '100%'},
  screencover: {
    paddingTop: 70,
    backgroundColor: Colors.darbluec,
    height: '100%',
    width: '100%',
    alignItems: 'flex-start',
  },
  bottomtext: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    height: '30%',
  },
  firstbottomtext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 16,
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    width: '100%',
  },
  bottombottext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 16,
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    width: '100%',
  },
  resultcover: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 14,
    alignItems: 'flex-start',
  },

  coffecover: {
    position:"absolute",
    width:"100%",
    height: "100%",
    top:"20%",
    left:0,
    right:0,
    justifyContent:"center",
    alignItems:"center"

  },
  leaderboardtextstyle: {
   flex: 1,
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: '33.33%',
  fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 32 : 16,
  fontFamily: 'Poppins-SemiBold',
  textAlign: 'center'
   } ,

  imagesize: {
    height: 600, 
    width:700, 
    marginRight:0,
  position:"absolute"},

});
export default Leaderboard;
