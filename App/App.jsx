import React, { Component } from 'react';
import Provider from 'react-redux/lib/components/Provider';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { RootScreen } from 'Screens/RootScreen';
import createStore from 'App/Stores';

const { store, persistor } = createStore();

export default class App extends Component {
  constructor( props ){
    super( props );
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootScreen />
        </PersistGate>
      </Provider>
    );
  }
}
