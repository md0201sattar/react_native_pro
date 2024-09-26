import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import DeviceInfo from 'react-native-device-info';
import { store } from '../../redux/store';
const ChatHistory = ({navigation}) => {
  const [propertyChat, setPropertyChat] = useState([]);
  
  useEffect(() => {
    setPropertyChat(store.getState().propertyChatList?.likeDisLikeData?.data)
  }, [])
  return (
    <SafeAreaView>
      <View style={styles.headerbgmain}>
        <View style={styles.leftarroeheader}>
          <TouchableOpacity
            style={styles.leftsiderarrow}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={styles.leftsideiconimage}
              source={Images.leftnewarrow}></Image>
          </TouchableOpacity>
          <View style={styles.centertext}>
            <Text style={styles.centermaintext}>Chat History</Text>
          </View>
          <TouchableOpacity
            style={styles.rightsidemenu}
            onPress={() => navigation.goBack()}>
            <Image
              source={Images.menu}
              style={styles.imagedata}
              animation="flipInY"
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={propertyChat}
          renderItem={item => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('BookaTour', {
                      PropID: item?.item?.ID,
                    });
                  }}>
                  <View style={styles.mainlisting}>
                    <View style={styles.maininnerlisting}>
                      <Text
                        numberOfLines={1}
                        style={[
                          {
                            fontFamily:
                              item.item.Is_read === '0'
                                ? 'Poppins-Bold'
                                : 'Poppins-Regular',
                          },
                          styles.titlemain,
                        ]}>
                        {item?.item?.post_title}
                      </Text>
                      <Text
                        style={[
                          {
                            fontFamily:
                              item.item.Is_read === '0'
                                ? 'Poppins-Bold'
                                : 'Poppins-SemiBold',
                          },
                          styles.pricetext,
                        ]}>
                        ${item?.item?.property_price}
                      </Text>
                      <Text
                        style={[
                          {
                            fontFamily:
                              item.item.Is_read === '0'
                                ? 'Poppins-Bold'
                                : 'Poppins-Regular',
                          },
                          styles.textstyle,
                        ]}>
                        {item.item.post_date}
                      </Text>
                    </View>
                    <View style={styles.imgarrowcover}>
                      <Image
                        style={styles.userimg}
                        source={{uri: item?.item?.image}}
                      />
                      <Image style={styles.arrow} source={Images.downArrow} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatHistory;
const styles = StyleSheet.create({
  titlemain: {
    color: Colors.black,
    textTransform: 'capitalize',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 26 : 16,
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 36 : 18,
  },
  pricetext: {
    textTransform: 'capitalize',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 15,
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 36 : 18,
  },
  color: Colors.black,
  textstyle: {
    textTransform: 'capitalize',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
    color: Colors.newgray,
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
  imgarrowcover: {flexDirection: 'row', alignItems: 'center'},
  userimg: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 40,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 40,
    resizeMode: 'contain',
    borderRadius: 50,
    marginRight: 5,
    borderColor: Colors.surfblur,
    borderWidth: 1,
  },
  headerbgmain: {backgroundColor: '#f5f5f5', height: '100%'},
  leftarroeheader: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 12,
    paddingTop: 16,
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  arrow: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
    resizeMode: 'contain',
    marginRight: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 12,
    transform: [{rotate: '-90deg'}],
  },
  leftsiderarrow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 12,
    justifyContent: 'flex-start',
    top: 13,
    width: 50,
    height: 50,
  },
  leftsideiconimage: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  centertext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centermaintext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  rightsidemenu: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  mainlisting: {
    width: '100%',
    flexDirection: 'row',
    borderBottomColor: Colors.BorderColor,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  maininnerlisting: {
    padding: 16,
    maxWidth: '80%',
  },
});
