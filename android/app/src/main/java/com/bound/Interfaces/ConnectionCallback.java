package com.bound.Interfaces;

public interface ConnectionCallback {

    void onEnabled(Object data);

    void onDisabled();

    void onFailed();

}
