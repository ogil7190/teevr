import React from 'react';
import { MessageBus } from 'App/Services/MessageBus';
import { SelectionListItemView } from 'Views/SelectionListItemView';

export class SelectionListItem extends React.PureComponent{
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
    }

    componentDidMount() {
        const { item, thumbnailExecutor } = this.props;
        thumbnailExecutor(item.id, (thumbnail) => {
            this.setState({ thumbnail, isLoaded: true ,selected: this.props.selected });
        });
    }

    drawCustomOverlay() {
        return this.props.drawCustomOverlay && this.props.drawCustomOverlay(); 
    }

    onItemSelect() {
        if( this.props.customSelection && this.props.item.isDirectory ) {
            MessageBus.trigger(this.props.customSelectionMessageBusEvent, {
                path: { path: this.props.item.path },
            });
        } else {
            MessageBus.trigger(this.props.messageBusEvent, {
                id: this.props.itemId,
                isSelected: !this.state.selected
            });
            this.setState({ selected : !this.state.selected });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if( nextProps.item.selected !== this.state.selected ){
            this.setState({ selected: nextProps.item.selected});
        }
    }

    getTitleFromPath( path ) {
        const splits = path.split("/");
        return splits[ splits.length - 1 ] || '';
    }

    render() {
        return(
            <SelectionListItemView
                {...this.props}
                {...this.state}
                onItemSelect={this.onItemSelect}
                getTitleFromPath={this.getTitleFromPath}
            />
        )
    }
}