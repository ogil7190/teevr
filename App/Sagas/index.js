import { takeLatest, all } from 'redux-saga/effects'
import { LocationTypes } from 'Stores/Location/Actions'
import { StartupTypes } from 'Stores/Startup/Actions'
import { fetchUser } from './ExampleSaga'
import { startup, firstStart } from './StartupSaga'

export default function* root() {
  yield all([
    /**
     * @see https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
     */
    // Run the startup saga when the application starts
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest( StartupTypes.FIRST_START, firstStart),
    // Call `fetchUser()` when a `FETCH_USER` action is triggered
    // takeLatest(ExampleTypes.FETCH_USER, fetchUser),
  ])
}
