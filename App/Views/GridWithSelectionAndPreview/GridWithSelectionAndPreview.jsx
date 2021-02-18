import React from 'react';
import { View, FlatList } from 'react-native';
import { WithLoading } from 'Views/WithLoading';
import { MessageBus } from 'App/Services/MessageBus';
import { POPUP_EVENTS } from 'Constants/MessageBusEvents';
import { ICON_VIDEOS } from 'Constants/iconNames';
import { Icon } from 'Components/Icon';
import { SelectionItemTypeBox } from 'Components/SelectionItemTypeBox';
import { Colors, ColorHelpers } from 'App/Theme/Colors';
import { EmptyListView } from '../EmptyListView';

export const GridWithSelectionAndPreview = ( props ) => {
    const refs = {};
    const { type, items, isItemSelected, thumbnailExecutor, messageBusEvent, isLoading } = props;

    const drawCustomOverlay = ( item ) => {
        switch( type ){
            case 'video':
                return (
                    <View style={{ flexDirection: 'row', padding: 5}}>
                        <Icon name={ICON_VIDEOS} fill={ColorHelpers.applyAlpha(Colors.themeWhite, 0.9)} width={16} height={16} />
                    </View>
                )
        }
        return null;
    }
    
    const renderListItem = ( { item, index }) => {
        return(
            <SelectionItemTypeBox
                selected={isItemSelected(index)}
                item={item}
                itemId={ index }
                messageBusEvent={messageBusEvent}
                thumbnailExecutor={thumbnailExecutor}
                drawCustomOverlay={drawCustomOverlay}
            />
        )
    }
    
    return (
        <WithLoading size={'large'} loading={ isLoading }>
            <View 
                style={{ width: '100%', height: '100%'}}
                onTouchEnd={() => {
                    MessageBus.trigger(POPUP_EVENTS.CLOSE_POPUP)
                }}
            >
            <FlatList
                style={{ width: '100%'}}
				numColumns={3}
				showsVerticalScrollIndicator={false}
                initialNumToRender={30}
                windowSize={21}
                ListEmptyComponent={EmptyListView}
                updateCellsBatchingPeriod={ 30 * 1000 }
                ref={(ref) => refs.list = ref }
                removeClippedSubviews={true}
				keyExtractor={( item, index ) => `${type}-${item.id || index }`}
                data={items || []}
                contentContainerStyle={{flexGrow: 1}}
				renderItem={renderListItem}
            />
            </View>
        </WithLoading>
    )
}