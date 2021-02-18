import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { Icon } from 'Components/Icon';
import { ICON_APPS, ICON_VIDEOS, ICON_AUDIOS, ICON_DOCS, ICON_IMAGES, ICON_FOLDER } from 'Constants/iconNames';
import { Colors, ColorHelpers } from 'App/Theme/Colors';
import { NeomorphFlex } from 'react-native-neomorph-shadows';
import * as ScreenNames from 'Constants/screenNames';
import { normalizeHeight, Fonts } from 'App/Theme/Fonts';

export const Panel = ( props ) => {
    const { items, activeIndex, itemIds, onAction, counts } = props;

    const handlePress = ( index ) => {
        onAction && onAction( index )
    }

    const getConfig = ( id ) => {
        switch( id ) {
            case ScreenNames.SUB_SCREEN_IMAGES: {
                const count = counts[ id ];
                const isTwoDigit = count / 10 >= 1;
                return {
                    icon: ICON_IMAGES,
                    count,
                    size: isTwoDigit ? 22 : 18,
                    fontSize: isTwoDigit ? 8 : 10,
                    offset: {
                        top: isTwoDigit ? 4 : 0,
                        left: isTwoDigit ? 5 : 5
                    }
                }
            }
            case ScreenNames.SUB_SCREEN_VIDEOS:{
                const count = counts[ id ];
                const isTwoDigit = count / 10 >= 1;
                return {
                    icon: ICON_VIDEOS,
                    count,
                    size: isTwoDigit ? 22 : 18,
                    fontSize: isTwoDigit ? 8 : 10,
                    offset: {
                        top: isTwoDigit ? 4 : 0,
                        left: isTwoDigit ? 5 : 5
                    }
                }
            }
            case ScreenNames.SUB_SCREEN_AUDIOS:{
                const count = counts[ id ];
                const isTwoDigit = count / 10 >= 1;
                return {
                    icon: ICON_AUDIOS,
                    count,
                    size: isTwoDigit ? 22 : 18,
                    fontSize: isTwoDigit ? 8 : 10,
                    offset: {
                        top: isTwoDigit ? 4 : 0,
                        left: isTwoDigit ? 5 : 5
                    }
                }
            }
            case ScreenNames.SUB_SCREEN_FILES:{
                const count = counts[ id ];
                const isTwoDigit = count / 10 >= 1;
                return {
                    icon: ICON_DOCS,
                    count,
                    size: isTwoDigit ? 22 : 18,
                    fontSize: isTwoDigit ? 8 : 10,
                    offset: {
                        top: isTwoDigit ? 4 : 0,
                        left: isTwoDigit ? 5 : 5
                    }
                }
            }
            case ScreenNames.SUB_SCREEN_APPS:{
                const count = counts[ id ];
                const isTwoDigit = count / 10 >= 1;
                return {
                    icon: ICON_APPS,
                    count,
                    size: isTwoDigit ? 22 : 18,
                    fontSize: isTwoDigit ? 8 : 10,
                    offset: {
                        top: isTwoDigit ? 4 : 0,
                        left: isTwoDigit ? 5 : 5
                    }
                }
            }
        }
    }


    return (
        <View style={{ flexDirection : 'row', backgroundColor : Colors.themeWhite, justifyContent :'center', paddingBottom : 25, paddingTop: 25}}>
            <NeomorphFlex
                swapShadows
                style={{
                    shadowRadius: 5,
                    borderRadius: 100,
                    backgroundColor: Colors.themeWhite,
                    width: '75%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    height: normalizeHeight(55),
                }}
            >
            {
                items.map( (item, index) => {
                    const isSelected = index === activeIndex;
                    const enabledColor = isSelected ? Colors.primary : ColorHelpers.applyAlpha(Colors.grey, 0.8)
                    const { icon, count, size, fontSize, offset } = getConfig( itemIds[ index ] );
                    const showBadge = count ? count > 0 : false;
                    
                    return(
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => handlePress( index ) }
                            key={`panel-item-${index}`}
                            style={{ padding: 12, position: 'relative', }}
                        >
                            <Icon
                                fill={enabledColor}
                                stroke={enabledColor}
                                name={icon}
                                width={32}
                                height={32}
                            />
                            { showBadge &&
                            <View style={{ position: 'absolute', width: size, height: size, backgroundColor: Colors.accent, borderRadius: 50, top: 5, right: 5}}>
                                <View style={{ position: 'relative'}}>
                                    <Text style={{ position: 'absolute', color: Colors.themeWhite, fontSize: fontSize, left: offset.left, top: offset.top, alignSelf: 'center'}}>
                                        { count < 99 ? count : '99+' }
                                    </Text>
                                </View>
                            </View>
                            }
                        </TouchableOpacity>
                    )
                })
            }
            </NeomorphFlex>
        </View>
    )
};