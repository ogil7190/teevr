import axios from 'axios';
import axiosCancel from 'axios-cancel';

axiosCancel( axios );

export const Http = {};

// HTTP execute method
// use this execute method to execute the axios request
Http.execute = ( config ) => {
    console.log( 'Http.execute' );
    return axios( config );
};

// HTTP get method
// use this get method to execute the get request
Http.get = ( url ) => {
    return axios.get( url );
};

// HTTP post method
// use this get method to execute the post request
Http.post = ( url, data ) => {
    return axios.post( url, data );
};

// HTTP put method
// use this get method to execute the post request
Http.put = ( url, data ) => {
    return axios.put( url, data );
};

// HTTP delete method
// use this get method to execute the delete request
Http.delete = ( url ) => {
    return axios.delete( url );
};

// HTTP Cancel method
// use Http.cancel method to cancel request with the id;
Http.cancel = ( id ) => {
    return axios.cancel( id );
};

// HTTP CancelAll method
// Use Http.cancelAll to cancel all the ongoing requests
Http.cancelAll = () => {
    return axios.cancelAll();
};

