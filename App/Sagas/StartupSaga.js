import { put, call } from 'redux-saga/effects'
import StartupActions from 'Stores/Startup/Actions';
import { ConfigService } from 'Services/ConfigService';
import { getDeviceConfig } from 'Utils/getDeviceConfig';

export function* startup() {
  // NavigationService.navigateAndReset( ScreenNames.SCREEN_HOME );
}

export function* firstStart() {
  const config = yield getDeviceConfig();
  const response = yield call( ConfigService.submitConfig, config );
  if( response ){
    yield put( StartupActions.setConfig( response.body ) );
  }
  yield call( startup );
}
