import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Helpers } from 'Theme';
import { Colors } from 'Theme/Colors';
import { Fonts } from 'App/Theme/Fonts';
import { Icon } from 'App/Components/Icon';
import { NeomorphRing } from 'Views/ProgressScreenView';
import { ICON_PRIVACY } from 'App/Constants/iconNames';

class _SecurityScreen extends React.PureComponent {
	constructor( props ) {
		super( props );
	}

	render() {
		return (
		<View style={[ Helpers.fillCol, { backgroundColor : Colors.themeWhite, alignItems: 'center', } ]}>
			<StatusBar backgroundColor={Colors.themeWhite} barStyle='dark-content' />
			<View style={{ flex: 1, width: '100%'}}>
				<View style={{ width: '100%'}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 10}}>
						<NeomorphRing outerSize={50} hideInternal={true}>
							<Icon name={ICON_PRIVACY} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Is this app secure?'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'Yes, this app does not collect any information about you or your data on this device without your explicit permission. Also none of your data accessible through this app will be sold to any third party.'}
					</Text>
				</View>

				<View style={{ width: '100%', marginTop: 30}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 10}}>
						<NeomorphRing outerSize={50} hideInternal={true}>
							<Icon name={ICON_PRIVACY} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Why does app need location(GPS) permission?'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'As per android developer guidelines & how android OS works, we need to have location permission to manage wifi connections & for hotspot creation. Without these permission the app will NOT be able to work properly.'}
					</Text>
				</View>

				<View style={{ width: '100%', marginTop: 30}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 10}}>
						<NeomorphRing outerSize={50} hideInternal={true}>
							<Icon name={ICON_PRIVACY} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Why do app need camera permission?'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'To scan QR code of other devices to establish a connection, camera is required, but if you are not using QR code for connection you can skip this permission. This permission is as per usage and depends on user to user.'}
					</Text>
				</View>

				<View style={{ width: '100%', marginTop: 30}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 10}}>
						<NeomorphRing outerSize={50} hideInternal={true}>
							<Icon name={ICON_PRIVACY} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Why do app need storage permission?'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'To list files that are on your device like photos, videos, apps & files, we need storage permisson. Also if you are receiving files from other devices to copy those files on your phones storage permission is required.\n\n'}
					</Text>
				</View>
			</View>
		</View>
		);
	}
}

_SecurityScreen.headerOptions = {
  hideHeader: false
}

_SecurityScreen.propTypes = {
  userIsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const SecurityScreen = connect(mapStateToProps, mapDispatchToProps)(_SecurityScreen);
