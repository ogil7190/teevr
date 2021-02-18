import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { Icon } from 'Components/Icon';
import { ICON_CHECK } from 'Constants/iconNames';
import { parseSize } from 'Utils/utils';
import { Colors } from 'App/Theme/Colors';
import { normalizeHeight, normalizeWidth, Fonts } from 'App/Theme/Fonts';

export const SelectionItemTypeTileView = ( props ) => {
    const { item, thumbnail, isLoaded, selected, onItemSelect, drawCustomOverlay } = props;
    return(
        !isLoaded ? 
        <View
            style={{
                backgroundColor: Colors.themeWhite,
                width: '25%',
                margin: 0.5
            }}
        /> :
        <TouchableOpacity
            activeOpacity={0.5}
            style={{
                width: '25%',
                height: normalizeHeight( 110 ),
                position: 'relative',
                backgroundColor: Colors.themeWhite,
                padding: normalizeWidth(10),
                marginBottom: normalizeWidth(0),
            }}
            onPress={onItemSelect}
        >
            <>
            <Image
                resizeMode={'contain'}
                source={{ uri: `data:image/png;base64,${thumbnail}`}}
                style={{
                    height: normalizeHeight(50),
                    width: normalizeWidth(50),
                    borderRadius: 5,
                    alignSelf: 'center'
                }}
            />
            <View>
                <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: Fonts.FONT_SIZE_12, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT}}>{item.name}</Text>
                <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: Fonts.FONT_SIZE_11, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, color: Colors.grey}}>{parseSize( item.size )}</Text>
            </View>
            <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
                { drawCustomOverlay() }
            </View>
            {
                selected &&
                <View style={{ position: 'absolute', top: 10, right:5}}>
                    <Icon fill={Colors.primary} name={ ICON_CHECK} width={16} height={16} />
                </View>
            }
            </>
        </TouchableOpacity>
    );
}