import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {getSavedSearch} from '../../modules/getSavedSearch';
import {deleteSearch} from '../../modules/deleteSearch';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import Loader from '../../components/Loader';
import SpinLoader from '../../components/SpinLoader';

const SavedSearches = ({}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [limit, setLimit] = useState(1);

  useEffect(() => {
    setLimit(1);
    if (isFocused) {
      setShowNoDataMessage(false);
      getSavedApiCall();
    }
  }, [isFocused]);

  const getSavedApiCall = async () => {
    setLoading(true);
    await dispatch(getSavedSearch(limit)).then(response => {
      if (response.payload.data.length > 1) {
        setImages(response?.payload?.data);
      } else {
        setShowNoDataMessage(true);
      }
      setLoading(false);
    });
  };
  const getSavedApiCallonEndReached = async () => {
    setLimit(limit + 1);
    dispatch(getSavedSearch(limit + 1)).then(response => {
      if (response?.payload?.data?.length > 0) {
        setImages(prevData => [...prevData, ...response?.payload?.data]);
      }
    });
  };

  function removeObjectWithId(arr, id) {
    const objWithIdIndex = arr.findIndex(obj => obj.ID === id);
    if (objWithIdIndex > -1) {
      return [
        ...arr.slice(0, objWithIdIndex),
        ...arr.slice(objWithIdIndex + 1),
      ];
    }
    return arr;
  }
  const deleteSearchApiCall = async postId => {
    const formData = new FormData();
    formData.append('postID', postId?.ID);
    dispatch(deleteSearch(formData)).then(response => {
      if (response?.payload?.code === 200) {
        const newArr = removeObjectWithId(images, postId?.ID);
        setImages(newArr);
      }
    });
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.slideOuter}>
        <TouchableOpacity
          style={styles.opacity1}
          onPress={() => {
            navigation.navigate('Home', {
              search_address: item?.search_parameters,
              triggerFlag: Math.random(5 * 100),
            });
          }}>
          <Image source={Images.savedSearch} styles={styles.imagestyle} />
          <Text style={styles.textstyle}>
            {item?.search_parameters ? item?.search_parameters + ',' : null}
            {item?.cities ? item?.cities + ', ' : null}
            {item?.bedroom ? item?.bedroom + ' Beds, ' : null}
            {item?.bathroom ? item?.bathroom + ' Baths, ' : null}
            {item?.min_price ? item?.min_price + '-' : null}
            {item?.max_price ? item?.max_price + ', ' : null}
            {item?.min_square ? item?.min_square + '-' : null}
            {item?.max_square ? item?.max_square + ', ' : null}
            {item?.more_filter_data ? item?.more_filter_data + ', ' : null}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteSearchApiCall({ID: item.ID})}>
          <Image source={Images.SearchNotification} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headercover}>
        <View style={styles.centercover}>
          <Text style={styles.centertext}>Saved Searches</Text>
        </View>
        <TouchableOpacity
          style={styles.rightarrow}
          onPress={() => navigation.goBack()}>
          <Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <>
        {loading ? (
          <View style={{height: '100%', justifyContent: 'center'}}>
            {/* <Loader /> */}
            <SpinLoader isVisible={loading} />
          </View>
        ) : (
          <>
            {showNoDataMessage ? (
              <View style={styles.nosearchecover}>
                <Text style={styles.searchtext}>No saved searches found!</Text>
              </View>
            ) : (
              <>
                {images.length > 0 ? (
                  <>
                    <FlatList
                      style={{flex: 1}}
                      contentContainerStyle={{paddingBottom: 20}}
                      data={images}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => {
                        const key = index.toString();
                        // console.log(`Item at index ${index} has key: ${key}`);
                        return key;
                      }}
                      onEndReachedThreshold={0.7}
                      onEndReached={() => {
                        getSavedApiCallonEndReached();
                      }}
                    />
                  </>
                ) : null}
              </>
            )}
          </>
        )}
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  slideOuter: {
    width: '98%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors,
    borderRadius: 18,
    marginBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imagedata: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,

    resizeMode: 'contain',
  },
  cover: {width: '100%', alignItems: 'center'},
  headercover: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
  },
  opacity1: {flexDirection: 'row', alignItems: 'center', width: '70%'},
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
  textstyle: {
    fontSize: 12,
    color: '#2D49AA',
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
  },
  imagestyle: {height: 59, width: 59, resizeMode: 'cover'},
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
  rightarrow: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  nosearchecover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchtext: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textColorDark,
    fontFamily: 'Poppins-Regular',
  },
});

export default SavedSearches;
