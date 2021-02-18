import React from 'react';
import { BackHandler, Easing, Animated } from 'react-native';
import { OverlayView } from 'Views/OverlayView'
import { MessageBus } from 'Services/MessageBus';

export class OverlayScreen extends React.Component{
    constructor( props ){
        super( props );
        const { params } = this.props.route;
        this.params = params;
        this.state = {
            // hidden: true,
            title: this.params.title,
            component: this.params.component
        }
        this._bind();
    }

    _bind() {
        // this.hide = this.hide.bind( this );
        // this.show = this.show.bind( this );
        this.close = this.close.bind( this );
    }

    UNSAFE_componentWillMount() {
        MessageBus.on( OVERLAY_EVENTS.OVERLAY_HIDE_EVENT, this.close );
        BackHandler.addEventListener( 'hardwareBackPress', this.close );
        // MessageBus.on( OVERLAY_EVENTS.OVERLAY_SHOW_EVENT, this.show );
    }

    close() {
        this.props.navigation.goBack();
        return true;
    }

    // hide() {
    //     this.setState({ hidden: true });
    //     return true;
    // }

    // show( config ) {
    //     const { title, component } = config;
    //     this.setState( { 
    //         hidden: false,
    //         component,
    //         title : title || this.state.title
    //     } );
    // }

    render() {
        return(
            <OverlayView
                title ={ this.state.title}
                hide = { this.close }
            >
                {
                    this.state.component
                }
            </OverlayView>
        )
    }

    componentWillUnmount() {
        // MessageBus.off( OVERLAY_EVENTS.OVERLAY_SHOW_EVENT, this.show );
        MessageBus.off( OVERLAY_EVENTS.OVERLAY_HIDE_EVENT, this.close );
        BackHandler.removeEventListener( 'hardwareBackPress', this.close );
    }
}