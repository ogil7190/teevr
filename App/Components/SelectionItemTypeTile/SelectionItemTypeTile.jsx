import React from 'react';
import { MessageBus } from 'App/Services/MessageBus';
import { SelectionItemTypeTileView } from 'Views/SelectionItemTypeTileView';

export class SelectionItemTypeTile extends React.PureComponent{
    constructor( props ){
        super( props );
        this.data = {};
        this.state = {
            selected: false,
            isLoaded: false,
            thumbnail : null
        }
        this.bind();
    }

    bind() {
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
        return this.props.drawCustomOverlay && this.props.drawCustomOverlay(); 
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if( nextProps.item.selected !== this.state.selected ){
            this.setState({ selected: nextProps.item.selected});
        }
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
            <SelectionItemTypeTileView
                {...this.props}
                {...this.state}
                drawCustomOverlay={this.drawCustomOverlay}
                onItemSelect = {this.onItemSelect}
            />
        )
    }
}