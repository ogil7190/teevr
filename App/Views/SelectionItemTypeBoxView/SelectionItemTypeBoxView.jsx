import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { Icon } from 'Components/Icon';
import { ICON_CHECK } from 'Constants/iconNames';
import { parseSize } from 'Utils/utils';
import { normalizeHeight, Fonts, calc } from 'App/Theme/Fonts';
import { Colors } from 'App/Theme/Colors';

export const SelectionItemTypeBoxView = ( props ) => {
    const { isLoaded, onItemSelect, onItemLongPress, drawCustomOverlay, item, selected, thumbnail,  } = props;

    return (
        !isLoaded ?
        <View style={{
                backgroundColor: Colors.themeWhite,
                width: '33%',
                height: normalizeHeight(120),
                margin: 0.5
            }}
        />:
        <TouchableOpacity
            activeOpacity={0.5}
            style={{
                width: '33%',
                margin: 0.5,
                height: calc('35%'),
                position: 'relative',
                backgroundColor: Colors.lightGrey
            }}
            onPress={onItemSelect}
            onLongPress={onItemLongPress}
        >
            <>
            <Image
                source={{ uri: `file://${ thumbnail || item.path }`}}
                style={{ height: '100%', width: '100%'}}
            />
            <View 
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    justifyContent: 'flex-end'
                }}
            >
                { drawCustomOverlay() }
            </View>
            {
                selected &&
                <View
                    style={{
                        backgroundColor: Colors.themeWhite,
                        borderRadius: 20,
                        padding: 2,
                        paddingLeft: 4,
                        paddingRight: 4,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: 4,
                        left: 4
                    }}
                >
                    <Icon fill={Colors.primary} name={ ICON_CHECK} width={16} height={16} />
                    <Text style={{ fontSize: Fonts.FONT_SIZE_10, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR, marginLeft: 5, color: Colors.primary }}>
                        {parseSize( item.size )}
                    </Text>
                </View>
            }
            </>
        </TouchableOpacity>
    );
}