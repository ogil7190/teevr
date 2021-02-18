import { Http } from 'Services/Http';
import { get } from 'lodash';
import { URLs } from 'Constants/URLs';
import { REQUEST_TYPE_POST, REQUEST_TYPE_GET, REQUEST_TYPE_DELETE, REQUEST_TYPE_PUT } from 'Constants/contants'
import { shortID } from 'Utils/utils';

class _Service {
    successResponseFormatter( httpResponse ) {
        return {
            body: httpResponse.data,
            status: httpResponse.status,
            headers: httpResponse.headers,
            timestamp: Date.now()
        };
    }

    errorResponseFormatter( httpError ) {
        const res = {
            type: get( httpError, 'status' ) ? 'HTTP_ERROR' : 'NETWORK_ERROR',
            error: get( httpError, 'data', httpError.message ),
            status: get( httpError, 'status', 0 ),
            headers: get( httpError, 'headers', {} ),
            timestamp: Date.now()
        };
        return res;
    }

    makeRequestConfig( method, config ) {
        const requestConfig = {
            requestId: config.id || shortID(),
            url: `${URLs.HOST}${config.path}`,
            method: method || REQUEST_TYPE_GET,
            timeout: 2 * 60 * 1000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...config.headers
            }
        };
        return requestConfig;
    }

    execute( config ) {
        return Http.execute( config ).then( ( response ) => {
            return this.successResponseFormatter( response );
        } ).catch( ( response ) => {
            return this.errorResponseFormatter( response );
        } );
    }


    get( config ) {
        const newConfig = this.makeRequestConfig( REQUEST_TYPE_GET, config );
        return this.execute( newConfig );
    }

    post( config ) {
        const newConfig = this.makeRequestConfig( REQUEST_TYPE_POST, config );
        return this.execute( newConfig );
    }
    put( config ) {
        const newConfig = this.makeRequestConfig( REQUEST_TYPE_PUT, config );
        return this.execute( newConfig );
    }
    
    delete( config ) {
        const newConfig = this.makeRequestConfig( REQUEST_TYPE_DELETE, config );
        return this.execute( newConfig );
    }

    cancel( id ) {
        return Http.cancel( id );
    }

    cancelAll() {
        return Http.cancelAll();
    }
}

export const Service = new _Service();
