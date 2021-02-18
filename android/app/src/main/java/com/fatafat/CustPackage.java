package com.fatafat;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.fatafat.jsModules.Communicator;
import com.fatafat.jsModules.FileGrabber;
import com.fatafat.jsModules.Funny;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CustPackage implements ReactPackage {

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new FileGrabber(reactContext));
        modules.add(new Funny(reactContext));
        modules.add(new Communicator(reactContext));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
