package com.fatafat.jsModules;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.bound.ApManager.HotspotManager;
import com.bound.ApManager.WifiHandler;
import com.bound.Interfaces.ConnectionCallback;
import com.bound.Interfaces.OnServerSocketConnection;
import com.bound.Interfaces.OnWaitForResponseCallback;
import com.bound.Models.WifiConnection;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.PermissionListener;
import com.fatafat.runnables.TinyServer;
import com.fatafat.utils.AppCloseBroadcaster;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.ResolvableApiException;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.google.android.gms.location.SettingsClient;
import com.thanosfisherman.wifiutils.WifiUtils;
import com.thanosfisherman.wifiutils.wifiConnect.ConnectionErrorCode;
import com.thanosfisherman.wifiutils.wifiConnect.ConnectionSuccessListener;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;

public class Funny extends ReactContextBaseJavaModule implements ActivityEventListener, PermissionListener {
    private static ReactContext context;
    private static HotspotManager manager;
    private static TinyServer server;
    public static Socket receiver, sender;
    public static ServerSocket serverSocket;
    private OnWaitForResponseCallback callback;
    private int CODE_WRITE_SETTINGS_PERMISSION = 1005;

    public static boolean hotspotEnabled = false;
    public static boolean wasWifiEnabled = false;

    private SettingsClient mSettingsClient;
    private LocationSettingsRequest mLocationSettingsRequest;
    private static final int REQUEST_CHECK_SETTINGS = 214;
    private static final int REQUEST_ENABLE_GPS = 516;
    private Callback savedCallback;

    public Funny(ReactContext reactContext) {
        context = reactContext;
        manager = new HotspotManager(context, this);
        context.addActivityEventListener(this);
    }

    @NonNull
    @Override
    public String getName() {
        return "Funny";
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (requestCode == CODE_WRITE_SETTINGS_PERMISSION) {
                if (Settings.System.canWrite(context)) {
                    Log.d("TAG", "CODE_WRITE_SETTINGS_PERMISSION onActivityResult success");
                    if (this.callback != null) {
                        this.callback.onResponse(true);
                    }
                } else {
                    if (this.callback != null) {
                        this.callback.onResponse(false);
                    }
                }
            }
        }

        Log.e("Activity Result", "Code " + requestCode);
        if (requestCode == REQUEST_CHECK_SETTINGS) {
            switch (resultCode) {
                case Activity.RESULT_OK:
                    Log.e("Activity Res", "OKAY ");
                    savedCallback.invoke();
                    break;
                case Activity.RESULT_CANCELED:
                    Log.e("GPS", "User denied to access location");
                    Toast.makeText(context, "Please enable GPS", Toast.LENGTH_LONG);
                    openGpsEnableSetting();
                    break;
            }
        } else if (requestCode == REQUEST_ENABLE_GPS) {
            LocationManager locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
            boolean isGpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);

            if (!isGpsEnabled) {
                Log.e("Activity Enable Manual", "Failed ");
                Toast.makeText(context, "Please enable GPS", Toast.LENGTH_LONG);
            } else {
                Log.e("Activity Enable Manual", "Success ");
                savedCallback.invoke();
            }
        }
    }

    private void openGpsEnableSetting() {
        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        context.startActivityForResult(intent, REQUEST_ENABLE_GPS, null);
    }

    public void checkSystemWriteAccess(OnWaitForResponseCallback callback) {
        try {
            boolean permission = false;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                permission = Settings.System.canWrite(context);
            } else {
                permission = ContextCompat.checkSelfPermission(context, Manifest.permission.WRITE_SETTINGS) == PackageManager.PERMISSION_GRANTED;
            }

            if (permission) {
                callback.onResponse(true);
            } else {
                this.callback = callback;
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                    Intent intent = new Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS);
                    intent.setData(Uri.parse("package:" + context.getPackageName()));
                    context.getCurrentActivity().startActivityForResult(intent, CODE_WRITE_SETTINGS_PERMISSION);
                } else {
                    ActivityCompat.requestPermissions(context.getCurrentActivity(), new String[]{Manifest.permission.WRITE_SETTINGS}, CODE_WRITE_SETTINGS_PERMISSION);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == CODE_WRITE_SETTINGS_PERMISSION) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Log.d("TAG", "CODE_WRITE_SETTINGS_PERMISSION onRequestPermissionsResult success");
                if (this.callback != null) {
                    this.callback.onResponse(true);
                }
            } else {
                if (this.callback != null) {
                    this.callback.onResponse(false);
                }
            }
        }
        return false;
    }

    @ReactMethod
    public void enableHotspot(Callback onSuccess, Callback onFailure) {
        manager.enableHotspot(new ConnectionCallback() {
            @Override
            public void onEnabled(Object data) {
                WifiConnection connection = (WifiConnection) data;
                onSuccess.invoke(connection.getReadableMap());
            }

            @Override
            public void onDisabled() {
            }

            @Override
            public void onFailed() {
                onFailure.invoke();
            }
        });
    }

    @ReactMethod
    public static void disableHotspot(Callback onSuccess, Callback onFailure) {
        manager.disableHotspot(new ConnectionCallback() {
            @Override
            public void onEnabled(Object data) {
            }

            @Override
            public void onDisabled() {
                if (onSuccess != null) {
                    onSuccess.invoke();
                }
            }

            @Override
            public void onFailed() {
                if (onFailure != null) {
                    onFailure.invoke();
                }
            }
        });
    }

    @ReactMethod
    public void connectToWifi(ReadableMap connection, Callback onSuccess, Callback onFailure) {
        String ssid = connection.getString("ssid");
        String password = connection.getString("password");

        WifiUtils
                .withContext(context)
                .enableWifi(isSuccess -> WifiUtils.withContext(context)
                        .connectWith(ssid, password)
                        .setTimeout(60000)
                        .onConnectionResult(new ConnectionSuccessListener() {
                            @Override
                            public void success() {
                                onSuccess.invoke();
                            }

                            @Override
                            public void failed(@NonNull ConnectionErrorCode errorCode) {
                                onFailure.invoke();
                            }
                        })
                        .start());
    }

    @ReactMethod
    public void whatIsMyIpAddress(Callback onSuccess) {
        String ip = WifiHandler.getLocalIpAddress(context);
        onSuccess.invoke(ip);
    }

    @ReactMethod
    public void startSender(Callback onSuccess) {
        manager.startServer(new OnServerSocketConnection() {
            @Override
            public void onConnection(ServerSocket socket) {
                serverSocket = socket;
                Log.d("TAG", "Server Started");
            }

            @Override
            public void onClientConnection(Socket socket) {
                sender = socket;
                Log.d("TAG", "Closing Socket");
                onSuccess.invoke();
            }
        });
    }

    @ReactMethod
    public static void stopSender(Callback onSuccess, Callback onFailure) {
        if (sender != null) {
            try {
                sender.close();
                sender = null;
                Log.d("TAG", "Closing Socket");
            } catch (IOException e) {
                sender = null;
                e.printStackTrace();
            }
        }

        if (serverSocket != null) {
            try {
                serverSocket.close();
                serverSocket = null;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        if (server != null) {
            server.stop();
        }
        manager.stopServer(data -> disableHotspot(onSuccess, onFailure));
        AppCloseBroadcaster.onAppClosed(context);
    }

    @ReactMethod
    public void startReceiver(String ip, Callback onSuccess) {
        manager.startReceiver(ip, socket -> {
            receiver = socket;
            onSuccess.invoke();
        });
        AppCloseBroadcaster.onAppClosed(context);
    }

    @ReactMethod
    public static void stopReceiver(Callback onSuccess) {
        if (receiver != null) {
            try {
                receiver.close();
                receiver = null;
            } catch (IOException e) {
                receiver = null;
                e.printStackTrace();
            }
        }

        manager.stopReceiver(data -> {
            if (wasWifiEnabled) {
                WifiUtils.withContext(context).enableWifi();
            }
            if (onSuccess != null) {
                onSuccess.invoke();
            }
        });
    }

    @ReactMethod
    public void startFilesNanoServer(ReadableArray files, Callback onSuccess, Callback onFailure) {
        HashMap<String, Object> temp;
        String filePath;
        String[] filesToHost = new String[files.size()];
        int count = 0;

        for (Object obj : files.toArrayList()) {
            temp = (HashMap<String, Object>) obj;
            filePath = (String) temp.get("path");
            filesToHost[count] = filePath;
            count++;
        }

        try {
            server = new TinyServer(context, filesToHost);
            server.start();
            onSuccess.invoke();
        } catch (IOException e) {
            e.printStackTrace();
            onFailure.invoke();
        }
    }

    @ReactMethod
    public void askToEnableLocation(Callback onSuccess) {
        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder();
        builder.addLocationRequest(new LocationRequest().setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY));
        builder.setAlwaysShow(true);
        mLocationSettingsRequest = builder.build();

        mSettingsClient = LocationServices.getSettingsClient(context);

        mSettingsClient
                .checkLocationSettings(mLocationSettingsRequest)
                .addOnSuccessListener(locationSettingsResponse -> {
                    Log.e("GPS", "status OKAY");
                    onSuccess.invoke();
                })
                .addOnFailureListener(e -> {
                    int statusCode = ((ApiException) e).getStatusCode();
                    Log.e("GPS", "status " + statusCode);

                    switch (statusCode) {
                        case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                            try {
                                ResolvableApiException rae = (ResolvableApiException) e;
                                savedCallback = onSuccess;
                                rae.startResolutionForResult(context.getCurrentActivity(), REQUEST_CHECK_SETTINGS);
                            } catch (IntentSender.SendIntentException sie) {
                                Toast.makeText(context, "Please enable GPS", Toast.LENGTH_LONG);
                                Log.e("GPS", "Unable to execute request.");
                            }
                            break;
                        case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                            Toast.makeText(context, "Please enable GPS", Toast.LENGTH_LONG);
                            Log.e("GPS", "Location settings are inadequate, and cannot be fixed here. Fix in Settings.");
                        default:
                            Toast.makeText(context, "Please enable GPS", Toast.LENGTH_LONG);
                            break;
                    }
                })
                .addOnCanceledListener(() -> {
                    Log.e("GPS", "checkLocationSettings -> onCanceled");
                    Toast.makeText(context, "Please enable GPS", Toast.LENGTH_LONG);
                });
    }
}
