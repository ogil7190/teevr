import React from 'react';
import {View, Text, Image, FlatList, TouchableOpacity, StatusBar} from 'react-native';
import { Neomorph } from 'react-native-neomorph-shadows';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Colors, ColorHelpers } from 'Theme/Colors';
import { parseTime, parseSpeed, parseSize } from 'Utils/utils';
import * as Progress from 'react-native-progress';
import { calc, Fonts, normalizeFont, normalizeWidth, normalizeHeight } from 'App/Theme/Fonts';
import { Icon } from 'App/Components/Icon';
import { FileGrabber } from 'Modules/Modules';
import { ICON_CHECK, ICON_ARROW, ICON_AUDIOS, ICON_DOUBLE_ARROW, ICON_DOCS, ICON_CHECK_ALONE } from 'App/Constants/iconNames';
import { avatars } from 'App/Models/avatars';

export const NeomorphRing = ( props ) => {
    const outerSize = normalizeWidth( props.outerSize || 130 );
    const innerSize = normalizeWidth( props.innerSize ) || (outerSize - 30);
    
    const reverse = props.reverse || false;
    const hideInternal = props.hideInternal || false;

    return (
    <Neomorph
        inner={ reverse }
        swapShadows
        style={{
            shadowRadius: 3,
            shadowOffset:{width: 0, height: 0},
            borderRadius: outerSize,
            backgroundColor: Colors.themeWhite,
            width: outerSize,
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            height: outerSize,
            ...props.style
        }}
    >
        {
            hideInternal ? props.children
            :
            <Neomorph
                inner={ !reverse }
                swapShadows
                style={{
                    shadowRadius: 3,
                    shadowOffset:{width: 0, height: 0},
                    borderRadius: innerSize,
                    backgroundColor: Colors.themeWhite,
                    width: innerSize,
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: innerSize,
                    ...props.innerStyle
                }}
            >
                {
                    props.children
                }
            </Neomorph>
        }
    </Neomorph>
    );
}

const renderCustomNavigation = ( props ) => {
    const { isComplete } = props;
    const color = isComplete ? Colors.themeWhite : Colors.primary;

    return (
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isComplete ? Colors.primary :Colors.themeWhite, padding: 5, paddingLeft: 15, paddingRight: 15, paddingTop: 10}}>
            <TouchableOpacity onPress={() => props.onBackPress(1)}>
                <Icon name={ICON_ARROW} fill={color} stroke={color} width={24} height={24} />
            </TouchableOpacity>
        </View>
    )
}

const renderOverallProgress = (props) => {
    const {overallProgress = 0, isComplete} = props;
    const mainColor = isComplete ? Colors.primary : Colors.themeWhite;
    const secondColor = isComplete ? Colors.themeWhite : Colors.primary;

    return (
        <View style={{ width: '100%', backgroundColor: mainColor, paddingBottom: normalizeWidth(40), paddingTop: normalizeWidth(20), borderBottomLeftRadius: 25, borderBottomRightRadius: 25, alignItems: 'center'}}>
            <NeomorphRing
                reverse={isComplete ? true : false}
                outerSize={240}
                hideInternal={isComplete ? true : false}
                style={{ shadowRadius: 25, shadowOpacity: 0.12, position: 'relative', backgroundColor: mainColor }}
            >
                {
                    isComplete
                    ? <Icon name={ICON_CHECK_ALONE} stroke={secondColor} fill={secondColor} width={140} height={140} />
                    : (
                        <Text style={{ fontSize: 34, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_BOLD, color: secondColor}}>
                            { Math.round( overallProgress ) + '%'}
                        </Text>
                    )
                }

                {
                    !isComplete &&
                    <Progress.Circle
                        size={normalizeWidth(200)}
                        thickness={normalizeWidth(35)}
                        borderWidth={0}
                        color={secondColor}
                        style={{position: 'absolute'}}
                        strokeCap={'round'}
                        progress={overallProgress / 100}
                    />
                }
            </NeomorphRing>
            <Text style={{ fontSize: Fonts.FONT_SIZE_14, color: isComplete ? Colors.white : Colors.grey, textAlign: 'center', marginTop: 20 }}>
                { isComplete ? 'File Transfered' : 'File Transfer in progress' }
            </Text>
        </View>
    )
}

const renderProgressStats = (props) => {
    const { timeLeft, speed, isComplete, avgSpeed, timeTaken } = props;
    const speeds = parseSpeed( isComplete ? avgSpeed : speed, true ).split(" ");
    const times = parseTime( Math.round( isComplete ? timeTaken : timeLeft ) ).split(" ");
    const speedfontSize = speeds[0].length > 4 ? normalizeFont(22) : normalizeFont(28);
    const timefontSize = times[0].length > 4 ? normalizeFont(22) : normalizeFont(28);

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, width: '100%'}}>
            <View>
                <NeomorphRing>
                    <Text style={{ fontSize: speedfontSize, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR, color: Colors.primary, lineHeight: normalizeHeight(35)}}>
                        {times[0]}
                    </Text>
                    <Text style={{ fontSize: Fonts.FONT_SIZE_16, color: Colors.grey, marginTop: -2}}>
                        { times[1]}
                    </Text>
                </NeomorphRing>
                <Text style={{ fontSize: Fonts.FONT_SIZE_14, color: Colors.primary, marginTop: 15, textAlign: 'center'}}>
                    { isComplete ? 'Time Taken' : 'Time Left' }
                </Text>
            </View>

            <View>
                <NeomorphRing>
                    <Text style={{ fontSize: timefontSize, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR, color: Colors.primary, lineHeight: normalizeHeight(35)}}>
                        {speeds[0]}
                    </Text>
                    <Text style={{ fontSize: Fonts.FONT_SIZE_16, color: Colors.grey, marginTop: -2}}>
                        { speeds[1] }
                    </Text>
                </NeomorphRing>
                <Text style={{ fontSize: Fonts.FONT_SIZE_14, color: Colors.primary, marginTop: normalizeWidth(15), textAlign: 'center'}}>
                    { isComplete ? 'Average Speed' : 'Transfer Speed' }
                </Text>
            </View>
        </View>
    )
}

const renderFileListWithProgress = (props) => {
    const { files, totalBytesToTransfer } = props;
    return(
        <View style={{ width: '100%', padding: 15, paddingTop: normalizeWidth(50) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: ColorHelpers.applyAlpha( Colors.primary, 0.1), marginBottom: 10, padding: 10, borderRadius: 10 }}>
                <Text style={{ marginLeft: 10, fontSize: Fonts.FONT_SIZE_15, color: Colors.grey}}>
                    { files.length + ' files' }
                </Text>

                <Text style={{marginRight: 10, fontSize: Fonts.FONT_SIZE_15, color: Colors.grey}}>
                    { 'Total: ' + parseSize(totalBytesToTransfer || 0)}
                </Text>
            </View>

            <FlatList
                style={{ width: '100%'}}
				showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
				keyExtractor={( item, index ) => `file-${item.fileType}-${index}`}
                data={files || []}
				renderItem={ ({ item }) => renderFileView(item, props)}
            />
        </View>
    )
}

const viewFile = ( file ) => {
    FileGrabber.triggerViewFile(file);
}

const renderFileView = (item, props) => {
    const status = props.getFileStatus( item.filePath ) || 103;
    const isCurrent = status === 101 ? true : false;
    const isDone = status === 102 ? true : false;
    const isSendType = props.type === 'send';
    const progress = isDone ? 1 : isCurrent ? (props.fileProgress)/100  : 0;
    const transferAmount = isDone ? item.fileLength : isCurrent ? progress * item.fileLength : 0;

    return (
        <View style={{ shadowRadius: 5, flex: 1, backgroundColor: ColorHelpers.applyAlpha( Colors.primary, 0.08), borderRadius: 10, padding: 15, paddingBottom: 15, paddingTop: 15, marginBottom: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            { renderThumbnail( item ) }
            <View style={{ width: '100%', flex: 1, paddingLeft: 10}}>
                <Text style={{ fontSize: 14}} numberOfLines={1}>
                    {item.fileName}
                </Text>
                {
                    !isDone &&
                    <Progress.Bar
                        borderColor={Colors.themeWhite}
                        progress={progress}
                        borderRadius={10}
                        style={{ backgroundColor: Colors.themeWhite, marginTop: 5}}
                        width={calc('45%')}
                        color={ColorHelpers.applyAlpha( Colors.primary, 0.8)}
                        height={8}
                    />
                }
                <Text style={{ fontSize: 12, color: Colors.grey, marginTop: 5}}>
                    {`${ parseSize(transferAmount) }/${ parseSize(item.fileLength) }`}
                </Text>
            </View>
            {
                isDone &&
                <Icon name={ICON_CHECK} width={16} height={16} fill={ColorHelpers.applyAlpha( Colors.primary, 0.8)} />
            }
            {
                isDone && !isSendType &&
                <TouchableOpacity onPress={ () => viewFile(item.filePath)} style={{ marginRight: 5, marginLeft: 5}} activeOpacity={0.5}>
                    <Text style={{ fontSize: Fonts.FONT_SIZE_12, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT, backgroundColor: Colors.primary, color: Colors.themeWhite, padding: 4, paddingLeft: 10, paddingRight: 10, borderRadius: 20}}>
                        {'Open'}
                    </Text>
                </TouchableOpacity>
            }
        </View>
    )
}

const renderThumbnail = ({ fileType, thumbnail }) => {
    switch( fileType ){
        case 'image':
        case 'video':
        case 'app': {
            return(
                <View style={{ width: 55, height: 55, justifyContent: 'center'}}>
                    <Image
                        source={{ uri: `data:image/png;base64,${thumbnail}`}}
                        style={{ height: 50, width: 50, borderRadius: 5 }}
                    />
                </View>
            )
        }
        case 'audio': {
            return(
                <View style={{ backgroundColor: ColorHelpers.applyAlpha( Colors.primary, 0.2), padding: 10, borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name={ICON_AUDIOS} width={28} height={28} fill={ColorHelpers.applyAlpha( Colors.primary, 0.7)} />
                </View>
            )
        }

        case 'file': {
            return (
                <View style={{ backgroundColor: ColorHelpers.applyAlpha( Colors.primary, 0.2), padding: 10, borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name={ICON_DOCS} width={28} height={28} fill={ColorHelpers.applyAlpha( Colors.primary, 0.7)} />
                </View>
            )
        }
    }
}

const capitalizeFirstLetter = (string)  =>{
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}

const renderWhomToWhom = ( props ) => {
    const { deviceInfo, connection, type, isComplete } = props;

    if( connection && deviceInfo && !isComplete ) {
        const senderInfo = type === 'send' ? deviceInfo : connection;
        const getterInfo = type === 'send' ? connection : deviceInfo;
    
        const senderAvatar = avatars[ senderInfo.avatar ];
        const getterAvatar = avatars[ getterInfo.avatar ];
    
        return(
            <View style={{ marginBottom: normalizeWidth(30), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: normalizeWidth(30)}}>
                <View style={{ alignItems: 'center'}}>
                    <NeomorphRing outerSize={65} hideInternal={true}>
                        <Icon name={senderAvatar} width={50} height={50} fill={Colors.primary} />
                    </NeomorphRing>
                    <Text style={{ fontSize: Fonts.FONT_SIZE_18, color: Colors.primary, marginTop: 10, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR}}>
                        {capitalizeFirstLetter(senderInfo.name)}
                    </Text>
                    <Text style={{ fontSize: Fonts.FONT_SIZE_12, color: Colors.grey, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT}}>
                        { capitalizeFirstLetter(senderInfo.brand) }
                    </Text>
                </View>
    
                <View style={{ marginLeft: normalizeWidth(30), marginRight: normalizeWidth(30) }}>
                    <Icon name={ICON_DOUBLE_ARROW} width={24} height={24} fill={Colors.primary} />
                </View>
    
                <View style={{ alignItems: 'center'}}>
                    <NeomorphRing outerSize={65} hideInternal={true}>
                        <Icon name={getterAvatar} width={50} height={50} fill={Colors.primary} />
                    </NeomorphRing>
                    <Text style={{ fontSize: Fonts.FONT_SIZE_18, color: Colors.primary, marginTop: 10, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_REGULAR}}>
                        {capitalizeFirstLetter(getterInfo.name)}
                    </Text>
                    <Text style={{ fontSize: Fonts.FONT_SIZE_12, color: Colors.grey, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT}}>
                        { capitalizeFirstLetter(getterInfo.brand) }
                    </Text>
                </View>
            </View>
        )
    }

}

export const ProgressScreenView = ( props ) => {
    const { isComplete } = props;
    return (
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: Colors.themeWhite, width: '100%'}}>
            <StatusBar barStyle={isComplete ? "light-content" : "dark-content"} backgroundColor={isComplete ? Colors.primary : Colors.themeWhite}/>
            {renderCustomNavigation(props)}
            { !isComplete && renderWhomToWhom(props) }
            <View style={{ width: '100%'}}>
                {renderOverallProgress(props)}
            </View>
            {renderProgressStats(props)}
            {renderFileListWithProgress(props)}
        </View>
    )
}