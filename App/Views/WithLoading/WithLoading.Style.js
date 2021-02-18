import { StyleSheet } from 'react-native';
import { Colors, ColorHelpers } from 'Theme/Colors';
import { Fonts } from 'Theme/Fonts';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: Colors.lightGrey,
    borderWidth: 1.5,
    display: 'flex',
    flexGrow: 0,
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    minWidth: 50,
    paddingLeft: 30,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 30,
  },
  fillContainer: {
    backgroundColor: Colors.primary,
  },
  linedText: {
    color: Colors.primary,
  },
  loader: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  text: {
    color: Colors.white,
    fontSize: Fonts.FONT_SIZE_SMALL,
  },
  textContainer: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 0,
    width: 'auto',
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  transparentText: {
    color: Colors.primary,
    fontSize: Fonts.FONT_SIZE_SMALL,
  },
  withShadow: {
    shadowColor: ColorHelpers.applyAlpha(Colors.primary, 0.1),
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  withoutMargin: {
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
  },
  withoutPadding: {
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
  },
});
