import React from 'react';
import * as ScreenNames from 'Constants/screenNames';
import { SplashScreen } from 'Screens/SplashScreen';
import { HomeScreen } from 'App/Screens/HomeScreen';
import { OverlayScreen } from 'Screens/OverlayScreen';
import { SetupScreen } from 'Screens/SetupScreen';
import { ReceiveScreen } from 'Screens/ReceiveScreen';
import { QrCodeScannerScreen } from 'Screens/QrCodeScannerScreen';
import { SendScreen } from 'Screens/SendScreen';
import { SendPcScreen } from 'Screens/SendPcScreen';
import { ProgressScreen } from 'Screens/ProgressScreen';
import { FilesScreen } from 'Screens/FilesScreen';
import { HistoryScreen } from 'Screens/HistoryScreen';
import { SecurityScreen } from 'Screens/SecurityScreen';
import { ThanksScreen } from 'Screens/ThanksScreen';
import { AboutScreen } from 'Screens/AboutScreen';
import { UpcomingScreen } from 'Screens/UpcomingScreen';
import { FileListScreen } from 'Screens/FileListScreen';
import { withHeaderHoc } from 'HOCs/withHeaderHoc';
import { Popup } from 'Components/Popup';
import NavigationService from 'Services/NavigationService';
import { NavigationContainer,  } from '@react-navigation/native/src';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SelectionScreenWithTabBar } from 'Containers/SelectionScreenWithTabBar';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer ref={ ref => NavigationService.setTopLevelNavigator(ref) }>
      <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,  }} initialRouteName={ScreenNames.SCREEN_SPLASH} headerMode={'none'}>
        
        <Stack.Screen name={ScreenNames.SCREEN_SPLASH} component={SplashScreen} />
        <Stack.Screen name={ScreenNames.SCREEN_SETUP} component={SetupScreen} />
        <Stack.Screen name={ScreenNames.SCREEN_HOME} component={HomeScreen} />
        <Stack.Screen name={ScreenNames.SCREEN_SELECTION} component={withHeaderHoc(SelectionScreenWithTabBar)} />
        <Stack.Screen name={ScreenNames.SCREEN_RECEIVE} component={withHeaderHoc(ReceiveScreen)} />
        <Stack.Screen name={ScreenNames.SCREEN_SEND} component={withHeaderHoc(SendScreen)} />
        <Stack.Screen name={ScreenNames.SCREEN_SEND_PC} component={withHeaderHoc(SendPcScreen)} />
        <Stack.Screen name={ScreenNames.SCREEN_QR_CODE_SCANNER} component={withHeaderHoc(QrCodeScannerScreen)} />
        <Stack.Screen name={ScreenNames.SCREEN_PROGRESS} component={withHeaderHoc(ProgressScreen)} />
        <Stack.Screen name={ScreenNames.SCREEN_FILES} component={withHeaderHoc(FilesScreen)} />
        <Stack.Screen name={ScreenNames.SCREEN_FILES_LIST} component={withHeaderHoc(FileListScreen)} />
        <Stack.Screen name={ScreenNames.SCREEN_HISTORY} component={withHeaderHoc(HistoryScreen)} />
        <Stack.Screen name={ScreenNames.SCREEN_SECURITY} component={withHeaderHoc(SecurityScreen)} />
        <Stack.Screen name={ScreenNames.SCREEN_THANKS} component={withHeaderHoc(ThanksScreen)} />
        <Stack.Screen name={ScreenNames.SCREEN_ABOUT} component={withHeaderHoc(AboutScreen)} />
        <Stack.Screen name={ScreenNames.SCREEN_UPCOMING} component={withHeaderHoc(UpcomingScreen)} />

        {/* TOP LEVEL COMPONENTS WHICH CAN BE RENDERED ON TOP OF OTHER COMPONENTS */}
        <Stack.Screen options={{ animationEnabled: false }} name={ScreenNames.OVERLAY_SCREEN} component={ OverlayScreen } />
        <Stack.Screen options={{ animationEnabled: false, cardStyle:{ backgroundColor: 'transparent'} }} name={ScreenNames.POPUP_SCREEN} component={ Popup } />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;