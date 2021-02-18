import React from 'react';
import { Panel } from 'Views/Panel';
import { MessageBus } from 'App/Services/MessageBus';
import { NOTIFY_SCREEN_PANEL_EVENT_ON_ITEM_SELECT, HEADER_EVENTS, SELECTION_SCREEN_TOGGLE_CUSTOM_SECTION, NOTIFY_CLEAR_SELECTION, SELECTION_SCREEN_CHANGE_TITLE } from 'Constants/MessageBusEvents';

export class SelectionTabBar extends React.Component{
    constructor(props) {
        super(props)
        this.data = {
            itemIds: [],
            routes: [],
            totalCount: 0
        };
        this.state = {
            activeIndex: this.props.selectedIndex || 0,
            counts: {}
        };
        this.bind();
    }

    bind() {
        this.onAction = this.onAction.bind( this );
        this.handleOnNotify = this.handleOnNotify.bind( this );
        this.handleNotifyClear = this.handleNotifyClear.bind( this );
    }

    componentDidMount() {
        const route = this.props.state.routes[ this.props.selectedIndex || 0 ];
        const { title } = this.props.descriptors[route.key].options || {};
        MessageBus.trigger(SELECTION_SCREEN_CHANGE_TITLE, title);
        
        const { state } = this.props;
        state.routes.map((route) => {
            const label = route.name;
            MessageBus.on(`${NOTIFY_SCREEN_PANEL_EVENT_ON_ITEM_SELECT}-${label}`, ( data ) => this.handleOnNotify( label, data ) );
        });
        MessageBus.on( NOTIFY_CLEAR_SELECTION, this.handleNotifyClear );
    }

    handleNotifyClear() {
        this.data.totalCount = 0;
        this.setState({ counts: {} });
        MessageBus.trigger( SELECTION_SCREEN_TOGGLE_CUSTOM_SECTION, false );
        MessageBus.trigger( HEADER_EVENTS.TOGGLE_HEADER, false);
    }

    handleOnNotify( type, { count }) {
        this.data.timer && clearTimeout( this.data.timer );

        const newTotalCount = this.data.totalCount - ( this.state.counts[type] || 0 ) + count;

        if(newTotalCount > 0 && this.data.totalCount === 0){
            MessageBus.trigger( HEADER_EVENTS.TOGGLE_HEADER, true);
            MessageBus.trigger( SELECTION_SCREEN_TOGGLE_CUSTOM_SECTION, true );
        }

        else if(newTotalCount === 0 && this.data.totalCount > 0){
            MessageBus.trigger( HEADER_EVENTS.TOGGLE_HEADER, false);
            MessageBus.trigger( SELECTION_SCREEN_TOGGLE_CUSTOM_SECTION, false );
        }

        this.data.totalCount = newTotalCount;
        this.setState({counts: {
            ...this.state.counts,
            [type]: count
        }});
    }

    onAction( index ) {
        this.setState({ activeIndex: index });

        const event = this.props.navigation.emit({
            type: 'tabPress',
            target: this.data.routes[index].key,
            canPreventDefault: true,
        });

        if ( this.data.currentRoute !==index && !event.defaultPrevented) {
            this.props.navigation.navigate( this.data.routes[index].name );

            /*** CHANGE TITLE ***/
            const route = this.props.state.routes[ index ];
            const { title } = this.props.descriptors[route.key].options || {};
            
            MessageBus.trigger(SELECTION_SCREEN_CHANGE_TITLE, title);
        }
    }

    render() {
        const { state } = this.props;
        
        this.data.itemIds = [];
        this.data.routes = [];

        state.routes.map((route) => {
            const label = route.name;
            this.data.itemIds.push( label );
            this.data.routes.push( route );
            this.data.currentRoute = state.index;
        });
      
        return (
            <Panel
                items={state.routes}
                itemIds={ this.data.itemIds }
                activeIndex={this.state.activeIndex}
                counts = {this.state.counts}
                onAction={this.onAction}
            />
        )
    }

    componentWillUnmount() {
        const { state } = this.props;
        state.routes.map((route) => {
            const label = route.name;
            MessageBus.off(`${NOTIFY_SCREEN_PANEL_EVENT_ON_ITEM_SELECT}-${label}`, ( data ) => this.handleOnNotify( label, data ) );
        });
        MessageBus.off( NOTIFY_CLEAR_SELECTION, this.handleNotifyClear );
    }
}