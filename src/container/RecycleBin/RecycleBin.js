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
  Platform,
  FlatList,
  Animated,
  PanResponder,
  Share,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import {postRating} from '../../modules/postRating';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {getTrash} from '../../modules/getTrash';
import {getRating} from '../../modules/getRating';
import {postUpdateRating} from '../../modules/postUpdateRating';
import {useIsFocused} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
const screenWidth = Dimensions.get('window').width;
import StarRating from 'react-native-star-rating-widget';
import Collapsible from 'react-native-collapsible';
import LottieView from 'lottie-react-native';
import {sortingFavoritelist} from '../../modules/sortingFavoritelist';
import {addToFavorite} from '../../modules/addToFavorite';
import Loader from '../../components/Loader';
import SpinLoader from '../../components/SpinLoader';

const RecycleBin = () => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [data, setHomeData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [commentContent, setComentContent] = useState('');
  const [rating3, setRating3] = useState(0);
  const [productId, setProductId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [limit, setLimit] = useState(1);

  useEffect(() => {
    if (isFocused) {
      getTrashApiCall();
    }
  }, [isFocused]);

  const getTrashApiCall = () => {
    setLoading(true);
    dispatch(getTrash(limit)).then(response => {
      setHomeData(response?.payload?.data);
      setLoading(false);
    });
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
        } else {
          Animated.spring(slideAnimation, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const generateLink = async ID => {
    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `https://surflokal.page.link/property?propetyID=${ID}`,
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
      return link;
    } catch (error) {}
  };
  const handleShare = async ID => {
    const link = await generateLink(ID);
    try {
      Share.share({
        title: 'Please check this property',
        message: link,
        url: link,
      });
    } catch (error) {}
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
    }
  };
  const navigation = useNavigation();

  const renderItem = ({item}) => (
    <View style={styles.slideOuter}>
      <View style={styles.renderMainWrapper}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ViewPropertiy', {
              ID: item.ID,
              from: 'RecycleBin',
            });
          }}>
          <Image
            source={{uri: item?.featured_image_src[0]?.guid}}
            style={styles.slide}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addToFav}
          onPress={() => {
            setLoading(true);
            setHomeData([]);
            const formData = new FormData();
            formData.append('post_id', item.ID);
            dispatch(addToFavorite(formData)).then(res => {
              if (res?.payload?.code === 200) {
                getTrashApiCall();
              }
            });
          }}>
          <Image
            source={Images.layerfav}
            style={{transform: [{rotate: '180deg'}]}}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.listingkeycover}>
        <Text style={styles.innerlistingkey}>RX-{item.ListingKey}</Text>
      </View>
      <View
        style={[
          styles.statusWrapper,
          {
            backgroundColor:
              item?.status === 'Active' ? Colors.surfblur : 'red',
          },
        ]}>
        <Text style={styles.statusText}>{item?.status}</Text>
      </View>

      <View style={styles.ratingMainWrapper}>
        <View style={styles.ratingSubChild}>
          <TouchableOpacity
            onPress={() => {
              setProductId(item.ID);
              setReviewTitle(item.title);
              toggleModal();
              dispatch(getRating(item.ID)).then(response => {
                setRatingData(response?.payload?.data);
                setRating(response?.payload?.data[0]?.photo_wuality_rating);
                setRating1(
                  response?.payload?.data[0]?.description_review_stars,
                );
                setRating2(response?.payload?.data[0]?.price_review_stars);
                setRating3(response?.payload?.data[0]?.interest_review_stars);
              });
            }}>
            <View style={styles.ratingcover}>
              <Image
                source={
                  item.total_average_rating > 0
                    ? Images.startfill
                    : Images.star2
                }
                style={[
                  styles.ratingImage,
                  {
                    tintColor:
                      item.total_average_rating > 0 ? undefined : 'black',
                  },
                ]}
              />
              {item.total_average_rating > 0 ? (
                <Text style={styles.ratingText}>
                  {Math.round(item.total_average_rating)}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.shareWrapper}>
          <TouchableOpacity
            style={{marginLeft: 15}}
            onPress={() => handleShare(item.ID)}>
            <Image source={Images.sendnew} style={styles.ratingImage}></Image>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('ViewPropertiy', {item})}>
        <Text style={styles.propertyText}>{item.property_price}</Text>
      </TouchableOpacity>
      <View style={styles.propertyTitle}>
        <Text numberOfLines={1} style={styles.propertyTitleText}>
          {item?.title}
        </Text>
      </View>
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
              <ScrollView
                style={styles.bgcover}
                showsVerticalScrollIndicator={false}>
                <View style={{alignItems: 'center', paddingBottom: 20}}>
                  <View style={styles.indicator}></View>
                </View>
                <ScrollView
                  style={styles.bgcover}
                  showsVerticalScrollIndicator={false}>
                  <View>
                    <Text style={styles.reviewtxt}>Rate This Property</Text>
                  </View>

                  <View style={styles.maincov}>
                    <View style={[styles.labelcover, {marginTop: 10}]}>
                      <Text style={styles.propertlabel}>Photo Quality:</Text>
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

                      <View style={styles.startRating}></View>
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
                      <View style={styles.startRating}></View>
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
                      <View style={styles.startRating}></View>
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
                      <View style={styles.propertlabel}></View>
                    </View>

                    <View style={styles.reviewcover}>
                      <Text style={styles.propertlabel}>My Notes</Text>
                      <View style={styles.textinputcover}>
                        {ratingData?.length > 0 ? (
                          <TextInput
                            multiline={true}
                            style={styles.textinputstyle1}
                            onChangeText={text => setComentContent(text)}
                            autoFocus
                          />
                        ) : (
                          <TextInput
                            onChangeText={text => setComentContent(text)}
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
                            <Text style={styles.submitbtntxt}>UPDATE</Text>
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
                            <Text style={styles.submitbtntxt}>Save</Text>
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
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
      <View style={styles.bottomMainWrapper}>
        {DeviceInfo.getDeviceType() === 'Tablet' ? (
          <View style={styles.bottomTabWrapper}>
            <View style={styles.bottomVerticleWrap}>
              <View style={styles.bottomVerticleCenterWrapper}>
                <Image source={Images.newbed} style={styles.newBed}></Image>
                <Text style={styles.bedText}>
                  {item.property_bedrooms.length > 0
                    ? item.property_bedrooms
                    : 0}{' '}
                  {'Beds'}
                </Text>
              </View>
            </View>
            <View style={styles.bottomVerticleWrap}>
              <View style={styles.bottomVerticleCenterWrapper}>
                <Image source={Images.bathtub} style={styles.newBed}></Image>
                <Text style={styles.newBed}>
                  {item.bathroomsfull.length > 0 ? item.bathroomsfull : 0}{' '}
                  {'Baths'}
                </Text>
              </View>
            </View>
            <View style={styles.bottomVerticleWrap}>
              <View style={styles.bottomVerticleCenterWrapper}>
                <Image
                  source={Images.measuringtape}
                  style={styles.newBed}></Image>
                <Text style={styles.newBed}>
                  {item.property_size.length > 0 ? item.property_size : 0}{' '}
                  {'SF'}
                </Text>
              </View>
            </View>
            <View style={styles.bottomVerticleWrap}>
              <View style={styles.bottomVerticleCenterWrapper}>
                <Image source={Images.hoa2} style={styles.newBed}></Image>

                <Text style={styles.newBed}>
                  {item.associationfee.length > 0 ? item.associationfee : 0}
                </Text>
              </View>
            </View>
            <View style={styles.bottomVerticleWrap}>
              <View style={styles.bottomVerticleCenterWrapper}>
                <Image source={Images.taxnew} style={styles.newBed}></Image>
                <Text style={styles.newBed}>
                  {item.taxannualamount.length > 0 ? item.taxannualamount : 0}
                </Text>
              </View>
            </View>
            <View style={styles.bottomVerticleWrap}>
              <View style={styles.bottomVerticleCenterWrapper}>
                <Image source={Images.calendar} style={styles.newBed}></Image>
                <Text style={styles.newBed}>
                  {item.taxannualamount.length > 0 ? item.taxannualamount : 0}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <ScrollView
            horizontal={true}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.phoneBottomMain}>
              <View style={styles.phoneBottomChild}>
                <View style={styles.phoneItemMain}>
                  <View style={styles.phoneItemSubChild}>
                    <Image
                      source={Images.newbed}
                      style={styles.phoneItemImage}></Image>
                    <Text style={styles.phoneItemText}>
                      {item.property_bedrooms.length > 0
                        ? item.property_bedrooms
                        : 0}{' '}
                      {'Beds'}
                    </Text>
                  </View>
                </View>

                <View style={styles.phoneItemMain}>
                  <View style={styles.phoneItemSubChild}>
                    <Image
                      source={Images.bathtub}
                      style={styles.phoneItemImage}></Image>
                    <Text style={styles.phoneItemText}>
                      {item.bathroomsfull.length > 0 ? item.bathroomsfull : 0}{' '}
                      {'Baths'}
                    </Text>
                  </View>
                </View>

                <View style={styles.phoneItemMain}>
                  <View style={styles.phoneItemSubChild}>
                    <Image
                      source={Images.measuringtape}
                      style={styles.phoneItemImage}></Image>
                    <Text style={styles.phoneItemText}>
                      {item.property_size.length > 0 ? item.property_size : 0}{' '}
                      {'SF'}
                    </Text>
                  </View>
                </View>

                <View style={styles.phoneItemMain}>
                  <View style={styles.phoneItemSubChild}>
                    <Image
                      source={Images.hoa2}
                      style={styles.phoneItemImage}></Image>
                    <Text style={styles.phoneItemText}>
                      {item.associationfee.length > 0 ? item.associationfee : 0}
                    </Text>
                  </View>
                </View>

                <View style={styles.phoneItemMain}>
                  <View style={styles.phoneItemSubChild}>
                    <Image
                      source={Images.taxnew}
                      style={styles.phoneItemImage}></Image>
                    <Text style={styles.phoneItemText}>
                      {item.taxannualamount.length > 0
                        ? item.taxannualamount
                        : 0}
                    </Text>
                  </View>
                </View>
                <View style={styles.phoneItemMain}>
                  <View style={styles.phoneItemSubChild}>
                    <Image
                      source={Images.cals}
                      style={styles.phoneItemImage}></Image>
                    <Text style={styles.phoneItemText}>
                      {item.yearbuilt.length > 0 ? item.yearbuilt : 0}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainheader}>
        <TouchableOpacity
          style={styles.leftheader}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={styles.leftheaderimage}
            source={Images.leftnewarrow}></Image>
        </TouchableOpacity>
        <View style={styles.centerheader}>
          <Text style={styles.centertext}>Recycle bin</Text>
        </View>
        <TouchableOpacity
          style={styles.rightheader}
          onPress={() => navigation.goBack()}>
          <Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.filtercover}>
        <TouchableOpacity
          disabled={loading ? true : false}
          onPress={() => {
            setIsCollapsed(!isCollapsed);
          }}>
          <Image
            style={[
              styles.filterimage,
              {
                transform: isCollapsed
                  ? [{rotate: '90deg'}]
                  : [{rotate: '0deg'}],
              },
            ]}
            source={Images.favfilter}
          />
        </TouchableOpacity>
      </View>

      <Collapsible collapsed={!isCollapsed} style={styles.collapsecover}>
        <Text style={styles.sortby}>Sort By</Text>
        <View style={styles.collapsebg}>
          <TouchableOpacity
            onPress={async () => {
              const payload = {
                sort_by: 2,
                date_favorited: 1,
              };
              setIsCollapsed(false);
              setLoading(true);
              setHomeData([]);
              await dispatch(sortingFavoritelist(payload)).then(response => {
                setHomeData(response?.payload?.data);
              });
              setLoading(false);
              setSelectedSortOption('Date Favorited');
            }}
            style={styles.collapupper}>
            <Image
              source={Images.calenderwedding}
              style={[
                styles.colimg,
                {
                  tintColor:
                    selectedSortOption === 'Date Favorited'
                      ? Colors.surfblur
                      : Colors.black,
                  fontWeight:
                    selectedSortOption === 'Date Favorited' ? '800' : 'normal',
                },
              ]}></Image>
            <Text
              style={[
                styles.coltxt,
                {
                  color:
                    selectedSortOption === 'Date Favorited'
                      ? Colors.surfblur
                      : Colors.black,
                },
              ]}>
              Date Favorited
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              const payload = {
                sort_by: 2,
                price_low_to_high: 1,
              };
              setIsCollapsed(false);
              setLoading(true);
              setHomeData([]);
              await dispatch(sortingFavoritelist(payload)).then(response => {
                setHomeData(response?.payload?.data);
              });
              setLoading(false);
              setSelectedSortOption('Price ascending');
            }}
            style={styles.collapupper}>
            <Image
              source={Images.low}
              style={[
                styles.colimg,
                {
                  tintColor:
                    selectedSortOption === 'Price ascending'
                      ? Colors.surfblur
                      : Colors.black,
                  fontWeight:
                    selectedSortOption === 'Price ascending' ? '800' : 'normal',
                },
              ]}></Image>
            <Text
              style={[
                styles.coltxt,
                {
                  color:
                    selectedSortOption === 'Price ascending'
                      ? Colors.surfblur
                      : Colors.black,
                },
              ]}>
              Price ascending{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const payload = {
                sort_by: 2,
                price_high_to_low: 1,
              };
              setIsCollapsed(false);
              setLoading(true);
              setHomeData([]);
              await dispatch(sortingFavoritelist(payload)).then(response => {
                setHomeData(response?.payload?.data);
              });
              setLoading(false);
              setSelectedSortOption('Price descending');
            }}
            style={styles.collapupper}>
            <Image
              source={Images.lowhigh}
              style={[
                styles.colimg,
                {
                  tintColor:
                    selectedSortOption === 'Price descending'
                      ? Colors.surfblur
                      : Colors.black,
                  fontWeight:
                    selectedSortOption === 'Price descending'
                      ? '800'
                      : 'normal',
                },
              ]}></Image>
            <Text
              style={[
                styles.coltxt,
                {
                  color:
                    selectedSortOption === 'Price descending'
                      ? Colors.surfblur
                      : Colors.black,
                },
              ]}>
              Price descending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const payload = {
                sort_by: 2,
                beds_high_to_low: 1,
              };
              setIsCollapsed(false);
              setLoading(true);
              setHomeData([]);
              await dispatch(sortingFavoritelist(payload)).then(response => {
                setHomeData(response?.payload?.data);
              });
              setLoading(false);
              setSelectedSortOption('Beds');
            }}
            style={styles.collapupper}>
            <Image
              source={Images.newbed}
              style={[
                styles.colimg,
                {
                  tintColor:
                    selectedSortOption === 'Beds'
                      ? Colors.surfblur
                      : Colors.black,
                  fontWeight: selectedSortOption === 'Beds' ? '800' : 'normal',
                },
              ]}></Image>
            <Text
              style={[
                styles.coltxt,
                {
                  color:
                    selectedSortOption === 'Beds'
                      ? Colors.surfblur
                      : Colors.black,
                },
              ]}>
              Beds
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const payload = {
                sort_by: 2,
                baths_high_to_low: 1,
              };
              setIsCollapsed(false);
              setHomeData([]);
              setLoading(true);
              await dispatch(sortingFavoritelist(payload)).then(response => {
                setHomeData(response?.payload?.data);
              });
              setLoading(false);
              setSelectedSortOption('Baths');
            }}
            style={styles.collapupper}>
            <Image
              source={Images.bathtub}
              style={[
                styles.colimg,
                {
                  tintColor:
                    selectedSortOption === 'Baths'
                      ? Colors.surfblur
                      : Colors.black,
                  fontWeight: selectedSortOption === 'Baths' ? '800' : 'normal',
                },
              ]}></Image>
            <Text
              style={[
                styles.coltxt,
                {
                  color:
                    selectedSortOption === 'Baths'
                      ? Colors.surfblur
                      : Colors.black,
                },
              ]}>
              Baths
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const payload = {
                sort_by: 2,
                squraefeet_high_to_low: 1,
              };
              setIsCollapsed(false);
              setHomeData([]);
              setLoading(true);
              await dispatch(sortingFavoritelist(payload)).then(response => {
                setHomeData(response?.payload?.data);
              });
              setLoading(false);
              setSelectedSortOption('Square Feet');
            }}
            style={styles.collapupper}>
            <Image
              source={Images.measuringtape}
              style={[
                styles.colimg,
                {
                  tintColor:
                    selectedSortOption === 'Square Feet'
                      ? Colors.surfblur
                      : Colors.black,
                  fontWeight:
                    selectedSortOption === 'Square Feet' ? '800' : 'normal',
                },
              ]}></Image>
            <Text
              style={[
                styles.coltxt,
                {
                  color:
                    selectedSortOption === 'Square Feet'
                      ? Colors.surfblur
                      : Colors.black,
                },
              ]}>
              Square Feet
            </Text>
          </TouchableOpacity>
        </View>
      </Collapsible>

      <View style={styles.mainWrapper}>
        {data?.length <= 0 ? (
          <View style={styles.loadingWrapper}>
            <Text style={styles.loadingText}>
              {/* {loading ? 'Loading...' : 'No properties in bin'} */}
              {loading ? (
                <View style={{height: '100%', justifyContent: 'center'}}>
                  {/* <Loader /> */}
                  <SpinLoader isVisible={loading} text="Loading..." />
                </View>
              ) : (
                'No properties in bin'
              )}
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{paddingBottom: 50}}
            onEndReached={() => {
              setLimit(limit + 1);
              dispatch(getTrash(limit + 1)).then(response => {
                if (response?.payload?.data?.length > 0) {
                  setHomeData(prevData => [
                    ...prevData,
                    ...response?.payload?.data,
                  ]);
                }
              });
            }}
            onEndReachedThreshold={0.1}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainWrapper: {height: '100%', width: '100%'},
  innerlistingkey: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 24 : 12,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
    marginBottom: 0,
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 14,
    paddingTop: 4,
  },
  ratingSubChild: {
    position: 'relative',
    flexDirection: 'row',
  },
  ratingMainWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  statusText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 24 : 12,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
    marginBottom: 0,
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 14,
    paddingTop: 4,
  },
  statusWrapper: {
    position: 'absolute',
    top: 8,
    right: 16,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  listingkeycover: {
    backgroundColor: Colors.surfblur,
    position: 'absolute',
    top: 8,
    left: 16,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  collapupper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: Colors.BorderColor,
    paddingBottom: 15,
    paddingTop: 15,
  },
  leftheaderimage: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  centerheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chaticon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 30,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 30,
    resizeMode: 'contain',
    marginRight: 0,
    position: 'absolute',
    top: -35,
    right: '35%',
  },
  imagedata: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,
    resizeMode: 'contain',
  },
  centertext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  rightheader: {
    position: 'absolute',
    right: 10,
    top: 15,
    tintColor: 'black',
  },
  leftheader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 12,
    justifyContent: 'flex-start',

    top: 13,

    width: 50,
    height: 50,
  },
  collapsebg: {},
  collapsecover: {
    justifyContent: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  addToFav: {position: 'absolute', bottom: 10, left: 30},
  renderMainWrapper: {position: 'relative'},
  slideOuter: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 18,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainheader: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 2,
  },
  slide: {
    width: screenWidth - 16,
    height: screenWidth - 100,
    borderRadius: 12,
    margin: 20,
    marginTop: 0,
    marginBottom: 0,
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalOverlaynew: {
    flex: 1,
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
  startRating: {
    width: '70%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.BorderColor,
    marginVertical: 15,
  },
  propertlabel: {
    fontSize: 17,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    marginBottom: 15,
    textAlign: 'center',
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
  reviewcover: {
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    marginTop: 15,
  },
  bottomVerticleCenterWrapper: {justifyContent: 'center', alignItems: 'center'},
  bedText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 17 : 11,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
  },
  phoneItemText: {
    fontSize: 11,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
  },
  phoneItemImage: {
    height: 21,
    width: 28,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  phoneItemSubChild: {justifyContent: 'center', alignItems: 'center'},
  phoneItemMain: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 70,
  },
  phoneBottomChild: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
    marginBottom: 12,
    width: '100%',
    alignSelf: 'center',
  },
  phoneBottomMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 5,
    width: '100%',
    alignSelf: 'center',
  },
  newBed: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 21,
    resizeMode: 'contain',
  },
  bottomVerticleWrap: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 100 : 70,
  },
  bottomChildWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    width: '100%',
    alignSelf: 'center',
  },
  bottomTabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 5,
    width: '100%',
    alignSelf: 'center',
  },
  bottomMainWrapper: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  propertyTitleText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    marginTop: DeviceInfo.getDeviceType() === 'Tablet' ? 10 : 6,
    marginBottom: DeviceInfo.getDeviceType() === 'Tablet' ? 10 : 0,
  },
  propertyTitle: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  propertyText: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 55 : 28,
    color: '#1450B1',
    fontFamily: 'Poppins-Medium',
    marginTop: 0,
  },
  ratingImage: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 33 : 22,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 33 : 22,
    resizeMode: 'contain',
  },
  ratingcover: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginLeft: 5,
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
  title: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 23,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
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
  colimg: {height: 36, width: 36, resizeMode: 'contain', left: 30},
  coltxt: {fontSize: 18, fontFamily: 'Poppins-Light', left: 50},
  paginationDotActive: {
    backgroundColor: 'blue',
  },
  filtercover: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  filter: {
    height: 60,
  },
  rating: {
    marginVertical: 5,
  },
  shareWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    marginHorizontal: 5,
  },
  sortby: {
    fontSize: 21,
    fontFamily: 'Poppins-Light',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 15,
    paddingTop: 15,
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
});

export default RecycleBin;
