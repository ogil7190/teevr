package com.bound.Models;

import java.io.Serializable;

public class Connection implements Serializable {
    private String deviceName;
    private String deviceAvatar;
    private WifiConnection connection;

    public Connection(String deviceName, String deviceAvatar, WifiConnection connection) {
        this.deviceName = deviceName;
        this.deviceAvatar = deviceAvatar;
        this.connection = connection;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getDeviceAvatar() {
        return deviceAvatar;
    }

    public void setDeviceAvatar(String deviceAvatar) {
        this.deviceAvatar = deviceAvatar;
    }

    public WifiConnection getConnection() {
        return connection;
    }

    public void setConnection(WifiConnection connection) {
        this.connection = connection;
    }
}
