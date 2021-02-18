import React from 'react';
import { View, TouchableOpacity, Text, StatusBar, Image, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Helpers } from 'Theme';
import { Colors } from 'Theme/Colors';
import { Icon } from 'App/Components/Icon';
import { ICON_REFRESH} from 'Constants/iconNames';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { MessageBus } from 'App/Services/MessageBus';
import { Fonts } from 'App/Theme/Fonts';

const SCANNER_RESET_TIMER = 30 * 1000;

class _QrCodeScannerScreen extends React.Component {
  constructor( props ) {
    super( props );
	this.state = {
		isMounted: false,
		pause: false
	}
	this._bind();
  }

  _bind() {
    this.reload = this.reload.bind( this );
    this.handleQrCode = this.handleQrCode.bind( this );
  }

  componentDidMount() {
	setTimeout( ()=> {
		this.setState({ isMounted: true }, () => {
			this.timer = setTimeout( ()=> {
				/* if scanning is idle for about 60sec disabled it */
				this.setState({ pause: true });
			}, SCANNER_RESET_TIMER );
		} );
	}, 500 );
  }

  handleQrCode( { data } ) {
	if( data ){
		try {
			const obj = JSON.parse( data );
			if( obj.ssid && obj.password ){
				const eventName = this.props.route.params.messageBusEvent;
				MessageBus.trigger( eventName, obj );
				this.props.forceClose();
				clearTimeout( this.timer );
			}
		} catch(e) {
			ToastAndroid.show('Not a valid QR Code for this app.', ToastAndroid.SHORT );
		}
	}
	return false
  }

  reload() {
	  this.setState({ pause: false}, () => {
		this.timer = setTimeout( ()=> {
			/* if scanning is idle for about 60sec disabled it */
			this.setState({ pause: true });
		}, SCANNER_RESET_TIMER );
	  })
  }

  componentWillUnmount() {
	clearTimeout( this.timer );
  }

  render() {
	const { isMounted, pause } = this.state;

    return (
		<View style={[ Helpers.fillCol, { backgroundColor : Colors.themeWhite } ]}>
			<StatusBar barStyle={"dark-content"} backgroundColor={Colors.themeWhite}/>
			<View style={{ flex: 1, backgroundColor: Colors.black, width: '100%', height: '100%',justifyContent: 'center', alignItems: 'center' }}>
				{
					isMounted && !pause &&
					<QRCodeScanner
						vibrate={true}
						onRead={this.handleQrCode}
					/>
  				}
				{
					pause &&
					<TouchableOpacity style={{ padding: 10, backgroundColor: Colors.themeWhite, borderRadius: 100}} onPress={this.reload}>
						<Icon name={ICON_REFRESH} width={50} height={50} fill={Colors.primary} />
					</TouchableOpacity>
				}

				<View style={{ position: 'absolute', bottom: 30, justifyContent: 'center', alignItems: 'center' }}>
					<Text style={{ fontSize: Fonts.FONT_SIZE_12, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, color: Colors.grey, textAlign: 'center'}}>
						{'Try to keep QR code in the camera view for a bit long.'}
					</Text>
				</View>
			</View>
		</View>
    );
  }
}

_QrCodeScannerScreen.headerOptions = {
  hideHeader: false,
}

_QrCodeScannerScreen.propTypes = {
  userIsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const QrCodeScannerScreen = connect(mapStateToProps, mapDispatchToProps)(_QrCodeScannerScreen);
