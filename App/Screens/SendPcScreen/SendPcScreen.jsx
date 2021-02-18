import React from 'react';
import { View, Text, StatusBar, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Helpers } from 'Theme';
import NavigationService from 'Services/NavigationService';
import { SCREEN_HOME } from 'Constants/screenNames';
import { Colors, ColorHelpers } from 'Theme/Colors';
import { Funny } from 'Modules/Modules';
import { MessageBus, MessageBusEvents } from 'App/Services/MessageBus';
import { Neomorph, NeomorphFlex } from 'react-native-neomorph-shadows';
import { WithLoading } from 'Views/WithLoading';
import { Fonts, normalizeWidth, normalizeHeight } from 'App/Theme/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'App/Components/Icon';
import { ICON_LOGO } from 'App/Constants/iconNames';

const FILE_SERVER_PORT = 8088;

class _SendPcScreen extends React.Component {
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
		this.goToHome = this.goToHome.bind( this );
	}

	waitForConnection() {
		const { filesToSend } = this.props.route.params;
		Funny.startFilesNanoServer(filesToSend, () => {
		}, () => {
			ToastAndroid.show('Something went wrong :( Try Restarting App!', ToastAndroid.LONG );
			// this.onCustomBackPress( this.props.forceClose);
		});
	}

	onCustomBackPress( forceCloseScreen ) {
		Funny.stopSender( ()=>{
			forceCloseScreen && forceCloseScreen();
		}, () => {
			/* TRY TO HANDLE THIS ERROR */
		} );
	}

	goToHome() {
		Funny.stopSender(()=>{
			NavigationService.navigateAndReset(SCREEN_HOME)
		}, () => {
			/* TRY TO HANDLE THIS ERROR */
		});
	}

	componentDidMount() {
		MessageBus.trigger( MessageBusEvents.HEADER_EVENTS.TOGGLE_BACK_HANDLER, {
			enabled: true,
			handler: this.onCustomBackPress
		});
		
		this.setState({ isLoading: true, haveError: false, helpText: 'Wait...\nEnabling Hotspot for device to connect.' }, () => {
			setTimeout( () => {
				Funny.enableHotspot((response)=> {
					this.setState({ isLoading:false, config: response, helpText: 'Hotspot File Server is active.' }, () => {
						this.waitForConnection();
					});
				}, () => {
					ToastAndroid.show('Please try Again! Your hotspot was active.', ToastAndroid.LONG );
					this.onCustomBackPress( this.props.forceClose );
				});
			}, 1000);
		})
	}

	render() {
		const { isLoading, config, helpText } = this.state;
		return (
		<View style={[ Helpers.fillCol, { backgroundColor : Colors.themeWhite } ]}>
			<StatusBar barStyle={"dark-content"} backgroundColor={Colors.themeWhite}/>
			<View style={{ padding:20, flex: 1, backgroundColor: Colors.themeWhite, width: '100%' }}>
				<View style={{ marginTop: 50, marginBottom: 10, alignItems: 'center'}}>
					<Icon name={ICON_LOGO} width={150} height={150} fill={ColorHelpers.applyAlpha(Colors.primary, 0.3)} />
					<Text style={{ fontSize: Fonts.FONT_SIZE_14, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR, marginBottom: 30, color: isLoading ? Colors.primary : Colors.grey, textAlign: 'center' }}>
						{ helpText }
					</Text>
				</View>
				
				<View style={{ flex : 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
					<WithLoading loading={isLoading}>
						<Text style={{ marginBottom: 10, fontSize: Fonts.FONT_SIZE_14, color: Colors.lightBlack, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT}}>
							{'Step 1. Connect to wifi '}
							<Text style={{ fontSize: Fonts.FONT_SIZE_14, color:Colors.primary, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_MEDIUM}}>
								{config.ssid}
							</Text>
						</Text>

						<Text style={{ marginBottom: 10, fontSize: Fonts.FONT_SIZE_14, color: Colors.lightBlack, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT}}>
							{'Step 2. Password is  '}
							<Text style={{ fontSize: Fonts.FONT_SIZE_14, color:Colors.primary, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_MEDIUM}}>
								{config.password}
							</Text>
						</Text>

						<Text style={{ marginBottom: 10, fontSize: Fonts.FONT_SIZE_14, color: Colors.lightBlack, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT}}>
							{'Step 3. Open safari/chrome or any browser.'}
						</Text>

						<Text style={{ marginBottom: 10, fontSize: Fonts.FONT_SIZE_15, color: Colors.lightBlack, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT}}>
							{'Step 4. Go to url '}
							<Text style={{ fontSize: Fonts.FONT_SIZE_14, color:Colors.primary, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_MEDIUM}}>
								{config.ip}
								{`:${FILE_SERVER_PORT}`}
							</Text>
						</Text>

						<Text style={{ marginBottom: 10, fontSize: Fonts.FONT_SIZE_14, color: Colors.lightBlack, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT}}>
							{'Step 5. Download the files.'}
						</Text>
					</WithLoading>
				</View>

				<TouchableOpacity onPress={this.goToHome} activeOpacity={0.5} style={{ borderRadius: 10, padding: 20, marginTop: 50}} >
					<NeomorphFlex style={{ shadowRadius: 5, backgroundColor: Colors.themeWhite, borderRadius: 80, padding:15, paddingLeft:30, paddingRight: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
						<Text style={{ textAlign: 'center', color: Colors.primary, fontSize: Fonts.FONT_SIZE_16, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR, marginRight: 10}}>
							{'Close Session'}
						</Text>
					</NeomorphFlex>
				</TouchableOpacity>
			</View>
		</View>
		);
	}
}

_SendPcScreen.headerOptions = {
  hideHeader: false,
}

_SendPcScreen.propTypes = {
  userIsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const SendPcScreen = connect(mapStateToProps, mapDispatchToProps)(_SendPcScreen);
