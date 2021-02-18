package com.fatafat.utils;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.fatafat.Constants;
import com.fatafat.models.FileTransfer;
import com.fatafat.models.Progress;
import com.google.gson.Gson;

import java.util.ArrayList;


public class TransferBroadcaster {

    private LocalBroadcastManager manager;
    private Gson gson = new Gson();

    public TransferBroadcaster(Context context) {
        manager = LocalBroadcastManager.getInstance(context);
    }

    public void onHandShake(String deviceInfo) {
        Intent intent = new Intent(Constants.INTENT_TRANSFER_PROGRESS);
        intent.putExtra("type", Constants.PROGRESS_TRANSFER_HANDSHAKE);
        intent.putExtra("info", deviceInfo);
        manager.sendBroadcast(intent);
    }

    public void onTransferStart(ArrayList<FileTransfer> files) {
        Intent intent = new Intent(Constants.INTENT_TRANSFER_PROGRESS);
        intent.putExtra("type", Constants.PROGRESS_TRANSFER_START);
        intent.putExtra("files", gson.toJson(files));
        manager.sendBroadcast(intent);
    }

    public void onFileTransferStart(String file) {
        Intent intent = new Intent(Constants.INTENT_TRANSFER_PROGRESS);
        intent.putExtra("type", Constants.PROGRESS_FILE_TRANSFER_START);
        intent.putExtra("file", file);
        manager.sendBroadcast(intent);
    }

    public void onFileTransferProgress(Progress progress) {
        Intent intent = new Intent(Constants.INTENT_TRANSFER_PROGRESS);
        intent.putExtra("type", Constants.PROGRESS_FILE_TRANSFER_PROGRESS);
        String p = gson.toJson(progress);
        Log.d("TAG", "Progress Broadcaster " + p);
        intent.putExtra("progress", p);
        manager.sendBroadcast(intent);
    }

    public void onFileTransferComplete(String path) {
        Intent intent = new Intent(Constants.INTENT_TRANSFER_PROGRESS);
        intent.putExtra("type", Constants.PROGRESS_FILE_TRANSFER_COMPLETE);
        intent.putExtra("path", path);
        manager.sendBroadcast(intent);
    }

    public void onTransferComplete() {
        Intent intent = new Intent(Constants.INTENT_TRANSFER_PROGRESS);
        intent.putExtra("type", Constants.PROGRESS_TRANSFER_COMPLETE);
        manager.sendBroadcast(intent);
    }

    public void onDisconnect() {
        Intent intent = new Intent(Constants.INTENT_TRANSFER_PROGRESS);
        intent.putExtra("type", Constants.PROGRESS_TRANSFER_HALT);
        manager.sendBroadcast(intent);
    }

    public void notifyBgThreadDone() {
        Intent intent = new Intent(Constants.INTENT_NOTIFY_BACKGROUND_SERVICE);
        manager.sendBroadcast(intent);
    }
}
