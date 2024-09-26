import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRatio = screenHeight / 1000;
export default StyleSheet.create({
  textvIew: { width: '85%', marginTop: 20 * viewSizeRatio },
  divider: {
    height: 12,
    backgroundColor: Colors.surfblur,
    width: 1,
  },
  actionView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    marginTop: 20 * viewSizeRatio,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loginView: {
    height: 80 * viewSizeRatio,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionUpperView: {
    height: 300 * viewSizeRatio,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 26 * fontSizeRatio,
    color: Colors.textColorDark,
    fontWeight: 'bold',
  },
  loginContainer: {
    height: 160 * viewSizeRatio,
    width: '85%',
    borderRadius: 8,
    borderWidth: 1 * viewSizeRatio,
    borderColor: Colors.textColorLight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loginLine: {
    height: 1 * viewSizeRatio,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: Colors.textColorLight,
  },
  regionView: {
    height: 80 * viewSizeRatio,
    width: '100%',
    flexDirection: 'row',
    borderColor: Colors.textColorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInputView: {
    height: 80 * viewSizeRatio,
    width: '100%',
    borderTopWidth: 1 * viewSizeRatio,
    borderColor: Colors.textColorLight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: 14
  },
  inputStyle: {
    width: '90%',
    borderRadius: 8,
    height: 80 * viewSizeRatio,
    color: Colors.textColorDark,
    fontSize: 18 * fontSizeRatio,
    fontFamily: 'Poppins-Regular'
  },
  regionText: {
    color: Colors.textColorLight,
    fontSize: 16 * fontSizeRatio,
    fontFamily: 'Poppins-Regular'
  },
  selectRegionText: {
    color: Colors.black,
    fontSize: 18 * fontSizeRatio,
    fontFamily: 'Poppins-Regular'
  },
  arrow: {
    height: 18 * imageSizeRatio,
    width: 18 * imageSizeRatio,
    resizeMode: 'contain',
  },
  alertText: {
    color: Colors.black,
    fontSize: 16 * fontSizeRatio,
    fontFamily: 'Poppins-Regular'
  },
  orView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    marginTop: 20 * viewSizeRatio,
    alignSelf: 'center',
    marginBottom: 20 * viewSizeRatio,
  },
  line: {
    width: '43%',
    height: 1,
    backgroundColor: Colors.black,
  },
  orText: {
    color: Colors.black,
    fontSize: 20 * fontSizeRatio,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular'
  },
  socialMediaButtons: {
    width: '85%',
    height: 70 * viewSizeRatio,
    marginTop: 20 * viewSizeRatio,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.textColorLight,
    borderRadius: 8,
    alignSelf: 'center',
    flexDirection: 'row',
  },

  socialMediaButtonsText: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
    fontFamily: 'Poppins-Regular'
  },
  socialMediaButtonsImage: {
    height: 30 * viewSizeRatio,
    width: 30 * viewSizeRatio,
    marginLeft: 20 * viewSizeRatio,
    resizeMode: 'contain',
  },
  appLogo: {
    height: 200 * imageSizeRatio,
    width: 250 * imageSizeRatio,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});