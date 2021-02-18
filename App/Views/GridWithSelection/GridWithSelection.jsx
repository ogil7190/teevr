import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { WithLoading } from 'Views/WithLoading';
import { SelectionItemTypeTile } from 'Components/SelectionItemTypeTile';
import { EmptyListView } from '../EmptyListView';

export const GridWithSelection = ( props ) => {
    const { type, items, isItemSelected, thumbnailExecutor, messageBusEvent, isLoading } = props;

    const renderListItem = ({ item, index }) => {
        return(
            <SelectionItemTypeTile
                selected={isItemSelected( index )}
                item={item}
                itemId={index}
                messageBusEvent={messageBusEvent}
                thumbnailExecutor={thumbnailExecutor}
            />
        )
    }
    
    return (
        <WithLoading size={'large'} loading={ isLoading }>
            <FlatList
                style={{ width: '100%'}}
                contentContainerStyle={{flexGrow: 1}}
				showsVerticalScrollIndicator={false}
                initialNumToRender={30}
                windowSize={21}
                numColumns={4}
                ListEmptyComponent={EmptyListView}
                updateCellsBatchingPeriod={ 30 * 1000 }
                removeClippedSubviews={true}
				keyExtractor={( item, index ) => `${type}-${item.id || index }`}
				data={items || []}
				renderItem={renderListItem}
            />
        </WithLoading>
    )
}