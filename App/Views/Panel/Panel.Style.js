import { StyleSheet } from 'react-native';
import { Colors } from 'Theme/Colors';
import { Fonts, normalizeWidth, normalizeHeight } from 'Theme/Fonts';

export default StyleSheet.create({
    mainContainer: {
        width: normalizeWidth(85),
        height: normalizeHeight(90),
        margin: normalizeWidth(5),
        borderRadius: 10,
        borderWidth:1,
        borderColor: Colors.ultraLightGrey
    },
    container:{        
        width: '100%',
        height: '100%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    preloaderContainer: {
        width : normalizeWidth(85),
        height : 50,
    },
    backgroundStyle: {
        // backgroundColor: Colors.ultraLightGrey,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        width: normalizeWidth(83),
        height: normalizeHeight(100),
    },
    iconStyle: {
        marginTop: normalizeHeight(10),
        width: normalizeWidth(32),
        height: normalizeWidth(32),
    },
    textContainer: {
        borderRadius:5,
        // backgroundColor: Colors.white,
    },
    textStyle:{
        marginTop: normalizeHeight(8),
        marginBottom: normalizeHeight(10),
        textAlign: 'center',
        marginLeft:2,
        marginRight:2,
        fontSize: Fonts.FONT_SIZE_XTRA_XTRA_SMALL,
        color: Colors.lightBlack
    },
    specialContainer:{
        position: 'absolute',
        bottom: 0,
        paddingBottom: 1,
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 0,
        borderRadius: 3
    },
    specialText: {
        color: Colors.white,
        fontSize: Fonts.FONT_SIZE_10
    }
});