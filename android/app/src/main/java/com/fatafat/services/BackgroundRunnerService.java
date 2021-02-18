package com.fatafat.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.fatafat.Constants;
import com.fatafat.MainActivity;
import com.fatafat.R;
import com.fatafat.jsModules.Communicator;
import com.fatafat.jsModules.Funny;
import com.fatafat.models.FileTransfer;
import com.fatafat.runnables.FileReceiver;
import com.fatafat.runnables.FileSender;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.ArrayList;

import static com.fatafat.Constants.INTENT_APP_CLOSED;
import static com.fatafat.Constants.INTENT_NOTIFY_BACKGROUND_SERVICE;

public class BackgroundRunnerService extends Service {
    public static final String CHANNEL_ID = "BackgroundRunnerService";
    private Thread worker;

    private BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (worker != null) {
                worker.interrupt();
                worker = null;
                Communicator.isCommunicating = false;
                stopSelf();
            }
        }
    };

    private BroadcastReceiver appClosedReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (worker != null) {
                worker.interrupt();
                worker = null;
                Communicator.isCommunicating = false;
                stopSelf();
            }
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        LocalBroadcastManager.getInstance(this).registerReceiver(broadcastReceiver, new IntentFilter(INTENT_NOTIFY_BACKGROUND_SERVICE));
        LocalBroadcastManager.getInstance(this).registerReceiver(appClosedReceiver, new IntentFilter(INTENT_APP_CLOSED));
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String input = intent.getStringExtra("serviceText");
        String type = intent.getStringExtra("actionType");
        String metaData = intent.getStringExtra("metaData");
        String intentData = intent.getStringExtra("intentData");

        createNotificationChannel();

        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, 0);
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(getString(R.string.app_name) + " is Running...")
                .setContentText(input)
                .setSmallIcon(R.mipmap.ic_launcher_round)
                .setContentIntent(pendingIntent)
                .build();
        startForeground(1, notification);
        startServiceOfType(type, intentData, metaData);
        return START_NOT_STICKY;
    }

    private void startServiceOfType(String type, String intentData, String metaData) {
        switch (type) {
            case Constants.SERVICE_TYPE_RECEIVE: {
                FileReceiver fileReceiver = new FileReceiver(Funny.receiver, metaData, getApplicationContext());
                worker = new Thread(fileReceiver);
                worker.start();
                break;
            }
            case Constants.SERVICE_TYPE_SEND: {
                ArrayList<FileTransfer> filesToSend = new Gson().fromJson(intentData, new TypeToken<ArrayList<FileTransfer>>() {
                }.getType());
                FileSender fileSender = new FileSender(Funny.sender, filesToSend, metaData, getApplicationContext());
                worker = new Thread(fileSender);
                worker.start();
                break;
            }
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Communicator.isCommunicating = false;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "BackgroundRunnerService Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }
}