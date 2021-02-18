import React from 'react';
import { APP_NAME, VERSION } from 'Constants/contants';
import { Colors, ColorHelpers } from 'Theme/Colors';
import { Icon } from 'App/Components/Icon';
import { View, TouchableOpacity, Text, StatusBar, ScrollView, Animated } from 'react-native';
import { ICON_SEND, ICON_FOLDER, ICON_PEOPLE, ICON_LOGO, ICON_SETTINGS, ICON_PRIVACY, ICON_ARROW, ICON_BOX, ICON_DROP_DOWN_ARROW, ICON_SMILE, ICON_CIRCLE } from 'Constants/iconNames';
import { avatars } from 'Models/avatars';
import { Neomorph, NeomorphFlex } from 'react-native-neomorph-shadows';
import { Fonts, normalizeWidth, normalizeHeight, calc } from 'App/Theme/Fonts';
import { get, Keys } from 'Utils/localDataManager';
import { NeomorphRing } from 'Views/ProgressScreenView';
import * as Animatable from 'react-native-animatable';

const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}

export const HomeScreenView = ( props ) => {
    const {gotoSelectionScreen, gotoReceiveScreen, gotoFilesScreen, gotoHistoryScreen,gotoUpcomingScreen, gotoAboutScreen, sideMenuVisibile, toggleSideMenu, gotoSetupScreen, gotoSecurityScreen, gotoThanksScreen } = props;
    const TagLine = 'Share Unlimited & Discover more.';
    const { selectedAvatar, deviceName, brand } =  get( Keys.SESSION_DATA_DETAILS );
    const selectedAvatarIcon = avatars[ selectedAvatar || 0 ];

    return (
        <View
            style={{
                backgroundColor : Colors.themeWhite,
                flex: 1,
                position: 'relative',
                flexDirection: 'column'
            }}
        >
            <StatusBar barStyle={"dark-content"} backgroundColor={Colors.themeWhite}/>

            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingBottom: 10, paddingLeft: 10, paddingRight: 20, paddingTop: 10, alignItems: 'center'}}>
                <NeomorphRing hideInternal = {true} outerSize={55} style={{ shadowRadius: 1}}>
                    <TouchableOpacity onPress={() => toggleSideMenu(!sideMenuVisibile)}>
                        <Icon name={selectedAvatarIcon} width={45} height={45} fill={Colors.primary} />
                    </TouchableOpacity>
                </NeomorphRing>
            </View>
          
            <View
                style={{
                    flex : 7,
                    backgroundColor: Colors.themeWhite,
                    alignItems: 'center'
                }}
            >
                <Icon fill={Colors.primary} name={ICON_LOGO} width={120} height={120} />
                
                <Text style={{ fontSize: Fonts.FONT_SIZE_50, letterSpacing:-2, color: ColorHelpers.applyAlpha( Colors.lightBlack, 0.9 ), fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, marginTop: 10 }}>
                    { APP_NAME }
                </Text>

                <Text style={{ color: Colors.grey, fontSize: Fonts.FONT_SIZE_16, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, marginBottom: 10}}>
                    {TagLine}
                </Text>
            </View>
  
            <View
                style={{
                    flex : 8,
                    backgroundColor: Colors.primary,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    paddingLeft: 20,
                    paddingRight:20,
                    justifyContent: 'center',
                    paddingBottom: normalizeHeight(30),
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: normalizeWidth(30), }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={gotoSelectionScreen}>
                        <>
                            <Neomorph
                                inner
                                style={{
                                    shadowOffset: {width: 0, height: 0},
                                    shadowRadius: 15,
                                    shadowOpacity: 0.06,
                                    padding: normalizeWidth(10),
                                    borderRadius: normalizeWidth( 200 ),
                                    backgroundColor: Colors.primary,
                                    width: normalizeWidth(100),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: normalizeHeight(100),
                                }}
                            >
                                <View style={{ marginTop: 10,}}>
                                    <Icon name={ICON_SEND} width={55} height={55} stroke={Colors.themeWhite} />
                                </View>
                            </Neomorph>

                            <Text style={{ color: Colors.themeWhite, fontSize: Fonts.FONT_SIZE_14, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, textAlign: 'center', marginTop: normalizeWidth(10),}}>
                                {'Send'}
                            </Text>
                        </>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.5} onPress={gotoReceiveScreen}>
                        <>
                            <Neomorph
                                inner
                                style={{
                                    shadowOffset: {width: 0, height: 0},
                                    shadowRadius: 15,
                                    shadowOpacity: 0.06,
                                    padding: normalizeWidth(10),
                                    borderRadius: normalizeWidth( 200 ),
                                    backgroundColor: Colors.primary,
                                    width: normalizeWidth(100),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: normalizeHeight(100),
                                }}
                            >
                                <View style={{ rotation: 180, marginTop: 0, marginLeft: 6}}>
                                    < Icon name={ICON_SEND} width={55} height={55} stroke={Colors.themeWhite} />
                                </View>
                            </Neomorph>
                            
                            <Text style={{ color: Colors.themeWhite, fontSize: Fonts.FONT_SIZE_14, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, textAlign: 'center', marginTop: normalizeWidth(10),}}>
                                {'Receive'}
                            </Text>
                        </>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: normalizeWidth(30), }}>
                    <TouchableOpacity onPress={gotoFilesScreen} activeOpacity={0.5}>
                        <>
                            <Neomorph
                                inner
                                style={{
                                    shadowOffset: {width: 0, height: 0},
                                    shadowRadius: 15,
                                    shadowOpacity: 0.06,
                                    padding:normalizeWidth(10),
                                    borderRadius: normalizeWidth( 200 ),
                                    backgroundColor: Colors.primary,
                                    width: normalizeWidth(100),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: normalizeHeight(100),
                                }}
                            >
                                <View style={{ marginTop: 5}}>
                                    < Icon name={ICON_FOLDER} width={50} height={50} fill={Colors.themeWhite} />
                                </View>
                            </Neomorph>

                            <Text style={{ color: Colors.themeWhite, fontSize: Fonts.FONT_SIZE_14, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, textAlign: 'center', marginTop: normalizeWidth(10),}}>
                                {'Files'}
                            </Text>
                        </>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={gotoHistoryScreen} activeOpacity={0.5}>
                        <>
                            <Neomorph
                                inner
                                style={{
                                    shadowOffset: {width: 0, height: 0},
                                    shadowRadius: 15,
                                    shadowOpacity: 0.06,
                                    padding:normalizeWidth(10),
                                    borderRadius: normalizeWidth( 200 ),
                                    backgroundColor: Colors.primary,
                                    width: normalizeWidth(100),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: normalizeHeight(100),
                                }}
                            >
                                <View style={{ marginTop: 10}}>
                                    < Icon name={ICON_PEOPLE} width={50} height={50} fill={Colors.themeWhite}  />
                                </View>
                            </Neomorph>
                            
                            <Text style={{ color: Colors.themeWhite, fontSize: Fonts.FONT_SIZE_14, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, textAlign: 'center', marginTop: normalizeWidth(10),}}>
                                {'History'}
                            </Text>
                        </>
                    </TouchableOpacity>
                </View>
            </View>
            {
                sideMenuVisibile &&
                <View onTouchEnd={() => toggleSideMenu(false)} duration={100} animation={'bounceInLeft'} style={ [ { position: 'absolute', height: '100%', width: '100%', backgroundColor: ColorHelpers.applyAlpha(Colors.black, 0.6)}]}>
                    <Animatable.View onTouchEnd={(e) => e.stopPropagation()} duration={250} useNativeDriver={true} animation={'slideInLeft'} style={ [{height: '100%', width: '80%', backgroundColor: Colors.themeWhite, elevation: 5, paddingTop: normalizeHeight(30), paddingLeft: 15 } ] } >
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <NeomorphRing outerSize={110} hideInternal={true} style={{ shadowRadius: 8}}>
                                <Icon name={selectedAvatarIcon} width={100} height={100} fill={Colors.primary} />
                            </NeomorphRing>
                            <View style={{ marginLeft: normalizeWidth(20)}}>
                                <Text style={{ fontSize: Fonts.FONT_SIZE_20, color: Colors.primary }}>
                                    { capitalizeFirstLetter( deviceName ) }
                                </Text>
                                <Text style={{ fontSize: Fonts.FONT_SIZE_14, color: Colors.grey, textAlign: 'center' }}>
                                    { capitalizeFirstLetter( brand ) }
                                </Text>
                            </View>
                        </View>
                        <ScrollView style={{ marginTop: normalizeHeight(30), marginLeft: -10,}}>
                            <NeomorphFlex style={{ shadowRadius: 5, backgroundColor: Colors.themeWhite, margin: 30, borderRadius: 100, padding: 10}}>
                                <TouchableOpacity onPress={gotoSetupScreen} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
                                    <View style={{ flexDirection: 'row', marginLeft: 10}}>
                                        <Icon name={ICON_SETTINGS} width={24} height={24} fill={Colors.primary} />
                                        <Text style={{ fontSize: Fonts.FONT_SIZE_16, color: Colors.grey, marginLeft: 10}}>
                                            {'Settings'}
                                        </Text>
                                    </View>

                                    <View style={{ rotation: -90}}>
                                        <Icon name={ICON_DROP_DOWN_ARROW} width={22} height={22} fill={Colors.primary} />
                                    </View>
                                </TouchableOpacity>
                            </NeomorphFlex>

                            <NeomorphFlex style={{ shadowRadius: 5, backgroundColor: Colors.themeWhite, margin: 30, marginTop: 0, borderRadius: 100, padding: 10}}>
                                <TouchableOpacity onPress={gotoSecurityScreen} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
                                    <View style={{ flexDirection: 'row', marginLeft: 10}}>
                                        <Icon name={ICON_PRIVACY} width={24} height={24} fill={Colors.primary} />
                                        <Text style={{ fontSize: Fonts.FONT_SIZE_16, color: Colors.grey, marginLeft: 10}}>
                                            {'Security'}
                                        </Text>
                                    </View>

                                    <View style={{ rotation: -90}}>
                                        <Icon name={ICON_DROP_DOWN_ARROW} width={22} height={22} fill={Colors.primary} />
                                    </View>
                                </TouchableOpacity>
                            </NeomorphFlex>


                            <NeomorphFlex style={{ shadowRadius: 5, backgroundColor: Colors.themeWhite, margin: 30, marginTop: 0, borderRadius: 100, padding: 10}}>
                                <TouchableOpacity onPress={gotoThanksScreen} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
                                    <View style={{ flexDirection: 'row', marginLeft: 10}}>
                                        <Icon name={ICON_SMILE} width={24} height={24} stroke={Colors.primary} />
                                        <Text style={{ fontSize: Fonts.FONT_SIZE_16, color: Colors.grey, marginLeft: 10}}>
                                            {'Thanks Page'}
                                        </Text>
                                    </View>

                                    <View style={{ rotation: -90}}>
                                        <Icon name={ICON_DROP_DOWN_ARROW} width={22} height={22} fill={Colors.primary} />
                                    </View>
                                </TouchableOpacity>
                            </NeomorphFlex>

                            <NeomorphFlex style={{ shadowRadius: 5, backgroundColor: Colors.themeWhite, margin: 30, marginTop: 0, borderRadius: 100, padding: 10}}>
                                <TouchableOpacity onPress={gotoUpcomingScreen} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
                                    <View style={{ flexDirection: 'row', marginLeft: 10}}>
                                        <Icon name={ICON_CIRCLE} width={24} height={24} stroke={Colors.primary} />
                                        <Text style={{ fontSize: Fonts.FONT_SIZE_15, color: Colors.grey, marginLeft: 10}}>
                                            {'Upcoming Features'}
                                        </Text>
                                    </View>

                                    <View style={{ rotation: -90}}>
                                        <Icon name={ICON_DROP_DOWN_ARROW} width={22} height={22} fill={Colors.primary} />
                                    </View>
                                </TouchableOpacity>
                            </NeomorphFlex>
                            
                            <NeomorphFlex style={{ shadowRadius: 5, backgroundColor: Colors.themeWhite, margin: 30, marginTop: 0, borderRadius: 100, padding: 10}}>
                                <TouchableOpacity onPress={gotoAboutScreen} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
                                    <View style={{ flexDirection: 'row', marginLeft: 10}}>
                                        <Icon name={ICON_BOX} width={24} height={24} stroke={Colors.primary} />
                                        <Text style={{ fontSize: Fonts.FONT_SIZE_16, color: Colors.grey, marginLeft: 10}}>
                                            {'About Us'}
                                        </Text>
                                    </View>

                                    <View style={{ rotation: -90}}>
                                        <Icon name={ICON_DROP_DOWN_ARROW} width={22} height={22} fill={Colors.primary} />
                                    </View>
                                </TouchableOpacity>
                            </NeomorphFlex>
                        </ScrollView>

                        <View style={{ flexDirection: 'row-reverse'}}>
                            <NeomorphRing outerSize={50} hideInternal={true} style={{ margin: normalizeWidth(20), marginRight : 10}}>
                                <TouchableOpacity onPress={()=>toggleSideMenu(false)}>
                                    <Icon name={ICON_ARROW} width={32} height={32} fill={Colors.primary} />
                                </TouchableOpacity>
                            </NeomorphRing>

                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 10}}>
                                    <Text style={{ fontSize: Fonts.FONT_SIZE_16, color: Colors.lightBlack}}>
                                        {'🇮🇳 Made in India 🇮🇳'}
                                    </Text>

                                    <Text style={{ fontSize: Fonts.FONT_SIZE_10, color: Colors.grey}}>
                                        {'Version ' + VERSION} { ' © 2020 '}
                                    </Text>
                            </View>
                        </View>
                    </Animatable.View>
                </View>
            }
        </View>
      );
}