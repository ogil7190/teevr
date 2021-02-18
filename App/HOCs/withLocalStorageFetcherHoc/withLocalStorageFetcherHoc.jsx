import React from 'react';
import { FileGrabber } from 'App/Modules/Modules';
import { View } from 'react-native';
import { LOCAL_STORAGE_FETCHER_EVENT_ON_ITEM_SELECT, NOTIFY_SCREEN_PANEL_EVENT_ON_ITEM_SELECT, NOTIFY_CLEAR_SELECTION, ON_ADD_FILES_TO_SEND, ON_REMOVE_FILES_TO_SEND, SELECTION_SCREEN_WAIT_BACK_PRESSED, SELECTION_SCREEN_WAIT_BACK_PRESSED_BACKED } from 'Constants/MessageBusEvents';
import { MessageBus } from 'App/Services/MessageBus';
import { Colors } from 'App/Theme/Colors';
import { shortID } from 'App/Utils/utils';

const TERM_FOR_ROOT_FOLDER = 'Home';

export const withLocalStorageFetcherHoc = ( Component, config = {} ) => {
    const { type, screenId, customSelection } = config;
    return class WithLocalStorageFetcherHoc extends React.Component {
        constructor( props ) {
            super( props );
            this.extraData = {};
            this.currentPage = TERM_FOR_ROOT_FOLDER;
            this.data = {
                selectedItems: {},
                thumbnails: {}
            };
            this.state = {
                isLoading: true,
                customPages: []
            };
            this.bind();
        }

        bind() {
            this.onItemSelect = this.onItemSelect.bind( this );
            this.isItemSelected = this.isItemSelected.bind( this );
            this.thumbnailExecutor = this.thumbnailExecutor.bind( this );
            this.onNotifyClear = this.onNotifyClear.bind( this );
            this.onCustomSelection = this.onCustomSelection.bind( this );
            this.removePageTillIndex = this.removePageTillIndex.bind( this );
            this.onCustomSelectionBack = this.onCustomSelectionBack.bind( this );
            this._onBlur = this._onBlur.bind( this );
            this._onFocus = this._onFocus.bind( this );
        }

        grabFromFileGrabber() {
            FileGrabber.getFilesOfType(type, (obj) => {
                this.data[type] = obj;
                this.data.selectedItems = {}

                requestAnimationFrame( () => {
                    if( this.isComponentMounted ){
                        this.setState({ items : obj.withOrder, isLoading: false}, () => {
                            requestAnimationFrame( () => {});
                        });
                    }
                })
            })
        }

        UNSAFE_componentWillMount() {
            this.isComponentMounted = true;
            MessageBus.on(`${LOCAL_STORAGE_FETCHER_EVENT_ON_ITEM_SELECT}-${type}`, this.onItemSelect);
            MessageBus.on( `${LOCAL_STORAGE_FETCHER_EVENT_ON_ITEM_SELECT}-custom-selection-${type}`, this.onCustomSelection);
            MessageBus.on(NOTIFY_CLEAR_SELECTION, this.onNotifyClear);
            MessageBus.on(SELECTION_SCREEN_WAIT_BACK_PRESSED_BACKED, this.onCustomSelectionBack);
            this.props.navigation.addListener('focus', this._onFocus);
            this.props.navigation.addListener('blur', this._onBlur);
        }

        onCustomSelectionBack() {
            if( this.needCustomBackForTimes > 0 ){
                this.grabCustomFiles(null, true);
            }
        }

        _onBlur() {
            if( this.needCustomBackForTimes > 0 ){
                MessageBus.trigger(SELECTION_SCREEN_WAIT_BACK_PRESSED, 0);
            }
        }

        _onFocus() {
            if( this.needCustomBackForTimes > 0 ){
                MessageBus.trigger(SELECTION_SCREEN_WAIT_BACK_PRESSED, this.needCustomBackForTimes);
            }
        }

        onNotifyClear() {
            this.data.selectedItems = {};
            this.forceUpdate();
        }

        componentDidMount() {
            this.grabFromFileGrabber();
        }

        removePageTillIndex( page, index ) {
            const arr = [...this.state.customPages];
            const nameSplit = this.currentPage.split("-");

            const _nameIndex = nameSplit.indexOf( page.title );
            
            nameSplit.splice(_nameIndex + 1);
            this.currentPage = nameSplit.join("-");

            const elementsToRemove = (arr.length - index );
            arr.splice(index, elementsToRemove);
            return arr;
        }

        grabCustomFiles( param, isBack ){
            let pages = [];
            if( isBack ){
                if( param ){
                    this.state.customPages.map( ( page, index ) => {
                        if( page.path === param.path ){
                            pages = this.removePageTillIndex(param, index);
                        }
                    })
                } else {
                    /* GRAB LAST PAGE AND THEN MAKE IT BACK */
                    const index = this.state.customPages.length - 1;
                    const page = this.state.customPages[ index ];
                    pages = this.removePageTillIndex(page, index);
                    param = page;
                }
            } else {
                const arr = [...this.state.customPages];
                if( arr.length === 0 ){
                    const splits = param.path.split("/");
                    const name = splits[ splits.length - 1];
                    this.currentPage = `${TERM_FOR_ROOT_FOLDER}-${name}`;
                    arr.push({
                        path: this.data[type].root,
                        title: TERM_FOR_ROOT_FOLDER
                    })
                } else {
                    const splits = param.path.split("/");
                    const name = splits[ splits.length - 2];
                    const nextName = splits[ splits.length - 1];
                    this.currentPage= `${this.currentPage}-${name}-${nextName}`;

                    arr.push({
                        path: this.data[type].root,
                        title: name
                    });
                }
                pages = arr;
            }

            this.needCustomBackForTimes = pages.length;
            MessageBus.trigger(SELECTION_SCREEN_WAIT_BACK_PRESSED, this.needCustomBackForTimes);
            
            this.setState({ isLoading: true, customPages: pages }, () => {
                FileGrabber.customFilesOfType(type, param.path, (obj) => {
                    this.data[type] = obj;
                    this.extraData = {
                        extraData : shortID(8)
                    }
                    this.setState({ items : obj.withOrder, isLoading: false});
                });
            })
        }

        isItemSelected( id ) {
            const key = customSelection ? `${this.currentPage}-${id}` : id;
            const items = this.data.selectedItems;

            if( items[key] ){
                return true;
            }
            return false;
        }

        onCustomSelection({ path, isBack }) {
            this.grabCustomFiles(path, isBack);
        }

        onItemSelect({ id, isSelected }) {
            const key = customSelection ? `${this.currentPage}-${id}` : id;

            if( isSelected ){
                this.data.selectedItems[ key ] = isSelected;
                MessageBus.trigger( ON_ADD_FILES_TO_SEND, this.state.items[ id ] );
            } else {
                delete this.data.selectedItems[ key ];
                MessageBus.trigger( ON_REMOVE_FILES_TO_SEND, this.state.items[ id ] );
            }
            
            const count = Object.keys( this.data.selectedItems ).length;
            MessageBus.trigger(`${NOTIFY_SCREEN_PANEL_EVENT_ON_ITEM_SELECT}-${screenId}`, {
                count,
            });
        }

        thumbnailExecutor( id, callback ) {
            const haveItem = this.data.thumbnails[ id ];
            if( haveItem ) {
                return callback( haveItem );
            } else {
                FileGrabber.getThumbnailForType( type, id, (thumbnail) => {
                    this.data.thumbnails[ id ] = thumbnail;
                    return callback( thumbnail );
                })
            }
        }

        render() {
            return(
                <View style={{ backgroundColor:Colors.themeWhite, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                <Component
                    {...config}
                    isLoading ={this.state.isLoading}
                    items={this.state.items}
                    customPages={this.state.customPages}
                    isItemSelected = {this.isItemSelected}
                    thumbnailExecutor={this.thumbnailExecutor}
                    onCustomSelection={this.onCustomSelection}
                    messageBusEvent={`${LOCAL_STORAGE_FETCHER_EVENT_ON_ITEM_SELECT}-${type}`}
                    customSelectionMessageBusEvent={`${LOCAL_STORAGE_FETCHER_EVENT_ON_ITEM_SELECT}-custom-selection-${type}`}
                    extraData={this.extraData}
                />
                </View>
            )
        }

        componentWillUnmount() {
            this.isComponentMounted = false;
            MessageBus.off( `${LOCAL_STORAGE_FETCHER_EVENT_ON_ITEM_SELECT}-${type}`, this.onItemSelect);
            MessageBus.off( `${LOCAL_STORAGE_FETCHER_EVENT_ON_ITEM_SELECT}-custom-selection-${type}`, this.onCustomSelection);
            MessageBus.off(NOTIFY_CLEAR_SELECTION, this.onNotifyClear);
            MessageBus.off(SELECTION_SCREEN_WAIT_BACK_PRESSED_BACKED, this.onCustomSelectionBack);
            this.props.navigation.removeListener('focus', this._onFocus);
            this.props.navigation.removeListener('blur', this._onBlur);
        }
    }
}