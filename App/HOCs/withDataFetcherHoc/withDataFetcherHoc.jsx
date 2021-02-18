import React from 'react';
import { REQUEST_TYPE_POST } from 'Constants/contants';
import { Service } from 'Services/Service';
import { shortID } from 'Utils/utils';

export const withDataFetcherHoc = ( Component, { path, params = {}, method = REQUEST_TYPE_POST, service, autoInitiate = true } ) => {
    class WithDataFetcherHoc extends React.Component {
        constructor( props ) {
            super( props );
            this.state = {
                isLoading: true,
                errorOccured: false,
                componentData: null,
            };
            this._bind();
        }

        _bind(){
            console.log( 'WithDataFetcherHoc._bind()' );
            this.fetchData = this.fetchData.bind( this );
            this.onSuccess = this.onSuccess.bind( this );
            this.onFailure = this.onFailure.bind( this );
        }

        fetchData( _config = {} ) {
            console.log( 'WithDataFetcherHoc.fetchData()' );
            this.setState( { isLoading: true}, async () => {
                this.cancelId = shortID();
                const config =  {
                    id : this.cancelId,
                    path : _config.path || path,
                    params : _config.params || params
                };

                try{
                    let response;
                    if( method === REQUEST_TYPE_POST ) {
                        response = await Service.post( config );
                        console.log( response );
                    } else {
                        response = await Service.get( config );
                    }
                    this.onSuccess( response );
                } catch(e){
                    this.onFailure( e );
                }
                
            } );
        }

        onSuccess( response ) {
            console.log( 'WithDataFetcherHoc.onSuccess()' );
            const _data = service ? service( response ) : response.body;
            this.setState( { componentData: _data, errorOccured: false, isLoading: false} );
        }

        onFailure() {
            console.log( 'WithDataFetcherHoc.onFailure()' );
            this.setState( { errorOccured: true, isLoading: false } );
        }

        componentDidMount() {
            console.log( 'WithDataFetcherHoc.componentDidMount()' );
            autoInitiate && this.fetchData();
        }

        render() {
            console.log( 'WithDataFetcherHoc.render()' );
            return (
                <Component
                    { ...this.props }
                    { ... this.state }
                    fetchData = { this.fetchData }
                />
            );
        }

        componentWillUnmount() {
            if( this.cancelId ){
                Service.cancel( this.cancelId );
            }
        }
    }

    WithDataFetcherHoc.defaultProps = {

    };

    WithDataFetcherHoc.propTypes = {

    };
    
    return WithDataFetcherHoc;
};