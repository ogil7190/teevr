package com.fatafat.models;

public class DeviceInfo {
    private String uid;
    private String name;
    private String Brand;
    private int avatar;

    public DeviceInfo(String uid, String name, String brand, int avatar) {
        this.uid = uid;
        this.name = name;
        Brand = brand;
        this.avatar = avatar;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return Brand;
    }

    public void setBrand(String brand) {
        Brand = brand;
    }

    public int getAvatar() {
        return avatar;
    }

    public void setAvatar(int avatar) {
        this.avatar = avatar;
    }
}
