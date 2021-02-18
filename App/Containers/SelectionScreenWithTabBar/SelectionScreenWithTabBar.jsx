import React from 'react';
import * as ScreenNames from 'Constants/screenNames';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { withLocalStorageFetcherHoc } from 'HOCs/withLocalStorageFetcherHoc';
import { GridWithSelectionAndPreview } from 'Views/GridWithSelectionAndPreview';
import { GridWithSelection } from 'Views/GridWithSelection';
import { ListWithSelection } from 'Views/ListWithSelection';
import { SelectionTabBar } from 'Components/SelectionTabBar';
import { View, Text, TouchableOpacity, StatusBar, ToastAndroid } from 'react-native';
import { MessageBus } from 'App/Services/MessageBus';
import { SCREEN_SEND } from 'App/Constants/screenNames';
import { SELECTION_SCREEN_TOGGLE_CUSTOM_SECTION, HEADER_EVENTS, SELECTION_SCREEN_CHANGE_TITLE, POPUP_EVENTS, NOTIFY_CLEAR_SELECTION, ON_ADD_FILES_TO_SEND, ON_REMOVE_FILES_TO_SEND, SELECTION_SCREEN_WAIT_BACK_PRESSED, SELECTION_SCREEN_WAIT_BACK_PRESSED_BACKED } from 'Constants/MessageBusEvents';
import { normalizeHeight, Fonts } from 'App/Theme/Fonts';
import { Icon } from 'App/Components/Icon';
import { ICON_DROP_DOWN_ARROW, ICON_CLOSE } from 'App/Constants/iconNames';
import { Colors, ColorHelpers } from 'App/Theme/Colors';
import NavigationService from 'Services/NavigationService';
import { findIndex } from 'lodash';
import { openConfirmationAlert } from 'Utils/openConfirmationAlert';
import { check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import { Funny } from 'Modules/Modules';

const Tab = createBottomTabNavigator();

export class SelectionScreenWithTabBar extends React.Component {
    constructor( props ){
        super( props );
        this.data = {};
        this.filesToSend = [];
        this.state = {
            showCustomSection: false
        };
        this.bind();
    }

    bind(){
        this.viewForApp = this.viewForApp.bind( this );
        this.viewForAudio = this.viewForAudio.bind( this );
        this.viewForFile = this.viewForFile.bind( this );
        this.viewForImage = this.viewForImage.bind( this );
        this.viewForVideo = this.viewForVideo.bind( this );
        this.toggleCustomSection = this.toggleCustomSection.bind( this );
        this.onBackPressWarning = this.onBackPressWarning.bind( this );
        this.clearSelection = this.clearSelection.bind( this );
        this.gotoSendScreen = this.gotoSendScreen.bind( this );
        this.onFileAdd = this.onFileAdd.bind( this );
        this.onFileRemoved = this.onFileRemoved.bind( this );
        this.waitBackPressed = this.waitBackPressed.bind( this );
        this.waitBackHandler = this.waitBackHandler.bind( this );
        this.handleNext = this.handleNext.bind( this );
        this.requestLocationPermssion = this.requestLocationPermssion.bind( this );
        this.checkForLocationPermission = this.checkForLocationPermission.bind( this );
        this.changeTitle = this.changeTitle.bind( this );
    }

    UNSAFE_componentWillMount() {
        MessageBus.on( SELECTION_SCREEN_TOGGLE_CUSTOM_SECTION, this.toggleCustomSection );
        MessageBus.on( SELECTION_SCREEN_WAIT_BACK_PRESSED, this.waitBackPressed );
        MessageBus.on( ON_ADD_FILES_TO_SEND, this.onFileAdd );
        MessageBus.on( ON_REMOVE_FILES_TO_SEND, this.onFileRemoved );
        MessageBus.on( SELECTION_SCREEN_CHANGE_TITLE, this.changeTitle );
    }

    onFileAdd( file ) {
        this.filesToSend.push( file );  
    }

    changeTitle( title ) {
        this.props.changeTitle && this.props.changeTitle(title);
    }

    onFileRemoved( file ) {
        const index = findIndex(this.filesToSend, { id: file.id });
        if( index !== -1 ){
            this.filesToSend.splice(index, 1);
        }
    }

    toggleCustomSection( enabled ) {
        this.setState({ showCustomSection : enabled });
        if( enabled ){
            MessageBus.trigger( HEADER_EVENTS.TOGGLE_BACK_HANDLER, {
                enabled: true,
                handler: this.onBackPressWarning
            })
        } else {
            MessageBus.trigger( HEADER_EVENTS.TOGGLE_BACK_HANDLER, { enabled : false } );
        }
    }

    waitBackHandler( forceClose ) {
        if( this.waitCountBackPressed >= 0){
            MessageBus.trigger(SELECTION_SCREEN_WAIT_BACK_PRESSED_BACKED);
            this.waitCountBackPressed = this.waitCountBackPressed - 1;
        } else if( this.state.showCustomSection ){
            MessageBus.trigger( HEADER_EVENTS.TOGGLE_BACK_HANDLER, {
                enabled: true,
                handler: this.onBackPressWarning
            })
            this.onBackPressWarning( forceClose );
        } else {
            forceClose && forceClose();
        }
    }

    waitBackPressed(count) {
        this.waitCountBackPressed = count;
        if( count > 0){
            MessageBus.trigger( HEADER_EVENTS.TOGGLE_BACK_HANDLER, {
                enabled: true,
                handler: this.waitBackHandler
            })
        } else {
            MessageBus.trigger( HEADER_EVENTS.TOGGLE_BACK_HANDLER, { enabled : false } );
            if( this.state.showCustomSection ){
                MessageBus.trigger( HEADER_EVENTS.TOGGLE_BACK_HANDLER, {
                    enabled: true,
                    handler: this.onBackPressWarning
                })
            }
        }
    }

    closePopup() {
        MessageBus.trigger( POPUP_EVENTS.CLOSE_POPUP );
    }

    clearSelection( callback ){
        this.closePopup();
        MessageBus.trigger( NOTIFY_CLEAR_SELECTION );
        callback && callback();
    }

    onBackPressWarning( forceClose ) {
        if( this.waitCountBackPressed > 0) {
            MessageBus.trigger(SELECTION_SCREEN_WAIT_BACK_PRESSED_BACKED);
            this.waitCountBackPressed = this.waitCountBackPressed - 1;
            return;
        }

        openConfirmationAlert({
            title: 'Are you sure you want to clear your selection?',
            onCancel: this.closePopup,
            onConfirm: () => this.clearSelection(forceClose)
        });
    }

    viewWithGrid( props, type, screenId ) {
        const Item = withLocalStorageFetcherHoc( GridWithSelectionAndPreview, { type, screenId });
        return (
          <View>
            <Item {...props} />
          </View>
        )
    }
      
    viewWithList( props, type, screenId, customSelection = false ) {
        const Item = withLocalStorageFetcherHoc( ListWithSelection, { type, screenId, customSelection });
        return (
          <View>
            <Item {...props} />
          </View>
        )
    }
      
    viewWithTile( props, type, screenId ) {
        const Item = withLocalStorageFetcherHoc( GridWithSelection, { type, screenId });
        return (
          <View>
            <Item {...props} />
          </View>
        )
    }
      
    viewForImage( props ) {
        return this.viewWithGrid( props, 'image', ScreenNames.SUB_SCREEN_IMAGES );
    }
    
    viewForFile( props ) {
        return this.viewWithList( props, 'file', ScreenNames.SUB_SCREEN_FILES, true );
    }
    
    viewForAudio( props ) {
        return this.viewWithList( props, 'audio', ScreenNames.SUB_SCREEN_AUDIOS );
    }
    
    viewForVideo( props ) {
        return this.viewWithGrid( props, 'video', ScreenNames.SUB_SCREEN_VIDEOS );
    }
    
    viewForApp( props ) {
        return this.viewWithTile( props, 'app', ScreenNames.SUB_SCREEN_APPS );
    }

    async checkForLocationPermission() {
        const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
		switch (result) {
			case RESULTS.DENIED:
				this.haveLocationPermission = 101;
				this.requestLocationPermssion();
				break;
			case RESULTS.GRANTED:
                this.haveLocationPermission = 100;
				break;
			case RESULTS.BLOCKED:
				ToastAndroid.show('No Location(GPS) Permission.', ToastAndroid.SHORT);
				ToastAndroid.show('Go to settings > Apps > Permissions > Enable Location(GPS) Permission.', ToastAndroid.LONG)
				this.haveLocationPermission = 102;
				break;
		}
    }

    async requestLocationPermssion() {
        const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,  {
			title: 'Location(GPS) permission',
			buttonPositive: 'Okay',
			message: 'We need location(GPS) permission to enable wifi-hostpot to start sharing the files to other devices. This permission is required to continue.',
			buttonNegative: 'Nope'
        });

		switch (result) {
			case RESULTS.DENIED: {
				this.haveLocationPermission = 101;
				ToastAndroid.show('Location(GPS) permission is required to continue, please allow it.', ToastAndroid.LONG)
				this.requestLocationPermssion();
				break;
			}
			case RESULTS.GRANTED: {
                this.haveLocationPermission = 100;
				break;
			}
			case RESULTS.BLOCKED: {
				this.haveLocationPermission = 102;
				ToastAndroid.show('No Location(GPS) Permission.', ToastAndroid.SHORT);
				ToastAndroid.show('Go to settings > Apps > Permissions > Enable Location(GPS) Permission.', ToastAndroid.LONG);
				break;
			}
		}
    }

    gotoSendScreen() {
        Funny.askToEnableLocation( async () => {
            const isLocationEnabled = await DeviceInfo.isLocationEnabled();
            if( isLocationEnabled && this.haveLocationPermission === 100 ){
                NavigationService.navigate(SCREEN_SEND, { filesToSend: this.filesToSend });
            } else {
                ToastAndroid.show('Please enable location(GPS) of device to continue.', ToastAndroid.LONG);  
            }
        });
    }

    async handleNext() {
        await this.requestLocationPermssion();
        await this.gotoSendScreen();
    }

    render(){
        return (
            <>
                {
                    this.state.showCustomSection &&
                    <View style={{ width: '100%', height: normalizeHeight(56), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, backgroundColor: Colors.themeWhite, borderBottomColor: Colors.primary, borderBottomWidth: 3}}>
                        <StatusBar backgroundColor={Colors.themeWhite} />
                        
                        <TouchableOpacity activeOpacity={0.5} onPress={ () => this.clearSelection() } style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: ColorHelpers.applyAlpha( Colors.primary, 0.85 ), borderRadius: 100, padding: 5}}>
                            <Icon name={ICON_CLOSE} width={26} height={26} fill={Colors.themeWhite} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={this.handleNext} activeOpacity={0.5} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View>
                                <Text style={{ fontSize: Fonts.FONT_SIZE_15, color: Colors.primary, marginRight: 5, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR}}>
                                    {'Send Now'}
                                </Text>
                            </View>
                            <View style={{ rotation: -90}}>
                                <Icon stroke={Colors.primary} name={ICON_DROP_DOWN_ARROW} width={18} height={18} />
                            </View>
                        </TouchableOpacity>
                    </View>
                }
                {
                    !this.state.showCustomSection &&
                    <StatusBar backgroundColor={Colors.themeWhite} />
                }
                <Tab.Navigator initialRouteName={ScreenNames.SUB_SCREEN_APPS} tabBar={ props => <SelectionTabBar selectedIndex={2} {...props} /> }>
                    <Tab.Screen name={ScreenNames.SUB_SCREEN_IMAGES} options={{ title: 'Select Images'}} component={this.viewForImage} />
                    <Tab.Screen name={ScreenNames.SUB_SCREEN_FILES} options={{ title: 'Select Files'}} component={this.viewForFile} />
                    <Tab.Screen name={ScreenNames.SUB_SCREEN_APPS} options={{ title: 'Select Apps'}} component={this.viewForApp} />
                    <Tab.Screen name={ScreenNames.SUB_SCREEN_AUDIOS} options={{ title: 'Select Audios'}} component={this.viewForAudio} />
                    <Tab.Screen name={ScreenNames.SUB_SCREEN_VIDEOS} options={{ title: 'Select Videos'}} component={this.viewForVideo} />
                </Tab.Navigator>
            </>
        )
    }

    componentWillUnmount() {
        MessageBus.off( SELECTION_SCREEN_TOGGLE_CUSTOM_SECTION, this.toggleCustomSection );
        MessageBus.off( ON_ADD_FILES_TO_SEND, this.onFileAdd );
        MessageBus.off( ON_REMOVE_FILES_TO_SEND, this.onFileRemoved );
        MessageBus.off( SELECTION_SCREEN_WAIT_BACK_PRESSED, this.waitBackPressed );
        MessageBus.off( SELECTION_SCREEN_CHANGE_TITLE, this.changeTitle );
    }
}

SelectionScreenWithTabBar.headerOptions = {
    
}
