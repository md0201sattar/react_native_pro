import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../utils/Colors';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRatio = screenHeight / 1000;
export default StyleSheet.create({
  signInHere: { fontFamily: "Poppins-Regular", fontSize: 14, textDecorationLine: "underline", color: Colors.PrimaryColor },
  textView: { fontFamily: "Poppins-Regular", fontSize: 14, textAlign: "center", color: Colors.gray, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  belowTextWrapper: { alignItems: "center", justifyContent: "center", flexDirection: "row", marginTop: 20, },
  arrow: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    tintColor: Colors.black,
    transform: [{ rotate: '0deg' }],
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
  },
  mainWrapper: {
    width: '100%',
    position: 'absolute',
    top: 10,
    left: 10
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
    textAlign: 'center',
  },
  safearea:{ flex: 1, backgroundColor: Colors.white },
  signUpText: {
    fontSize: 24 * fontSizeRatio,
    color: Colors.primaryBlue,
    fontWeight: '400',
    textAlign: 'center',
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
  },
  inputStyle: {
    width: '90%',
    borderRadius: 8,
    alignSelf: 'center',
    height: 80 * viewSizeRatio,
    color: Colors.textColorDark,
    fontSize: 18 * fontSizeRatio,
    fontFamily: 'Poppins-Regular'
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
    fontSize: 16 * fontSizeRatio,
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
  },
  socialMediaButtons: {
    width: '85%',
    height: 60 * viewSizeRatio,
    marginTop: 20 * viewSizeRatio,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: .7,
    borderColor: Colors.gray,
    borderRadius: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    fontFamily: 'Poppins-Regular'
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
