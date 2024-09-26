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
  },
  slideOuter: {
    width: screenWidth,
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width: screenWidth - 20,
    height: 220,
    borderRadius: 18,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: 'blue',
  },
  
  filter: {
    height: 60,
  },
  phoneInputView: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputStyle: {
    width: '90%',
    color: Colors.textColorDark,
    fontSize: 14 * fontSizeRatio,
  },
});
