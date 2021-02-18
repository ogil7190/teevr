package com.fatafat.models;

public class Ack {
    boolean okay;
    String extraData;

    public Ack(boolean okay) {
        this.okay = okay;
    }

    public boolean isOkay() {
        return okay;
    }

    public void setOkay(boolean okay) {
        this.okay = okay;
    }

    public String getExtraData() {
        return extraData;
    }

    public void setExtraData(String extraData) {
        this.extraData = extraData;
    }
}
