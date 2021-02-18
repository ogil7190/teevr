import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Helpers } from 'Theme';
import { Colors } from 'Theme/Colors';
import { Fonts } from 'App/Theme/Fonts';
import { Icon } from 'App/Components/Icon';
import { NeomorphRing } from 'Views/ProgressScreenView';
import { ICON_BOX } from 'App/Constants/iconNames';

class _AboutScreen extends React.PureComponent {
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
							<Icon stroke={Colors.primary} name={ICON_BOX} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Who we are?'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'We are a bunch of young developers who are well versed with technical skills & with our skills we want to help & contribute to society by solving their modern life problems, providing cool solutions & better products. We are entirely based in India 🇮🇳. If you are looking for collaboration or hiring some of us contact us at '}
						<Text style={{ fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'ogil7190@gmail.com'}
						</Text>
					</Text>
				</View>

				<View style={{ width: '100%', marginTop: 30}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 10}}>
						<NeomorphRing outerSize={50} hideInternal={true}>
							<Icon stroke={Colors.primary} name={ICON_BOX} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Need good Design like us?'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'Feel free to ping the designers behind this awesome UI, they are more than helpful in delivering such awesome user interface along with good user experience. Connect at'}
						<Text style={{ fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{' poonam230498@gmail.com  &  amish7077@gmail.com .'}
						</Text>
					</Text>
				</View>

				<View style={{ width: '100%', marginTop: 30}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 10}}>
						<NeomorphRing outerSize={50} hideInternal={true}>
							<Icon stroke={Colors.primary} name={ICON_BOX} width={30} height={30} />
						</NeomorphRing>
						<Text style={{ color: Colors.primary, fontSize: Fonts.FONT_SIZE_18, marginLeft: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'Connect'}
						</Text>
					</View>
					<Text style={{ color: Colors.lightBlack, fontSize: Fonts.FONT_SIZE_14, marginLeft: 20, marginRight: 20}}>
						{'We are just one mail away from you, in case you have anything intersting ping us at '}
						<Text style={{ fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD}}>
							{'ogil7190@gmail.com'}
						</Text>
					</Text>
				</View>
			</View>
		</View>
		);
	}
}

_AboutScreen.headerOptions = {
  hideHeader: false
}

_AboutScreen.propTypes = {
  userIsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const AboutScreen = connect(mapStateToProps, mapDispatchToProps)(_AboutScreen);
