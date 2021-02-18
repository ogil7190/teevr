package com.bound.Models;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.io.Serializable;

public class WifiConnection implements Serializable {
    private String ssid;
    private String password;
    private String ip;

    public WifiConnection(String ssid, String password) {
        this.ssid = ssid;
        this.password = password;
    }

    public WifiConnection(String ssid, String password, String ip) {
        this.ssid = ssid;
        this.password = password;
        this.ip = ip;
    }

    public ReadableMap getReadableMap(){
        WritableMap map = Arguments.createMap();
        map.putString("ssid", ssid);
        map.putString("password", password);
        map.putString("ip", ip);
        return map;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getSsid() {
        return ssid;
    }

    public void setSsid(String ssid) {
        this.ssid = ssid;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
