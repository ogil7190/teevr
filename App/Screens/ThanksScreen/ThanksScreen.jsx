import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Helpers } from 'Theme';
import { Colors } from 'Theme/Colors';
import { Fonts } from 'App/Theme/Fonts';
import { Icon } from 'App/Components/Icon';
import { NeomorphRing } from 'Views/ProgressScreenView';
import { ICON_SMILE } from 'App/Constants/iconNames';

class _ThanksScreen extends React.PureComponent {
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
							<Icon stroke={Colors.primary} name={ICON_SMILE} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Poonam & Amish for Design'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'Did you liked the design? If yes, this awesome design is possible because of '}
						<Text style={{ fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Poonam Beniwal & Amish Singh. '}
						</Text>
						{'A very big thanks for providing this awesome design & all of the related content like wireframes, icons & avatars. They have awesome content on their behance profile too. If you are looking for a designer, they are best fit for it.'}
					</Text>
				</View>

				<View style={{ width: '100%', marginTop: 30}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 10}}>
						<NeomorphRing outerSize={50} hideInternal={true}>
							<Icon stroke={Colors.primary} name={ICON_SMILE} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Friends & Family'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'A big thanks to all of the friends & family members who made this effort possible. Big thanks to all friends who tested the application, invited new users, gave valuable feedback and helped in pin-pointing bugs.'}
					</Text>
				</View>

				<View style={{ width: '100%', marginTop: 30}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 10}}>
						<NeomorphRing outerSize={50} hideInternal={true}>
							<Icon stroke={Colors.primary} name={ICON_SMILE} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Graphics & Animations'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'Most of the graphics used here are designed by Amish & Poonam, thanks again. Also thanks to lottie files & https://lottiefiles.com/4312-scan [ for scan animation ].'}
					</Text>
				</View>

				<View style={{ width: '100%', marginTop: 30}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 10}}>
						<NeomorphRing outerSize={50} hideInternal={true}>
							<Icon stroke={Colors.primary} name={ICON_SMILE} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'And YOU'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'A very very big thanks to you, for trying out the application, using it & being with us. We will try to serve you in the best possible way. Please do not forget to rate us & put your valuable reviews on the respected play store.\n\n'}
					</Text>
				</View>
			</View>
		</View>
		);
	}
}

_ThanksScreen.headerOptions = {
  hideHeader: false
}

_ThanksScreen.propTypes = {
  userIsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const ThanksScreen = connect(mapStateToProps, mapDispatchToProps)(_ThanksScreen);
