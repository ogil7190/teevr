package com.bound.ApManager;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.os.Build;
import android.util.Log;

import com.bound.Constants;
import com.bound.Interfaces.ConnectionCallback;
import com.bound.Interfaces.OnServerSocketConnection;
import com.bound.Interfaces.OnSocketConnection;
import com.bound.Interfaces.OnWaitForResponseCallback;
import com.fatafat.interfaces.NetworkBoundListener;
import com.fatafat.jsModules.Funny;

import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class HotspotManager {
    private Context context;
    private OreoAndAboveHotspotHandler handlerOreo;
    private PreOreoHotspotHandler handlerPreOreo;
    private Funny module;
    private Thread thread;

    public HotspotManager(Context context, Funny module) {
        this.context = context;
        this.module = module;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            handlerOreo = new OreoAndAboveHotspotHandler(this);
        } else {
            handlerPreOreo = new PreOreoHotspotHandler(this);
        }
    }

    public Funny getModule() {
        return module;
    }

    public void enableHotspot(ConnectionCallback callback) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            handlerOreo.toggle(true, context, callback);
        } else {
            handlerPreOreo.toggle(true, context, callback);
        }
    }

    public void disableHotspot(ConnectionCallback callback) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            handlerOreo.toggle(false, context, callback);
        } else {
            handlerPreOreo.toggle(false, context, callback);
        }
    }

    public boolean isHotspotActive() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return handlerOreo.isHotspotActive();
        } else {
            return handlerPreOreo.isHotspotActive(context);
        }
    }

    public String getMyIP() {
        return WifiHandler.getLocalIpAddress(context);
    }

    public void startServer(OnServerSocketConnection callback) {
        thread = new Thread(() -> {
            try {
                Log.d("TAG", "Making Server");
                ServerSocket serverSocket = new ServerSocket(Constants.WIFI_FILE_SERVER_PORT);
                callback.onConnection(serverSocket);
                Log.d("TAG", "Server is started and we are waiting for the client");
                Socket socket = serverSocket.accept();
                Log.d("TAG", "Client Connected and Lets start");
                callback.onClientConnection(socket);

                /*** WE DO NOT WANT MORE THAN ONE CONNECTION ***/
                Thread.currentThread().interrupt();
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        thread.start();
    }

    public void stopServer(OnWaitForResponseCallback callback) {
        if (thread != null) {
            thread.interrupt();
        }
        callback.onResponse(null);
    }

    public void bindToWifi(NetworkBoundListener listener) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            final ConnectivityManager manager = (ConnectivityManager) context
                    .getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkRequest.Builder builder;
            builder = new NetworkRequest.Builder();
            //set the transport type do WIFI
            builder.addTransportType(NetworkCapabilities.TRANSPORT_WIFI);
            manager.requestNetwork(builder.build(), new ConnectivityManager.NetworkCallback() {
                @Override
                public void onAvailable(Network network) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        manager.bindProcessToNetwork(network);
                    } else {
                        ConnectivityManager.setProcessDefaultNetwork(network); //This method was deprecated in API level 23
                    }
                    try {
                        listener.onBound(); //do a callback or something else to alert your code that it's ok to send the message through socket now
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    manager.unregisterNetworkCallback(this);
                }
            });
        }
    }

    public void unBindToWifi() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            ConnectivityManager manager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            manager.bindProcessToNetwork(null);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            ConnectivityManager.setProcessDefaultNetwork(null);
        }
    }

    public void startReceiver(String ipAddress, OnSocketConnection callback) {
        Funny.wasWifiEnabled = WifiHandler.isWifiEnabled(context);

        Log.d("TAG", "Hotspot IP address " + ipAddress);
        thread = new Thread(() -> {
            bindToWifi(() -> {
                try {
                    InetAddress serverAddress = InetAddress.getByName(ipAddress);
                    Socket socket = new Socket(serverAddress, Constants.WIFI_FILE_SERVER_PORT);
                    Log.d("TAG", "Server Connected and Lets start");
                    callback.onConnection(socket);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        });
        thread.start();
    }

    public void stopReceiver(OnWaitForResponseCallback callback) {
        if (thread != null) {
            thread.interrupt();
        }
        unBindToWifi();
        callback.onResponse(null);
    }
}
