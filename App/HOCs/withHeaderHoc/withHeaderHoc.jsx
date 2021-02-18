import React from 'react';
import { SafeAreaView, View, ScrollView, YellowBox, BackHandler, StatusBar } from 'react-native';
import { HeaderView } from 'Views/HeaderView';
import { MessageBus } from 'Services/MessageBus';
import headerStyle from 'Views/HeaderView/HeaderView.Style';
import { HEADER_EVENTS } from 'Constants/MessageBusEvents';

// @TODO: Remove when fixed
YellowBox.ignoreWarnings( [ 'VirtualizedLists should never be nested'] )

const SCROLL_THRESHOLD = 20;

export const withHeaderHoc = ( Component ) => {
    return class WithHeaderHoc extends React.Component{
        constructor( props ){
            super( props );
            this.headerOptions = Component.headerOptions || {};
            this.data = {};
            this.state = {
                hideHeader: this.headerOptions.hideHeader || false,
                showHeaderShadow: false,
                headerTitle: this.headerOptions.title || '',
                actions: [],
                actionsReady: false
            };
            this.bind();
        }

        bind(){
            this.toggleHeader = this.toggleHeader.bind( this );
            this.renderActions = this.renderActions.bind( this );
            this.handleScroll = this.handleScroll.bind( this );
            this.canGoBack = this.canGoBack.bind( this );
            this.close = this.close.bind( this );
            this.forceClose = this.forceClose.bind( this );
            this.toggleBackHandler = this.toggleBackHandler.bind( this );
            this.changeTitle = this.changeTitle.bind( this );
        }

        UNSAFE_componentWillMount() {
            BackHandler.addEventListener( 'hardwareBackPress', this.close );
            MessageBus.on(HEADER_EVENTS.TOGGLE_HEADER, this.toggleHeader);
            MessageBus.on(HEADER_EVENTS.TOGGLE_BACK_HANDLER, this.toggleBackHandler);
        }

        close() {
            requestAnimationFrame( () => {
                if( this.data.haveCustomBackHandler ){
                    this.data.customBackHandler && this.data.customBackHandler( this.forceClose );
                } else {
                    this.props.navigation.goBack();
                }
            })
            return true;
        }

        forceClose() {
            this.props.navigation.goBack();
        }

        toggleHeader( enabled ){
            this.setState( { hideHeader: enabled } );
        }

        toggleBackHandler({ enabled, handler }) {
            this.data = {
                ...this.data,
                haveCustomBackHandler: enabled,
                customBackHandler: handler
            }
        }

        renderActions( actions ) {
            this.setState({ actions, actionsReady: true });
        }

        getActions() {
            return this.actions;
        }

        handleScroll( event ) {
            const scrollOffset = event.nativeEvent.contentOffset;
            if( scrollOffset && scrollOffset.y >= 0 && !this.headerOptions.hideHeaderShadow ){
                if( scrollOffset.y < SCROLL_THRESHOLD && this.state.showHeaderShadow !== false ){
                    this.setState( { showHeaderShadow: false } );
                }
    
                if( scrollOffset.y > SCROLL_THRESHOLD && this.state.showHeaderShadow !== true ){
                    this.setState( { showHeaderShadow: true } );
                }
            }
        }

        renderBody(){
            const _View = this.headerOptions.viewType === 'view' ? View : ScrollView
            return(
                <_View
                    style={[ headerStyle.contentContainer]} contentContainerStyle={{flexGrow: 1}}
                    showsVerticalScrollIndicator = { false }
                    scrollEventThrottle = { 16 }
                    nestedScrollEnabled = { true }
                    onScroll = { !this.state.hideHeader && this.handleScroll }
                >
                    <Component
                        {...this.props}
                        toggleHeader = { this.toggleHeader }
                        renderActions = { this.renderActions }
                        forceClose = { this.close }
                        changeTitle= {this.changeTitle}
                    />
                </_View>
            );
        }

        canGoBack() {
            const index = this.props.navigation.dangerouslyGetState().index;
            if( index > 0 ){
                return true;
            } else {
                return false;
            }
        }

        changeTitle( newTitle ){
            this.setState({ headerTitle: newTitle });
        }

        render(){
            const { headerTitle, hideHeader, showHeaderShadow, actions, actionsReady } = this.state;
            const showBackArrow = this.canGoBack();
            
            return (
                <SafeAreaView style={[ headerStyle.mainContainer ]}>
                    <StatusBar hidden={false} />
                    <View style={[ headerStyle.content ]}>
                        <View style={[ headerStyle.content, headerStyle.contentBody, !this.state.hideHeader && headerStyle.skipHeader ]}>
                            {
                                this.renderBody()
                            }
                        </View>
                        {
                            !hideHeader &&
                            <HeaderView
                                actionsReady = { actionsReady }
                                showHeaderShadow = { showHeaderShadow }
                                showBackArrow = { showBackArrow}
                                title = { headerTitle }
                                renderAfterTitle = { this.headerOptions.renderAfterTitle } 
                                actions = { actions }
                                onBackPress = { this.close }
                                {...this.headerOptions}
                            />
                        }
                    </View>
                </SafeAreaView>
            );
        }

        componentWillUnmount() {
            BackHandler.removeEventListener( 'hardwareBackPress', this.close );
            MessageBus.off(HEADER_EVENTS.TOGGLE_HEADER, this.toggleHeader);
            MessageBus.off(HEADER_EVENTS.TOGGLE_BACK_HANDLER, this.toggleBackHandler);
        }
    }
}