import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import {useNavigation} from '@react-navigation/native';

const Header = props => {
  const {label, plusButton} = props;
  const navigation = useNavigation();
  return (
    <View
      style={{
        height: 140,
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: Colors.PrimaryColor,
      }}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginTop: 20,
        }}>
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={{height: 50, width: 50, marginLeft: 10}}>
          <Image
            style={{height: 25, width: 25, resizeMode: 'contain'}}
            source={Images.drawerMenu}></Image>
        </TouchableOpacity>
        {plusButton == true ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('AddClients')}
            style={{height: 50, width: 50}}>
            <Image
              style={{height: 25, width: 25, resizeMode: 'contain'}}
              source={Images.plus}></Image>
          </TouchableOpacity>
        ) : (
          <View style={{height: 50, width: 50}}></View>
        )}
      </View>
      <Text
        allowFontScaling={false}
        style={{
          color: Colors.white,
          fontSize: 35,
          fontWeight: 'bold',
          marginLeft: 15,
          marginBottom: 20,
        }}>
        {label}
      </Text>
    </View>
  );
};
export default Header;
