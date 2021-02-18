package com.fatafat.models;

import android.content.Context;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.fatafat.jsModules.FileGrabber;

public class File implements Comparable<File> {
    private String path;
    private String fileType;
    private boolean isDirectory;

    public File(String path, boolean isDirectory) {
        this.path = path;
        this.isDirectory = isDirectory;
    }

    public static long getFileSize(String path) {
        java.io.File file = new java.io.File(path);
        return file.length();
    }

    public ReadableMap getReadableMap(Context context) {
        WritableMap map = Arguments.createMap();
        map.putString("type", FileGrabber.FILE_TYPE_FILE);
        map.putDouble("size", isDirectory ? 0 : getFileSize(path));
        map.putString("path", path);
        map.putBoolean("isDirectory", isDirectory);
        return map;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public boolean isDirectory() {
        return isDirectory;
    }

    public void setDirectory(boolean directory) {
        isDirectory = directory;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    @Override
    public int compareTo(File file) {
        return getPath().compareTo(file.getPath());
    }
}
