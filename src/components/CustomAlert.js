import React, {useState} from 'react';
import {View, Modal, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../utils/Colors';

const CustomAlert = ({
  title,
  message,
  visible,
  onCancel,
  onDelete,
  firstName,
  secondName,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => onClose()}>
      <View style={styles.modalContainer}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => onCancel()}>
              <Text style={styles.buttonText}>{firstName}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonDelete}
              onPress={() => onDelete()}>
              <Text style={styles.buttonText}>{secondName}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    width: '90%',

    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 18,
    marginBottom: 8,
    color: Colors.black,
    textAlign: 'center',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    marginBottom: 16,
    color: Colors.black,
    marginBottom: 20,
  },
  buttonDelete: {
    height: 50,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 8,
    backgroundColor: 'red',
  },
  buttonCancel: {
    height: 50,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    backgroundColor: Colors.buttonColor,
  },
  buttonText: {
    color: Colors.black,
    fontWeight: 'bold',
  },
});

export default CustomAlert;
