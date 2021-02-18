import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { StartupTypes } from './Actions'

export const setConfig = (state, { config } ) => {
    return ({
        ...state,
        ...config
    })
}

export const reducer = createReducer(INITIAL_STATE, {
    [StartupTypes.SET_CONFIG]: setConfig
})
