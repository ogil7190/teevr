package com.fatafat.interfaces;

public interface TransferProgressListener {
    void onHandShake(String deviceDetails);

    void onInit(String files);

    void onFileTransferStart(String file);

    void onFileTransferProgress(String progress);

    void onFileTransferComplete(String path);

    void onComplete();

    void onDisconnect();
}
