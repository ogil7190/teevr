import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'Theme/Colors';
import { Fonts, normalizeHeight, normalizeWidth } from 'Theme/Fonts';

export default StyleSheet.create( {
    container: {
        position: 'absolute',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: Platform.select({
            android: normalizeHeight(56),
            ios: normalizeHeight(50),
        }),
        padding: normalizeWidth(10),
        paddingLeft: normalizeWidth(20),
        paddingRight: normalizeWidth(20),
        alignItems: 'center',
        backgroundColor: Colors.themeWhite,
    },
    mainContainer:{
        display: 'flex',
        flex: 1,
        backgroundColor: Colors.themeWhite
    },
    content: {
        display: 'flex',
        flex: 1,
        backgroundColor: Colors.themeWhite
    },
    contentBody:{
        backgroundColor: Colors.themeWhite
    },
    skipHeader:{
        paddingTop: Platform.select({
            android: normalizeHeight(56),
            ios: normalizeHeight(50),
        }),
    },
    contentContainer:{
        display: 'flex',
        flex: 1,
        backgroundColor: Colors.themeWhite
    },
    showShadow: {
        shadowColor: Colors.lightGrey,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 0.6,
        elevation: 10, /* max eleveation is for header only */
    },
    title: {
        fontSize: Fonts.FONT_SIZE_16,
        color: Colors.primary,
        fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT,
    },
    smallTitle: {
        fontSize: Fonts.FONT_SIZE_SMALL
    }
});