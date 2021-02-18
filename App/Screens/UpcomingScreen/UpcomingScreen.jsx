import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Helpers } from 'Theme';
import { Colors } from 'Theme/Colors';
import { Fonts } from 'App/Theme/Fonts';
import { Icon } from 'App/Components/Icon';
import { NeomorphRing } from 'Views/ProgressScreenView';
import { ICON_CIRCLE } from 'App/Constants/iconNames';

class _UpcomingScreen extends React.PureComponent {
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
							<Icon stroke={Colors.primary} name={ICON_CIRCLE} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Web/iPhone Share'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'We are working on web/iPhone Sharing so that it will be easy for users to share with a variety of other devices other than android, soon we will update the application to support iPhone & Web share. '}
					</Text>
				</View>

				<View style={{ width: '100%', marginTop: 30}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 10}}>
						<NeomorphRing outerSize={50} hideInternal={true}>
							<Icon stroke={Colors.primary} name={ICON_CIRCLE} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Sorting & Searching'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'With this feature soon sorting & searching through file manager & selection screen will be possible, it can help users to search big files or latest files. '}
					</Text>
				</View>

				<View style={{ width: '100%', marginTop: 30}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 10}}>
						<NeomorphRing outerSize={50} hideInternal={true}>
							<Icon stroke={Colors.primary} name={ICON_CIRCLE} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Share Hub'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'We will allow users to quickly access the files on their device through a web portal when both the devices are on the same network. Just like Xender soon our users will be able to transfer files to and from just that web portal.'}
					</Text>
				</View>

				<View style={{ width: '100%', marginTop: 30}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 10}}>
						<NeomorphRing outerSize={50} hideInternal={true}>
							<Icon stroke={Colors.primary} name={ICON_CIRCLE} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'More Speed'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'We are trying to boost speed of sharing files to a new level, that other apps are not able to achieve. We will use give a significant boost to speed in coming updates.'}
					</Text>
				</View>
			</View>
		</View>
		);
	}
}

_UpcomingScreen.headerOptions = {
  hideHeader: false
}

_UpcomingScreen.propTypes = {
  userIsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const UpcomingScreen = connect(mapStateToProps, mapDispatchToProps)(_UpcomingScreen);
