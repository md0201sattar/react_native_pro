import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const ChatLoader = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder speed={1800}>
        <View style={{...styles.item, width: 120}} />
        <View style={{...styles.item, width: 180}} />
        <View style={{...styles.item, width: 100}} />
        <View style={styles.item} />
        <View style={{...styles.item, width: 120}} />
        <View style={{...styles.item, width: 160}} />
        <View style={styles.item} />
        <View style={{...styles.item, width: 100}} />
        <View style={{...styles.item, width: 120}} />
        <View style={styles.item} />
        <View style={{...styles.item, width: 90}} />
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  item: {
    height: 54,
    width: '48%',
    marginBottom: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    alignSelf: 'flex-end',
  },
});
