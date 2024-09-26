import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
  PanResponder,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Share,
  Platform,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import CardsSwipe from 'react-native-cards-swipe';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {useDispatch} from 'react-redux';
import {WebView} from 'react-native-webview';
import {postRating} from '../../modules/postRating';
import {useNavigation} from '@react-navigation/native';
import {getPopertiesDetails} from '../../modules/getPopertiesDetails';
import DeviceInfo from 'react-native-device-info';
import {AutoScrollFlatList} from 'react-native-autoscroll-flatlist';
import {TypingAnimation} from 'react-native-typing-animation';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {getRating} from '../../modules/getRating';
import {postUpdateRating} from '../../modules/postUpdateRating';
import {addToFavorite} from '../../modules/addToFavorite';
import {addRemoveTrash} from '../../modules/addRemoveTrash';
import {getAgent} from '../../modules/getAgent';
import StarRating from 'react-native-star-rating-widget';
import LottieView from 'lottie-react-native';
import Loader from '../../components/Loader';
import {schoolChat} from '../../modules/schoolChat';
import {chat} from '../../modules/chat';
import {ScreenWidth} from 'react-native-elements/dist/helpers';
import {getPoperties} from '../../modules/getPoperties';
import {getFavoriteProperties} from '../../modules/getFavoriteProperties';
import {getTrash} from '../../modules/getTrash';
import {getUserDetailsSync} from '../../utils/getUserDetailsSync';
import ChatWithAgent from '../../components/ChatWithAgent';

const screenWidth = Dimensions.get('window').width;

const {width} = Dimensions.get('screen');

const ViewPropertiy = (props, imageUrl) => {
  const postid = props.route.params;
  const {route} = props;

  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [rating, setRating] = useState(0);
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [commentContent, setComentContent] = useState('dada');
  const [productId, setProductId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const property = data;
  const [isAnimating, setIsAnimating] = useState(false);
  const [calData, setCalData] = useState();
  const [schoolRating, setSchoolRating] = useState([]);
  const navigation = useNavigation();
  const [readmore, setreadmore] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [agentData, setAgentData] = useState('');
  const [showFullContent, setShowFullContent] = useState(false);
  const [map, setMap] = useState();
  const [selectedTab, setSelectedTab] = useState(0);
  const [weather, setweather] = useState();
  const [tax, settax] = useState();
  const [walk, setWalk] = useState();
  const [ratingData, setRatingData] = useState([]);
  const [schoolModalVisible, setSchoolModalVisible] = useState(false);
  const [pin, setPin] = useState(null);
  const [lntLng, setLatLng] = useState({latitude: 0.0, longitude: 0.0});
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [res, setRes] = useState([]);
  const [message, setMessage] = useState();
  const [animationDirection, setAnimationDirection] = useState('slideInRight');
  const [isImageVisible, setIsImageVisible] = useState(true);
  const [twilioToken, setTwilioToken] = useState('');

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    const dateTimeString = `${month}/${date}/${year}    ${hours}:${minutes} ${ampm}`;
    return dateTimeString;
  };
  const renderImages = () => {
    if (route.params.from === 'Home') {
      return null;
    } else if (route.params.from === 'MyFavorites') {
      return (
        <TouchableOpacity
          onPress={() => {
            handleRecycleBinPress();
          }}>
          <View>
            {isImageVisible && (
              <Image source={Images.layerfav} style={styles.chaticon} />
            )}
            {!isImageVisible && (
              <Image source={Images.redlike} style={styles.chaticon} />
            )}
          </View>
        </TouchableOpacity>
      );
    } else if (route.params.from === 'RecycleBin') {
      return (
        <TouchableOpacity
          onPress={() => {
            handleFavoritePress();
          }}>
          <View>
            {isImageVisible && (
              <Image
                source={Images.layerfav}
                style={[styles.chaticon, {transform: [{rotate: '180deg'}]}]}
              />
            )}
            {!isImageVisible && (
              <Image source={Images.upgreen} style={styles.chaticon} />
            )}
          </View>
        </TouchableOpacity>
      );
    }
  };
  const getFavPropertyApiCall = async () => {
    await dispatch(getFavoriteProperties()).then(res => {
      if (res?.payload.success) {
        setLoading(false);
        navigation.goBack();
      }
    });
  };

  const getTrashApiCall = async () => {
    await dispatch(getTrash()).then(res => {
      if (res?.payload.success) {
        setLoading(false);
        navigation.goBack();
      }
    });
  };

  const handleFavoritePress = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('post_id', postid.ID);
    await dispatch(addToFavorite(formData)).then(res => {
      if (res?.payload?.code === 200) {
        getTrashApiCall();
      }
    });
  };
  const handleRecycleBinPress = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('post_id', postid.ID);

    await dispatch(addRemoveTrash(formData)).then(res => {
      if (res?.payload?.code === 200) {
        getFavPropertyApiCall();
      }
    });
  };
  const generateLink = async () => {
    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `https://surflokal.page.link/property?propetyID=${postid.ID}`,
          domainUriPrefix:
            Platform.OS === 'android'
              ? 'https://surflokal.page.link/'
              : 'https://surflokal.page.link',
          android: {
            packageName: 'surf.lokal',
          },
          ios: {
            appStoreId: '123456789',
            bundleId: 'surf.lokal',
          },
          navigation: {
            forcedRedirectEnabled: true,
          },
        },
        dynamicLinks.ShortLinkType.SHORT,
      );
      console.log('link:', link);
      return link;
    } catch (error) {
      console.log('Generating Link Error:', error);
    }
  };
  const screenHeight = Dimensions.get('window').height;
  const firstViewHeight = (screenHeight * 60) / 100;
  const handleShare = async () => {
    const link = await generateLink();
    try {
      Share.share({
        title: 'Please check this property',
        message: link,
        url: link,
      });
    } catch (error) {
      console.log('Sharing Error:', error);
    }
  };
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnimation.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          closeModal();
          closeSchoolModal();
        } else {
          Animated.spring(slideAnimation, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;
  const schoolModal = () => {
    setSchoolModalVisible(!schoolModalVisible);
    setAnimationDirection('slideInRight');
  };
  const closeSchoolModal = () => {
    setAnimationDirection('slideOutDown');
    setTimeout(() => {
      setSchoolModalVisible(false);
      setMessage('');
    }, 500);
  };
  const chatModal = () => {
    setChatModalVisible(!chatModalVisible);
    setAnimationDirection('slideInRight');
  };
  const closeChatModal = () => {
    setAnimationDirection('slideOutDown');
    setTimeout(() => {
      setChatModalVisible(false);
      setMessage('');
    }, 500);
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleModalAnimation = () => {
    Animated.timing(slideAnimation, {
      toValue: modalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    handleModalAnimation();
  }, [modalVisible]);

  useEffect(async () => {
    const fetchUserDetails = async () => {
      const userDetails = await getUserDetailsSync();
      setUserDetails(userDetails);
      await getToken(userDetails);
    };
    fetchUserDetails();
  }, []);

  async function getToken(userDetails) {
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
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error(error.response.data ?? 'Authentication error.');
      }
      throw new Error(`ERROR received from ${requestAddress}: ${error}\n`);
    }
  }

  useEffect(() => {
    if (userDetails?.authToken) {
      getPopertiesDetailsApiCall();
      getAgentApicall();
    }
  }, [userDetails?.authToken]);

  useEffect(() => {
    scale.setValue(0.9);
    opacity.setValue(1);
    animation.setValue({x: 0, y: 0});
  }, []);

  const animation = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const getPopertiesDetailsApiCall = () => {
    setLoading(true);
    dispatch(
      getPopertiesDetails({
        postid: postid?.ID,
        authToken: userDetails?.authToken,
      }),
    ).then(response => {
      setLoading(false);

      setData(response.payload.data);
      setCalData(response.payload.data.moartage);
      setSchoolRating(response.payload.data.school);
      setweather(response.payload.data.current_weather);
      settax(response.payload.data.tax_history);
      setWalk(response.payload.data.walkscore);
      setMap(response.payload.data.address.property_address);
      setPin({
        latitude:
          response.payload.data.address.property_address.property_latitude,
        longitude:
          response.payload.data.address.property_address.property_longitude,
      });
      const res = [
        {
          ID: productId,
          property_longitude: map.property_longitude.toString(),
          property_latitude: map.property_latitude.toString(),
        },
      ];

      const property = res;
      latitude = parseFloat(property.property_latitude);
      longitude = parseFloat(property.property_longitude);
    });
  };
  const makePhoneCall = () => {
    let phoneNumber = '1-888-508-3174';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const savefile = async post_id => {
    const formData = new FormData();
    formData.append('post_id', post_id);
    await dispatch(addToFavorite(formData)).then(response => {
      setLoading(true);
      if (res?.payload?.code === 200) {
        getPopertiesApiCall({type: 0, data: {limit: 1}, lntLng});
      }
    });
  };
  const getPopertiesApiCall = async type => {
    await dispatch(getPoperties(type)).then(response => {
      if (response?.payload?.success) {
        setLoading(false);
        navigation.goBack();
      }
    });
  };
  const getAgentApicall = () => {
    dispatch(getAgent()).then(response => {
      console.log('response.payload.data', response);
      if (response.payload.data[0]) {
        setAgentData(response.payload.data);
      } else {
        console.log('enter else');
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

  const trashfile = async post_id => {
    const formData = new FormData();
    formData.append('post_id', post_id);
    await dispatch(addRemoveTrash(formData)).then(response => {
      setLoading(true);
      if (response.payload?.data?.success) {
        getPopertiesApiCall({type: 0, data: {limit: 1}, lntLng});
      }
    });
  };

  const updateReview = async post_id => {
    try {
      setIsAnimating(true);

      const formData = new FormData();
      formData.append('postid', productId);
      formData.append('comment_content', commentContent ? commentContent : '');
      formData.append('review_title', reviewTitle);
      formData.append('review_stars', rating);
      formData.append('description_review_stars', rating1);
      formData.append('price_review_stars', rating2);
      formData.append('interest_review_stars', rating3);
      console.log('postUpdateRating', formData);

      dispatch(postUpdateRating(formData)).then(response => {
        if (response.payload.success) {
          setIsAnimating(false);
          toggleModal();
        } else {
          setIsAnimating(false);
          toggleModal();
        }
      });
    } catch (error) {
      setIsAnimating(false);
      console.error('Error submitting review:', error);
    }
  };
  const addReview = async () => {
    try {
      setIsAnimating(true);

      const formData = new FormData();
      formData.append('postid', productId.toString());
      formData.append('reviewtitle', reviewTitle);
      // formData.append('photo_quality_rating', rating);
      // formData.append('desc_stars', rating1);
      // formData.append('price_stars', rating2);
      // formData.append('interest_stars', rating3);
      formData.append('photo_quality_rating', rating ?? 0);
      formData.append('desc_stars', rating1 ?? 0);
      formData.append('price_stars', rating2 ?? 0);
      formData.append('interest_stars', rating3 ?? 0);
      formData.append('content', commentContent ? commentContent : '');

      const response = await dispatch(postRating(formData));

      if (response.payload.data.success) {
        setIsAnimating(false);
        toggleModal();
      } else {
        setIsAnimating(false);
        toggleModal();
      }
    } catch (error) {
      setIsAnimating(false);
      console.error('Error submitting review:', error);
    }
  };
  const Details = () => {
    return (
      <>
        <View style={styles.detailView}>
          <View style={styles.viewstyle}>
            <View style={styles.view1}>
              <Text style={styles.property}>Property Details</Text>
              <Text style={styles.props}>
                Price:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.property_details?.price}
                </Text>
              </Text>
              <Text style={styles.props}>
                Est. Taxes:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.property_details?.taxes}
                </Text>
              </Text>
              <Text style={styles.props}>
                Bedrooms:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.property_details?.bedrooms}
                </Text>{' '}
              </Text>
              <Text style={styles.props}>
                Bathrooms:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.property_details?.bedrooms}
                </Text>
              </Text>
              <Text style={styles.props}>
                Size:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.property_details?.property_size} SF{' '}
                </Text>{' '}
              </Text>
              <Text style={styles.props}>
                Garage Spaces:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.property_details?.garagespaces}
                </Text>
              </Text>
              <Text style={styles.props}>
                Lot Size: <Text style={styles.fontstyle}>{data?.hoa_fee}</Text>
              </Text>
              <Text style={styles.props}>
                Year Built :{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.property_details?.yearbuilt}{' '}
                </Text>{' '}
              </Text>
              <Text style={styles.props}>
                Total Stories:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.property_details?.storiestotal}
                </Text>
              </Text>
              <Text style={styles.props}>
                Days on Market : <Text style={styles.fontstyle}>1</Text>
              </Text>
            </View>
            <View style={styles.detailmiddleview}>
              <Text style={styles.property}>Community Details</Text>
              <Text style={styles.props}>
                Community Name:{' '}
                <Text style={styles.communityText}>
                  {data?.details?.community_details?.community_name}
                </Text>
              </Text>
              <Text style={styles.props}>
                HOA Fee Includes:{' '}
                <Text style={styles.communityText}>{data?.hoa_fee}</Text>
              </Text>
              <Text style={styles.props}>
                Community Features:{' '}
                <Text style={styles.communityText}>
                  Bike Storage, Community Kitchen, Fitness Center, Library,
                  Barbecue, Picnic Area, Pool, Shuffleboard Court, Spa Hot Tub,
                  Storage, Trash, Vehicle Wash Area, Elevators Boat Facilities,
                  Non Gated
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.viewstyle}>
            <View style={styles.detailmiddleview}>
              <Text style={styles.property}>Interior Features</Text>
              <Text style={styles.props}>
                A/C:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.interior_features?.A_C}
                </Text>
              </Text>
              <Text style={styles.props}>
                Heating:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.interior_features?.heating}
                </Text>
              </Text>
              <Text style={styles.props}>
                Flooring:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.interior_features?.flooring}{' '}
                </Text>
              </Text>
              <Text style={styles.props}>
                Property Rooms:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.interior_features?.property_rooms}
                </Text>
              </Text>
            </View>
            <View style={styles.detailmiddleview}>
              <Text style={styles.property}>Exterior Features</Text>
              <Text style={styles.props}>
                Architectural Style:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.exterior_features?.architecturalstyle}
                </Text>
              </Text>
              <Text style={styles.props}>
                Construction:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.exterior_features?.construction}
                </Text>
              </Text>
              <Text style={styles.props}>
                Roofing:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.exterior_features?.roofing}{' '}
                </Text>
              </Text>
              <Text style={styles.props}>
                Water Source:{' '}
                <Text style={styles.fontstyle}>
                  {data?.details?.exterior_features?.watersource}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.viewstyle}>
            <View style={styles.detailbottomview}>
              <Text style={styles.property}>Miscellaneous Details</Text>
              <Text style={styles.props}>
                Driving Directions:{' '}
                <Text style={styles.detailbottomtext}>
                  {data?.details?.miscellaneous_details?.driving_directions}
                </Text>{' '}
              </Text>
              <Text style={styles.props}>
                Listing Office:{' '}
                <Text style={styles.detailbottomtext}>
                  {data?.details?.miscellaneous_details?.listing_office}
                </Text>{' '}
              </Text>
              <Text style={styles.props}>
                Listing Agent:{' '}
                <Text style={styles.detailbottomtext}>
                  {data?.details?.miscellaneous_details?.listing_agent}
                </Text>{' '}
              </Text>
              <Text style={styles.props}>
                Listing Office Phone:{' '}
                <Text style={styles.detailbottomtext}>
                  {data?.details?.miscellaneous_details?.listing_office_phone}
                </Text>{' '}
              </Text>
              <Text style={styles.props}>
                Data Disclaimer:{' '}
                <Text style={styles.detailbottomtext}>
                  {data?.details?.miscellaneous_details?.data_disclaimer}
                </Text>{' '}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const Featuers = () => {
    return (
      <>
        <ScrollView style={styles.detailView}>
          <View style={styles.viewstyle}>
            <View style={styles.featureview}>
              <Text style={[styles.property, {marginBottom: 8}]}>
                {' '}
                Property Features & Amenities{' '}
              </Text>
              <FlatList
                numColumns={2}
                data={property?.features?.property_features}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <>
                    <View style={styles.middleView}>
                      <Image
                        source={Images.check}
                        style={styles.checkimagestyle}></Image>
                      <Text style={styles.checkText}>{item}</Text>
                    </View>
                  </>
                )}
              />
            </View>
          </View>
        </ScrollView>
      </>
    );
  };
  const Address = () => {
    return (
      <ScrollView style={styles.detailView}>
        <View style={[styles.viewstyle1, {marginTop: 20}]}>
          <View style={styles.featureview}>
            <Text style={[styles.property, {marginBottom: 6}]}>
              {' '}
              Property Address & Location{' '}
            </Text>
            <Text style={styles.props}>
              Address:{' '}
              <Text style={styles.fontstyle}>
                {' '}
                {property?.address.property_address.address}
              </Text>
            </Text>
            <Text style={styles.props}>
              Area:{' '}
              <Text style={styles.fontstyle}>
                {' '}
                {property?.address.property_address.area}
              </Text>
            </Text>
            <Text style={styles.props}>
              State:{' '}
              <Text style={styles.fontstyle}>
                {' '}
                {property?.address.property_address.state_county}
              </Text>
            </Text>
            <Text style={styles.props}>
              County:{' '}
              <Text style={styles.fontstyle}>
                {' '}
                {property?.address.property_address.Country}
              </Text>
            </Text>
            <Text style={styles.props}>
              Zip:{' '}
              <Text style={styles.fontstyle}>
                {' '}
                {property?.address.property_address.zip}
              </Text>
            </Text>
          </View>
          <View style={styles.maincovermap}>
            <MapView
              provider={PROVIDER_DEFAULT}
              style={styles.map}
              region={{
                latitude: parseFloat(pin.latitude),
                longitude: parseFloat(pin.longitude),
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker
                showCallout={false}
                coordinate={{
                  latitude: parseFloat(pin.latitude),
                  longitude: parseFloat(pin.longitude),
                }}>
                <Image
                  source={Images.locationss}
                  style={styles.locationImagestyle}
                />
              </Marker>
            </MapView>
          </View>
        </View>
      </ScrollView>
    );
  };
  const NearBy = () => {
    return (
      <>
        <Text style={[styles.property1, ,]}>What’s Nearby?</Text>
        <View style={styles.detailView}>
          <View style={styles.address1}>
            <FlatList
              data={property?.what_is_nearby}
              renderItem={({item}) => (
                <>
                  <View style={styles.nearbyView}>
                    <View style={styles.nearbyView2}>
                      <Text style={styles.unitname}>{item.unite_name}</Text>
                      <Text style={styles.unitdistance}>
                        {item.unit_distance}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            />
          </View>
        </View>
      </>
    );
  };
  const WalkSco = () => {
    return (
      <>
        <View style={styles.addresss}>
          <WebView
            source={{uri: walk?.walkscore_details}}
            onLoad={console.log('loaded')}
            style={styles.featureview}
          />
        </View>
      </>
    );
  };
  const CurrentWeather = () => {
    return (
      <>
        <View style={styles.detailView}>
          <Text style={[styles.property, {marginTop: 20}]}>
            Current Weather
          </Text>
          <View style={styles.weatherView}>
            <View style={[styles.addresss, {width: '40%'}]}>
              <View style={{marginBottom: 15}}>
                <Text style={styles.props}>Location </Text>
                <Text style={styles.locationText}>{weather.location_name}</Text>
              </View>

              <View style={styles.localview}>
                <Text style={styles.props}>Local Time </Text>
                <Text style={styles.locationText}>
                  {weather.location_localtime}
                </Text>
              </View>

              <View style={styles.conditionView}>
                <Text style={styles.props}>Conditions </Text>
                <Text style={styles.locationText}>
                  {weather.condition_text}
                </Text>
                <Image
                  style={styles.weatherimagestyle}
                  source={{uri: weather?.current_condition_icon}}
                />
              </View>
              <View style={styles.localview}>
                <Text style={styles.props}>Current Temperature </Text>
                <Text style={styles.locationText}>
                  {((+weather.current_temp * 9) / 5 + 32).toFixed(2)}
                  {' ℉'}
                </Text>
              </View>
            </View>

            <LottieView
              style={styles.lottieStyle}
              source={require('../../assets/animations/WeatherCode.json')}
              autoPlay
              loop
            />
          </View>
          <View style={styles.localview}>
            <Text style={styles.props}>Local Forecast</Text>
            <Text style={styles.locationText}>
              Mostly Sunny conditions expected today with a few scattered
              showers around 5pm.
            </Text>
          </View>
        </View>
      </>
    );
  };
  const Calculator = () => {
    return (
      <>
        <View style={styles.calculatorView}>
          <Text style={styles.property2}>Mortgage Calculator</Text>

          <ScrollView
            style={[styles.addresss1, {flex: 1, flexGrow: 1, height: '100%'}]}>
            <WebView
              style={styles.webViewStyle}
              source={{uri: calData?.moartage_details}}
              onLoad={() => console.log('loaded')}
            />
          </ScrollView>
        </View>
      </>
    );
  };
  const School = () => {
    const [res, setRes] = useState([]);
    const [message, setMessage] = useState();
    const [loading, setLoading] = useState(false);
    const slideAnimation = new Animated.Value(-300);

    useEffect(() => {}, [res]);
    const navigation = useNavigation();
    const getCurrentDateTime = () => {
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const date = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const dateTimeString = `${year}-${month}-${date} ${hours}:${minutes}`;
      return dateTimeString;
    };
    return (
      <>
        <Text style={styles.property3}>Closest Schools</Text>

        <View style={styles.detailView}>
          <View>
            <FlatList
              data={schoolRating.school_Info}
              renderItem={({item}) => (
                <>
                  <View style={styles.schoolView}>
                    <View style={styles.featureview}>
                      <Text style={styles.schoolname}>{item.schools_name}</Text>
                      <Text style={styles.schoolsummary}>
                        {item.school_summary}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            />
          </View>

          <View style={styles.schoolButtonview}>
            <TouchableOpacity
              onPress={() => {
                schoolModal();
              }}
              style={styles.schoolbuttonTouchableopacity}>
              <Text style={styles.schoolbuttonText}>School Info</Text>
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAvoidingView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={schoolModalVisible}
            onRequestClose={schoolModal}>
            <View style={styles.modalView}>
              <View style={styles.modalview2}>
                <View style={styles.modalView3}>
                  <Image
                    style={styles.trainImage}
                    source={Images.train}></Image>

                  <Text style={styles.cynthiaText}> Powered by Cynthia®</Text>
                </View>

                <View style={styles.reloadView}>
                  <TouchableOpacity
                    onPress={() => {
                      setRes([]);
                    }}
                    style={styles.reloadTouchableopacity}>
                    <Image
                      style={styles.reloadImage}
                      source={Images.reload}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => closeSchoolModal()}
                    style={styles.closetouchableopacity}>
                    <Image
                      style={styles.closeImage}
                      source={Images.whiteclose}></Image>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.normalView1}></View>
              <View style={styles.cynithiaView}>
                <Text style={styles.cynthiaText1}>
                  I'm Cynthia. How can I help you?
                </Text>

                <AutoScrollFlatList
                  nestedScrollEnabled={true}
                  data={res}
                  threshold={20}
                  renderItem={({item, index}) => {
                    return (
                      <View>
                        <Text
                          style={[
                            styles.messagetext,
                            {
                              backgroundColor:
                                item.type === 0
                                  ? Colors.surfblur
                                  : Colors.white,
                              alignSelf:
                                item.type === 0 ? 'flex-end' : 'flex-start',
                              color:
                                item.type === 0 ? Colors.white : Colors.black,
                            },
                          ]}>
                          {item.message}
                        </Text>
                        <Text
                          style={[
                            styles.dateText,
                            {
                              marginLeft: item.type === 0 ? 8 : 16,
                              marginRight: item.type === 0 ? 16 : 8,
                              alignSelf:
                                item.type === 0 ? 'flex-end' : 'flex-start',
                            },
                          ]}>
                          {item.date}
                        </Text>
                      </View>
                    );
                  }}
                />
                <View style={styles.messageView}>
                  {loading && (
                    <Text style={styles.messageText1}>{message}</Text>
                  )}

                  {loading && (
                    <View style={styles.xyz}>
                      <Text style={styles.typingstyle}>typing</Text>
                      <TypingAnimation
                        dotColor="black"
                        dotMargin={3}
                        dotAmplitude={2}
                        dotSpeed={0.15}
                        dotRadius={1}
                        dotX={8}
                        dotY={0}
                        style={styles.typingAnimation}
                      />
                    </View>
                  )}

                  <View style={styles.textinputView}>
                    <TextInput
                      style={styles.textinputstyle3}
                      placeholder="Type here"
                      placeholderTextColor={Colors.black}
                      value={message}
                      onChangeText={setMessage}></TextInput>
                    <TouchableOpacity
                      onPress={() => {
                        setLoading(true);
                        dispatch(schoolChat({message: message}))
                          .then(ress => {
                            setLoading(false);

                            const newTodo1 = {
                              type: 0,
                              message: message,
                              date: getCurrentDateTime(),
                            };
                            const newTodo = {
                              type: 1,
                              message: ress.payload.data.text,
                              date: getCurrentDateTime(),
                            };
                            setMessage('');
                            setRes([...res, newTodo1, newTodo]);
                          })
                          .catch(e => {
                            alert('Error ==> ' + JSON.stringify(e));
                          });
                      }}
                      style={styles.sendtouchablestyle}>
                      <Image
                        style={styles.sendimagestyle}
                        source={Images.sendm}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </>
    );
  };

  return (
    <View style={styles.views}>
      {loading ? (
        <>
          <StatusBar backgroundColor={'#5BB3FF'} />
          <View style={styles.topview}>
            <Loader />
          </View>
        </>
      ) : null}
      <SafeAreaView style={styles.safeareastyle}>
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <View style={styles.headerIcon}>
            <TouchableOpacity
              style={styles.arrowTouchableopacity}
              onPress={() => navigation.goBack()}>
              <Image
                style={styles.arrowimagestyle}
                source={Images.leftnewarrow}></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.cardswipeview1}>
            <View style={[styles.cardswipeview2, {height: firstViewHeight}]}>
              <View style={styles.cardswipe4}>
                <View style={styles.cardswipeview3}>
                  <CardsSwipe
                    style={styles.cardswipe}
                    loop={true}
                    cards={[data]}
                    onSwipedLeft={() => {
                      trashfile(postid.ID);
                    }}
                    onSwipedRight={() => {
                      savefile(postid.ID);
                    }}
                    renderNope={() =>
                      props.route.params.from === 'MyFavorites' ||
                      props.route.params.from === 'Home' ? (
                        <View
                          style={[
                            styles.nopeView,
                            {
                              height: screenHeight + 500,
                              width: screenWidth - 16,
                            },
                          ]}>
                          <View
                            style={[
                              styles.nopeView1,
                              {height: screenHeight - firstViewHeight - 27},
                            ]}>
                            <View style={styles.nopeView2}>
                              <Image
                                source={Images.deletethumb}
                                style={styles.deletethumbimage}
                              />
                            </View>
                          </View>
                        </View>
                      ) : null
                    }
                    renderYep={() =>
                      props.route.params.from === 'RecycleBin' ||
                      props.route.params.from === 'Home' ? (
                        <View
                          style={[
                            styles.yepView,
                            {height: screenHeight + 500, width: screenWidth},
                          ]}>
                          <View
                            style={[
                              styles.nopeView1,
                              {height: screenHeight - firstViewHeight - 27},
                            ]}>
                            <View style={styles.nopeView2}>
                              <Image
                                source={Images.ThumbUp}
                                style={styles.likethumbImage}
                              />
                            </View>
                          </View>
                        </View>
                      ) : null
                    }
                    renderCard={(item, index) => (
                      <View style={styles.renderView}>
                        <View style={styles.renderview2}>
                          <TouchableOpacity
                            style={styles.renderTouchable}
                            onPress={() =>
                              navigation.navigate('ViewPropertiyImage', {
                                postid: postid.ID,
                              })
                            }>
                            <Image
                              style={styles.mainimagestyle}
                              source={{uri: item?.featured_image_src}}
                            />
                            <View>{renderImages()}</View>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.view22}>
                          <View style={styles.view23}>
                            <View style={styles.view24}>
                              <TouchableOpacity
                                onPress={() => {
                                  setProductId(item.ID);
                                  setReviewTitle(item.title);
                                  toggleModal();
                                  dispatch(getRating(item.ID)).then(
                                    response => {
                                      setRatingData(response.payload.data);
                                      setRating(
                                        response?.payload?.data[0]
                                          ?.photo_wuality_rating,
                                      );
                                      setRating1(
                                        response?.payload?.data[0]
                                          ?.description_review_stars,
                                      );
                                      setRating2(
                                        response?.payload?.data[0]
                                          ?.price_review_stars,
                                      );
                                      setRating3(
                                        response?.payload?.data[0]
                                          ?.interest_review_stars,
                                      );
                                    },
                                  );
                                }}>
                                <Image
                                  source={
                                    item?.Total_average_rating > 0
                                      ? Images.startfill
                                      : Images.star2
                                  }
                                  style={styles.imagestyle2}></Image>
                              </TouchableOpacity>
                              {item?.Total_average_rating > 0 ? (
                                <Text style={styles.averageText}>
                                  {Math.round(item?.Total_average_rating)}
                                </Text>
                              ) : null}
                            </View>

                            <TouchableOpacity
                              onPress={() => {
                                handleShare();
                              }}>
                              <Image
                                source={Images.sendnew}
                                style={styles.imagestyle2}></Image>
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.priceText}>{item?.price}</Text>
                          <View style={styles.view25}>
                            <Text style={styles.titleText} numberOfLines={1}>
                              {property?.title}
                            </Text>
                          </View>

                          <View style={styles.view26}>
                            <View>
                              <View style={styles.view27}>
                                <View style={styles.view28}>
                                  <View style={styles.view29}>
                                    <View style={styles.view30}>
                                      <Image
                                        source={Images.newbed}
                                        style={styles.newbedstyle}></Image>
                                      <Text style={styles.bedText}>
                                        {item?.bedrooms ? item.bedrooms : '0'}

                                        {' Beds'}
                                      </Text>
                                    </View>
                                  </View>

                                  <View style={styles.view29}>
                                    <View style={styles.view30}>
                                      <Image
                                        source={Images.bathtub}
                                        style={styles.bathtubstyle}></Image>
                                      <Text style={styles.bedText}>
                                        {item?.bathroomsfull?.length > 0
                                          ? item.bathroomsfull
                                          : '0'}

                                        {' Baths'}
                                      </Text>
                                    </View>
                                  </View>

                                  <View style={styles.view29}>
                                    <View style={styles.view30}>
                                      <Image
                                        source={Images.measuringtape}
                                        style={styles.tapeStyle}></Image>
                                      <Text style={styles.bedText}>
                                        {item?.details?.property_details
                                          .property_size?.length > 0
                                          ? item.details.property_details
                                              ?.property_size
                                          : '0'}

                                        {' SF'}
                                      </Text>
                                    </View>
                                  </View>

                                  <View style={styles.view29}>
                                    <View style={styles.view30}>
                                      <Image
                                        source={Images.hoa2}
                                        style={styles.hoastyle}></Image>
                                      <Text style={styles.bedText}>
                                        {'$'}
                                        {item?.hoa_fee?.length > 0
                                          ? item.hoa_fee
                                          : '0'}
                                      </Text>
                                    </View>
                                  </View>
                                  <View style={styles.view29}>
                                    <View style={styles.view30}>
                                      <Image
                                        source={Images.taxnew}
                                        style={styles.taxstyle}></Image>
                                      <Text style={styles.bedText}>
                                        {item?.details?.property_details?.taxes
                                          ?.length > 0
                                          ? item.details.property_details.taxes
                                          : '0'}
                                      </Text>
                                    </View>
                                  </View>
                                  <View style={styles.view29}>
                                    <View style={styles.view30}>
                                      <Image
                                        source={Images.cals}
                                        style={styles.calendarstyle}></Image>
                                      <Text style={styles.bedText}>
                                        {item?.details?.property_details
                                          ?.yearbuilt?.length > 0
                                          ? item.details.property_details
                                              .yearbuilt
                                          : '0'}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>

            <View style={styles.view11}>
              <View>
                <>
                  <View style={styles.view12}>
                    <Text
                      numberOfLines={property?.ID == readmore ? 0 : 100}
                      style={styles.readmorestyle}>
                      {typeof property?.content?.rendered === 'string' ? (
                        <>
                          {!showFullContent ||
                          property?.content?.rendered?.length < 100
                            ? property?.content.rendered
                            : property?.content.rendered.slice(0, 100) + ''}
                        </>
                      ) : null}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.view30}
                    onPress={() => setShowFullContent(!showFullContent)}>
                    <Text style={styles.showlessTest}>
                      {!showFullContent ? 'Show Less' : 'Read More'}
                    </Text>
                  </TouchableOpacity>
                </>
              </View>
              <View style={styles.view13}></View>
              <View style={styles.view14}>
                <View style={styles.featuresDetails}>
                  <ScrollView
                    horizontal={true}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}>
                    <View style={styles.view15}>
                      <View style={styles.featuersComtainer}>
                        <View style={{justifyContent: 'center'}}>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedTab(0);
                            }}
                            style={styles.detailsStyle}>
                            <Image
                              source={Images.details}
                              style={[
                                styles.detailImage,
                                {
                                  tintColor:
                                    selectedTab == 0 ? '#0165C5' : Colors.black,
                                },
                              ]}></Image>
                            <Text
                              style={[
                                styles.detailTextstyle,
                                {
                                  color:
                                    selectedTab == 0 ? '#0165C5' : Colors.black,
                                  borderBottomColor:
                                    selectedTab == 0 ? '#0165C5' : Colors.white,
                                  borderBottomWidth: selectedTab == 0 ? 1 : 0,
                                  fontFamily:
                                    selectedTab == 0
                                      ? 'Poppins-Medium'
                                      : 'Poppins-Light',
                                },
                              ]}>
                              Details
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.featuersComtainer}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedTab(1);
                            selectedTab ? Colors.darbluec : 'black';
                          }}
                          style={styles.detailsStyle}>
                          <Image
                            source={Images.featuresnew}
                            style={[
                              styles.detailImage,
                              {
                                tintColor:
                                  selectedTab == 1 ? '#0165C5' : Colors.black,
                              },
                            ]}></Image>
                          <Text
                            style={[
                              styles.detailTextstyle,
                              {
                                color:
                                  selectedTab == 1 ? '#0165C5' : Colors.black,
                                borderBottomColor:
                                  selectedTab == 1 ? '#0165C5' : Colors.white,
                                borderBottomWidth: selectedTab == 1 ? 1 : 0,
                              },
                            ]}>
                            Features
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.featuersComtainer}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedTab(2);
                          }}
                          style={styles.detailsStyle}>
                          <Image
                            source={Images.mapnew}
                            style={[
                              styles.detailImage,
                              {
                                tintColor:
                                  selectedTab == 2 ? '#0165C5' : Colors.black,
                              },
                            ]}></Image>
                          <Text
                            style={[
                              styles.detailTextstyle,
                              {
                                color:
                                  selectedTab == 2 ? '#0165C5' : Colors.black,
                                borderBottomColor:
                                  selectedTab == 2 ? '#0165C5' : Colors.white,
                                borderBottomWidth: selectedTab == 2 ? 1 : 0,
                              },
                            ]}>
                            Location
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.featuersComtainer}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedTab(6);
                          }}
                          style={styles.detailsStyle}>
                          <Image
                            source={Images.payment}
                            style={[
                              styles.detailImage,
                              {
                                tintColor:
                                  selectedTab == 6 ? '#0165C5' : Colors.black,
                              },
                            ]}></Image>
                          <Text
                            style={[
                              styles.detailTextstyle,
                              {
                                color:
                                  selectedTab == 6 ? '#0165C5' : Colors.black,
                                borderBottomColor:
                                  selectedTab == 6 ? '#0165C5' : Colors.white,
                                borderBottomWidth: selectedTab == 6 ? 1 : 0,
                              },
                            ]}>
                            Payment
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.featuersComtainer}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedTab(3);
                          }}
                          style={styles.detailsStyle}>
                          <Image
                            source={Images.nearBy1}
                            style={[
                              styles.detailImage,
                              {
                                tintColor:
                                  selectedTab == 3 ? '#0165C5' : Colors.black,
                              },
                            ]}></Image>
                          <Text
                            style={[
                              styles.detailTextstyle,
                              {
                                color:
                                  selectedTab == 3 ? '#0165C5' : Colors.black,
                                borderBottomColor:
                                  selectedTab == 3 ? '#0165C5' : Colors.white,
                                borderBottomWidth: selectedTab == 3 ? 1 : 0,
                              },
                            ]}>
                            Nearby
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.featuersComtainer}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedTab(7);
                          }}
                          style={styles.detailsStyle}>
                          <Image
                            source={Images.schoolbus}
                            style={[
                              styles.detailImage,
                              {
                                tintColor:
                                  selectedTab == 7 ? '#0165C5' : Colors.black,
                              },
                            ]}></Image>
                          <Text
                            style={[
                              styles.detailTextstyle,
                              {
                                color:
                                  selectedTab == 7 ? '#0165C5' : Colors.black,
                                borderBottomColor:
                                  selectedTab == 7 ? '#0165C5' : Colors.white,
                                borderBottomWidth: selectedTab == 7 ? 1 : 0,
                              },
                            ]}>
                            Schools
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.featuersComtainer}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedTab(5);
                          }}
                          style={styles.detailsStyle}>
                          <Image
                            source={Images.cloudysun}
                            style={[
                              styles.detailImage,
                              {
                                tintColor:
                                  selectedTab == 5 ? '#0165C5' : Colors.black,
                              },
                            ]}></Image>
                          <Text
                            style={[
                              styles.detailTextstyle,
                              {
                                color:
                                  selectedTab == 5 ? '#0165C5' : Colors.black,
                                borderBottomColor:
                                  selectedTab == 5 ? '#0165C5' : Colors.white,
                                borderBottomWidth: selectedTab == 5 ? 1 : 0,
                              },
                            ]}>
                            Weather
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>

                  <KeyboardAvoidingView>
                    <Modal
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={toggleModal}>
                      <View style={styles.modalContainer}>
                        <TouchableOpacity
                          activeOpacity={1}
                          style={styles.modalOverlaynew}
                          onPress={closeModal}
                        />
                        <Animated.View
                          {...panResponder.panHandlers}
                          style={[
                            styles.modalContentnew,
                            {
                              transform: [
                                {
                                  translateY: slideAnimation.interpolate({
                                    inputRange: [-300, 0],
                                    outputRange: [-300, 0],
                                  }),
                                },
                              ],
                            },
                          ]}>
                          {/* <ScrollView style={styles.bgcover}> */}
                          <View style={styles.view16}>
                            <View style={styles.indicator}></View>
                          </View>
                          <ScrollView
                            style={styles.bgcover}
                            showsVerticalScrollIndicator={false}>
                            <View style={{}}>
                              <Text style={styles.reviewtxt}>
                                Rate This Property
                              </Text>
                            </View>

                            <View style={styles.maincov}>
                              <View
                                style={[styles.labelcover, {marginTop: 10}]}>
                                <Text style={styles.propertlabel}>
                                  Photo Quality:
                                </Text>

                                <StarRating
                                  maxStars={5}
                                  starSize={27}
                                  enableSwiping
                                  enableHalfStar
                                  color={Colors.surfblur}
                                  rating={rating}
                                  onChange={value => {
                                    setRating(value);
                                  }}
                                />

                                <View style={styles.view17}></View>
                              </View>

                              <View style={styles.labelcover}>
                                <Text style={styles.propertlabel}>
                                  Description Accuracy:
                                </Text>

                                <StarRating
                                  maxStars={5}
                                  starSize={27}
                                  enableSwiping
                                  enableHalfStar
                                  color={Colors.surfblur}
                                  rating={rating1}
                                  onChange={value => {
                                    setRating1(value);
                                  }}
                                />
                                <View style={styles.view17}></View>
                              </View>

                              <View style={styles.labelcover}>
                                <Text style={styles.propertlabel}>Price :</Text>

                                <StarRating
                                  maxStars={5}
                                  starSize={27}
                                  enableSwiping
                                  enableHalfStar
                                  color={Colors.surfblur}
                                  rating={rating2}
                                  onChange={value => {
                                    setRating2(value);
                                  }}
                                />
                                <View style={styles.view17}></View>
                              </View>

                              <View style={styles.labelcover}>
                                <Text style={styles.propertlabel}>
                                  Interest in the property:
                                </Text>

                                <StarRating
                                  maxStars={5}
                                  starSize={27}
                                  enableSwiping
                                  enableHalfStar
                                  color={Colors.surfblur}
                                  rating={rating3}
                                  onChange={value => {
                                    setRating3(value);
                                  }}
                                />
                                <View style={styles.view17}></View>
                              </View>

                              <View style={styles.reviewcover}>
                                <Text style={styles.propertlabel}>
                                  My Notes
                                </Text>
                                <View style={styles.textinputcover}>
                                  {ratingData?.length > 0 ? (
                                    <TextInput
                                      multiline={true}
                                      style={styles.textinputstyle1}
                                      onChangeText={text =>
                                        setComentContent(text)
                                      }
                                      autoFocus
                                    />
                                  ) : (
                                    <TextInput
                                      onChangeText={text =>
                                        setComentContent(text)
                                      }
                                      multiline={true}
                                      style={styles.textinputstyle}></TextInput>
                                  )}
                                </View>
                              </View>
                              <View style={styles.btnmaincover}>
                                {ratingData?.length > 0 ? (
                                  <View style={styles.submitbtnmain}>
                                    <TouchableOpacity
                                      onPress={() => updateReview()}
                                      style={styles.submitbtncover}>
                                      <Text style={styles.submitbtntxt}>
                                        UPDATE
                                      </Text>
                                    </TouchableOpacity>
                                    {isAnimating && (
                                      <LottieView
                                        style={styles.loaderstyle1}
                                        source={require('../../assets/animations/star.json')}
                                        autoPlay
                                        loop
                                      />
                                    )}
                                  </View>
                                ) : (
                                  <View style={styles.submitbtnmain}>
                                    <TouchableOpacity
                                      onPress={() => addReview()}
                                      style={styles.submitbtncover}>
                                      <Text style={styles.submitbtntxt}>
                                        Save
                                      </Text>
                                    </TouchableOpacity>
                                    {isAnimating && (
                                      <LottieView
                                        style={styles.loaderstyle1}
                                        source={require('../../assets/animations/star.json')}
                                        autoPlay
                                        loop
                                      />
                                    )}
                                  </View>
                                )}
                              </View>
                            </View>
                          </ScrollView>
                          {/* </ScrollView> */}
                        </Animated.View>
                      </View>
                    </Modal>
                  </KeyboardAvoidingView>
                </View>
              </View>
            </View>
          </View>
          {selectedTab == 0 ? (
            <Details />
          ) : selectedTab == 1 ? (
            <Featuers />
          ) : selectedTab == 2 ? (
            <Address />
          ) : selectedTab == 3 ? (
            <NearBy />
          ) : selectedTab == 4 ? (
            <WalkSco />
          ) : selectedTab == 5 ? (
            <CurrentWeather />
          ) : selectedTab == 6 ? (
            <Calculator />
          ) : (
            <School />
          )}
          <View style={styles.view18}></View>
          <KeyboardAvoidingView>
            <Modal
              transparent={true}
              animationType="slide"
              visible={chatModalVisible}
              onRequestClose={chatModal}>
              <SafeAreaView style={styles.safearea}>
                <View style={styles.view19}>
                  <View style={styles.view20}>
                    <Image
                      style={styles.userImagestyle}
                      source={Images.user}></Image>

                    <Text style={styles.cynthiaText}> Powered by Cynthia</Text>
                  </View>

                  <View style={styles.view3}>
                    <TouchableOpacity
                      onPress={() => {
                        closeChatModal();
                      }}
                      style={styles.closechatstyle}>
                      <Image
                        style={styles.closeImagestyle}
                        source={Images.whiteclose}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
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
              </SafeAreaView>
            </Modal>
          </KeyboardAvoidingView>
        </ScrollView>
        <View style={styles.bottomView}>
          <View style={styles.bottomView2}>
            <TouchableOpacity
              style={styles.bottomopacity}
              onPress={() => {
                makePhoneCall();
              }}>
              <Image source={Images.newcall} style={styles.callstyle}></Image>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.chatopacity}
              onPress={() => {
                chatModal();
              }}>
              <Image source={Images.chatnew} style={styles.callstyle}></Image>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('BookaTour', {
                PropID: postid?.ID,
              });
            }}
            style={styles.bookopacity}>
            <Text style={styles.tourtext}>Schedule a Tour</Text>
            <LottieView
              style={styles.lottieview}
              source={require('../../assets/animations/SurfVan.json')}
              autoPlay
              loop
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ViewPropertiy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lottieview: {
    height: 100,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 150 : 90,
    position: 'relative',
  },
  bookopacity: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 50,
    lineHeight: 12,
    borderWidth: 2,
    backgroundColor: Colors.surfblur,
    borderColor: Colors.white,
    height: 45,
    width: '65%',
  },
  tourtext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 30 : 18,
    color: Colors.white,
    textAlign: 'center',
    left: 10,
    fontFamily: 'Poppins-Medium',
    position: 'relative',
    letterSpacing: 0,
  },
  coverlocation: {
    backgroundColor: 'rgba(255,255,255,.8)',
    height: 38,
    width: 35,
    position: 'absolute',
    top: 15,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    right: 12,
    shadowOffset: {width: -2, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  view1: {width: '50%'},
  chatopacity: {
    right: 20,
  },
  xyz: {flexDirection: 'row'},
  locationpic: {resizeMode: 'contain', width: 16, height: 16},
  tour: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    marginLeft: 5,
  },
  buttonscroll: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfblur,
    borderRadius: 100,
    height: 45,
    width: 45,
    transform: [{rotate: '-180deg'}],
  },
  call: {
    fontSize: 12,
    color: Colors.black,
    textAlign: 'center',
    marginLeft: 5,
  },
  ratetext: {
    fontSize: 12,
    color: Colors.black,
    textAlign: 'center',
    marginLeft: 5,
  },
  book: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.primaryBlue,
    borderRadius: 14,
    height: 40,
    width: '80%',
  },
  modalContainer: {
    backgroundColor: 'trasnparent',
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  rate: {
    justifyContent: 'space-evenly',

    alignItems: 'center',
    alignContent: 'center',
    width: '50%',
    flexDirection: 'row',
  },
  detailsStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 28,
  },
  map: {
    width: '100%',
    height: 326,
    borderRadius: 22,
    flex: 1,
  },
  maincovermap: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',

    position: 'relative',
    marginTop: 15,
  },
  detail: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  modalContainer: {
    // flex: 1,
    height: '90%',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalOverlaynew: {
    // flex: 1,
  },
  modalContentnew: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '72%',
  },
  bgcover: {
    height: '100%',
    backgroundColor: Colors.white,
  },
  maincov: {
    width: '100%',
    alignSelf: 'center',
  },
  propertlabel: {
    fontSize: 17,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    marginBottom: 15,
    textAlign: 'center',
  },
  chaticon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 23 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 30 : 23,
    resizeMode: 'contain',
    marginRight: 15,
    position: 'absolute',
    top: -30,
    paddingHorizontal: 20,
    // right:5,
  },
  labelcover: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textinputstyle: {
    verticalAlign: 'top',
    borderWidth: 1,
    borderColor: Colors.BorderColor,
    borderRadius: 50,
    paddingHorizontal: 12,
    fontSize: 12,
    flexWrap: 'wrap',
    color: Colors.newgray,
    fontFamily: 'Poppins-Regular',
    height: 50,
    width: '100%',
  },
  loaderstyle1: {
    height: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 99,
    left: 0,
    top: 0,
  },
  submitbtntxt: {
    fontSize: 17,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  submitbtnmain: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  submitbtncover: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 45,
    width: 100,
    borderRadius: 100,
    backgroundColor: Colors.surfblur,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnmaincover: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinputstyle1: {
    verticalAlign: 'top',
    borderWidth: 1,
    borderColor: Colors.BorderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 12,
    flexWrap: 'wrap',
    color: Colors.newgray,
    fontFamily: 'Poppins-Regular',
    height: 50,
    width: '100%',
  },
  textinputcover: {
    width: '100%',
    marginTop: 0,
    flexWrap: 'wrap',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    height: 60,
    width: '100%',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  reviewtxt: {
    fontSize: 21,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.black,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  weatherView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lottieStyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 250 : 150,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 250 : 150,
  },
  weatherimagestyle: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 30,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 30,
    position: 'absolute',
    bottom: DeviceInfo.getDeviceType() === 'Tablet' ? -12 : 0,
    left: 90,
  },
  conditionView: {marginBottom: 15, position: 'relative'},

  localview: {marginBottom: 15},
  locationText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 19 : 12,
    fontFamily: 'Poppins-Light',
    color: 'black',
  },
  calculatorView: {height: '100%', width: '100%'},
  reviewcover: {
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    marginTop: 15,
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#bac1c3',
    marginTop: 0,
    justifyContent: 'center',
    borderRadius: 100,
  },
  filterimage: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 30 : 15,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 26 : 13,
    resizeMode: 'contain',
  },
  cloud: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  imagedata: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    tintColor: Colors.black,
  },
  addresimage: {
    height: 30,
    width: 25,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  screen: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  slideOuter: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  imgg: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  property: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 15,
    color: Colors.black,

    fontFamily: 'Poppins-Medium',
  },
  property3: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 15,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
    marginBottom: 0,
    paddingBottom: 0,
    padding: 0,
    margin: 0,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  property1: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 15,
    color: Colors.black,

    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
    paddingBottom: 0,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  property2: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 15,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  webViewStyle: {flex: 1, height: 2300},
  unitname: {
    color: 'black',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
    fontFamily: 'Poppins-Light',
    marginRight: 5,
  },
  unitdistance: {
    color: 'black',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
    fontFamily: 'Poppins-Light',
    lineHeight: 22,
  },
  nearbyView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nearbyView2: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  detailText: {
    fontSize: 11,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  cloudText: {
    fontSize: 10,
    color: Colors.black,
    textAlign: 'center',
  },
  imgview: {
    flexDirection: 'row',
    width: screenWidth,
    position: 'absolute',
    bottom: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slide: {
    width: width - 18,
    height: width - 18,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  modalContentnew: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '72%',
  },
  bottom: {
    flexDirection: 'row',

    paddingVertical: 17,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    alignItems: 'center',
    alignContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fontstyle: {fontFamily: 'Poppins-Light'},

  detailView: {paddingHorizontal: 16},

  locationImagestyle: {height: 50, width: 100, resizeMode: 'contain'},

  detailmiddleview: {width: '50%'},

  communityText: {
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 22,
  },
  schoolView: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    marginVertical: 5,
    justifyContent: 'space-between',
    paddingBottom: 20,
    marginBottom: 10,
  },
  schoolname: {
    color: Colors.black,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  schoolsummary: {
    color: Colors.black,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
    fontFamily: 'Poppins-Light',
    lineHeight: 23,
  },
  schoolButtonview: {
    marginTop: 10,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    marginBottom: 10,
    width: '100%',
  },
  schoolbuttonTouchableopacity: {
    backgroundColor: Colors.surfblur,
    borderRadius: 20,
    width: 100,
    paddingVertical: 10,
    width: 120,
  },
  schoolbuttonText: {
    alignItems: 'center',
    textAlign: 'center',
    color: Colors.white,
    fontFamily: 'Poppins-medium',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
  },
  modalView: {
    height: '94%',
    width: '100%',
    marginTop: 50,
    backgroundColor: 'white',
    marginBottom: 50,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  modalview2: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#c9c9c5',
  },
  modalView3: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
  },
  trainImage: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
    marginRight: 5,
  },
  reloadImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    tintColor: Colors.black,
  },
  normalView1: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    marginTop: 12,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
  },
  messageView: {
    bottom: 70,
    position: 'absolute',
    zIndex: 99,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
  },
  views: {flex: 1},

  sendimagestyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    tintColor: Colors.surfblur,
  },
  sendtouchablestyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textinputView: {
    backgroundColor: Colors.white,
    borderColor: Colors.BorderColor,
    borderWidth: 1,
    borderRadius: 5,
    margin: 16,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  textinputstyle3: {
    width: '90%',
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  typingAnimation: {marginTop: 25, marginLeft: -3},
  typingstyle: {
    fontSize: 14,
    borderRadius: 16,
    alignSelf: 'flex-start',
    maxWidth: '70%',
    marginLeft: 16,
    marginTop: 12,
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  textview: {
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
    top: -8,
  },
  textinput: {
    width: '90%',
    backgroundColor: Colors.white,
    color: Colors.black,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 14,
  },
  messageText1: {
    padding: 16,
    fontSize: 14,
    borderRadius: 16,
    backgroundColor: Colors.surfblur,
    alignSelf: 'flex-end',
    maxWidth: '70%',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 88,
    marginBottom: 50,
    color: Colors.white,
  },
  messagetext2: {
    padding: 8,
    maxWidth: '70%',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 10,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 16,
  },
  dateText: {
    marginBottom: 8,
    fontSize: 12,
    color: Colors.gray,
  },
  messagetext: {
    padding: 8,
    fontSize: 14,
    borderRadius: 16,
    maxWidth: '70%',
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  cynthiaText1: {
    fontSize: 14,
    borderRadius: 16,
    alignSelf: 'flex-start',
    maxWidth: '70%',
    marginTop: 15,
    color: Colors.black,
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 22,
  },
  cynithiaView: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  closeImage: {
    height: 20,
    width: 20,
    top: 7,
    resizeMode: 'contain',
    borderRadius: 50,
    marginLeft: 2,
    tintColor: Colors.black,
  },
  closetouchableopacity: {
    height: 35,
    width: 35,
    borderRadius: 100,
    alignItems: 'center',
  },
  reloadTouchableopacity: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  closechatstyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 35,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 35,
    borderRadius: 100,
    alignItems: 'center',
  },
  closeImagestyle: {
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
  reloadView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginRight: 0,
  },

  cynthiaText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: Colors.black,
  },

  viewstyle: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
  },
  featureview: {width: '100%'},

  middleView: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  checkimagestyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 30 : 18,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 30 : 18,
    resizeMode: 'contain',
    marginRight: 5,
  },
  checkText: {
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 19 : 12,
  },
  detailbottomview: {width: '100%', marginTop: 30},
  detailbottomtext: {fontFamily: 'Poppins-Light', lineHeight: 25},
  address: {
    width: '100%',

    marginTop: 20,
    justifyContent: 'center',
  },
  addresss: {
    width: '100%',
    justifyContent: 'center',
  },
  props: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
    color: Colors.black,
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
  },

  prop: {
    fontSize: 13,
    color: Colors.black,
  },
  view: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 5,
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  community: {
    fontSize: 16,
    color: Colors.black,

    fontWeight: '700',
  },
  featuresDetails: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',

    paddingVertical: 0,
    justifyContent: 'center',
  },

  featuersComtainer: {
    justifyContent: 'center',
  },

  headerIcon: {
    width: '100%',
    zIndex: 9999,
    position: 'absolute',
    top: 20,
    left: 10,
  },

  cardswipeview1: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardswipeview2: {
    width: ScreenWidth - 16,
    zIndex: 999,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: `rgba(255, 255, 255, 0.01)`,
  },
  cardswipeview3: {
    width: '100%',
    height: '100%',
    zIndex: 999,
  },
  cardswipe: {
    height: '100%',
  },
  cardswipe4: {
    width: '100%',
    height: '100%',
  },
  nopeView: {
    backgroundColor: 'red',
    opacity: 0.4,
    borderRadius: 15,
    overflow: 'hidden',
  },
  nopeView1: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nopeView2: {
    backgroundColor: Colors.white,
    height: 50,
    width: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deletethumbimage: {
    height: 25,
    width: 25,
    tintColor: 'red',
  },
  likethumbImage: {
    height: 25,
    width: 25,
    tintColor: 'green',
  },
  renderTouchable: {backgroundColor: Colors.white},

  view22: {height: '40%'},
  view23: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  view24: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  view25: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  view26: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  view27: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  view28: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  view29: {
    justifyContent: 'center',
    alignItems: 'center',
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 100 : 60,
  },
  view30: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  newbedstyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 36 : 21,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 28,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  bathtubstyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 44 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 28,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  bedText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 17 : 11,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
  },
  tapeStyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 45 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 27,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  hoastyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 51 : 27,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  taxstyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 27,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 43 : 25,
    marginTop: 0,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  calendarstyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 34 : 30,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 30,
    marginTop: 0,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  view11: {flexWrap: 'wrap', marginHorizontal: 16, flexDirection: 'column'},

  view12: {flexDirection: 'row', flexWrap: 'wrap'},
  view13: {
    borderTopColor: Colors.BorderColor,
    borderTopWidth: 1,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 12,
  },
  detailImage: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 21,
    resizeMode: 'contain',
  },
  detailTextstyle: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 21 : 11,
    textAlign: 'center',
  },
  view14: {justifyContent: 'center', width: '100%'},
  view15: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  view16: {alignItems: 'center', paddingBottom: 20},

  view17: {
    width: '70%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.BorderColor,
    marginVertical: 15,
  },
  view18: {height: 70},

  view19: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#c9c9c5',
  },
  view20: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
  },
  view3: {flexDirection: 'row', justifyContent: 'space-around', marginRight: 0},

  view4: {
    bottom: 0,
    position: 'absolute',
    zIndex: 99,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
  },
  messagecynthia: {
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
  userImagestyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 40,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 40,
    resizeMode: 'contain',
    borderRadius: 50,
    marginRight: 5,
    borderColor: Colors.surfblur,
    borderWidth: 1,
  },
  safearea: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
  },

  readmorestyle: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 21 : 12,
    flexDirection: 'row',
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    flexWrap: 'wrap',
    lineHeight: 22,
    marginTop: DeviceInfo.getDeviceType() === 'Tablet' ? 16 : 0,
  },
  showlessTest: {
    color: '#1450B1',
    marginVertical: 10,
    marginBottom: 0,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 11,
    fontFamily: 'Poppins-Medium',
  },
  imagestyle2: {
    height: 23,
    width: 23,
    resizeMode: 'contain',
  },
  priceText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 25,
    color: '#1450B1',
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    width: '100%',
    textAlign: 'center',
    backgroundColor: Colors.white,
  },
  titleText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 16,
    color: Colors.black,
    marginHorizontal: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    backgroundColor: Colors.white,
  },

  averageText: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    marginLeft: 4,
    marginTop: 8,
  },
  bottomView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 8,
    height: 55,
  },
  bottomView2: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '30.33%',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  bottomopacity: {
    marginRight: 16,
  },
  callstyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 26,
    resizeMode: 'contain',
  },
  mainimagestyle: {
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 0,
  },
  renderView: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.white,
  },
  renderview2: {
    height: '60%',
  },
  yepView: {
    backgroundColor: 'green',
    opacity: 0.4,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'absolute',
  },
  arrowimagestyle: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 57 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 57 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
    tintColor: 'white',
  },
  safeareastyle: {flex: 1, backgroundColor: Colors.white},

  arrowTouchableopacity: {
    position: 'absolute',
    left: 5,
    top: -2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: 50,
    height: 50,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  topview: {
    height: '100%',
    width: '100%',
    backgroundColor: '#5BB3FF',
    position: 'absolute',
    zIndex: 99,
    left: 0,
    top: 0,
  },

  rating: {
    marginVertical: 2,
  },
  propertyt: {
    fontSize: 18,
    color: Colors.black,
    marginTop: 20,
    paddingStart: 20,
    fontFamily: 'Poppins-SemiBold',
  },

  propertyts: {
    fontSize: 14,
    color: Colors.black,
    marginTop: 20,
    fontFamily: 'Poppins-Medium',
  },
  propsmain: {
    fontFamily: 'Poppins-Medium',
    color: Colors.sitegray,
    paddingBottom: 4,
  },
  propsinnermain: {fontFamily: 'Poppins-Regular'},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0065C4',
  },
  card: {
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '92%',
    height: '70%',
  },
  card: {
    width: '100%',
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 3.3,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
});
