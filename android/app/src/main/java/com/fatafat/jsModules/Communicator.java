package com.fatafat.jsModules;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.fatafat.Constants;
import com.fatafat.interfaces.TransferProgressListener;
import com.fatafat.models.FileTransfer;
import com.fatafat.services.BackgroundRunnerService;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static com.fatafat.Constants.INTENT_TRANSFER_PROGRESS;
import static com.fatafat.Constants.PROGRESS_FILE_TRANSFER_COMPLETE;
import static com.fatafat.Constants.PROGRESS_FILE_TRANSFER_PROGRESS;
import static com.fatafat.Constants.PROGRESS_FILE_TRANSFER_START;
import static com.fatafat.Constants.PROGRESS_TRANSFER_COMPLETE;
import static com.fatafat.Constants.PROGRESS_TRANSFER_HALT;
import static com.fatafat.Constants.PROGRESS_TRANSFER_HANDSHAKE;
import static com.fatafat.Constants.PROGRESS_TRANSFER_START;
import static com.fatafat.jsModules.FileGrabber.FILE_TYPE_APP;

public class Communicator extends ReactContextBaseJavaModule {
    private ReactContext context;
    public static boolean isCommunicating = false;

    private TransferProgressListener transferProgressListener = new TransferProgressListener() {
        @Override
        public void onInit(String files) {
            WritableMap map = Arguments.createMap();
            map.putString("files", files);
            sendEvent(PROGRESS_TRANSFER_START, map);
        }

        @Override
        public void onFileTransferStart(String file) {
            WritableMap map = Arguments.createMap();
            map.putString("file", file);
            sendEvent(PROGRESS_FILE_TRANSFER_START, map);
        }

        @Override
        public void onFileTransferProgress(String progress) {
            WritableMap map = Arguments.createMap();
            map.putString("progress", progress);
            Log.d("TAG", "Progress Communicator " + progress);
            sendEvent(PROGRESS_FILE_TRANSFER_PROGRESS, map);
        }

        @Override
        public void onFileTransferComplete(String path) {
            WritableMap map = Arguments.createMap();
            map.putString("filePath", path);
            Log.d("TAG", "File Complete " + path);
            sendEvent(PROGRESS_FILE_TRANSFER_COMPLETE, map);
        }

        @Override
        public void onComplete() {
            WritableMap map = Arguments.createMap();
            sendEvent(PROGRESS_TRANSFER_COMPLETE, map);
        }

        @Override
        public void onDisconnect() {
            WritableMap map = Arguments.createMap();
            sendEvent(PROGRESS_TRANSFER_HALT, map);
        }

        @Override
        public void onHandShake(String deviceDetails) {
            WritableMap map = Arguments.createMap();
            map.putString("info", deviceDetails);
            Log.d("TAG", "Handshake  " + deviceDetails);
            sendEvent(PROGRESS_TRANSFER_HANDSHAKE, map);
        }
    };

    private BroadcastReceiver transferBroadcast = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String type = intent.getExtras().getString("type");
            switch (type) {
                case PROGRESS_FILE_TRANSFER_PROGRESS: {
                    String progress = intent.getExtras().getString("progress");
                    Log.d("TAG", "Progress Receiver " + progress);
                    transferProgressListener.onFileTransferProgress(progress);
                    break;
                }
                case PROGRESS_TRANSFER_START: {
                    String files = intent.getExtras().getString("files");
                    transferProgressListener.onInit(files);
                    break;
                }

                case PROGRESS_FILE_TRANSFER_START: {
                    String file = intent.getExtras().getString("file");
                    transferProgressListener.onFileTransferStart(file);
                    break;
                }

                case PROGRESS_FILE_TRANSFER_COMPLETE: {
                    String path = intent.getExtras().getString("path");
                    transferProgressListener.onFileTransferComplete(path);
                    break;
                }

                case PROGRESS_TRANSFER_COMPLETE: {
                    transferProgressListener.onComplete();
                    break;
                }

                case PROGRESS_TRANSFER_HALT: {
                    transferProgressListener.onDisconnect();
                    break;
                }

                case PROGRESS_TRANSFER_HANDSHAKE: {
                    String info = intent.getExtras().getString("info");
                    transferProgressListener.onHandShake(info);
                    break;
                }
            }
        }
    };

    public Communicator(ReactContext context) {
        this.context = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "Communicator";
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @ReactMethod
    public void startFileSending(ReadableMap data) {
        String info = data.getString("info");

        ReadableArray files = data.getArray("files");
        List<FileTransfer> filesToSend = new ArrayList<>();
        HashMap<String, Object> temp;
        String filePath, fileType, fileId;
        Double fileSize;
        FileTransfer tempFileTransfer;

        for (Object obj : files.toArrayList()) {
            temp = (HashMap<String, Object>) obj;
            fileId = (String) temp.get("id");
            fileSize = (Double) temp.get("size");
            filePath = (String) temp.get("path");
            fileType = (String) temp.get("type");
            tempFileTransfer = new FileTransfer(fileId, filePath, fileType, fileSize);
            if (fileType.equals(FILE_TYPE_APP)) {
                tempFileTransfer.setFileName((String) temp.get("name")); // most of the apps are base.apk that is why
            }
            filesToSend.add(tempFileTransfer);
        }

        Intent serviceIntent = new Intent(this.context, BackgroundRunnerService.class);
        serviceIntent.putExtra("serviceText", "App is sending files to other device");
        serviceIntent.putExtra("actionType", Constants.SERVICE_TYPE_SEND);
        serviceIntent.putExtra("metaData", info);
        serviceIntent.putExtra("intentData", new Gson().toJson(filesToSend));
        LocalBroadcastManager.getInstance(context).registerReceiver(transferBroadcast, new IntentFilter(INTENT_TRANSFER_PROGRESS));
        ContextCompat.startForegroundService(context, serviceIntent);
        isCommunicating = true;
    }

    @ReactMethod
    public void startFilesReceiving(ReadableMap data) {
        String deviceInfo = data.getString("info");
        Intent serviceIntent = new Intent(this.context, BackgroundRunnerService.class);
        serviceIntent.putExtra("serviceText", "App is receiving files from other device");
        serviceIntent.putExtra("actionType", Constants.SERVICE_TYPE_RECEIVE);
        serviceIntent.putExtra("metaData", deviceInfo);
        LocalBroadcastManager.getInstance(context).registerReceiver(transferBroadcast, new IntentFilter(INTENT_TRANSFER_PROGRESS));
        ContextCompat.startForegroundService(context, serviceIntent);
        isCommunicating = true;
    }

    @ReactMethod
    public void isCommunicating(Callback onSuccess) {
        onSuccess.invoke(isCommunicating);
    }
}
