import { StyleSheet } from 'react-native';
import { Colors, ColorHelpers } from 'Theme/Colors';
import { Fonts } from 'Theme/Fonts';

export default StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: ColorHelpers.applyAlpha( Colors.white, 0.98)
    },
    header: {
        flexDirection: 'row',
        padding: 20,
        paddingTop: 15,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: Fonts.FONT_SIZE_MEDIUM,
    }
});