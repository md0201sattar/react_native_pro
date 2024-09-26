import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Switch,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import {useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import {useDispatch} from 'react-redux';
import {store} from '../../redux/store';
import {addRemoveTrash} from '../../modules/addRemoveTrash';
import {addToFavorite} from '../../modules/addToFavorite';
import {getNotifications} from '../../modules/getNotifications';
import Loader from '../../components/Loader';
import SpinLoader from '../../components/SpinLoader';

const Notification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [limit, setLimit] = useState(1);
  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setToggle(!isEnabled);
  };

  useEffect(() => {
    if (isFocused) {
      setLoader(true);
      getNotificationsApiCall();
    }
  }, [isFocused]);

  const getNotificationsApiCall = () => {
    dispatch(getNotifications(limit)).then(res => {
      setData(res?.payload?.data);
      setLoader(false);
    });
  };

  const renderItem = ({item, index}) => {
    if (!isEnabled) {
      return null;
    }
    return (
      <View style={styles.slideOuter}>
        <View style={styles.imageview}>
          <Image
            source={{uri: item?.featured_image_url}}
            style={styles.featuresimage}
          />
          <Text style={styles.imageText}>New</Text>
          <View style={styles.feedarrowview}>
            <Image
              source={Images.feedarrow}
              style={styles.feedarrowimagestyle}
            />
            <Image
              source={Images.feedarrow}
              style={[
                styles.feedarrowimagestyle,
                {transform: 'rotate(180deg)'},
              ]}
            />
          </View>
          <View style={styles.layerfavView}>
            <TouchableOpacity
              onPress={async () => {
                const formData = new FormData();
                formData.append('post_id', item.post_id);
                await dispatch(addRemoveTrash(formData)).then(response => {});
              }}>
              <Image source={Images.layerfav} style={styles.imagelayerfav} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                const formData = new FormData();
                formData.append('post_id', item.post_id);
                await dispatch(addToFavorite(formData)).then(response => {});
              }}>
              <Image
                source={Images.layerfav}
                style={[styles.imagelayerfav, {transform: 'rotate(180deg)'}]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.titlecover}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ViewPropertiy', {ID: item.post_id})
            }>
            <Text style={styles.posttitle}>${item?.price}</Text>
            <Text style={styles.postcontent}>{item?.post_title}</Text>

            <View style={styles.iconmaincover}>
              <View style={styles.iconcover}>
                <Image
                  source={Images.newbed}
                  style={styles.newbedstyle}></Image>
                <Text style={styles.labelicon}>{item?.bedrooms}</Text>
              </View>
              <View style={styles.iconcover}>
                <Image
                  source={Images.bathtub}
                  style={styles.bathtubicon}></Image>
                <Text style={styles.labelicon}>{item.bathrooms}</Text>
              </View>
              <View style={styles.iconcover}>
                <Image
                  source={Images.measuringtape}
                  style={styles.measureicon}></Image>
                <Text style={styles.labelicon}>{item.property_size}</Text>
              </View>
              <View style={styles.iconcover}>
                <Image source={Images.hoa2} style={styles.hoaicon}></Image>
                <Text style={styles.labelicon}>{item.hoa_fee}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.headermain}>
        <View style={styles.centercover}>
          <Text style={styles.centertext}>My Feed</Text>
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
      <View style={styles.container}>
        <View style={styles.headerinner}>
          <Text style={styles.headercover}>
            You have{' '}
            <Text style={styles.Notificationcount}>
              {data?.length > 0 ? data.length : '0'}
            </Text>{' '}
            new properties in your feed
          </Text>
          <View style={styles.mt10}>
            <Switch
              trackColor={{false: '#767577', true: '#11b03e'}}
              thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>

        {loader ? (
          <View style={{height: '100%', justifyContent: 'center'}}>
            {/* <Loader /> */}
            <SpinLoader isVisible={loader} />
          </View>
        ) : (
          <View style={styles.notificationdetail}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              onEndReached={() => {
                setLimit(limit + 1);
                dispatch(getNotifications(limit + 1)).then(response => {
                  if (response?.payload?.data.length > 0) {
                    setData(prevData => [
                      ...prevData,
                      ...response?.payload?.data,
                    ]);
                  }
                });
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 5,
  },
  viewStyle: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginLeft: 0,
  },
  notificationdetail: {flex: 1, marginTop: 10},
  slideOuter: {
    width: '97%',
    marginBottom: 22,
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingRight: 25,
    overflow: 'hidden',
    marginTop: 12,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  imageview: {width: '40%', position: 'relative'},
  screen1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  imageText: {
    backgroundColor: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 8,
    color: '#0F4BC3',
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 8,
    position: 'absolute',
    top: 8,
    left: 4,
  },
  imagedata: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,

    resizeMode: 'contain',
  },
  featuresimage: {
    resizeMode: 'cover',
    borderRadius: 4,
    marginRight: 8,
    width: '100%',
    height: '100%',
  },
  feedarrowview: {
    position: 'absolute',
    zIndex: 99,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  feedarrowimagestyle: {
    height: 15,
    width: 15,
    marginLeft: 4,
    resizeMode: 'contain',
  },
  layerfavView: {
    position: 'absolute',
    zIndex: 99,
    bottom: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imagelayerfav: {
    height: 20,
    width: 20,
    marginHorizontal: 8,
    resizeMode: 'contain',
  },
  titlecover: {
    textAlign: 'center',
    flexDirection: 'column',
    width: '60%',
    paddingVertical: 12,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  posttitle: {
    width: '100%',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: '#0F4BC3',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postcontent: {
    width: '100%',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 9,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  postdate: {
    width: '100%',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 14 : 11,
    color: Colors.textColorLight,
    fontFamily: 'Poppins-Light',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    textAlign: 'right',
    marginTop: 0,
    position: 'relative',
    top: DeviceInfo.getDeviceType() === 'Tablet' ? 0 : 6,
  },
  headermain: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 2,
    marginBottom: 18,
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
    marginBottom: 20,
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
  centercover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centertext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  rightmenu: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  headerinner: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 0,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
  },
  Notificationcount: {color: '#0F4BC3', fontFamily: 'Poppins-SemiBold'},
  headercover: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 32 : 16,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
    marginLeft: 12,
  },

  iconmaincover: {
    flexDirection: 'row',
    // width: width - 16,

    alignSelf: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    marginTop: 8,

    width: '100%',
  },
  mt10: {
    marginTop: DeviceInfo.getDeviceType() === 'Tablet' ? 10 : -4,
  },
  iconcover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoaicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 51 : 27,
    marginTop: 0,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  measureicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 45 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 27,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  bathtubicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 44 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 28,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  newbedstyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 21,
    resizeMode: 'contain',
    marginBottom: 5,
  },
});

export default Notification;
