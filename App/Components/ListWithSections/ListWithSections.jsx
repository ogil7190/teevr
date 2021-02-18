import React from 'react';
import { FlatList } from 'react-native';

const SECTION = 'section';
const ITEM = 'item';

export class ListWithSections extends React.Component{
    constructor( props ) {
		super( props );
		const _state = this.compose( props );
        this.state = {
			..._state
        };
        this._bind();
    }

    _bind() {
		console.log( 'ListWithSections._bind()');
		this.scrollToIndex = this.scrollToIndex.bind( this );
		this.scrollToSectionIndex = this.scrollToSectionIndex.bind( this );
	}
	
	componentDidMount() {
		console.log( 'ListWithSections.componentDidMount()' );
		if( !this.componentMounted ) {
			this.props.goToSectionCaller && this.props.goToSectionCaller();
			this.componentMounted = true;
		}
	}

    compose( props ) {
		console.log( 'ListWithSections.compose()' );
		if( props.sections.length === 0) return { items : [] };
		const items = props.items || {};
		const _items = [];
        props.sections.forEach( (section, index) => {
			const _sectionItems = items[ section.id ];
			if( _sectionItems ) {
				_items.push( {
					itemType: SECTION,
					index,
					...section,
				} );
				_items.push( ..._sectionItems );
			}
        });
        return { items : _items };
    }
	
	scrollToSectionIndex = ( targetSectionIndex ) => {
		this.itemsBefore = 0;
		this.props.sections.every( ( section, index ) => {
			if( index === targetSectionIndex ){
				return false;
			} else {
				const _sectionItems = this.props.items[ section.id ];
				if( _sectionItems ) {
					this.itemsBefore = this.itemsBefore + _sectionItems.length + 1;
					return true;
				}
			}
		});
		const actualIndex = this.itemsBefore;
		if( actualIndex < this.state.items.length ) this.scrollToIndex(actualIndex);
	}

	scrollToIndex( index ) {
		this.list.scrollToIndex({animated: true, index });
	}

    render() {
		console.log( 'ListWithSections.render()');
		const SectionView = this.props.sectionView;
		const ItemView = this.props.itemView;
		
        return(
            <FlatList
				showsVerticalScrollIndicator = { false }
				onScrollToIndexFailed={()=>{}}
				initialNumToRender={this.state.items.length}
				ref={(ref) => { this.list = ref; }}
				nestedScrollEnabled={ true }
                keyExtractor={ ( item, index ) => item.itemType === SECTION ? `${SECTION}-${index}` : `${ITEM}-${index}` }
                data = { this.state.items }
                renderItem={({ item, index}) => {
					if( item.itemType === SECTION ){
						return <SectionView item = { item } index={ index } />
					}
					return <ItemView item = { item } index={ index } />
				}}
				extraData = { this.state.items }
            />
        )
	}

	componentWillUnmount() {
		this.componentMounted = false;
	}
}