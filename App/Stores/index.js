import { combineReducers } from 'redux';
import configureStore from './CreateStore';
import rootSaga from 'App/Sagas';
import { reducer as LocationReducer } from './Location/Reducers';
import { reducer as StartupReducers } from './Startup/Reducers';

export default () => {
	const rootReducer = combineReducers({
		config: StartupReducers,
		location: LocationReducer,
	})
	
  	return configureStore(rootReducer, rootSaga);
}
