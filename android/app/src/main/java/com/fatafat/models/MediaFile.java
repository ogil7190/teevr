package com.fatafat.models;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;

public class MediaFile {
    private String name;
    private String path;
    private int size;
    private String id;
    private long date;
    private String fileType;
    private Map<String, Object> extras;

    private ReadableMap resolveExtras() {
        if( extras == null ) return null;
        WritableMap map = Arguments.createMap();

        for(String key : extras.keySet() ) {
            Object obj = extras.get( key );
            switch ( obj.getClass().getName() ){
                case "long" :
                case "int" : {
                    map.putInt(key, (int) obj );
                    break;
                }

                case "java.lang.String" : {
                    map.putString(key, (String) obj );
                    break;
                }
            }
        }
        return map;
    }

    public ReadableMap getReadableMap() {
        WritableMap map = Arguments.createMap();
        map.putString("name", name);
        map.putString("path", path);
        map.putString("type", fileType);
        map.putInt("size", size);
        map.putString("id", id);
        map.putInt("date", (int)date);
        map.putMap("extras", resolveExtras() );
        return map;
    }

    public MediaFile(String name, String path, int size, String id, long date, String fileType) {
        this.name = name;
        this.path = path;
        this.size = size;
        this.id = id;
        this.date = date;
        this.fileType = fileType;
    }

    public MediaFile() {

    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Map<String, Object> getExtras() {
        return extras;
    }

    public void setExtras(Map<String, Object> extras) {
        this.extras = extras;
    }

    public long getDate() {
        return date;
    }

    public void setDate(long date) {
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}