import AsyncStorage from '@react-native-community/async-storage';

export const getUserDetailsSync = async () => {
  try {
    const userDetailsString = await AsyncStorage.getItem('userDetails');
    if (userDetailsString !== null) {
      const userDetails = JSON.parse(userDetailsString);
      return userDetails;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
