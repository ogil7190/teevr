import React from 'react';
import { TouchableOpacity, StatusBar, View } from 'react-native';
import { ColorHelpers, Colors } from 'Theme/Colors';
import { calc } from 'Theme/Fonts';
import * as Animatable from "react-native-animatable";
import { Icon } from 'App/Components/Icon';
import { ICON_CLOSE_CIRCULAR, ICON_CLOSE } from 'Constants/iconNames';

export const PopupView = ( props ) => {
    const { close, bottomPopup, showCloseButton, transparent, customAlpha } = props;
    const colorWithAlpha = ColorHelpers.applyAlpha( Colors.black, customAlpha ? customAlpha : transparent ?  0.90 : 0.5 )

    return (
        <>
        <StatusBar backgroundColor={colorWithAlpha} />
        <TouchableOpacity
            activeOpacity = { 1 }
            onPress = { close }
            style= {{
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent : bottomPopup ? 'flex-end' : 'center',
                alignItems : 'center',
                backgroundColor : colorWithAlpha,
            }}
        >
            <Animatable.View
                animation={ bottomPopup ? 'slideInUp' : 'zoomIn' }
                duration={200}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ 
                        backgroundColor : transparent ? Colors.transparent : Colors.white,
                        padding : bottomPopup ? 0 : 5,
                        borderRadius : 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomLeftRadius: bottomPopup ? 0 : 4,
                        borderBottomRightRadius: bottomPopup ? 0 : 4,
                        width : calc( bottomPopup ? '100%' : '100% - 20' ),
                        margin : bottomPopup ? 0 : 10
                    }}
                >
                    {
                        props.children
                    }
                </TouchableOpacity>

                {
                    showCloseButton &&
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={close}
                        style={{ position: 'absolute', backgroundColor: Colors.white, padding: 5, borderRadius: 100, bottom: 10, alignSelf: 'center'}}
                    >
                        <Icon name={ICON_CLOSE} fill={Colors.primary} width={32} height={32} />
                    </TouchableOpacity>
                }

            
            </Animatable.View>
        </TouchableOpacity>
        </>
    )
}