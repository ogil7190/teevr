import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'Components/Icon';
import { ICON_CHECK } from 'Constants/iconNames';
import { ColorHelpers, Colors } from 'App/Theme/Colors';
import { parseSize } from 'Utils/utils';
import { normalizeHeight, Fonts, normalizeWidth } from 'App/Theme/Fonts';

export const SelectionListItemView = ( props ) => {
    const { item, isOdd, renderCustomIcon, customSelection, isLoaded, selected, getTitleFromPath, onItemSelect  } = props;
    const title = item.extras ? item.extras.title : getTitleFromPath( item.path );

    return(
        !isLoaded ?
        <View
            style={{
                backgroundColor: Colors.themeWhite,
                width: '100%',
                height: normalizeHeight( 70 ),
                margin: 0.5
            }}
        /> :
        
        <TouchableOpacity
            activeOpacity={0.5}
            style={{
                width: '100%',
                height: normalizeHeight(70),
                position: 'relative',
                backgroundColor: Colors.themeWhite
            }}
            onPress={onItemSelect}
        >
            <>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        backgroundColor: isOdd ? ColorHelpers.applyAlpha( Colors.primary, 0.035) : Colors.themeWhite,
                        height: '100%'
                    }}
                >
                    {
                        renderCustomIcon(item.isDirectory)
                    }
                    <View style={{ flex: 1}}>
                        <Text numberOfLines={2} style={{ fontSize: Fonts.FONT_SIZE_15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR, color: Colors.lightBlack, marginRight: normalizeWidth(10) }}>
                            { title }
                        </Text>
                        {
                            !item.isDirectory &&
                            <Text style={{ fontSize: Fonts.FONT_SIZE_14, color: Colors.grey, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT }}>
                                { parseSize( item.size ) }
                            </Text>
                        }
                    </View>
                    {
                        selected &&
                        <View style={{ marginRight: normalizeWidth(20) }}>
                            <Icon name={ICON_CHECK} width={20} height={20} fill={Colors.primary} />
                        </View>
                    }

                    {
                        customSelection && !item.isDirectory && !selected && 
                        <View style={{ marginRight: 20, width: 20, height: 20, borderRadius: 20, borderWidth: 1, borderColor: Colors.primary }} />
                    }
                </View>
            </>
        </TouchableOpacity>
    );   
}