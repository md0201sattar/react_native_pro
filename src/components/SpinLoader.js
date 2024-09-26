import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

const SpinLoader = ({isVisible, text}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        {/* {text && <Text style={styles.text}>{text}</Text>} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  loader: {
    // backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default SpinLoader;
