import React from 'react';
import { View, TouchableOpacity, Text, StatusBar } from 'react-native';
import headerStyle from './HeaderView.Style';
import { Colors } from 'Theme/Colors';
import { ICON_ARROW } from 'App/Constants/iconNames';
import { Icon } from 'Components/Icon';
import { isEmpty } from 'lodash';

const VIEW_TAG = 'HEADER_VIEW';

export const HeaderView = ( props ) => {
    const { actions, actionsReady, title, showHeaderShadow, showBackArrow, onBackPress, renderAfterTitle, arrowColor, headerBackgroundColor } = props;

    const headerCommonStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center'};
    return(
        ( !isEmpty( title ) || showBackArrow ) &&
        <View style={ [ headerStyle.container, showHeaderShadow && headerStyle.showShadow, showBackArrow && { paddingLeft: 5}, headerBackgroundColor && { backgroundColor: headerBackgroundColor} ] }>
            <View style={headerCommonStyle}>
                {
                    showBackArrow &&
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' , marginLeft: 10, padding: 8, paddingRight: 15,}}  activeOpacity={0.8} onPress={ ()=> onBackPress() }>
                        <Icon fill={ arrowColor || Colors.primary} width={24} height={24} name = { ICON_ARROW } />
                    </TouchableOpacity>
                }
                <Text style={ [headerStyle.title] }>{ title }</Text>
                {
                    renderAfterTitle && renderAfterTitle()
                }
            </View>
            <View style={headerCommonStyle}>
                {
                    actionsReady && actions.map( ( item, index ) => {
                        return(
                            <View key={`${VIEW_TAG}-ACTIONS-${index}`}>
                                { item }
                            </View>
                        )
                    }) 
                }
            </View>
        </View>
    );
};
