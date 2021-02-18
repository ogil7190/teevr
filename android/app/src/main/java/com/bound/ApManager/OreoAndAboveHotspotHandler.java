package com.bound.ApManager;

import android.content.Context;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Handler;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.bound.Interfaces.ConnectionCallback;
import com.bound.Models.WifiConnection;
import com.fatafat.jsModules.Funny;

import static android.content.ContentValues.TAG;

@RequiresApi(api = Build.VERSION_CODES.O)
public class OreoAndAboveHotspotHandler {

    private WifiManager.LocalOnlyHotspotReservation mReservation;
    private HotspotManager hotspotManager;
    private boolean inProgress;

    public OreoAndAboveHotspotHandler(HotspotManager hotspotManager) {
        this.hotspotManager = hotspotManager;
    }

    public void toggle(boolean setOn, Context context, final ConnectionCallback callback) {
        try {
            if( inProgress ){
                callback.onFailed();
            }

            if (isHotspotActive()) {

                turnOffHotspot();
            }

            if (!setOn) {
                callback.onDisabled();
                return;
            } else {
                turnOnHotspot(context, callback);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public boolean isHotspotActive() {
        return null != mReservation && mReservation.getWifiConfiguration() != null;
    }

    private void turnOnHotspot(Context context, ConnectionCallback callback) {
        inProgress = true;
        WifiManager manager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        manager.startLocalOnlyHotspot(new WifiManager.LocalOnlyHotspotCallback() {

            @Override
            public void onStarted(WifiManager.LocalOnlyHotspotReservation reservation) {
                super.onStarted(reservation);
                Log.d(TAG, "Wifi Hotspot is on now");
                mReservation = reservation;
                String ip = hotspotManager.getMyIP();
                WifiConnection connection = new WifiConnection(reservation.getWifiConfiguration().SSID, reservation.getWifiConfiguration().preSharedKey);
                connection.setIp(ip);

                Log.v("TAG", "THE PASSWORD IS: "
                        + reservation.getWifiConfiguration().preSharedKey
                        + " \n SSID is : "
                        + reservation.getWifiConfiguration().SSID
                        + " \n IP is :" + ip);

                callback.onEnabled(connection);
                Funny.hotspotEnabled = true;
                inProgress = false;
            }

            @Override
            public void onStopped() {
                super.onStopped();
                Log.d(TAG, "onStopped: ");
            }

            @Override
            public void onFailed(int reason) {
                super.onFailed(reason);
                Log.d(TAG, "onFailed: ");
                callback.onFailed();
            }

        }, new Handler());
    }

    private void turnOffHotspot() {
        if (mReservation != null) {
            mReservation.close();
            mReservation = null;
            Funny.hotspotEnabled = false;
        } else {
            Log.d("TAG", "reservation not found");
        }
    }
}
