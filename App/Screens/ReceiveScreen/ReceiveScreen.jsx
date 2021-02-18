import React from 'react';
import { View, TouchableOpacity, Text, StatusBar, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Helpers } from 'Theme';
import NavigationService from 'Services/NavigationService';
import { SCREEN_QR_CODE_SCANNER, SCREEN_PROGRESS } from 'Constants/screenNames';
import { Colors } from 'Theme/Colors';
import { Icon } from 'App/Components/Icon';
import { ICON_QR_SCAN, ICON_SEARCH, ICON_REFRESH } from 'Constants/iconNames';
import { NeomorphFlex } from 'react-native-neomorph-shadows';
import { MessageBus, MessageBusEvents } from 'App/Services/MessageBus';
import { ON_QR_CODE_SCAN_RESPONSE } from 'Constants/MessageBusEvents';
import { Funny } from 'App/Modules/Modules';
import { Fonts, normalizeHeight, calc } from 'App/Theme/Fonts';
import LottieView from 'lottie-react-native';
import { NeomorphRing } from 'Views/ProgressScreenView';
import { WithLoading } from 'Views/WithLoading';
import DeviceInfo from 'react-native-device-info';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const SCANNING_TIME = 15 * 1000;

class _ReceiveScreen extends React.Component {
  constructor( props ) {
	super( props );
	this.state ={
		isLoading: false,
		isScanning : true
	}
    this._bind();
  }

  _bind() {
	this.onQrCodeResponse = this.onQrCodeResponse.bind( this );
	this.onCustomBackPress = this.onCustomBackPress.bind( this );
	this.tryConnecting = this.tryConnecting.bind( this );
	this.checkForLocationPermission = this.checkForLocationPermission.bind( this );
	this.requestLocationPermssion = this.requestLocationPermssion.bind( this );
	this.onIconClicked = this.onIconClicked.bind( this );
  }

  gotoProgressScreen() {
    NavigationService.navigateAndReplace(SCREEN_PROGRESS, {
		type: 'receive'
	});
  }

  tryConnecting( { ip } ) {
	ToastAndroid.show('Waiting for connection verification', ToastAndroid.LONG );
	Funny.whatIsMyIpAddress( () => {
		setTimeout( () => {
			this.setState({ isLoading: false }, () => {
				Funny.startReceiver( ip, ()=> {
					this.gotoProgressScreen();
				});
			})
		}, 3000 );
	})
  }

  onCustomBackPress( forceCloseScreen ) {
	Funny.stopReceiver( ()=>{
		forceCloseScreen && forceCloseScreen();
	});
  }

  componentDidMount() {
	this.isComponentMounted = true;
	MessageBus.trigger( MessageBusEvents.HEADER_EVENTS.TOGGLE_BACK_HANDLER, {
		enabled: true,
		handler: this.onCustomBackPress
	});

	setTimeout(() => {
		if( this.isComponentMounted ){
			requestAnimationFrame(() => {
				this.setState({ showAnimation : true }, ()=>{
					requestAnimationFrame( ()=>{
						this.checkForLocationPermission();
					} )
				});
			});

			setTimeout( () => {
				this.setState({ isScanning: false });
			}, SCANNING_TIME );
		}
	}, 1200);
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
		message: 'We need location(GPS) permission to connect to Wifi of other devices to recieve files. This permission is required to connect to other device.',
		buttonNegative: 'Nope'
	});

	switch (result) {
		case RESULTS.DENIED: {
			this.haveLocationPermission = 101;
			ToastAndroid.show('Location(GPS) permission is required to continue, please allow it continue.', ToastAndroid.LONG)
			this.requestStoragePermission();
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

  onQrCodeResponse( data ) {
	this.setState({ isLoading: true });
	Funny.askToEnableLocation( async () => {
		const isLocationEnabled = await DeviceInfo.isLocationEnabled();
		if( isLocationEnabled && this.haveLocationPermission === 100 ){
			Funny.connectToWifi(data, ()=> {
				this.tryConnecting( data );
			},() => {
				ToastAndroid.show('Please try again. Something went wrong.', ToastAndroid.LONG );
				this.setState({ isLoading: false });
			})
		} else {
			this.setState({ isLoading: false });
			ToastAndroid.show('Please enable location(GPS) of device to connect.', ToastAndroid.LONG);
		}
	});
  }

  gotoQrCodeScreen() {
    NavigationService.navigate(SCREEN_QR_CODE_SCANNER, {
		messageBusEvent: `${ON_QR_CODE_SCAN_RESPONSE}-ReceiveScreen`
	});
  }

  UNSAFE_componentWillMount() {
	MessageBus.on(`${ON_QR_CODE_SCAN_RESPONSE}-ReceiveScreen`, this.onQrCodeResponse );
  }

  onIconClicked() {
	  if( this.state.isScanning ) return;
	  else {
		  this.setState({ isScanning: true });
	  }
  }

  render() {
    return (
		<View style={[ Helpers.fillCol, { backgroundColor : Colors.themeWhite, width: '100%', height: '100%' } ]}>
			<StatusBar barStyle={"dark-content"} backgroundColor={Colors.themeWhite}/>
			
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: normalizeHeight(50) }}>
				<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, width: '100%', }}>
					{ this.state.showAnimation && this.state.isScanning && <LottieView source={require('../../Assets/animations/scan.json')} autoPlay loop hardwareAccelerationAndroid={true} /> }
					
					<NeomorphRing outerSize={280}>
						<NeomorphRing outerSize={180}>
								<TouchableOpacity activeOpacity={this.state.isScanning ? 0 : 0.5} onPress={this.onIconClicked}>
									<Icon fill={Colors.primary} stroke={Colors.primary} name={this.state.isScanning ? ICON_SEARCH : ICON_REFRESH} width={60} height={60} />
								</TouchableOpacity>
						</NeomorphRing>
					</NeomorphRing>

					{ this.state.showAnimation && this.state.isScanning && <LottieView source={require('../../Assets/animations/scan.json')} style={{ opacity: 0.3}} autoPlay loop hardwareAccelerationAndroid={true} /> }
				</View>

				<View style={{ flex : 1, width:'100%', alignItems: 'center'}}>
					<View style={{ marginBottom: normalizeHeight(30) }}>
						<Text style={{ fontSize: Fonts.FONT_SIZE_16, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, color: Colors.grey }}>
							{ this.state.isScanning ? 'Searching for sending devices.' : 'Please use QR code to connect.'}
						</Text>
					</View>

					<View style={{ marginTop: normalizeHeight(50), width: '100%', alignItems:'center' }}>
					<WithLoading loading={this.state.isLoading}>
						<TouchableOpacity activeOpacity={0.5} style={{ borderRadius: 10 }} onPress={this.gotoQrCodeScreen}>
							<NeomorphFlex style={{ shadowRadius: 5, backgroundColor: Colors.themeWhite, borderRadius: 80, padding:15, paddingLeft: 30, paddingRight:30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
								<Text style={{ textAlign: 'center', color: Colors.primary, fontSize: Fonts.FONT_SIZE_16, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, marginRight: 10}}>
									{'Quick Scan'}
								</Text>
								<Icon name={ICON_QR_SCAN} width={28} height={28} fill={Colors.primary} stroke={Colors.primary} />
							</NeomorphFlex>
						</TouchableOpacity>
					</WithLoading>
					</View>
				</View>

				<View style={{ position: 'absolute', bottom: normalizeHeight(30) }}>
					<Text style={{ fontSize: Fonts.FONT_SIZE_12, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, color: Colors.grey}}>
						{'For faster connection scan sending device\'s QR code.'}
					</Text>
				</View>
			</View>
		</View>
    );
  }

  componentWillUnmount() {
	this.isComponentMounted = false;
	MessageBus.off(`${ON_QR_CODE_SCAN_RESPONSE}-ReceiveScreen`, this.onQrCodeResponse );
  }
}

_ReceiveScreen.headerOptions = {
  hideHeader: false,
}

_ReceiveScreen.propTypes = {
  userIsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const ReceiveScreen = connect(mapStateToProps, mapDispatchToProps)(_ReceiveScreen);
