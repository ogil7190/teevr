import DeviceInfo from 'react-native-device-info';
import { parseSize } from './utils';

const getConfig = async () => {
    const config = {};
    
    try {
        config.uniqueId = await DeviceInfo.getUniqueId();
        config.hasNotch = await DeviceInfo.hasNotch();
        config.brand = await DeviceInfo.getBrand();
        config.model = await DeviceInfo.getModel();
        config.osVersion = await DeviceInfo.getSystemVersion();
        config.manufacturer = await DeviceInfo.getManufacturer();
        config.carrier = await DeviceInfo.getCarrier();
        config.deviceName = await DeviceInfo.getDeviceName();
        config.isLocationEnabled = await DeviceInfo.isLocationEnabled();
        config.fontScale = await DeviceInfo.getFontScale();
        config.isEmulator = await DeviceInfo.sEmulator();

        config.storage = parseSize( await DeviceInfo.getTotalDiskCapacity() || 0 );
        config.ram = parseSize( await DeviceInfo.getTotalMemory() || 0 );
        
        config.installer = await DeviceInfo.getInstallerPackageName();
        config.referer = await DeviceInfo.getInstallReferrer()();
    } catch(e){
        console.log( e );
    }
    
    return config;
}

export const getDeviceConfig = async () => {
    return await getConfig();
}