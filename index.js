import { AppRegistry } from 'react-native'
import App from './App/App'
import { name as appName } from './app.json'
import codePush from "react-native-code-push";

const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };
const AppWithDynamicUpdates = codePush(codePushOptions)(App);

AppRegistry.registerComponent(appName, () => AppWithDynamicUpdates)
