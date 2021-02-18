import { Service } from 'Services/Service';
import { URLs } from 'Constants/URLs';

const submitConfig = ( config ) => {
    const _config = {
        path : URLs.CONFIG.submitConfig,
        params: {
            config
        }
    };
    return Service.get( _config );
};

export const ConfigService = {
    submitConfig,
}