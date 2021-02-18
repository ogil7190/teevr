import React from 'react';
import { View, Text, StatusBar, ToastAndroid, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Helpers } from 'Theme';
import NavigationService from 'Services/NavigationService';
import { SCREEN_PROGRESS, SCREEN_SEND_PC } from 'Constants/screenNames';
import { Colors } from 'Theme/Colors';
import { Funny } from 'Modules/Modules';
import { MessageBus, MessageBusEvents } from 'App/Services/MessageBus';
import { Neomorph, NeomorphFlex } from 'react-native-neomorph-shadows';
import { WithLoading } from 'Views/WithLoading';
import QRCode from 'react-native-qrcode-svg';
import { Fonts, normalizeWidth, normalizeHeight } from 'App/Theme/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';

class _SendScreen extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
		isLoading: true,
		config: "{}",
		haveError: false
	};
    this._bind();
  }

  _bind() {
	this.onCustomBackPress = this.onCustomBackPress.bind( this );
	this.gotoProgressScreen = this.gotoProgressScreen.bind( this );
	this.gotoSendPcScreen = this.gotoSendPcScreen.bind( this );
  }

  gotoProgressScreen(){
	const { filesToSend } = this.props.route.params;
	NavigationService.navigateAndReplace(SCREEN_PROGRESS, {
		type: 'send',
		filesToSend
	})
  }

  waitForConnection() {
	ToastAndroid.show('Waiting for Client to connect', ToastAndroid.LONG );
	Funny.startSender(()=> {
		ToastAndroid.show('Connected to Client', ToastAndroid.LONG );
		this.gotoProgressScreen();
	});
  }

  onCustomBackPress( forceCloseScreen ) {
	Funny.stopSender( ()=>{
		forceCloseScreen && forceCloseScreen();
	}, () => {
		/* TRY TO HANDLE THIS ERROR */
	} );
  }

  gotoSendPcScreen() {
	if( this.state.isLoading ) return;

	const { filesToSend } = this.props.route.params;
	this.onCustomBackPress( () => {
		NavigationService.navigateAndReplace(SCREEN_SEND_PC, {
			filesToSend
		})
	});
  }

  componentDidMount() {
	MessageBus.trigger( MessageBusEvents.HEADER_EVENTS.TOGGLE_BACK_HANDLER, {
		enabled: true,
		handler: this.onCustomBackPress
	});

	this.setState({ isLoading: true, haveError: false, helpText: 'Wait...\nEnabling Hotspot for Receiver to connect.' }, () => {
		Funny.enableHotspot( (response)=> {
			this.setState({ isLoading:false, config: JSON.stringify(response), details: response, helpText: 'Hotspot is active, waiting for receiver.' }, () => {
				this.waitForConnection();
			});
		}, () => {
			ToastAndroid.show('Please try Again! Your hotspot was active.', ToastAndroid.LONG );
			this.onCustomBackPress( this.props.forceClose );
		})
	})
  }

  render() {
	const { isLoading, config, helpText, details } = this.state;
	return (
	<View style={[ Helpers.fillCol, { backgroundColor : Colors.themeWhite } ]}>
		<StatusBar barStyle={"dark-content"} backgroundColor={Colors.themeWhite}/>
		<View style={{ alignItems: 'center', flex: 1, backgroundColor: Colors.themeWhite, width: '100%' }}>
			<View style={{ marginTop: 100, marginBottom: 10}}>
				<Text style={{ fontSize: Fonts.FONT_SIZE_14, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR, marginBottom: 30, color: Colors.grey, textAlign: 'center' }}>
					{ helpText }
				</Text>
			</View>

			<Neomorph
				swapShadows
				style={{
					shadowRadius: 10,
					borderRadius: 30,
					backgroundColor: Colors.themeWhite,
					width: normalizeWidth(250),
					position: 'relative',
					justifyContent: 'center',
					alignItems: 'center',
					height: normalizeHeight(250),
				}}
			>
				<WithLoading loading={isLoading}>
					<QRCode
						backgroundColor={'transparent'}
						color={Colors.primary}
						size={normalizeWidth(200)}
						value={config}
					/>
				</WithLoading>
			</Neomorph>

			{ 
				details &&
				<Text style={{ marginTop: 20, textAlign: 'center', color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_16, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD }}>
					{details.ssid}
				</Text>
  			}

			{ 
				details &&
				<Text style={{ textAlign: 'center', color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_16, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR }}>
					{ details.password}
				</Text>
  			}

			{/* <TouchableOpacity disabled={isLoading} onPress={this.gotoSendPcScreen} activeOpacity={0.5} style={{ borderRadius: 10, padding: 20, marginTop: 50}} >
				<NeomorphFlex style={{ shadowRadius: 5, backgroundColor: Colors.themeWhite, borderRadius: 80, padding:15, paddingLeft:30, paddingRight: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
					<Text style={{ textAlign: 'center', color: isLoading ? Colors.grey : Colors.primary, fontSize: Fonts.FONT_SIZE_16, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR, marginRight: 10}}>
						{'Send to iPhone / PC'}
					</Text>

					<ActivityIndicator
						size='small'
						animating={isLoading}
						color={Colors.grey}
					/>
				</NeomorphFlex>
			</TouchableOpacity> */}

			<View style={{ position: 'absolute', bottom: 30}}>
				<Text style={{ fontSize: Fonts.FONT_SIZE_12, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, color: Colors.grey}}>
					{'For faster connection use QR code.'}
				</Text>
			</View>
		</View>
	</View>
	);
  }
}

_SendScreen.headerOptions = {
  hideHeader: false,
}

_SendScreen.propTypes = {
  userIsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const SendScreen = connect(mapStateToProps, mapDispatchToProps)(_SendScreen);
