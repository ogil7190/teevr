package com.fatafat.utils;

import android.content.Context;
import android.content.Intent;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.fatafat.Constants;

public class AppCloseBroadcaster {

    public static void onAppClosed(Context context) {
        Intent intent = new Intent(Constants.INTENT_APP_CLOSED);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }
}
