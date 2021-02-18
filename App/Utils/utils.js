export const shortID = ( length = 8, numbersOnly = false ) => {
    const vocab = numbersOnly ? '1234567890' : 'qwertyuiopasdfghjklzxcvbnm1234567890';
    let id = '';
    for( let i=0; i<length; i = i + 1 ) {
        const pos = Math.floor( Math.random() * vocab.length );
        id = id + vocab[ pos ];
    }
    return id;
};

export const roundToTwoDecimal = ( num ) => {
    return Math.round( (num + Number.EPSILON) * 100) / 100;
}

export const parseSize = (sizeInBytes) => {
    const sizeInKB = sizeInBytes / 1000;
    if( sizeInKB < 1 ) return `${roundToTwoDecimal(sizeInBytes)} Bytes`;
    const sizeInMB = sizeInKB / 1000;
    if( sizeInMB < 1 ) return `${roundToTwoDecimal(sizeInKB)} KB`;
    const sizeInGB = sizeInMB / 1000;
    if( sizeInGB < 1 ) return `${roundToTwoDecimal(sizeInMB)} MB`;
    return `${ roundToTwoDecimal(sizeInGB)} GB`;
}

export const parseSpeed = (speedInKbps, onlyMbps = false) => {
    if( onlyMbps ){
        const speedInMbps = speedInKbps / 1000;
        return `${roundToTwoDecimal(speedInMbps)} MB/s`;
    } else {
        const speedInMbps = speedInKbps / 1000;
        if( speedInMbps < 1 ) return `${roundToTwoDecimal(speedInKbps)} KB/s`;
        const sizeInGbps = speedInMbps / 1000;
        if( sizeInGbps < 1 ) return `${roundToTwoDecimal(speedInMbps)} MB/s`;
        return `${ roundToTwoDecimal(sizeInGbps)} GB/s`;
    }
}

export const parseTime = (timeInSecs) => {
    const timeInMins = timeInSecs / 60;
    if( timeInMins < 1 ) return `${roundToTwoDecimal(timeInSecs)} sec`;
    const timeInHours = timeInMins / 60;
    if( timeInHours < 1 ) return `${roundToTwoDecimal(timeInMins)} min`;
    return `${ roundToTwoDecimal(timeInHours)} hour`;
}

export const parseTimeElapsed = (timeInMs) => {
    const curr = new Date().getTime();
    const diff = curr - timeInMs;
    const inSeconds = diff / 1000;
    const inMins = inSeconds / 60;
    if( inMins < 1) return `${Math.floor(inSeconds)} sec ago`;
    const inHours = inMins / 60;
    if( inHours < 1) return `${Math.floor(inMins)} min ago`;
    const inDays = inHours / 24;
    if( inDays < 1) return `${Math.floor(inHours)} hour ago`;
    const yesterday = inDays / 2;
    if( yesterday < 1) return `Yesterday`;
    const date = new Date( timeInMs );
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}
