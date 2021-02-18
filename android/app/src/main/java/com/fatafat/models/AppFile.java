package com.fatafat.models;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

public class AppFile implements Comparable<AppFile> {
    private String name;
    private String appPackage;
    private String apkLocation;
    private long sizeInBytes;
    private long installedOn;

    public AppFile(String name, String appPackage, String apkLocation, long sizeInBytes, long installedOn) {
        this.name = name;
        this.appPackage = appPackage;
        this.apkLocation = apkLocation;
        this.sizeInBytes = sizeInBytes;
        this.installedOn = installedOn;
    }

    public ReadableMap getReadableMap() {
        WritableMap map = Arguments.createMap();
        map.putString("name", name);
        map.putString("package", appPackage);
        map.putString("id", appPackage);
        map.putString("path", apkLocation);
        map.putString("type", "app");
        map.putInt("size", (int) sizeInBytes);
        map.putInt("date", (int) installedOn);
        return map;
    }

    @Override
    public int compareTo(AppFile appFile) {
        return getName().compareToIgnoreCase(appFile.getName());
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAppPackage() {
        return appPackage;
    }

    public void setAppPackage(String appPackage) {
        this.appPackage = appPackage;
    }

    public String getApkLocation() {
        return apkLocation;
    }

    public void setApkLocation(String apkLocation) {
        this.apkLocation = apkLocation;
    }

    public long getSizeInBytes() {
        return sizeInBytes;
    }

    public void setSizeInBytes(long sizeInBytes) {
        this.sizeInBytes = sizeInBytes;
    }

    public long getInstalledOn() {
        return installedOn;
    }

    public void setInstalledOn(long installedOn) {
        this.installedOn = installedOn;
    }
}
