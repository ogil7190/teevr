import { Service } from 'Services/Service';
import { shortID } from 'Utils/utils';

export const genericPost = ( { path, params = {}, headers={}} ) => {
    const _id = shortID();
    const config = {
        id : _id,
        path,
        params,
        headers
    };

    return {
        execute: async () => {
            return await Service.post( config );
        },
        cancel: () => {
            Service.cancel( _id )
        }
    }
}