package com.fatafat;

public class Constants {
    public static final String SERVICE_TYPE_SEND = "sendService";
    public static final String SERVICE_TYPE_RECEIVE = "receiveService";
    public static final String APP_FOLDER_NAME = "Fatafat";

    public static final String INTENT_TRANSFER_PROGRESS = "transferProgress";
    public static final String INTENT_NOTIFY_BACKGROUND_SERVICE = "notifyBgService";
    public static final String INTENT_APP_CLOSED = "appClosed";

    public static final String PROGRESS_TRANSFER_HANDSHAKE = "transfer:handshake";
    public static final String PROGRESS_TRANSFER_START = "transfer:start";
    public static final String PROGRESS_TRANSFER_COMPLETE = "transfer:complete";
    public static final String PROGRESS_TRANSFER_HALT = "transfer:halt";
    public static final String PROGRESS_FILE_TRANSFER_START = "file:start";
    public static final String PROGRESS_FILE_TRANSFER_PROGRESS = "file:progress";
    public static final String PROGRESS_FILE_TRANSFER_COMPLETE = "file:complete";

    public static final int BUFFER_SIZE = 768;
}
