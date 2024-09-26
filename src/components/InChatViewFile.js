import React, {useEffect, useState} from 'react';
import {View, Modal, TouchableOpacity, StyleSheet, Text} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Pdf from 'react-native-pdf';

function InChatViewFile({props, visible, onClose}) {
  const {currentMessage} = props;
  const [fileURL, setFileURL] = useState('');

  useEffect(() => {
    if (visible) convertFileToBase64(currentMessage.file.url);
  }, [visible]);

  const convertFileToBase64 = async fileUri => {
    try {
      // const response = await RNFetchBlob.config({responseType: 'base64'}).fetch(
      //   'GET',
      //   fileUri,
      // );
      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
      })
        .fetch('GET', fileUri)
        .then(res => {
          console.log('The file saved to ', res.path());
        })
        .then(base64Data => {
          console.log('base64Data', base64Data);

          return base64Data;
        });

      const base64Data = response.data;
      setFileURL('data:application/pdf;base64,' + base64Data);
    } catch (error) {
      console.error('Error converting file to base64:', error);
      throw error;
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      style={{height: 600}}>
      <View style={{padding: 20}}>
        <Pdf source={{uri: fileURL}} style={{height: '100%', width: '100%'}} />
        <TouchableOpacity onPress={onClose} style={styles.buttonCancel}>
          <Text style={styles.textBtn}>X</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default InChatViewFile;

const styles = StyleSheet.create({
  buttonCancel: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    left: 13,
    top: 20,
  },
  textBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});
