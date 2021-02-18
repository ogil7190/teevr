import React from 'react';
import { PopupView } from 'Views/PopupView';
import { MessageBus } from 'Services/MessageBus';
import { BackHandler } from 'react-native';
import {POPUP_EVENTS} from 'Constants/MessageBusEvents';

export class Popup extends React.Component {
    constructor( props ){
        super( props );
        const { params } = this.props.route;
        this.state = {
            component: params.component,
            transparent: params.transparent,
            customAlpha: params.customAlpha,
            bottomPopup: params.bottomPopup,
            showCloseButton: params.showCloseButton
        }
        this._bind();
    }

    _bind() {
        this.close = this.close.bind( this );
    }

    UNSAFE_componentWillMount() {
        MessageBus.on( POPUP_EVENTS.CLOSE_POPUP, this.close );
        BackHandler.addEventListener( 'hardwareBackPress', this.close );
    }

    close() {
        this.props.navigation.goBack();
        return true;
    }

    render() {
        return(
            <PopupView {...this.state} close={this.close}>
                {
                    this.state.component
                }
            </PopupView>
        )
    }

    componentWillUnmount() {
        MessageBus.off( POPUP_EVENTS.CLOSE_POPUP, this.close );
        BackHandler.removeEventListener( 'hardwareBackPress', this.close );
    }
}