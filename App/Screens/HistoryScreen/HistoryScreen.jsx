import React from 'react';
import { View, Text, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from 'App/Theme/Colors';
import { get, loadDataInMemory, Keys } from 'Utils/localDataManager';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { NeomorphRing } from 'App/Views/ProgressScreenView';
import { Fonts, normalizeWidth, normalizeHeight, normalizeFont } from 'App/Theme/Fonts';
import { avatars } from 'App/Models/avatars';
import { Icon } from 'App/Components/Icon';
import { parseSize, parseTimeElapsed } from 'App/Utils/utils';
import { reverse } from 'lodash';
import NavigationService from 'App/Services/NavigationService';
import { SCREEN_FILES_LIST } from 'App/Constants/screenNames';
import { EmptyListView } from 'Views/EmptyListView';

class _HistoryScreen extends React.Component {
    constructor(props){
        super( props );
        this.state = {
            transfer: {}
        };
        this.bind();
    }

    bind() {
        this.renderOverview = this.renderOverview.bind( this );
        this.renderHistoryItem = this.renderHistoryItem.bind( this );
        this.previewFiles = this.previewFiles.bind( this );
    }

    async UNSAFE_componentWillMount() {
        const load = await loadDataInMemory([Keys.SESSION_HISTORY]);
        const history = load[ 0 ];

        if( history ){
            const histories = [];
            history.map( ( item ) => {
                histories.push( item );
            });
            const historyData = await loadDataInMemory( histories ); 

            this.setState({ history, historyData }, () => {
                this.calculateTransfer();
            });
        } else {
            this.setState({ history: [] }, () => {
                this.calculateTransfer();
            });
        }
    }

    calculateTransfer() {
        const { history = [], historyData } = this.state;

        if( history.length > 0 ){
            let filesReceived = 0;
            let totalTransfer = 0;
            const temp = {};
            let uniqueDevices = [];

            history.map( (item, index) => {
                const historyItem = historyData[ index ];

                if( historyItem ) {
                    const device = historyItem.deviceInfo;

                    if( temp[`${device.uid}-${device.brand}-${device.name}`] === undefined ) {
                        temp[`${device.uid}-${device.brand}-${device.name}`] = index;
                        uniqueDevices.push([ index ]);
                    } else {
                        const _index = temp[`${device.uid}-${device.brand}-${device.name}`];
                        uniqueDevices[_index].push( index );
                    }
                    historyItem.files.map( ( file, index ) => {
                        filesReceived += 1;
                        totalTransfer += file.fileLength;
                    });
                }
            })

            this.setState({
                uniqueDevices: reverse(uniqueDevices),
                transfer: {
                    fileReceived: filesReceived,
                    totalTransfer: totalTransfer
                }
            });

        } else {
            this.setState({
                transfer: {
                    fileReceived: 0,
                    totalTransfer: 0
                }
            })
        }
    }

    renderOverview() {
        const { selectedAvatar, deviceName } = get(Keys.SESSION_DATA_DETAILS);
        const avatar = avatars[ selectedAvatar ];
        const { transfer } = this.state;

        const capitalizeFirstLetter = (string) => {
            return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
        }        

        return (
            <View style={{ width: '100%', flexDirection: 'row', backgroundColor: Colors.primary, borderBottomRightRadius: 25, borderBottomLeftRadius: 25, paddingBottom: 40, paddingTop: normalizeWidth(20), paddingLeft: 20}}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: normalizeFont(35), color: Colors.themeWhite}}>
                        {'History'}
                    </Text>

                    <Text style={{ marginTop: 5, fontSize: Fonts.FONT_SIZE_14, color: Colors.themeWhite}}>
                        { 'Files Received:  ' + transfer.fileReceived + ' files'}
                    </Text>
                    <Text style={{ marginTop: 5, fontSize: Fonts.FONT_SIZE_14, color: Colors.themeWhite}}>
                        { 'Data Transfered:  ' + parseSize( transfer.totalTransfer ) }
                    </Text>
                </View>
                
                <View>
                    <NeomorphRing outerSize={120} style={{ backgroundColor: Colors.primary, marginRight : 20 }} hideInternal={true}>
                        <Icon name={avatar} width={100} height={100} fill={Colors.themeWhite} />
                    </NeomorphRing>
                    <Text style={{ color: Colors.themeWhite, fontSize: Fonts.FONT_SIZE_12, textAlign: 'center', marginTop: 8}}>
                        { capitalizeFirstLetter(deviceName) }
                    </Text>
                </View>
            </View>
        )
    }

    previewFiles( items ) {
        const { historyData } = this.state;
        const files = [];
        items.map( ( item ) => {
            files.push( ...historyData[item].files ); 
        } );
        NavigationService.navigate(SCREEN_FILES_LIST, {
            files
        });
    }

    renderHistoryItem() {
        return(
            <FlatList
                numColumns={2}
                ListEmptyComponent={ () => <EmptyListView hideContent={true} /> }
                contentContainerStyle={{flexGrow: 1}}
                style={{ width: '100%', padding: 10, paddingTop: 20}}
                data={this.state.uniqueDevices}
                keyExtractor={ ( item, index )  => `${item.uid}-${index}`}
                renderItem={ ( { item }) =>{
                    const _item = item[0];
                    const time = parseInt( this.state.history[ [_item] ].split('-')[1] );
                    const actualItem = this.state.historyData[ _item ];
                    const deviceInfo = actualItem.deviceInfo;
                    const avatar = avatars[ deviceInfo.avatar ];

                    return (
                        <View style={{ justifyContent: 'center', alignItems: 'center', margin: 10, marginLeft: 20, marginRight: 20}}>
                            <NeomorphRing outerSize={120} innerSize={100}>
                                <TouchableOpacity onPress={ () => this.previewFiles(item)} activeOpacity={0.5}>
                                    <Icon name={avatar} width={70} height={70} fill={Colors.primary} />
                                </TouchableOpacity>
                            </NeomorphRing>
                            <Text style={{ fontSize: Fonts.FONT_SIZE_16, color: Colors.primary, marginTop: 10 }}>
                                { deviceInfo.name }
                            </Text>
                            <Text style={{ fontSize: Fonts.FONT_SIZE_12, color: Colors.grey }}>
                                {parseTimeElapsed(time)}
                            </Text>
                        </View>
                    )
                }}
            />
        )
    }

    render() {
        return(
            <View style={{ flex: 1, width: '100%', backgroundColor: Colors.themeWhite}}>
                { this.renderOverview() }
                { this.renderHistoryItem() }
                <StatusBar barStyle={ "light-content"} backgroundColor={Colors.primary }/>
            </View>
        )
    }
}

_HistoryScreen.headerOptions = {
    hideHeader: false,
    headerBackgroundColor: Colors.primary,
    arrowColor: Colors.white
}
  
_HistoryScreen.propTypes = {
    userIsLoading: PropTypes.bool,
};
  
const mapStateToProps = (state) => ({
    
});
  
const mapDispatchToProps = (dispatch) => ({
    
});
  
export const HistoryScreen = connect(mapStateToProps, mapDispatchToProps)(_HistoryScreen);