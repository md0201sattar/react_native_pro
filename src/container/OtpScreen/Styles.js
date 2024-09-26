import {StyleSheet, Dimensions} from 'react-native';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRatio = screenHeight / 1000;
export default StyleSheet.create({
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
  },
  inputStyle: {
    width: '90%',
    borderRadius: 8,
    height: 80 * viewSizeRatio,
    color: Colors.textColorDark,
    fontSize: 22 * fontSizeRatio,
  },
  regionText: {
    color: Colors.textColorLight,
    fontSize: 16 * fontSizeRatio,
  },
  selectRegionText: {
    color: Colors.black,
    fontSize: 22 * fontSizeRatio,
  },
  arrow: {
    height: 20 * imageSizeRatio,
    width: 20 * imageSizeRatio,
    resizeMode: 'contain',
  },
  alertText: {
    color: Colors.black,
    fontSize: 18 * fontSizeRatio,
  },
  orView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    marginTop: 40 * viewSizeRatio,
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
    fontSize: 20 * fontSizeRatio,
    fontWeight: '500',
    marginLeft: 30,
  },
  socialMediaButtonsImage: {
    height: 30 * viewSizeRatio,
    width: 30 * viewSizeRatio,
    marginLeft: 20 * viewSizeRatio,
    resizeMode: 'contain',
  },
  appLogo: {
    height: 250 * imageSizeRatio,
    width: 250 * imageSizeRatio,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
