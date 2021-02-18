import React from 'react';
import { View, TouchableOpacity, StatusBar, Text, TextInput, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { Neomorph } from 'react-native-neomorph-shadows';
import { FlatList } from 'react-native-gesture-handler';
import { Icon } from 'App/Components/Icon';
import { ICON_CHECK } from 'Constants/iconNames';
import NavigationService from 'Services/NavigationService';
import { SCREEN_HOME } from 'Constants/screenNames';
import { Colors } from 'App/Theme/Colors';
import { Fonts, normalizeFont, normalizeWidth, normalizeHeight, calc } from 'App/Theme/Fonts';
import { avatars } from 'Models/avatars';
import { getDeviceConfig } from 'Utils/getDeviceConfig';
import { set, Keys, get } from 'Utils/localDataManager';
import { NeomorphRing } from 'Views/ProgressScreenView';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const POSSIBLE_NAME_LENGTH = 12;

class _SetupScreen extends React.Component {  
	constructor( props ) {
		super( props );
		this.bind();
		this.state = {
			deviceName: '',
			selectedAvatar: 0
		}
	}

	bind() {
		this.selectAvatar = this.selectAvatar.bind( this );
		this.checkComplete = this.checkComplete.bind( this );
		this.setNewName = this.setNewName.bind( this );
	}

	selectAvatar( index ) {
		this.setState( { selectedAvatar: index });
	}

	saveDetails() {
		const data = {
			...this.state.details,
			deviceName: this.state.deviceName,
			selectedAvatar: this.state.selectedAvatar,
			isAppSetup: true
		};
		set(Keys.SESSION_DATA_DETAILS, data);
	}

	checkComplete() {
		if( this.state.error ){
			ToastAndroid.show('Please enter a valid name', ToastAndroid.SHORT );
		} else {
			this.saveDetails();
			this.gotoHome();
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

	async componentDidMount() {
		const { selectedAvatar, deviceName } =  get( Keys.SESSION_DATA_DETAILS ) || {};
		const details = await getDeviceConfig() || {};
		const _name = deviceName ? deviceName : details.model ? details.model.substring(0, POSSIBLE_NAME_LENGTH) : details.deviceName.substring(0, POSSIBLE_NAME_LENGTH);
		this.setState({ deviceName : _name, details, selectedAvatar: selectedAvatar || 0 });
		setTimeout( () => {
			this.checkForStoragePermission();
		}, 1000);
	}

	gotoHome() {
		if( this.haveStoragePermissions ===  100 ){
			NavigationService.navigateAndReset( SCREEN_HOME, { selectedAvatar: this.state.selectedAvatar } );
		} else {
			this.checkForStoragePermission();
		}
	}

	setNewName( name ) {
		if( name.length < 4){
			this.setState({ deviceName: name, error: true });
		} else {
			this.setState({ deviceName: name, error: false });
		}
	}

	render() {
		const avatar = avatars[this.state.selectedAvatar];

		return (
		<View style={{ width: '100%', height: '100%', flex: 1, backgroundColor: Colors.themeWhite, alignItems: 'center', }}>
				<StatusBar backgroundColor={Colors.themeWhite} barStyle={'dark-content'}/>
				<Neomorph
					swapShadows
					style={{
						shadowRadius: 10,
						marginTop: normalizeHeight(40),
						borderRadius: 200,
						backgroundColor: Colors.themeWhite,
						width: normalizeWidth(160),
						padding:10,
						justifyContent: 'center',
						alignItems: 'center',
						height: normalizeHeight(160),
					}}
				>
					<Icon name={avatar} width={135} height={135} fill={Colors.primary} />

				</Neomorph>

				<Neomorph
					inner
					swapShadows
					style={{
						shadowRadius: 5,
						marginTop: 30,
						borderRadius: 100,
						backgroundColor: Colors.themeWhite,
						width: calc('85%'),
						padding:5,
						borderWidth: 1,
						borderColor: this.state.error ? Colors.accent : Colors.themeWhite,
						justifyContent: 'center',
						alignItems: 'center',
						height: normalizeHeight(50),
					}}
				>
				
				<TextInput
					placeholder={'Your Device Nick Name'}
					maxLength={POSSIBLE_NAME_LENGTH}
					value={this.state.deviceName}
					onChangeText = { this.setNewName }
					style={{ 
						borderRadius: 5,
						paddingLeft: 30,
						paddingRight: 30,
						paddingTop: normalizeWidth(5),
						width: '100%',
						paddingBottom: normalizeHeight(5),
						fontSize: Fonts.FONT_SIZE_18,
						color: Colors.grey,
						fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT,
						textAlign: 'center'
					}}
				/>
				</Neomorph>
				{
					this.state.error &&
					<Text style={{ margin: 5, marginTop: 10, color: Colors.grey, fontSize: Fonts.FONT_SIZE_12 }}>
						{'Please enter a valid name to continue.'}
					</Text>
				}
			<FlatList
				style={{ flexGrow: 1,  backgroundColor: Colors.themeWhite, marginTop: normalizeHeight(40), marginBottom: normalizeWidth(30) }}
				numColumns={3}
				showsVerticalScrollIndicator={false}
				keyExtractor={ ( item , index ) => `avatar-${index}`}
				data={ avatars } 
				renderItem={ ( { item, index } ) => {
					const isSelected = this.state.selectedAvatar === index;

					return (
						<TouchableOpacity activeOpacity={0.5} key={ `${index}`} onPress={ () => this.selectAvatar( index )} style={{ margin: 10}}>
						<>
						{/* <Neomorph
						swapShadows
						inner
						style={{
							shadowRadius: 2,
							borderRadius: 50,
							backgroundColor: Colors.themeWhite,
							width: normalizeWidth(95),
							justifyContent: 'center',
							alignItems: 'center',
							height: normalizeHeight(95),
						}}
						> */}
							<NeomorphRing outerSize={100} style={{ marginBottom: 10}} innerSize={80}>
								<Icon name={item} width={60} height={60} fill={  isSelected ? Colors.primary : Colors.grey} />
							</NeomorphRing>
						{/* </Neomorph> */}
						{
						this.state.selectedAvatar === index &&  
						<View style={{ position: 'absolute', top: 5, right: 10}}>
							<Icon name={ICON_CHECK} fill={Colors.primary}  width={20} height={20} />
						</View>
						}
						</>
						</TouchableOpacity>
					)
				}}
			/>

			<TouchableOpacity activeOpacity={0.5} onPress={ this.checkComplete }>
				<Neomorph
					swapShadows
					style={{
						shadowRadius: 8,
						borderRadius: 200,
						backgroundColor: Colors.themeWhite,
						width: normalizeWidth(160),
						justifyContent: 'center',
						alignItems: 'center',
						// paddingRight: 5,
						paddingLeft: 10,
						height: normalizeHeight(50)
					}}
				>
					<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
						<Text style={{ fontSize: Fonts.FONT_SIZE_18, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR, color: Colors.primary, textAlign: 'center'}}>
							{'Done'}
						</Text>

						<View style={{ margin: 10}}>
							<Icon name={ICON_CHECK} width={20} height={20} fill={Colors.primary} />
						</View>
					</View>
				</Neomorph>
			</TouchableOpacity>

			<Text style={{ fontFamily: Fonts.FONT_SIZE_REGULAR, fontSize: normalizeFont(8), color: Colors.lightBlack, textAlign: 'center', marginLeft: 25, marginRight:25, marginTop: normalizeHeight(25), marginBottom: normalizeHeight(10) }}>
				{'By continuing you agree to terms of use and privacy policy of this app.'}
			</Text>
		</View>
		);
	}
}

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const SetupScreen = connect(mapStateToProps, mapDispatchToProps)(_SetupScreen);
