package com.fatafat.jsModules;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.webkit.MimeTypeMap;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.fatafat.BuildConfig;
import com.fatafat.Constants;
import com.fatafat.models.AppFile;
import com.fatafat.models.FileTransfer;
import com.fatafat.models.MediaFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FileGrabber extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;
    public static final String FILE_TYPE_IMAGE = "image";
    public static final String FILE_TYPE_VIDEO = "video";
    public static final String FILE_TYPE_AUDIO = "audio";
    public static final String FILE_TYPE_APP = "app";
    public static final String FILE_TYPE_FILE = "file";

    public FileGrabber(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.makeFolders();
    }

    @ReactMethod
    public void makeFolders() {
        File root = new File(Environment.getExternalStorageDirectory(), Constants.APP_FOLDER_NAME);
        if (!root.exists()) {
            root.mkdir();
        }

        File apps = new File(root, "Apps");
        if (!apps.exists()) {
            apps.mkdir();
        }
        File images = new File(root, "Images");
        if (!images.exists()) {
            images.mkdir();
        }
        File videos = new File(root, "Videos");
        if (!videos.exists()) {
            videos.mkdir();
        }
        File audios = new File(root, "Audios");
        if (!audios.exists()) {
            audios.mkdir();
        }
        File files = new File(root, "Files");
        if (!files.exists()) {
            files.mkdir();
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "FileGrabber";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        final Map<String, Object> fileTypes = new HashMap<>();
        fileTypes.put("FILE_TYPE_APPS", FILE_TYPE_APP);
        fileTypes.put("FILE_TYPE_AUDIO", FILE_TYPE_AUDIO);
        fileTypes.put("FILE_TYPE_FILE", FILE_TYPE_FILE);
        fileTypes.put("FILE_TYPE_IMAGE", FILE_TYPE_IMAGE);
        fileTypes.put("FILE_TYPE_VIDEO", FILE_TYPE_VIDEO);

        constants.put("fileTypes", fileTypes);
        return constants;
    }

    public static String getImageThumbnail(String _id, Context context) {
        try {
            long id = Long.parseLong(_id);
            String[] thumbColumns = {MediaStore.Images.Thumbnails.DATA};
            Cursor thumbCursor = context.getContentResolver().query(
                    MediaStore.Images.Thumbnails.EXTERNAL_CONTENT_URI,
                    thumbColumns,
                    MediaStore.Images.Thumbnails.IMAGE_ID + " = " + id,
                    null, null);

            if (thumbCursor.moveToFirst()) {
                String thumbPath = thumbCursor.getString(0);
                return thumbPath;
            }
        } catch (Exception e){
            e.printStackTrace();
        }

        return null;
    }


    public static String getVideoThumbnail(String _id, Context context) {
        try {
            long id = Long.parseLong(_id);
            MediaStore.Video.Thumbnails.getThumbnail(context.getContentResolver(),
                    id, MediaStore.Video.Thumbnails.MICRO_KIND, null);

            String[] thumbColumns = {MediaStore.Video.Thumbnails.DATA};
            Cursor thumbCursor = context.getContentResolver().query(
                    MediaStore.Video.Thumbnails.EXTERNAL_CONTENT_URI,
                    thumbColumns,
                    MediaStore.Video.Thumbnails.VIDEO_ID + " = " + id,
                    null, null);

            if (thumbCursor.moveToFirst()) {
                String thumbPath = thumbCursor.getString(0);
                return thumbPath;
            }
        } catch (Exception e){
            e.printStackTrace();
        }

        return null;
    }

    private String getAudioThumbnail(String _id) {
        Cursor thumbCursor = reactContext.getContentResolver().query(
                MediaStore.Audio.Albums.EXTERNAL_CONTENT_URI,
                new String[]{MediaStore.Audio.Albums._ID, MediaStore.Audio.Albums.ALBUM_ART},
                MediaStore.Audio.Albums._ID + "=?",
                new String[]{_id},
                null);

        if (thumbCursor.moveToFirst()) {
            String thumbPath = thumbCursor.getString(0);
            return thumbPath;
        }

        return null;
    }


    @ReactMethod
    public void getImages(Callback onSuccess) {
        new Thread(() -> {
            Map<String, Object> buckets = new HashMap<>();
            List<Object> orderedImages = new ArrayList<>();
            buckets.put("withOrder", orderedImages);

            // which image properties are we querying
            String[] PROJECTION_BUCKET = {
                    MediaStore.Images.Media._ID,
                    MediaStore.Images.Media.SIZE,
                    MediaStore.Images.ImageColumns.BUCKET_ID,
                    MediaStore.Images.ImageColumns.BUCKET_DISPLAY_NAME,
                    MediaStore.Images.ImageColumns.DATE_MODIFIED,
                    MediaStore.Images.ImageColumns.DATE_TAKEN,
                    MediaStore.Images.ImageColumns.DATE_ADDED,
                    MediaStore.Images.ImageColumns.DATA};
            // We want to order the albums by reverse chronological order. We abuse the
            // "WHERE" parameter to insert a "GROUP BY" clause into the SQL statement.
            // The template for "WHERE" parameter is like:
            //    SELECT ... FROM ... WHERE (%s)
            // and we make it look like:
            //    SELECT ... FROM ... WHERE (1) GROUP BY 1,(2)
            // The "(1)" means true. The "1,(2)" means the first two columns specified
            // after SELECT. Note that because there is a ")" in the template, we use
            // "(2" to match it.
            String BUCKET_GROUP_BY =
                    "";
            String BUCKET_ORDER_BY = "date_modified DESC";

            Uri images = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;

            Cursor cur = reactContext.getContentResolver().query(images, PROJECTION_BUCKET, null, null, BUCKET_ORDER_BY);

            Log.d("Images", "count=" + cur.getCount());

            if (cur.moveToFirst()) {
                String bucket;
                String data;
                int size;
                long id;
                long date;
                String bucketId;
                boolean hasKey;

                int idColumn = cur.getColumnIndex(MediaStore.Images.Media._ID);
                int bucketColumn = cur.getColumnIndex(MediaStore.Images.Media.BUCKET_DISPLAY_NAME);
                int bucketIdColumn = cur.getColumnIndex(MediaStore.Images.Media.BUCKET_ID);
                int dataColumn = cur.getColumnIndex(MediaStore.Images.Media.DATA);
                int sizeColumn = cur.getColumnIndex(MediaStore.Images.Media.SIZE);
                int dateColumn = cur.getColumnIndex(MediaStore.Images.Media.DATE_MODIFIED);

                do {
                    bucketId = cur.getString(bucketIdColumn);
                    bucket = cur.getString(bucketColumn);
                    data = cur.getString(dataColumn);
                    id = cur.getLong(idColumn);
                    size = Integer.parseInt(cur.getString(sizeColumn));
                    date = cur.getLong(dateColumn);

                    hasKey = buckets.containsKey(bucketId);

                    MediaFile orderedImage = new MediaFile(null, data, size, "" + id, date, FILE_TYPE_IMAGE);
                    orderedImages.add(orderedImage.getReadableMap());

                    if (!hasKey) {
                        Map<String, Object> currentBucket = new HashMap<>();
                        currentBucket.put("name", bucket);
                        currentBucket.put("count", 1);

                        MediaFile file = new MediaFile(null, data, size, "" + id, date, FILE_TYPE_IMAGE);

                        List<Object> currImages = new ArrayList<>();
                        currImages.add(file.getReadableMap());
                        currentBucket.put("images", currImages);
                        buckets.put(bucketId, currentBucket);
                    } else {
                        Map<String, Object> thisBucket = (Map) buckets.get(bucketId);
                        int count = (int) thisBucket.get("count");
                        thisBucket.put("count", count + 1);

                        MediaFile file = new MediaFile(null, data, size, "" + id, date, FILE_TYPE_IMAGE);

                        List<Object> currImages = (List) thisBucket.get("images");
                        currImages.add(file.getReadableMap());
                        thisBucket.put("images", currImages);
                        buckets.put(bucketId, thisBucket);
                    }
                } while (cur.moveToNext());
            }
            ReadableMap res = Arguments.makeNativeMap(buckets);
            onSuccess.invoke(res);
        }).start();
    }

    @ReactMethod
    public void getVideos(Callback onSuccess) {
        new Thread(new Runnable() {
            @Override
            public void run() {

                Map<String, Object> buckets = new HashMap<>();
                List<Object> orderedVideos = new ArrayList<>();
                buckets.put("withOrder", orderedVideos);

                // which image properties are we querying
                String[] PROJECTION_BUCKET = {
                        MediaStore.Video.Media._ID,
                        MediaStore.Video.Media.SIZE,
                        MediaStore.Video.VideoColumns.BUCKET_ID,
                        MediaStore.Video.VideoColumns.BUCKET_DISPLAY_NAME,
                        MediaStore.Video.VideoColumns.DATE_MODIFIED,
                        MediaStore.Video.VideoColumns.DATE_TAKEN,
                        MediaStore.Video.VideoColumns.DATE_ADDED,
                        MediaStore.Video.VideoColumns.DATA};
                // We want to order the albums by reverse chronological order. We abuse the
                // "WHERE" parameter to insert a "GROUP BY" clause into the SQL statement.
                // The template for "WHERE" parameter is like:
                //    SELECT ... FROM ... WHERE (%s)
                // and we make it look like:
                //    SELECT ... FROM ... WHERE (1) GROUP BY 1,(2)
                // The "(1)" means true. The "1,(2)" means the first two columns specified
                // after SELECT. Note that because there is a ")" in the template, we use
                // "(2" to match it.
                String BUCKET_GROUP_BY =
                        "";
                String BUCKET_ORDER_BY = "date_modified DESC";

                Uri videos = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;

                Cursor cur = reactContext.getContentResolver().query(videos, PROJECTION_BUCKET, null, null, BUCKET_ORDER_BY);

                Log.d("Videos", "count=" + cur.getCount());

                if (cur.moveToFirst()) {
                    String bucket;
                    String data;
                    int size;
                    long id;
                    long date;
                    String bucketId;
                    boolean hasKey;

                    int idColumn = cur.getColumnIndex(MediaStore.Video.Media._ID);
                    int bucketColumn = cur.getColumnIndex(MediaStore.Video.Media.BUCKET_DISPLAY_NAME);
                    int bucketIdColumn = cur.getColumnIndex(MediaStore.Video.Media.BUCKET_ID);
                    int dataColumn = cur.getColumnIndex(MediaStore.Video.Media.DATA);
                    int sizeColumn = cur.getColumnIndex(MediaStore.Video.Media.SIZE);
                    int dateColumn = cur.getColumnIndex(MediaStore.Video.Media.DATE_MODIFIED);

                    do {
                        bucketId = cur.getString(bucketIdColumn);
                        bucket = cur.getString(bucketColumn);
                        data = cur.getString(dataColumn);
                        id = cur.getLong(idColumn);
                        size = Integer.parseInt(cur.getString(sizeColumn));
                        date = cur.getLong(dateColumn);

                        hasKey = buckets.containsKey(bucketId);

                        MediaFile orderedVideo = new MediaFile(null, data, size, "" + id, date, FILE_TYPE_VIDEO);
                        orderedVideos.add(orderedVideo.getReadableMap());

                        if (!hasKey) {
                            Map<String, Object> currentBucket = new HashMap<>();
                            currentBucket.put("name", bucket);
                            currentBucket.put("count", 1);

                            MediaFile file = new MediaFile(null, data, size, "" + id, date, FILE_TYPE_VIDEO);

                            List<Object> currVideos = new ArrayList<>();
                            currVideos.add(file.getReadableMap());
                            currentBucket.put("videos", currVideos);
                            buckets.put(bucketId, currentBucket);
                        } else {
                            Map<String, Object> thisBucket = (Map) buckets.get(bucketId);
                            int count = (int) thisBucket.get("count");
                            thisBucket.put("count", count + 1);

                            MediaFile file = new MediaFile(null, data, size, "" + id, date, FILE_TYPE_VIDEO);

                            List<Object> currVideos = (List) thisBucket.get("videos");
                            currVideos.add(file.getReadableMap());
                            thisBucket.put("videos", currVideos);
                            buckets.put(bucketId, thisBucket);
                        }
                    } while (cur.moveToNext());
                }

                onSuccess.invoke(Arguments.makeNativeMap(buckets));

            }
        }).start();
    }

    @ReactMethod
    public void getAudios(Callback onSuccess) {
        new Thread(() -> {
            Map<String, Object> buckets = new HashMap<>();
            List<Object> orderedAudios = new ArrayList<>();
            buckets.put("withOrder", orderedAudios);

            // which image properties are we querying
            String[] PROJECTION_BUCKET = {
                    MediaStore.Audio.Media._ID,
                    MediaStore.Audio.Media.SIZE,
                    MediaStore.Audio.Media.DURATION,
                    MediaStore.Audio.Media.TITLE,
                    MediaStore.Audio.Media.DISPLAY_NAME,
                    MediaStore.Audio.Media.DATE_MODIFIED,
                    MediaStore.Audio.Media.DATE_ADDED,
                    MediaStore.Audio.Media.DATA};

            String BUCKET_ORDER_BY = "date_modified DESC";

            Uri audios = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;

            Cursor cur = reactContext.getContentResolver().query(audios, PROJECTION_BUCKET, null, null, BUCKET_ORDER_BY);

            Log.d("Audios", "count=" + cur.getCount());

            if (cur.moveToFirst()) {
                String data, title;
                int size, duration;
                long id, date;

                int idColumn = cur.getColumnIndex(MediaStore.Audio.Media._ID);
                int dataColumn = cur.getColumnIndex(MediaStore.Audio.Media.DATA);
                int sizeColumn = cur.getColumnIndex(MediaStore.Audio.Media.SIZE);
                int displayNameColumn = cur.getColumnIndex(MediaStore.Audio.Media.DISPLAY_NAME);
                int titleColumn = cur.getColumnIndex(MediaStore.Audio.Media.TITLE);
                int durationColumn = cur.getColumnIndex(MediaStore.Audio.Media.DURATION);
                int dateColumn = cur.getColumnIndex(MediaStore.Images.Media.DATE_MODIFIED);

                do {
                    data = cur.getString(dataColumn);
                    id = cur.getLong(idColumn);
                    size = Integer.parseInt(cur.getString(sizeColumn));
                    date = cur.getLong(dateColumn);
                    title = cur.getString(titleColumn);
                    if (title == null || title.equals("")) {
                        title = cur.getString(displayNameColumn);
                    }
                    duration = cur.getInt(durationColumn);

                    MediaFile orderedAudio = new MediaFile(null, data, size, "" + id, date, FILE_TYPE_AUDIO);
                    Map<String, Object> extras = new HashMap<>();
                    extras.put("title", title);
                    extras.put("duration", duration);
                    orderedAudio.setExtras(extras);
                    orderedAudios.add(orderedAudio.getReadableMap());
                } while (cur.moveToNext());
            }

            onSuccess.invoke(Arguments.makeNativeMap(buckets));
        }).start();
    }

    @NonNull
    static private Bitmap getBitmapFromDrawable(@NonNull Drawable drawable) {
        final Bitmap bmp = Bitmap.createBitmap(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
        final Canvas canvas = new Canvas(bmp);
        drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
        drawable.draw(canvas);
        return bmp;
    }

    public void getApps(Callback callback) {
        new Thread(() -> {
            Map<String, Object> buckets = new HashMap<>();
            List<AppFile> apps = new ArrayList<>();
            List<Object> orderedApps = new ArrayList<>();
            buckets.put("withOrder", orderedApps);

            String packageName, appName, appLocation;
            long sizeInBytes, installDate;
            File file;

            final PackageManager pm = reactContext.getPackageManager();
            List<ApplicationInfo> packages = pm.getInstalledApplications(PackageManager.GET_META_DATA);
            for (ApplicationInfo packageInfo : packages) {
                boolean isSystemApp = ((packageInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0);
                if (isSystemApp) continue;

                packageName = packageInfo.packageName;
                appLocation = packageInfo.sourceDir;
                appName = packageInfo.loadLabel(pm).toString();

                file = new File(packageInfo.sourceDir);
                sizeInBytes = file.length();

                try {
                    installDate = pm.getPackageInfo(packageInfo.packageName, 0).firstInstallTime;
                } catch (PackageManager.NameNotFoundException e) {
                    installDate = 0L;
                    e.printStackTrace();
                }


                AppFile app = new AppFile(appName, packageName, appLocation, sizeInBytes, installDate);
                apps.add(app);
            }
            Collections.sort(apps);

            for (AppFile app : apps) {
                orderedApps.add(app.getReadableMap());
            }

            callback.invoke(Arguments.makeNativeMap(buckets));
        }).start();
    }

    @ReactMethod
    public void getThumbnailFromApk(String path, Callback onSuccess) {
        Drawable drawable = getDrawableIconFromLocalAPK(path);
        Bitmap map = getBitmapFromDrawable(drawable);
        String encoded = getBase64StringFromBitmap(map);
        onSuccess.invoke(encoded);
    }

    public Drawable getDrawableIconFromLocalAPK(String apk) {
        PackageManager pm = reactContext.getPackageManager();
        PackageInfo pi = pm.getPackageArchiveInfo(apk, 0);

        pi.applicationInfo.sourceDir = apk;
        pi.applicationInfo.publicSourceDir = apk;

        Drawable icon = pi.applicationInfo.loadIcon(pm);
        return icon;
    }

    public void getFiles(String folderPath, Callback callback) {
        new Thread(() -> {
            Map<String, Object> buckets = new HashMap<>();
            List<com.fatafat.models.File> files = new ArrayList<>();
            List<Object> orderedFiles = new ArrayList<>();
            buckets.put("withOrder", orderedFiles);
            File root;
            if (folderPath != null) {
                root = new File(folderPath);
                buckets.put("root", folderPath);
            } else {
                root = Environment.getExternalStorageDirectory();
                buckets.put("root", root.getAbsolutePath());
            }

            if (root.isDirectory()) {
                File[] dirFiles = root.listFiles(file -> !file.isHidden());
                for (File file : dirFiles) {
                    files.add(new com.fatafat.models.File(file.getAbsolutePath(), file.isDirectory()));
                }

                Collections.sort(files);
                for (com.fatafat.models.File file : files) {
                    orderedFiles.add(file.getReadableMap(reactContext));
                }
            }

            callback.invoke(Arguments.makeNativeMap(buckets));
        }).start();
    }

    public static String getBase64StringFromBitmap(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
        return encoded;
    }

    public static String getAppThumbnail(String id, Context context) {
        try {
            Drawable icon = context.getPackageManager().getApplicationIcon(id);
            Bitmap iconBitmap = getBitmapFromDrawable(icon);
            return getBase64StringFromBitmap(iconBitmap);
        } catch (Exception e) {

        }
        return null;
    }

    @ReactMethod
    public void getAppThumbnail(String id, Callback onSuccess) {
        String encoded = getAppThumbnail(id, reactContext);
        onSuccess.invoke(encoded);
    }

    @ReactMethod
    public void getImageThumbnail(String id, Callback onSuccess, Callback onError) {
        String uri = getImageThumbnail(id, reactContext);
        if (uri != null) {
            onSuccess.invoke(uri);
        } else {
            onError.invoke();
        }
    }

    @ReactMethod
    public void getVideoThumbnail(String id, Callback onSuccess, Callback onError) {
        String uri = getVideoThumbnail(id, reactContext);
        if (uri != null) {
            onSuccess.invoke(uri);
        } else {
            onError.invoke();
        }
    }

    @ReactMethod
    public void getAudioThumbnail(String id, Callback onSuccess, Callback onError) {
        String uri = getAudioThumbnail(id);
        if (uri != null) {
            onSuccess.invoke(uri);
        } else {
            onError.invoke();
        }
    }

    public static String getImageFromFile(String path) {
        Bitmap bm = BitmapFactory.decodeFile(path);
        ByteArrayOutputStream bOut = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.JPEG, 100, bOut);
        String base64Image = Base64.encodeToString(bOut.toByteArray(), Base64.DEFAULT);
        return base64Image;
    }

    public static String getThumbnailForType(FileTransfer fileTransfer, Context context) {
        String type = fileTransfer.getFileType();
        String id = fileTransfer.getId();

        switch (type) {
            case FILE_TYPE_IMAGE: {
                String uri = getImageThumbnail(id, context);
                String base64 = getImageFromFile(uri);
                return base64;
            }
            case FILE_TYPE_VIDEO: {
                String uri = getVideoThumbnail(id, context);
                String base64 = getImageFromFile(uri);
                return base64;
            }
            case FILE_TYPE_APP: {
                return getAppThumbnail(id, context);
            }
        }
        return null;
    }

    @ReactMethod
    public void getThumbnailForType(String type, String id, Callback onSuccess) {
        switch (type) {
            case FILE_TYPE_IMAGE: {
                String uri = getImageThumbnail(id, reactContext);
                onSuccess.invoke(uri);
                break;
            }
            case FILE_TYPE_VIDEO: {
                String uri = getVideoThumbnail(id, reactContext);
                onSuccess.invoke(uri);
                break;
            }
            case FILE_TYPE_AUDIO: {
                String uri = getAudioThumbnail(id);
                onSuccess.invoke(uri);
                break;
            }
            case FILE_TYPE_APP: {
                getAppThumbnail(id, onSuccess);
                break;
            }
            default: {
                onSuccess.invoke("{}");
            }
        }
    }

    @ReactMethod
    public void customFilesOfType(String fileType, String param, Callback onSuccess) {
        switch (fileType) {
            case FILE_TYPE_FILE: {
                getFiles(param, onSuccess);
                break;
            }

            default: {
                onSuccess.invoke("{}");
            }
        }
    }

    @ReactMethod
    public void getFilesOfType(String fileType, Callback onSuccess) {
        try {
            switch (fileType) {
                case FILE_TYPE_IMAGE: {
                    getImages(onSuccess);
                    break;
                }

                case FILE_TYPE_VIDEO: {
                    getVideos(onSuccess);
                    break;
                }

                case FILE_TYPE_AUDIO: {
                    getAudios(onSuccess);
                    break;
                }

                case FILE_TYPE_APP: {
                    getApps(onSuccess);
                    break;
                }

                case FILE_TYPE_FILE: {
                    getFiles(null, onSuccess);
                    break;
                }

                default: {
                    onSuccess.invoke("{}");
                }
            }
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    private String fileExt(String url) {
        if (url.indexOf("?") > -1) {
            url = url.substring(0, url.indexOf("?"));
        }
        if (url.lastIndexOf(".") == -1) {
            return null;
        } else {
            String ext = url.substring(url.lastIndexOf(".") + 1);
            if (ext.indexOf("%") > -1) {
                ext = ext.substring(0, ext.indexOf("%"));
            }
            if (ext.indexOf("/") > -1) {
                ext = ext.substring(0, ext.indexOf("/"));
            }
            return ext.toLowerCase();

        }
    }

    @ReactMethod
    public void doesAppFolderExists(Callback onSuccess, Callback onFailure) {
        File file = new File(Environment.getExternalStorageDirectory(), Constants.APP_FOLDER_NAME);
        doesFolderExists(file.getAbsolutePath(), onSuccess, onFailure);
    }

    @ReactMethod
    public void doesFolderExists(String folderPath, Callback onSuccess, Callback onFailure) {
        File file = new File(folderPath);
        if (file.exists()) {
            if (file.isDirectory()) {
                onSuccess.invoke(folderPath);
            } else {
                onSuccess.invoke(false);
            }
        } else {
            onFailure.invoke();
        }
    }

    public void openApk(File file) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            Uri apkUri = FileProvider.getUriForFile(reactContext, BuildConfig.APPLICATION_ID + ".provider", file);
            Intent intent = new Intent(Intent.ACTION_INSTALL_PACKAGE);
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            reactContext.getCurrentActivity().startActivity(intent);
        } else {
            Uri apkUri = Uri.fromFile(file);
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.getCurrentActivity().startActivity(intent);
        }
    }

    @ReactMethod
    public void deleteFile(String path) {
        File file = new File(path);
        if (file.exists()) {
            file.delete();
        }
    }

    @ReactMethod
    public void triggerViewFile(String file) {
        if (file.contains(".apk")) {
            openApk(new File(file));
        } else {
            MimeTypeMap myMime = MimeTypeMap.getSingleton();
            Intent newIntent = new Intent(Intent.ACTION_VIEW);
            String mimeType = myMime.getMimeTypeFromExtension(fileExt(file).substring(1));
            Log.d("TAG", "Mime Type " + mimeType);
            newIntent.setDataAndType(FileProvider.getUriForFile(reactContext, reactContext.getApplicationContext().getPackageName() + ".provider", new File(file)), mimeType);
            newIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            newIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            try {
                reactContext.startActivity(newIntent);
            } catch (ActivityNotFoundException e) {
                Toast.makeText(reactContext, "No app for this type of file.", Toast.LENGTH_LONG).show();
            }
        }
    }
}
