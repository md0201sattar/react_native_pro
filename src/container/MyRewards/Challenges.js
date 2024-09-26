import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect,useRef} from 'react';
import Colors from '../../utils/Colors';
import {useNavigation} from '@react-navigation/native';
import Images from '../../utils/Images';
import {useDispatch} from 'react-redux';
import {getRewardListing} from '../../modules/getRewardListing';
import {useIsFocused} from '@react-navigation/native';
import {likeDisLike} from '../../modules/likeDislike';
import {TypingAnimation} from 'react-native-typing-animation';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';

const screenWidth = Dimensions.get('window').width;
const Challenges = () => {

  const [question, setQuestion] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigation = useNavigation();
  const [selectedTabsMore, setSelectedTabsMore] = useState([]);
  const [selectedTabsMore2, setSelectedTabsMore2] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const swiperRef = useRef(null);

   useEffect(() => {
   console.log("countt",question)
    }, [question])

  useEffect(() => {
    if (isFocused) {
      Promise.all[(getRewardsChallengeApicall())];
    }
  }, [isFocused]);
  const getRewardsChallengeApicall = () => {
    dispatch(getRewardListing()).then(response => {
      setQuestion(response?.payload?.data);
      setCurrentQuestionIndex(response?.payload?.count);

     
    });
  };
  const goForward = () => {
    if (currentQuestionIndex < question.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      swiperRef.current.scrollToIndex({
        index: currentQuestionIndex + 1,
      });
    }
  };

  const goBackward = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      swiperRef.current.scrollToIndex({
        index: currentQuestionIndex - 1,
      });
    }
  };
 
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={styles.leftcoverarrow}>
        <TouchableOpacity
          style={styles.leftarrow}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={styles.leftarrowimage}
            source={Images.leftnewarrow}></Image>
        </TouchableOpacity>
        <View style={styles.headingcover}>
          <Text style={styles.challengestext}>Challenges</Text>
        </View>
        <TouchableOpacity
          style={styles.menucover}
          onPress={() => navigation.goBack()}>
          <Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.dislikeview}>
                    <TouchableOpacity
                     onPress={() => {
                     goBackward()  }}
                        activeOpacity={0.3}>
                        <Image
                          source={ Images.next }
                          style={[styles.dislikedes,{transform:[{rotate: '180deg'}],
                          }]}
                        />
                      </TouchableOpacity>
                     
</View>
      <View style={styles.questioncover}>
      {question.length > 0 ? (
          <SwiperFlatList
            style={{width: screenWidth}}
            index={currentQuestionIndex}
            data={question}
            ref={swiperRef}
           
            renderItem={({item, index}) => {
              const {ID, points} = item;
              const isSelected =selectedTabsMore.filter(i => i === ID).length > 0
              const isSelected2 = selectedTabsMore2.filter(i => i === ID).length > 0
              return (
                <View style={{}}>
                  <View style={styles.questionmain}>
                    <Text style={styles.textques}>
                      {'Q.'}
                      {index + 1}
                      {' : '}
                      {item.post_title}
                    </Text>
                    <View style={styles.innertext}>
                    

                      <TouchableOpacity
                        disabled={
                          item?.is_like != '0' ||
                          isSelected2 ||
                          (isSelected && true)
                        }
                        onPress={() => {
                   
                          if (isSelected) {
                            setSelectedTabsMore(prev =>
                              prev.filter(i => i !== ID),
                            );
                            setSelectedTabsMore2(prev =>
                              prev.filter(i => i == ID),
                            );
                          } else {
                            setSelectedTabsMore(prev => [...prev, ID]);
                            setSelectedTabsMore2(prev =>
                              prev.filter(i => i !== ID),
                            );
                          }

                          const formData = new FormData();
                          formData.append('title', item.post_title);
                          formData.append('post_id', item.ID);
                          formData.append('points', item.points);
                          formData.append('status', 2);
                          dispatch(likeDisLike(formData))
                        }}
                      >
                        <Image
                          source={
                            isSelected || item.is_like === '2'
                              ? Images.redlike
                              : Images.deletethumb
                          }
                          style={styles.dislikedes}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={
                          item?.is_like != '0' ||
                          isSelected ||
                          (isSelected2 && true)
                        }
                       
                        onPress={() => {
                    

                          if (isSelected2) {
                            setSelectedTabsMore2(prev =>
                              prev.filter(i => i !== ID),
                            );
                          } else {
                            setSelectedTabsMore2(prev => [...prev, ID]);
                            setSelectedTabsMore(prev =>
                              prev.filter(i => i !== ID),
                            );
                          }
                          const formData = new FormData();
                          formData.append('title', item.post_title);
                          formData.append('post_id', item.ID);
                          formData.append('points', item.points);
                          formData.append('status', 1);
                          dispatch(likeDisLike(formData))
                            .then(response => { })
                            .catch(e => {
                            });
                        }}
                        activeOpacity={0.8}>
                        <View style={styles.viewstyle}>
                          <Image
                            source={
                              isSelected2 || item.is_like === '1'
                                ? Images.upgreen
                                : Images.upthumb
                            }
                            style={styles.upthumpdes}
                          />
                        </View>
                      </TouchableOpacity>
                     
                    </View>
                  
                  </View>
                  
                </View>
                
              );
            }}
            
          />
          
        ) : (
          <>
            <Text style={styles.waittext}>Wait for your challenges</Text>
            <TypingAnimation
              dotColor="black"
              dotMargin={10}
              dotAmplitude={2}
              dotSpeed={0.15}
              dotRadius={1}
              dotX={8}
              dotY={5}
              style={styles.typinganimationmain}
            />
          </>
        )}
      </View>
      <View style={styles.upthumbView}>
      <TouchableOpacity
                    
                     onPress={() => {
                    goForward()
                    }}
                        activeOpacity={0.1}>
                        
                          <Image
                             source={ Images.next }
                            style={[styles.upthumpdes, {}]}
                          />
                       
                      </TouchableOpacity>
                      </View>
      <View style={styles.bottomview}>
        <Text style={styles.challestext}>Are you up for a challenge?</Text>
        <View style={styles.coffecover}>
          <LottieView
            style={styles.imagesize}
            source={require('../../assets/animations/ChallengeScreen.json')}
            autoPlay
            loop
          />
        </View>
      </View>
      
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  viewstyle: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 18,
    alignItems: 'center',
    paddingVertical: 18,
    position:"relative",
    zIndex:9999
  },
  line: {
    height: 1,
    width: '90%',
    backgroundColor: Colors.BorderColor,
  },
  text: {
    fontSize: 14,
    color: Colors.black,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  slideOuter: {
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: 'blue',
  },

  filter: {
    height: 60,
  },
  rew: {
    height: 35,
    width: 80,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderColor: Colors.surfblur,
    lineHeight: 17,
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

    resizeMode: 'contain',
  },
  dislikeview:{
    flexDirection:"row", 
  alignItems:"center", 
  justifyContent:"space-between",
  paddingHorizontal:4, 
  position:"absolute", 
   top:"50%",
    zIndex:999
  },
  leftcoverarrow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 2,
  },
  leftarrow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 12,
    justifyContent: 'flex-start',
    top: 13,
    width: 50,
    height: 50,
  },
  leftarrowimage: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  headingcover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengestext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  menucover: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  questioncover: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    color: Colors.black,
    height: '100%',
    width: '100%',
    position:"relative",
    zIndex:99
  },
  questionmain: {
    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    width: screenWidth,
    paddingTop: 180,
  },
  textques: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    width: screenWidth,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 30 : 18,
    marginTop: 20,
    color: Colors.black,
    fontFamily: 'Poppins-Regular',
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 120 : 60,
  },
  innertext: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  dislikedes: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 50,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 50,
    resizeMode: 'contain',
    position:"relative",
    zIndex:9999
  },
  upthumpdes: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 50,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 50,
    resizeMode: 'contain',
    position:"relative",
    zIndex:9999
  },
  waittext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 32 : 16,
    fontWeight: '500',
    marginTop: 20,
    color: Colors.black,
    fontFamily: 'Poppins-Regular',
  },
  typinganimationmain: {marginTop: 25, marginLeft: -3},
  challestext: {
    textAlign: 'center',
    width: '100%',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 34 : 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#3348A3',
    marginBottom: 20,
  },
  upthumbView:{
    flexDirection:"row",
     alignItems:"center", 
     justifyContent:"space-between",
  paddingHorizontal:4, 
  position:"absolute", 
   top:"50%", 
   zIndex:999, 
   right:0
},
  coffecover: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagesize: {height: 120, width: 150},
  bottomview: {position: 'absolute', bottom: 0, left: 0, right: 0},
});
export default Challenges;

