import React from 'react';
import { View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import styles from './OverlayView.Style';
import { Icon } from 'Components/Icon';
import { ICON_CLOSE_CIRCULAR } from 'Constants/iconNames';
import { Colors } from 'Theme/Colors';

export const OverlayView = ( props ) => {
    const { title, hide } = props;
    return(
        <SafeAreaView style={ styles.container }>
            <View style={ styles.header }>
                <Text style={styles.title}>
                    {title}
                </Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={ hide }
                >
                    <Icon name={ICON_CLOSE_CIRCULAR} width={24} height={24} fill={Colors.lightBlack} />
                </TouchableOpacity>
            </View>
            {
                props.children
            }
        </SafeAreaView>
    )
}