import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import NavigationService from 'Services/NavigationService';
import { POPUP_SCREEN } from 'App/Constants/screenNames';
import { Colors, ColorHelpers } from 'App/Theme/Colors';
import { noop } from 'lodash';
import { Fonts } from 'App/Theme/Fonts';
import { MessageBus, MessageBusEvents } from 'Services/MessageBus';

const renderConfirm = ({ title, confirmText, cancelText, onCancel, onConfirm, hideCancel }) => {
    return(
        <View style={{backgroundColor: Colors.white, padding: 10, borderRadius: 5,}}>
            <Text style={{ fontSize: Fonts.FONT_SIZE_15, fontFamily: 'Roboto-Light', margin: 5, marginTop: 10}}>
                { title }
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 5}}>
                {
                    !hideCancel &&
                    <TouchableOpacity onPress={onCancel} activeOpacity={0.5} style={{ backgroundColor: ColorHelpers.applyAlpha(Colors.primary, 0.3), padding: 10, paddingLeft: 15, paddingRight:15, borderRadius: 10 }}>
                        <Text style={{ fontSize: Fonts.FONT_SIZE_14, color: Colors.primary }}>
                            {cancelText}
                        </Text>
                    </TouchableOpacity>
                }

                <TouchableOpacity onPress={onConfirm} activeOpacity={0.5} style={{ backgroundColor: Colors.lightGrey, padding: 10, paddingLeft: 20, paddingRight:20, borderRadius: 10 }}>
                    <Text style={{ fontSize: Fonts.FONT_SIZE_14 }}>
                        {confirmText}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const closeAlert = () => {
    MessageBus.trigger( MessageBusEvents.POPUP_EVENTS.CLOSE_POPUP );
}

export const openConfirmationAlert = (props) => {
    const { customAlpha, transparent } = props;

    const _modified = {
        title: '',
        cancelText: 'Cancel',
        confirmText: 'Yes',
        hideCancel: false,
        onCancel: noop,
        onConfirm: noop,
        ...props
    };
    
    const popupConfig = {
        transparent: transparent || true,
        customAlpha: customAlpha || 0.65,
        component: renderConfirm( _modified )
    }
    NavigationService.navigate( POPUP_SCREEN, popupConfig );
}