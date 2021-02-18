import AsyncStorage from '@react-native-community/async-storage';
import { cloneDeep } from 'lodash';

const store = {};

export const loadDataInMemory = async ( keys ) => {
    const data = await AsyncStorage.multiGet( keys );
    const response = [];
    data.map( (dataArray) => {
        const _value = JSON.parse(dataArray[1]);
        store[ dataArray[0] ] = _value;
        response.push(_value);
    });
    return response;
}

export const get = ( key ) =>{
    return cloneDeep( store[key] );
}

export const set = ( key, value ) =>{
    store[key] = cloneDeep( value );
}

export const persist = async () => {
    const keys = Object.keys( store );
    const items = [];
    keys.map((key) => {
        if( store[key] ){
            const value = JSON.stringify(store[key]);
            const item = [ key, value ];
            items.push( item );
        }
    })
    await AsyncStorage.multiSet( items );
}

export const Keys = {
    SESSION_DATA_DETAILS : "SESSION_DATA_DETAILS",
    SESSION_HISTORY: 'SESSION_HISTORY',
    SESSION_FILE_HISTORY_ON: 'FILE_HISTORY-'
}