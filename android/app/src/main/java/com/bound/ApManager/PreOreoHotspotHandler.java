package com.bound.ApManager;

import android.content.Context;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;
import android.util.Log;

import com.bound.Interfaces.ConnectionCallback;
import com.bound.Models.WifiConnection;
import com.bound.Utils.Randoms;
import com.fatafat.jsModules.Funny;

import java.lang.reflect.Method;

@SuppressWarnings("deprecation")
public class PreOreoHotspotHandler {
    private static boolean wasWifiEnabled;
    private HotspotManager hotspotManager;

    public PreOreoHotspotHandler(HotspotManager hotspotManager) {
        this.hotspotManager = hotspotManager;
    }

    public void toggle(boolean setOn, Context context, ConnectionCallback callback) {
        WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        Method[] methods = wifiManager.getClass().getDeclaredMethods();
        String apName = "AP_" + Randoms.randomString(8);
        String apPassword = Randoms.randomPassword(10);
        WifiConnection connection = new WifiConnection(apName, apPassword, hotspotManager.getMyIP());
        WifiConfiguration config = initWifiConfig(apName, apPassword);

        boolean foundMethod = false;

        for (Method method : methods) {
            if (method.getName().equals("setWifiApEnabled")) {
                foundMethod = true;
                if (setOn) {
                    wasWifiEnabled = wifiManager.isWifiEnabled();
                    Log.d("TAG", "Was wifi Enabled :" + wasWifiEnabled);
                    wifiManager.setWifiEnabled(false); //Turning off wifi because tethering requires wifi to be off

                    hotspotManager.getModule().checkSystemWriteAccess(data -> {
                        try {
                            if(isHotspotActive(context)){
                                method.invoke(wifiManager, null, false);
                            }
                            method.invoke(wifiManager, config, true); //Activating tethering
                            Funny.hotspotEnabled = true;
                            if (callback != null) callback.onEnabled(connection);
                        } catch (Exception e) {
                            e.printStackTrace();
                            if (callback != null) callback.onFailed();
                        }
                    });

                } else {
                    hotspotManager.getModule().checkSystemWriteAccess(data -> {
                        try {
                            method.invoke(wifiManager, null, false); //Deactivating tethering
                            wifiManager.setWifiEnabled(wasWifiEnabled);
                            Funny.hotspotEnabled = false;
                            if (callback != null) callback.onDisabled();
                        } catch (Exception e) {
                            e.printStackTrace();
                            if (callback != null) callback.onFailed();
                        }
                    });
                }
            }
        }

        if (callback != null && !foundMethod) {
            callback.onFailed(); //Error setWifiApEnabled not found
        }
    }

    private WifiConfiguration initWifiConfig(String name, String passPhrase) {

        WifiConfiguration wifiConfig = new WifiConfiguration();

        wifiConfig.SSID = name;
        wifiConfig.preSharedKey = passPhrase; // must be 8 or more in length

        wifiConfig.hiddenSSID = false;

        wifiConfig.status = WifiConfiguration.Status.ENABLED;
        wifiConfig.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.CCMP);
        wifiConfig.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.TKIP);
        wifiConfig.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_PSK);
        wifiConfig.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.CCMP);
        wifiConfig.allowedProtocols.set(WifiConfiguration.Protocol.RSN);
        wifiConfig.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.TKIP);

        wifiConfig.allowedProtocols.set(WifiConfiguration.Protocol.WPA);
        return wifiConfig;
    }

    public boolean isHotspotActive(Context context) {
        WifiManager manager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        try {
            final Method method = manager.getClass().getDeclaredMethod("isWifiApEnabled");
            method.setAccessible(true); //in the case of visibility change in future APIs
            return (Boolean) method.invoke(manager);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
