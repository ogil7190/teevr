import React from 'react';
import { View, StatusBar, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Helpers } from 'Theme';
import NavigationService from 'Services/NavigationService';
import { SCREEN_HOME } from 'Constants/screenNames';
import { Colors } from 'Theme/Colors';
import { Funny, Communicator } from 'Modules/Modules';
import { WithLoading } from 'Views/WithLoading';
import { findIndex } from 'lodash';
import { MessageBus, MessageBusEvents } from 'App/Services/MessageBus';
import { ProgressScreenView } from 'Views/ProgressScreenView';
import { get, Keys, set, persist } from 'Utils/localDataManager';
import { openConfirmationAlert, closeAlert } from 'Utils/openConfirmationAlert';

class _ProgressScreen extends React.Component {
	constructor( props ) {
		super( props );
		this.filesStatus = {};
		this.totalBytesToTransfer = 0;
		this.avgSpeed = 0;

		this.sessionData = {
			files: []
		}; /* STORES THE SESSION DETAILS FOR HISTORY TAB */

		this.state = {
			connection: {},
			isLoading: true,
			isComplete: false,
			helpText: '',
			files:[],
			fileProgress: 0,
			noConnection: false,
			overallProgress: 0,
			speed: 0,
			averageSpeed: 0,
			timeLeft: 0,
			timeStarted: new Date().getTime()
		};
		this._bind()
	}

	_bind() {
		this.hanldeTransferStart = this.hanldeTransferStart.bind( this );
		this.hanldeTransferComplete = this.hanldeTransferComplete.bind( this );
		this.handleFileTransferStart = this.handleFileTransferStart.bind( this );
		this.handleFileTransferProgress = this.handleFileTransferProgress.bind( this );
		this.hanldeFileTransferComplete = this.hanldeFileTransferComplete.bind( this );
		this.onBackPressed = this.onBackPressed.bind( this );
		this.onCustomBackPress = this.onCustomBackPress.bind( this );
		this.getFileStatus = this.getFileStatus.bind( this );
		this.handleHandShake = this.handleHandShake.bind( this );
		this.handleOnDisconnect = this.handleOnDisconnect.bind( this );
		this.close = this.close.bind( this );
	}

	UNSAFE_componentWillMount(){
		this.eventEmitter = new NativeEventEmitter(Communicator);
		this.eventEmitter.addListener('transfer:handshake', this.handleHandShake);
		this.eventEmitter.addListener('transfer:start', this.hanldeTransferStart);
		this.eventEmitter.addListener('file:start', this.handleFileTransferStart);
		this.eventEmitter.addListener('file:progress', this.handleFileTransferProgress);
		this.eventEmitter.addListener('file:complete', this.hanldeFileTransferComplete);
		this.eventEmitter.addListener('transfer:complete', this.hanldeTransferComplete);
		this.eventEmitter.addListener('transfer:halt', this.handleOnDisconnect);
		
		this.deviceInfo = this.getDeviceInfo();
	}

	handleHandShake({ info }){
		const device = JSON.parse( info );
		this.setState({ connection: device });
		this.sessionData.deviceInfo = device;
	}

	handleOnDisconnect(){
		this.setState({ noConnection: true });
		openConfirmationAlert({
			title: 'Your connection is intrerrupted with other device.',
			confirmText: 'Okay',
			hideCancel: true,
			onConfirm: this.close
		})
	}

	hanldeTransferStart(params) {
		const files = JSON.parse( params.files );
		this.totalBytesToTransfer = 0;
		
		const { type } = this.props.route.params;
		if( type !== 'send' ) {
			/* UPDATE SESSION HISTORY ADD NEW ENTRY */
			this.sessionData.time = new Date().getTime();
			const sessions = get(Keys.SESSION_HISTORY) || [];
			sessions.unshift(`${Keys.SESSION_FILE_HISTORY_ON}${this.sessionData.time}` );
			set(Keys.SESSION_HISTORY, sessions);
			/******************/
		}

		files.map((file)=> {
			this.totalBytesToTransfer = this.totalBytesToTransfer + file.fileLength;
		});

		this.setState({ files, isLoading: false });
	}

	hanldeTransferComplete() {
		persist();
		const timeTaken = ( (new Date().getTime() ) - this.state.timeStarted ) / 1000; /* TIME TAKEN IN SECONDS */
		this.avgSpeed = ( this.totalBytesToTransfer / 1000 ) / timeTaken;
		this.setState({ isComplete: true, timeTaken });
	}

	handleFileTransferStart(params){
		const file = params.file;
		this.currentFile = file;
		this.filesStatus[ this.currentFile ] = 101 /* FILE TRANSFER IN PROGRESS */;
	}

	handleFileTransferProgress(params){
		const progress = JSON.parse( params.progress );
		const overallProgress = ( progress.totalSent * 100 ) / ( this.totalBytesToTransfer );
		this.avgSpeed = this.avgSpeed + progress.speedInKbps;
		
		const timeTaken = (new Date().getTime() - this.state.timeStarted) / 1000;
		const actualSpeed = this.avgSpeed / timeTaken; /* incremental speed looks like slow but actual avaergae */
		const speed = progress.speedInKbps;

		const timeLeft = actualSpeed === 0 ? this.state.timeLeft : ( (this.totalBytesToTransfer - progress.totalSent) / actualSpeed ) / 1000;
		const fileProgress = progress.progressInPercent;
		const fileTimeLeft = progress.estimatedTimeInSeconds;
		this.setState({ overallProgress, speed, fileProgress, fileTimeLeft, timeLeft });
	}

	hanldeFileTransferComplete(data){
		const { type } = this.props.route.params;
		
		this.sessionData.type = type; /* STORE TYPE INTO SESSION */
		
		if( type !== 'send' ){
			const { filePath } = data;
			const index = findIndex(this.state.files, { filePath: this.currentFile });

			if( index !== -1 ){
				const newFiles = [...this.state.files]
				const newFile = {
					...newFiles[ index ],
					filePath
				};

				const sessionFiles = [...this.sessionData.files];
				sessionFiles.push( { ...newFile, thumbnail: ''} );
				this.sessionData.files = sessionFiles /* ADD THIS FILE INTO SESSION */

				newFiles[ index ] = newFile;
				this.filesStatus[ filePath ] = 102; /* FILE TRANSFER COMPLETE */
				this.setState({ files: newFiles });
			}
		} else {
			/* SAVE NO HISTORY FOR SENT FILES */

			// const index = findIndex(this.state.files, { filePath: this.currentFile });
			// const file = { ...this.state.files[ index ] };
			// file.thumbnail = ''; /* REMOVE THUMBNAIL BEFORE SETTING INTO SESSION */
			// const sessionFiles = [...this.sessionData.files];
			// sessionFiles.push( file );
			// this.sessionData.files = sessionFiles /* ADD THIS FILE INTO SESSION */
			
			this.filesStatus[ this.currentFile ] = 102; /* FILE TRANSFER COMPLETE */
		}

		set( `${Keys.SESSION_FILE_HISTORY_ON}${this.sessionData.time}`, this.sessionData );
	}

	close() {
		const { type } = this.props.route.params;
		if( type === 'send' ){
			Funny.stopSender( ()=>{
				NavigationService.navigateAndReset(SCREEN_HOME)
			}, () => {
				NavigationService.navigateAndReset(SCREEN_HOME)
			});
		} else {
			Funny.stopReceiver( ()=>{
				NavigationService.navigateAndReset(SCREEN_HOME)
			});
		}
	}

	onCustomBackPress() {
		const { isComplete, noConnection } = this.state;
		if( isComplete || noConnection ){ 
			this.close();
		} else {
			openConfirmationAlert({
				title: 'Are you sure you want to disconnect?',
				onCancel: closeAlert,
				onConfirm: () => this.close()
			});
		}
	}

	onBackPressed( custom ) {
		if( custom === 1) this.props.forceClose();
		else this.onCustomBackPress();
	}

	getDeviceInfo() {
		const deviceDetails = get(Keys.SESSION_DATA_DETAILS);
		const detailsWeWant = {
			name: deviceDetails.deviceName,
			avatar: parseInt(deviceDetails.selectedAvatar),
			uid: deviceDetails.uniqueId,
			brand: deviceDetails.brand
		}
		return detailsWeWant;
	}

	componentDidMount() {
		MessageBus.trigger( MessageBusEvents.HEADER_EVENTS.TOGGLE_BACK_HANDLER, {
			enabled: true,
			handler: this.onBackPressed
		});
		const { type, filesToSend } = this.props.route.params;
		const data = {
			info: JSON.stringify(this.deviceInfo)
		}
		if( type === 'send' ){
			data.files = filesToSend;
			Communicator.startFileSending(data);
		} else {
			Communicator.startFilesReceiving(data);
		}
	}

	getFileStatus( file ) {
		const status = this.filesStatus[file] || 103; /* FILE IS NOT YET OPERATED */
		return status;
	}

	render() {
		const { type } = this.props.route.params || {};
		const { isLoading, connection, noConnection, overallProgress, speed, timeLeft, files, isComplete, fileProgress, timeTaken } = this.state;
		return (
		<View style={[ Helpers.fillCol, { backgroundColor : Colors.themeWhite, alignItems: 'center', justifyContent: 'center' } ]}>			
			<WithLoading loading={isLoading}>
				<ProgressScreenView
					overallProgress={overallProgress}
					speed={speed}
					avgSpeed={this.avgSpeed}
					timeLeft={timeLeft}
					files={files}
					connection={connection}
					noConnection={noConnection}
					timeTaken={timeTaken}
					deviceInfo={this.deviceInfo}
					isComplete={isComplete}
					type={type}
					fileProgress={fileProgress}
					onBackPress={this.onBackPressed}
					getFileStatus={this.getFileStatus}
					totalBytesToTransfer = {this.totalBytesToTransfer}
				/>
			</WithLoading>
		</View>
		);
	}

	componentWillUnmount(){
		this.eventEmitter.removeListener('transfer:handshake', this.handleHandShake);
		this.eventEmitter.removeListener('transfer:halt', this.handleOnDisconnect);
		this.eventEmitter.removeListener('transfer:start', this.hanldeTransferStart);
		this.eventEmitter.removeListener('transfer:complete', this.hanldeTransferComplete);
		this.eventEmitter.removeListener('file:start', this.handleFileTransferStart);
		this.eventEmitter.removeListener('file:progress', this.handleFileTransferProgress);
		this.eventEmitter.removeListener('file:complete', this.hanldeFileTransferComplete);
	}
}

_ProgressScreen.headerOptions = {
  hideHeader: true
}

_ProgressScreen.propTypes = {
  userIsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const ProgressScreen = connect(mapStateToProps, mapDispatchToProps)(_ProgressScreen);
