import React from 'react';
import { Image } from 'react-native';
import NavigationService from 'Services/NavigationService';
import { MessageBus } from 'App/Services/MessageBus';
import { POPUP_SCREEN } from 'App/Constants/screenNames';
import { SelectionItemTypeBoxView } from 'Views/SelectionItemTypeBoxView';

export class SelectionItemTypeBox extends React.PureComponent{
    constructor( props ){
        super( props );
        this.data = {};
        this.state = {
            selected: this.props.selected || false,
            isLoaded: false,
            thumbnail : null
        }
        this.bind();
    }

    bind() {
        this.onItemLongPress = this.onItemLongPress.bind(this);
        this.viewFullView = this.viewFullView.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.drawCustomOverlay = this.drawCustomOverlay.bind(this);
    }

    componentDidMount() {
        const { item, thumbnailExecutor } = this.props;
        thumbnailExecutor(item.id, (thumbnail) => {
            this.setState({ thumbnail, isLoaded: true });
        });
    }

    drawCustomOverlay() {
        return this.props.drawCustomOverlay && this.props.drawCustomOverlay( this.props.item );
    }

    onItemLongPress( event ) {
        event.stopPropagation();
        this.data.isLongPressing = true;
        this.viewFullView();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if( nextProps.selected !== this.state.selected ){
            this.setState({ selected: nextProps.item.selected});
        }
    }

    viewFullView() {
        const popupConfig = {
            transparent: true,
            showCloseButton: true,
            component:
                <Image
                    resizeMode={'contain'}
                    source={{ uri: `file://${ this.props.item.path || this.state.thumbnail }`}}
                    style={{ height: '95%', width: '100%', borderRadius: 10 }}
                />
        }
        NavigationService.navigate( POPUP_SCREEN, popupConfig );
    }

    onItemSelect() {
        MessageBus.trigger(this.props.messageBusEvent, {
            id: this.props.itemId,
            isSelected: !this.state.selected
        });
        this.setState({ selected : !this.state.selected });
    }

    render() {
        return(
            <SelectionItemTypeBoxView
                {...this.props}
                {...this.state}
                onItemSelect={this.onItemSelect}
                onItemLongPress={this.onItemLongPress}
                drawCustomOverlay={this.drawCustomOverlay}
            />
        );
    }
}