import React from 'react';
import { View, TouchableOpacity, Text, StatusBar, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Helpers } from 'Theme';
import { FileGrabber } from 'Modules/Modules';
import { Colors, ColorHelpers } from 'Theme/Colors';
import { WithLoading } from 'Views/WithLoading';
import { Fonts, normalizeWidth } from 'App/Theme/Fonts';
import { Icon } from 'App/Components/Icon';
import { ICON_FOLDER, ICON_AUDIOS, ICON_VIDEOS, ICON_DOCS, ICON_IMAGES, ICON_APPS } from 'App/Constants/iconNames';
import NavigationService from 'App/Services/NavigationService';
import { SCREEN_FILES_LIST } from 'App/Constants/screenNames';
import { NeomorphRing } from 'Views/ProgressScreenView';
import { EmptyListView } from 'App/Views/EmptyListView';

class _FilesScreen extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			isLoading: true,
			files: []
		};
	}

	getFilesInFolder( folderPath, callback ){
		FileGrabber.customFilesOfType( 'file', folderPath, (filesObj)=> {
			callback( filesObj );
		});
	}

	gotoFileListScreen( folderPath, title ) {
		NavigationService.navigate( SCREEN_FILES_LIST, {
			folderPath,
			type: title
		});
	}

	componentDidMount(){
		setTimeout( () => {
			requestAnimationFrame( () => {
				FileGrabber.doesAppFolderExists( (folderPath)=> {
					/* FOLDER FOUND LIST THE FILES AND LET USER EXPLORE */
					this.getFilesInFolder( folderPath, (filesObj) => {
						this.setState({ files: filesObj.withOrder, isLoading: false });
					})
				}, () => {
					/* EITHER PERMISSIONS ARE NOT THERE OR FOLDER DOES NOT EXISTS */
				})
			})
		}, 100);
	}

	getTitleFromPath( path ) {
        const splits = path.split("/");
        return splits[ splits.length - 1 ] || '';
	}
	
	getIconForTitle( title ){
		if( title.indexOf('Apps') !== -1 ){
			return ICON_APPS;
		}

		if( title.indexOf('Videos') !== -1 ){
			return ICON_VIDEOS;
		}

		if( title.indexOf('Files') !== -1 ){
			return ICON_DOCS;
		}

		if( title.indexOf('Images') !== -1 ){
			return ICON_IMAGES;
		}

		if( title.indexOf('Audios') !== -1 ){
			return ICON_AUDIOS;
		}
	}

	renderFiles() {
		const { files } = this.state;
		return (
			<FlatList
				data={files}
				style={{ width: '100%', height: 0, padding: 10, paddingTop:0}}
				numColumns={2}
				ListEmptyComponent={EmptyListView}
				keyExtractor={ ( item , index ) => `folder-${index}`}
				extraData={this.state.files}
				renderItem={ ( { item, index }) => {
					const title = this.getTitleFromPath( item.path );
					return (
						<NeomorphRing hideInternal={true} outerSize={140} style={{ margin: normalizeWidth(25) }}>
							<TouchableOpacity activeOpacity={0.5} onPress={() => this.gotoFileListScreen(item.path, title)} style={{ position: 'relative', justifyContent: 'center', alignItems: 'center'}}>
								<Icon name={ICON_FOLDER} width={75} height={75} fill={ColorHelpers.applyAlpha(Colors.primary, 0.85)} />
								<Text style={{ fontSize: Fonts.FONT_SIZE_16, color: Colors.lightBlack, marginTop: 2}}>
									{title}
								</Text>

								<View style={{ position: 'absolute', paddingBottom: 15}}>
									<Icon name={ this.getIconForTitle(title) } width={30} height={30} fill={Colors.primary} stroke={Colors.primary} />
								</View>
							</TouchableOpacity>
						</NeomorphRing>
					)
				}}
			/>
		)
	}

	render() {
		const { isLoading } = this.state;
		return (
		<View style={[ Helpers.fillCol, { backgroundColor : Colors.themeWhite, alignItems: 'center', } ]}>
			<StatusBar backgroundColor={Colors.themeWhite} barStyle='dark-content' />
			<View style={{ width: '100%', flex: 1, alignItems: 'center', flexGrow: 1}}>
				<WithLoading loading={isLoading}>
					{
						this.renderFiles()
					}
				</WithLoading>
			</View>
			<Text style={{ justifyContent: 'flex-end', textAlign: 'center', fontSize: Fonts.FONT_SIZE_10, color: Colors.grey, marginBottom: 15, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT}}>
				{'These are the files that are sent by other devices.\nYou can find these folders in your file explorer also.'}
			</Text>
		</View>
		);
	}
}

_FilesScreen.headerOptions = {
  hideHeader: false
}

_FilesScreen.propTypes = {
  userIsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const FilesScreen = connect(mapStateToProps, mapDispatchToProps)(_FilesScreen);
