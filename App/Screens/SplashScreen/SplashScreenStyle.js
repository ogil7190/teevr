import { StyleSheet } from 'react-native';
import { Colors } from 'Theme/Colors';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  outerShadow : {
    shadowOffset: {
      width: -15,
      height: -15,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowColor: '#fff',
    elevation: -10
  },
  innerShadow : {
    shadowOffset: {
      width: 15,
      height: 15,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowColor: '#aeaec0',
    elevation: 10
  }
});
