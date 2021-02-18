import React from 'react'
import { Text, View, TouchableOpacity, StatusBar, BackHandler } from 'react-native'
import NavigationService from 'Services/NavigationService';
import { SCREEN_SETUP, SCREEN_HOME } from 'Constants/screenNames';
import { Neomorph } from 'react-native-neomorph-shadows';
import { Icon } from 'App/Components/Icon';
import { ICON_ARROW, ICON_LOGO } from 'Constants/iconNames';
import { APP_NAME } from 'Constants/contants';
import { Colors } from 'App/Theme/Colors';
import { Fonts, normalizeHeight, normalizeWidth } from 'App/Theme/Fonts';
import { loadDataInMemory, get, Keys } from 'Utils/localDataManager';

export class SplashScreen extends React.Component {
	constructor(props) {
		super( props );
		this.bind();
	}

	bind() {
		this.handleBackPress = this.handleBackPress.bind( this );
		this.gotoSetupScreen = this.gotoSetupScreen.bind( this );
	}

	async UNSAFE_componentWillMount(){
		await loadDataInMemory([ Keys.SESSION_DATA_DETAILS ]);
		BackHandler.addEventListener( 'hardwareBackPress', this.handleBackPress );
	}

	handleBackPress() {
		return false;
	}

	gotoSetupScreen() {
		const { isAppSetup } =  get( Keys.SESSION_DATA_DETAILS ) || {};
		if( isAppSetup ){
			NavigationService.navigateAndReset(SCREEN_HOME);
		} else {
			NavigationService.navigate(SCREEN_SETUP);
		}
	}

	render() {
		return (
			<View style={{ width: '100%', height: '100%', backgroundColor: Colors.themeWhite, flex: 1}}>
				<StatusBar backgroundColor={Colors.themeWhite}/>

				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
					<Neomorph
						swapShadows
						style={{
							shadowRadius: 8,
							borderRadius: 200,
							backgroundColor: Colors.themeWhite,
							width: normalizeWidth(200),
							justifyContent: 'center',
							alignItems: 'center',
							height: normalizeHeight(200),
						}}
					>
						<Icon fill={Colors.primary} name={ICON_LOGO} width={160} height={160} />
					</Neomorph>

					<Text style={{ fontSize: Fonts.FONT_SIZE_50, letterSpacing:-2, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, color: Colors.lightBlack, marginTop: normalizeHeight( 30 )}}>
						{APP_NAME}
					</Text>

					<Text style={{ fontSize: Fonts.FONT_SIZE_16, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, color: Colors.grey }}>
						{'Share Unlimited & Discover more'}
					</Text>
					
					<TouchableOpacity style={{ marginTop: normalizeWidth(100)}} activeOpacity={0.5} onPress={ this.gotoSetupScreen }>
						<Neomorph
							swapShadows
							style={{
								shadowRadius: 8,
								borderRadius: 200,
								backgroundColor: Colors.themeWhite,
								width: normalizeWidth( 160 ),
								justifyContent: 'center',
								alignItems: 'center',
								height: normalizeHeight(55)
							}}
						>
							<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
								<Text style={{ fontSize: Fonts.FONT_SIZE_18, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, color: Colors.primary}}>
									{'Start'}
								</Text>

								<View style={{ rotation: 180, marginLeft: 10 }}>
									<Icon fill={Colors.primary} name={ICON_ARROW} width={24} height={24} />
								</View>
							</View>
						</Neomorph>
					</TouchableOpacity>
				</View>

				<View style={{ justifyContent: 'flex-end', marginBottom: normalizeHeight(30) }}>
					<Text style={{ fontSize: Fonts.FONT_SIZE_18, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, textAlign: 'center', color: Colors.grey}}>
						{'Made with ❤ in India'}
					</Text>
				</View>
			</View>
		)
	}
	
	componentWillUnmount() {
		BackHandler.removeEventListener( 'hardwareBackPress', this.handleBackPress );
	}
	
}
