import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const checkAndRequestPermission = async permission => {
  if (Platform.OS === 'android') {
    const permissionStatus = await check(permission);
    if (permissionStatus === RESULTS.GRANTED) {
      // The permission has already been granted, you can proceed with your action.
      // console.log('Permission is granted');
      return 'granted'; // Return 'granted' as a string
    } else {
      const requestResult = await request(permission);
      if (requestResult === RESULTS.GRANTED) {
        // The user granted the permission, proceed with your action.
        // console.log('Permission is granted');
        return 'granted'; // Return 'granted' as a string
      } else {
        // The user denied the permission; handle this scenario as needed.
        // console.log('Permission is denied');
        return 'denied'; // Return 'denied' as a string
      }
    }
  } else {
    // Handle permissions for iOS or other platforms here, if needed.
    // console.log('Platform not supported');
    return 'Platform not supported'; // Return an appropriate string for unsupported platforms
  }
};
