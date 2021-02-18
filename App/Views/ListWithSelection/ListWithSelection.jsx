import React from 'react';
import { View, FlatList, Text, TouchableOpacity, ScrollView } from 'react-native';
import { WithLoading } from 'Views/WithLoading';
import { ICON_AUDIOS, ICON_FOLDER, ICON_DOCS } from 'Constants/iconNames';
import { Icon } from 'Components/Icon';
import { SelectionListItem } from 'Components/SelectionListItem';
import { ColorHelpers, Colors } from 'App/Theme/Colors';
import { EmptyListView } from '../EmptyListView';

export const ListWithSelection = ( props ) => {
    const refs = {};
    const { type, items, isItemSelected, customPages,onCustomSelection, thumbnailExecutor, messageBusEvent, isLoading, customSelection, extraData, customSelectionMessageBusEvent } = props;
    
    const renderCustomIcon = ( isDirectory ) => {
        switch(type){
            case 'audio': {
                return(
                <View style={{ backgroundColor: ColorHelpers.applyAlpha( Colors.primary, 0.2), marginLeft: 10, padding: 10, marginRight: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name={ICON_AUDIOS} width={28} height={28} fill={ColorHelpers.applyAlpha( Colors.primary, 0.7)} />
                </View>
                );
            }
            case 'file': {
                return(
                isDirectory
                ?
                <View style={{ backgroundColor: ColorHelpers.applyAlpha( Colors.primary, 0.2), marginLeft: 10, padding: 12, marginRight: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name={ICON_FOLDER} width={24} height={24} stroke={ColorHelpers.applyAlpha( Colors.primary, 0.7)} />
                </View>
                :
                <View style={{ backgroundColor: ColorHelpers.applyAlpha( Colors.primary, 0.2), marginLeft: 10, padding: 10, marginRight: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name={ICON_DOCS} width={28} height={28} fill={ColorHelpers.applyAlpha( Colors.primary, 0.7)} />
                </View>
                );
            }
        }
    }
    
    const renderListItem = ( { item, index }) => {
        return(
            <SelectionListItem
                selected={isItemSelected( index )}
                item={item}
                itemId={index}
                customSelection={customSelection}
                isOdd={index % 2 !== 0}
                messageBusEvent={messageBusEvent}
                customSelectionMessageBusEvent={customSelectionMessageBusEvent}
                thumbnailExecutor={thumbnailExecutor}
                renderCustomIcon={renderCustomIcon}
            />
        )
    }

    const goBackCustom = (page) => {
        onCustomSelection({ path: page, isBack: true });
    }
    
    return (
        <WithLoading size={'large'} loading={ isLoading }>
            {
                customSelection && customPages.length > 0 &&
                <ScrollView horizontal={true} style={{ flexGrow: 0, width: '100%'}} showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', paddingLeft: 5, paddingRight: 5}}>
                        {   
                            customPages.map( (page, index) => {
                                return (
                                    <TouchableOpacity key={`back-${index}`} onPress={ () => goBackCustom(page)} activeOpacity={0.5} style={{ padding: 8, paddingLeft: 10, paddingRight:10, margin: 5, backgroundColor: ColorHelpers.applyAlpha( Colors.primary, 0.2), borderRadius: 5, }}>
                                        <Text style={{ fontSize: 14, color: Colors.primary}}>
                                            { page.title }
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            }
            <FlatList
                style={{ width: '100%'}}
				showsVerticalScrollIndicator={false}
                initialNumToRender={60}
                windowSize={21}
                contentContainerStyle={{flexGrow: 1}}
                ListEmptyComponent={EmptyListView}
                updateCellsBatchingPeriod={ 30 * 1000 }
                ref={(ref) => refs.list = ref }
                removeClippedSubviews={true}
				keyExtractor={( item, index ) => `${type}-${item.id || index }`}
                data={items || []}
                renderItem={renderListItem}
                {...extraData}
            />
        </WithLoading>
    )
}