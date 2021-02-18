import React, { Component } from 'react';
import AppNavigator from 'Navigators/AppNavigator';
import { View, Text, StatusBar, AppState } from 'react-native';
import { connect } from 'react-redux';
import StartupActions from 'Stores/Startup/Actions';
import { PropTypes } from 'prop-types';
import { get } from 'lodash';
import { persist, loadDataInMemory, Keys, get as getData } from 'Utils/localDataManager';

// **********************************************
/* Check for todos in the project to see what is missing or what not while going production */
// **********************************************

const APP_STATE_ACTIVE = "active";
const APP_STATE_BACKGROUND = "background";

class _RootScreen extends Component {
	constructor(props){
		super(props);
		this.state = {
			loaded: false
		}
	}

	componentDidMount() {
		// const token = get( this.props.config, 'token', null );
		// if( token ){
		// 	this.props.startup()
		// } else {
		// 	const config = getDeviceConfig();
		// 	this.props.firstStart( config );
		// }
		
		AppState.addEventListener("change", this.handleAppStateChange);
		this.loadData();
		// AppState.addEventListener("blur", this.handleAppStateChange);
	}

	async loadData() {
		await loadDataInMemory([ Keys.SESSION_DATA_DETAILS ]);
		this.setState({ loaded: true });
	}

	async handleAppStateChange( state ) {
		if( state === APP_STATE_BACKGROUND ){
			await persist();
		}
	}

	render() {
		return (
			<View style={{ flex : 1 } }>
				{
					this.state.loaded &&
					<AppNavigator />
				}
			</View>
		)
	}

	componentWillUnmount(){
		AppState.removeEventListener("change", this.handleAppStateChange);
	}
}

_RootScreen.propTypes = {
	startup: PropTypes.func,
}

const mapStateToProps = (state) => ({
	config : state.config
})

const mapDispatchToProps = (dispatch) => ({
	startup: () => dispatch(StartupActions.startup()),
	firstStart: () => dispatch(StartupActions.firstStart()),
})

export const RootScreen = connect(mapStateToProps,mapDispatchToProps)(_RootScreen);
