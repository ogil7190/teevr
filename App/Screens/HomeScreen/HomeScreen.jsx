import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Communicator, Funny, FileGrabber } from 'Modules/Modules';
import NavigationService from 'Services/NavigationService';
import { SCREEN_SELECTION, SCREEN_RECEIVE, SCREEN_FILES, SCREEN_HISTORY, SCREEN_SETUP, SCREEN_SECURITY, SCREEN_THANKS, SCREEN_ABOUT, SCREEN_UPCOMING } from 'Constants/screenNames';
import { HomeScreenView } from 'Views/HomeScreenView';
import { BackHandler, ToastAndroid } from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import * as Progress from 'react-native-progress';

class _HomeScreen extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			sideMenuVisibile: false
		}
		this.bind();
	}

	bind() {
		this.handleBackPress = this.handleBackPress.bind( this );
		this.toggleSideMenu = this.toggleSideMenu.bind( this );
		this.gotoSelectionScreen = this.gotoSelectionScreen.bind( this );
	}

	gotoSelectionScreen() {
		this.checkForStoragePermission();
		if( this.haveStoragePermissions === 100 ){
			NavigationService.navigate(SCREEN_SELECTION);
		}
	}

	gotoReceiveScreen() {
		NavigationService.navigate(SCREEN_RECEIVE);
	}
	
	gotoFilesScreen() {
		NavigationService.navigate(SCREEN_FILES);
	}

	gotoHistoryScreen() {
		NavigationService.navigate(SCREEN_HISTORY);
	}

	UNSAFE_componentWillMount(){
		requestAnimationFrame( () => {
			FileGrabber.makeFolders();
		})
	}

	componentDidMount() {
		BackHandler.addEventListener( 'hardwareBackPress', this.handleBackPress );
		setTimeout( ()=> {
			this.checkForStoragePermission();
		}, 500);
	}

	handleBackPress() {
		if(this.state.sideMenuVisibile){
			this.setState({ sideMenuVisibile: false });
			return true;
		} else {
			BackHandler.exitApp();
		}
	}

	async requestStoragePermission() {
		const result = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,  {
			title: 'Storage permission',
			buttonPositive: 'Okay',
			message: 'We need storage permission to see files, images & videos on your device that you want to share. This permission is required to continue.',
			buttonNegative: 'Nope'
		});
		switch (result) {
			case RESULTS.DENIED: {
				this.haveStoragePermissions = 101;
				ToastAndroid.show('Store permission is required for the app to work, please allow it.', ToastAndroid.LONG)
				this.requestStoragePermission();
				break;
			}
			case RESULTS.GRANTED: {
				this.haveStoragePermissions = 100;
				break;
			}
			case RESULTS.BLOCKED: {
				this.haveStoragePermissions = 102;
				ToastAndroid.show('No Storage Permission.', ToastAndroid.SHORT);
				ToastAndroid.show('Go to settings > Apps > Permissions > Enable Storage Permission.', ToastAndroid.LONG);
				break;
			}
		}
	}

	async checkForStoragePermission() {
		const result = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
		switch (result) {
			case RESULTS.DENIED:
				this.haveStoragePermissions = 101;
				this.requestStoragePermission();
				break;
			case RESULTS.GRANTED:
				this.haveStoragePermissions = 100;
				break;
			case RESULTS.BLOCKED:
				ToastAndroid.show('No Storage Permission.', ToastAndroid.SHORT);
				ToastAndroid.show('Go to settings > Apps > Permissions > Enable Storage Permission.', ToastAndroid.LONG)
				this.haveStoragePermissions = 102;
				break;
		}
	}

	toggleSideMenu( value ) {
		requestAnimationFrame(()=>{
			this.setState({ sideMenuVisibile: value }, () => {
				requestAnimationFrame(() => {} );
			});
		})
	}

	gotoSetupScreen() {
		NavigationService.navigate(SCREEN_SETUP);
	}

	gotoAboutScreen() {
		NavigationService.navigate(SCREEN_ABOUT);
	}

	gotoSecurityScreen() {
		NavigationService.navigate(SCREEN_SECURITY);
	}

	gotoThanksScreen() {
		NavigationService.navigate(SCREEN_THANKS);
	}

	gotoUpcomingScreen() {
		NavigationService.navigate(SCREEN_UPCOMING);
	}

	render() {
		return (
			<HomeScreenView
				gotoReceiveScreen={this.gotoReceiveScreen}
				gotoSelectionScreen={this.gotoSelectionScreen}
				gotoFilesScreen={this.gotoFilesScreen}
				gotoHistoryScreen={this.gotoHistoryScreen}
				sideMenuVisibile={this.state.sideMenuVisibile}
				toggleSideMenu = { this.toggleSideMenu }
				gotoAboutScreen={this.gotoAboutScreen}
				gotoThanksScreen={this.gotoThanksScreen}
				gotoSecurityScreen={this.gotoSecurityScreen}
				gotoSetupScreen={this.gotoSetupScreen}
				gotoUpcomingScreen={this.gotoUpcomingScreen}
			/>
		)
	}

	componentWillUnmount() {
		Communicator.isCommunicating(( isCommunicating ) => {
		if( isCommunicating ) return ;
			Funny.stopSender( ()=> {
				Funny.stopReceiver( ()=> {
					
				})
			}, () => {
				/* TRY TO HANDLE THIS ERROR */
			})
		})

		BackHandler.removeEventListener( 'hardwareBackPress', this.handleBackPress );
	}
}

_HomeScreen.headerOptions = {
  hideHeader: true,
}

_HomeScreen.propTypes = {
  userIsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(_HomeScreen);
