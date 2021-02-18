package com.bound.ApManager;

import android.content.Context;
import android.net.DhcpInfo;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.text.format.Formatter;
import android.util.Log;

import com.bound.Models.WifiConnection;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.List;

@SuppressWarnings("deprecation")
public class WifiHandler {
    /**
     * Turn on Wifi
     *
     * @param context
     * @return is successful
     */

    public static boolean openWifi(Context context) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        return wifiManager != null && (wifiManager.isWifiEnabled() || wifiManager.setWifiEnabled(true));
    }

    /**
     * Whether Wifi is turned on
     *
     * @param context
     * @return switch
     */
    public static boolean isWifiEnabled(Context context) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        return wifiManager != null && wifiManager.isWifiEnabled();
    }

    /**
     * Turn on Wifi scanning
     *
     * @param context
     */
    public static void startWifiScan(Context context) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        if (wifiManager == null) {
            return;
        }
        if (!wifiManager.isWifiEnabled()) {
            wifiManager.setWifiEnabled(true);
        }
        wifiManager.startScan();
    }

    /**
     * Turn on Wifi scanning
     *
     * @param context
     */
    public static List<ScanResult> getScanResults(Context context) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        if (wifiManager == null) {
            return null;
        }
        return wifiManager.getScanResults();
    }

    /**
     * Turn off Wifi
     *
     * @param context
     */
    public static void closeWifi(Context context) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        if (wifiManager != null && wifiManager.isWifiEnabled()) {
            wifiManager.setWifiEnabled(false);
        }
    }

    private static int getExistingNetworkId(Context context, String SSID) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        List<WifiConfiguration> configuredNetworks = wifiManager.getConfiguredNetworks();
        if (configuredNetworks != null) {
            for (WifiConfiguration existingConfig : configuredNetworks) {
                if (existingConfig.SSID.equals(SSID)) {
                    return existingConfig.networkId;
                }
            }
        }
        return -1;
    }

    /**
     * Connect to specified Wifi
     *
     * @param context
     * @param connection
     * @return is connected successfully
     */
    public static boolean connectWifi(Context context, WifiConnection connection) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        if (wifiManager == null) {
            return false;
        }
        if (!wifiManager.isWifiEnabled()) {
            wifiManager.setWifiEnabled(true);
        }

        WifiConfiguration wifiConfiguration = createWifiConfiguration(connection.getSsid(), connection.getPassword());
        int networkId = wifiManager.addNetwork(wifiConfiguration);
        if (networkId == -1) {
            networkId = getExistingNetworkId(context, wifiConfiguration.SSID);
        }
        Log.d("TAG", "" + networkId);
        wifiManager.disconnect();
        wifiManager.enableNetwork(networkId, true);
        return wifiManager.reconnect();
    }

    /**
     * Disconnect Wifi connection
     *
     * @param context
     */
    public static void disconnectWifi(Context context) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        if (wifiManager != null && wifiManager.isWifiEnabled()) {
            wifiManager.disconnect();
        }
    }

    /**
     * Get the SSID of the currently connected Wifi
     *
     * @param context
     * @return SSID
     */
    public static String getConnectedSSID(Context context) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        WifiInfo wifiInfo = wifiManager == null ? null : wifiManager.getConnectionInfo();
        return wifiInfo != null ? wifiInfo.getSSID().replaceAll(" \" ", " ") : " ";
    }

    /**
     * Get the IP address of the connected Wifi hotspot
     *
     * @param context
     * @return IP address
     */
    public static String getHotspotIpAddress(Context context) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        WifiInfo wifiinfo = wifiManager == null ? null : wifiManager.getConnectionInfo();
        if (wifiinfo != null) {
            DhcpInfo dhcpInfo = wifiManager.getDhcpInfo();
            if (dhcpInfo != null) {
                int address = dhcpInfo.gateway;
                String pos = ((address & 0xFF)
                        + "." + ((address >> 8) & 0xFF)
                        + "." + ((address >> 16) & 0xFF)
                        + "." + ((address >> 24) & 0xFF));
                Log.d("TAG", "Possible Gateway IP :" + pos);
            }

            final DhcpInfo dhcp = wifiManager.getDhcpInfo();
            final String address;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.CUPCAKE) {
                address = Formatter.formatIpAddress(dhcp.gateway);
                Log.d("TAG", "Possible Gateway IP " + address);
                return address;
            }
//            return Formatter.formatIpAddress(wifiManager.getConnectionInfo().getIpAddress());
        }
        return " ";
    }

    /**
     * Get the IP address of the device itself after connecting to Wifi
     *
     * @param context
     * @return IP address
     */
    public static String getLocalIpAddress(Context context) {
//        return getHotspotIpAddress(context);

        try {
            Process p = Runtime.getRuntime().exec("ip -o a");
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(p.getInputStream()));
            String line;

            while ((line = reader.readLine()) != null) {
                int pos = line.indexOf("inet 192");
                if (pos != -1) {
                    Log.d("TAG", line);
                    line = line.substring(pos);
                    String ip = line.split(" ")[1].split("/")[0];
                    return ip;
                }
                p.waitFor();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "192.168.43.1";

//        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
//        WifiInfo wifiinfo = wifiManager == null ? null : wifiManager.getConnectionInfo();
//        if (wifiinfo != null) {
//            int ipAddress = wifiinfo.getIpAddress();
//            return ((ipAddress & 0xFF)
//                    + " . " + ((ipAddress >> 8) & 0xFF)
//                    + " . " + ((ipAddress >> 16) & 0xFF)
//                    + " . " + ((ipAddress >> 24) & 0xFF));
//        }
//        return " ";
    }

    public static void test(Context context) throws Exception {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        Method getWifiApConfigurationMethod = wifiManager.getClass().getMethod("getWifiApConfiguration");
        WifiConfiguration netConfig = (WifiConfiguration) getWifiApConfigurationMethod.invoke(wifiManager);

        //Log.i("Writing HotspotData", "\nSSID:" + netConfig.SSID + "\nPassword:" + netConfig.preSharedKey + "\n");

        Field wcBand = WifiConfiguration.class.getField("apBand");
        int vb = wcBand.getInt(netConfig);
        Log.d("Band was", "val=" + vb);
        wcBand.setInt(netConfig, 2); // 2Ghz

        // For Channel change
        Field wcFreq = WifiConfiguration.class.getField("apChannel");
        int val = wcFreq.getInt(netConfig);
        Log.d("Config was", "val=" + val);
        wcFreq.setInt(netConfig, 11); // channel 11

        Method setWifiApConfigurationMethod = wifiManager.getClass().getMethod("setWifiApConfiguration", WifiConfiguration.class);
        setWifiApConfigurationMethod.invoke(wifiManager, netConfig);

        // For Saving Data
        wifiManager.saveConfiguration();
    }

    /**
     * Determine whether the configuration information of the specified Wifi is saved locally (whether the Wifi has been successfully connected before)
     *
     * @param context
     * @param ssid    SSID
     * @return Wifi configuration information
     */
    private static WifiConfiguration isWifiExist(Context context, String ssid) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        List<WifiConfiguration> wifiConfigurationList = wifiManager == null ? null : wifiManager.getConfiguredNetworks();
        if (wifiConfigurationList != null && wifiConfigurationList.size() > 0) {
            for (WifiConfiguration wifiConfiguration : wifiConfigurationList) {
                if (wifiConfiguration.SSID.equals(" \" " + ssid + " \" ")) {
                    return wifiConfiguration;
                }
            }
        }
        return null;
    }

    /**
     * Clear the configuration information of the specified Wifi
     *
     * @param ssid SSID
     */
    public static void cleanWifiInfo(Context context, String ssid) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        WifiConfiguration wifiConfiguration = isWifiExist(context, ssid);
        if (wifiManager != null && wifiConfiguration != null) {
            wifiManager.removeNetwork(wifiConfiguration.networkId);
        }
    }

    /**
     * Create Wifi network configuration
     *
     * @param ssid     SSID
     * @param password password
     * @return Wifi network configuration
     */
    private static WifiConfiguration createWifiConfiguration(String ssid, String password) {
        WifiConfiguration wifiConfiguration = new WifiConfiguration();
        wifiConfiguration.SSID = " \" " + ssid + " \" ";
        wifiConfiguration.preSharedKey = " \" " + password + " \" ";
        wifiConfiguration.hiddenSSID = true;
        wifiConfiguration.status = WifiConfiguration.Status.ENABLED;
        wifiConfiguration.allowedProtocols.set(WifiConfiguration.Protocol.WPA);
        wifiConfiguration.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_PSK);
        return wifiConfiguration;
    }

}
