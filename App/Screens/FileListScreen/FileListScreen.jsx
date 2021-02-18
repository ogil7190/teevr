import React from 'react';
import { View, TouchableOpacity, Text, StatusBar, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Helpers } from 'Theme';
import { FileGrabber } from 'Modules/Modules';
import { Colors, ColorHelpers } from 'Theme/Colors';
import { WithLoading } from 'Views/WithLoading';
import { parseSize } from 'App/Utils/utils';
import { Fonts, normalizeWidth, normalizeHeight } from 'App/Theme/Fonts';
import { Icon } from 'App/Components/Icon';
import { ICON_AUDIOS, ICON_VIDEOS, ICON_DOCS, ICON_IMAGES, ICON_APPS } from 'App/Constants/iconNames';
import { EmptyListView } from 'Views/EmptyListView';

class _FileListScreen extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			isLoading: true,
			customList: false,
			files: []
		};
		this.bind();
	}

	bind() {
		
	}

	getFilesInFolder( folderPath, callback ){
		FileGrabber.customFilesOfType( 'file', folderPath, (filesObj)=> {
			callback( filesObj );
		});
	}

	componentDidMount(){
		const { folderPath, files } = this.props.route.params;

		if( files ){
			this.setState({ files, isLoading: false, customList: true });
		} else {
			FileGrabber.doesFolderExists(folderPath, ()=> {
				/* FOLDER FOUND LIST THE FILES AND LET USER EXPLORE */
				this.getFilesInFolder( folderPath, (filesObj) => {
					this.setState({ files: filesObj.withOrder, isLoading: false });
				})
			}, () => {
				/* EITHER PERMISSIONS ARE NOT THERE OR FOLDER DOES NOT EXISTS */
			})
		}

	}

	renderHeader() {
		return null;
	}

	getTitleFromPath( path, isFilePath = false ) {
        const splits = path.split("/");
        return splits[ splits.length - ( isFilePath ? 2 : 1 ) ] || '';
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

	viewFile( file ) {
		FileGrabber.triggerViewFile(file);
	}

	renderFiles() {
		const { files, customList } = this.state;
		const { type } = this.props.route.params;
		return (
			<FlatList
				data={files}
				contentContainerStyle={{flexGrow: 1}}
				style={{ width: '100%' }}
				extraData={this.state.files}
				keyExtractor={ ( item , index ) => `file-${index}`}
				ListEmptyComponent={EmptyListView}
				renderItem={ ( { item, index }) => {
					const title = this.getTitleFromPath( item.path || item.filePath );
					const fileType = type || this.getTitleFromPath( item.path || item.filePath, true);

					return (
						<View key={`${index}`} style={{ width: '100%', position: 'relative', flexDirection: 'row', backgroundColor: index % 2 === 0 ? ColorHelpers.applyAlpha(Colors.primary, 0.1) : Colors.themeWhite, justifyContent: 'center', alignItems: 'center', margin:5, padding: 10, }}>
							<View style={{ height: normalizeHeight(36), width: normalizeWidth(36), padding: 10, backgroundColor: index % 2 !== 0 ? ColorHelpers.applyAlpha(Colors.primary, 0.1) : Colors.themeWhite, justifyContent: 'center', alignItems: 'center', marginRight: 10, borderRadius: 100}}>
								<Icon name={this.getIconForTitle(fileType) } width={28} height={28} fill={Colors.primary} />
							</View>
							<View style={{ flex : 1 }}>
								<Text style={{ fontSize: Fonts.FONT_SIZE_16, color: Colors.lightBlack}}>
									{title}
								</Text>
								<Text style={{ fontSize: Fonts.FONT_SIZE_16, color: Colors.lightBlack}}>
									{parseSize(item.size || item.fileLength)}
								</Text>
							</View>
							<TouchableOpacity onPress={ () => this.viewFile(item.path || item.filePath)} style={{ marginRight: 10}} activeOpacity={0.5}>
								<Text style={{ fontSize: Fonts.FONT_SIZE_12, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, backgroundColor: Colors.primary, color: Colors.themeWhite, padding: 4, paddingLeft: 10, paddingRight: 10, borderRadius: 20}}>
									{'Open'}
								</Text>
							</TouchableOpacity>
						</View>
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
			<WithLoading loading={isLoading}>
				{
					this.renderFiles()
				}
			</WithLoading>
		</View>
		);
	}

	componentWillUnmount(){
		
	}
}

_FileListScreen.headerOptions = {
  hideHeader: false
}

_FileListScreen.propTypes = {
  userIsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  
});

export const FileListScreen = connect(mapStateToProps, mapDispatchToProps)(_FileListScreen);
