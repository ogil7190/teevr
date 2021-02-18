package com.fatafat.runnables;

import android.content.Context;
import android.os.Environment;
import android.util.Log;

import com.fatafat.Constants;
import com.fatafat.models.Ack;
import com.fatafat.models.FileTransfer;
import com.fatafat.models.Progress;
import com.fatafat.utils.TransferBroadcaster;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.util.ArrayList;

public class FileReceiver implements Runnable {
    private Socket socket;
    private ObjectOutputStream objectOutputStream;
    private ObjectInputStream objectInputStream;
    private TransferBroadcaster broadcaster;
    private FileOutputStream fileOutputStream;
    private OutputStream outputStream;
    private InputStream inputStream;
    private ArrayList<FileTransfer> filesToReceive;
    private File targetFolder;
    private long totalSent = 0;
    private String deviceInfo;

    public static final String TAG = "FileReceiver";

    public FileReceiver(Socket socket, String deviceInfo, Context context) {
        this.socket = socket;
        this.deviceInfo = deviceInfo;
        this.filesToReceive = new ArrayList<>();
        this.broadcaster = new TransferBroadcaster(context);

        targetFolder = new File(Environment.getExternalStorageDirectory(), Constants.APP_FOLDER_NAME);
        Log.d("TAG Files", targetFolder.getAbsolutePath());

        if (!targetFolder.exists()) {
            targetFolder.mkdirs();
        }
    }

    private void perFormHandShake() throws Exception {
        String deviceInfo = (String) objectInputStream.readObject();
        objectOutputStream.writeObject(this.deviceInfo);
        objectOutputStream.flush();
        this.broadcaster.onHandShake(deviceInfo);
    }

    @Override
    public void run() {
        try {
            inputStream = socket.getInputStream();
            outputStream = socket.getOutputStream();

            objectInputStream = new ObjectInputStream(inputStream);
            objectOutputStream = new ObjectOutputStream(outputStream);

            perFormHandShake(); /* SHARE DEVICE INFO BEFORE PROCEEDING */

            String filesJSON = (String) objectInputStream.readObject();
            Log.d("TAG", "Files JSON " + filesJSON);
            filesToReceive = new Gson().fromJson(filesJSON, new TypeToken<ArrayList<FileTransfer>>() {
            }.getType());

            Log.d("TAG", "Files Count " + filesToReceive.size());

            broadcaster.onTransferStart(filesToReceive);
            totalSent = 0;

            for (FileTransfer fileTransfer : filesToReceive) {
                broadcaster.onFileTransferStart(fileTransfer.getFilePath());
                String path = readAndSaveFileFromSocket(fileTransfer);
                Log.d("TAG", "File is Saved at :" + path);
                broadcaster.onFileTransferComplete(path);
            }

            broadcaster.onTransferComplete();

            sendAck();

            fileOutputStream.close();
            objectInputStream.close();
            inputStream.close();

            objectOutputStream.close();
            outputStream.close();

            socket.close();
            socket = null;
            objectInputStream = null;
            inputStream = null;

            Thread.sleep(3000);
            broadcaster.notifyBgThreadDone();

        } catch (Exception e) {
            e.printStackTrace();
            broadcaster.onDisconnect();
        }
    }

    private String readAndSaveFileFromSocket(FileTransfer fileTransfer) throws IOException {
        Log.d("TAG", "File Name " + fileTransfer.getFileName());
        String FOLDER;

        if (fileTransfer.getFileExtension().equals(".apk")) {
            FOLDER = "Apps";
        } else {
            FOLDER = (fileTransfer.getFileType().substring(0, 1).toUpperCase() + fileTransfer.getFileType().substring(1)) + "s";
        }


        File file = new File(targetFolder, FOLDER + "/" + fileTransfer.getFileName() + fileTransfer.getFileExtension());
        file.mkdirs();

        if (file.exists()) {
            file.delete(); /* OVERWRITE EXISTING FILE */  /* PUT SOME LOGIC HERE, THIS IS BRUTAL UX */
        }

        fileOutputStream = new FileOutputStream(file);

        byte buffer[] = new byte[Constants.BUFFER_SIZE];
        int len;
        long fileSize = (long) fileTransfer.getFileLength(); //File size
        double progress = 0; // Current transmission progress

        long remainingBytes = fileSize;
        long total = 0; //The total number of transferred bytes

        long tempTime = System.currentTimeMillis(); // Cache - the time when the update progress
        long tempTotal = 0; // Cache - the total number of bytes transferred when the update progress

        double speed = 0; //Transmission rate (Kb/s)
        double remainingTime = 0; // Estimated remaining completion time (seconds)

        while (remainingBytes > 0 && (len = inputStream.read(buffer, 0, (int) Math.min(Constants.BUFFER_SIZE, remainingBytes) ) ) != -1) {
            fileOutputStream.write(buffer, 0, len);

            totalSent += len;
            total += len;

            remainingBytes = fileSize - total;
            long time = System.currentTimeMillis() - tempTime;

            if (time >= 1000) { //Update the transfer rate and transfer progress every second
                progress = (total * 100) / fileSize; // Current transmission progress
                Log.e(TAG, "---------------------------");
                Log.e(TAG, "Transfer progress in percent: " + progress);
                Log.e(TAG, "Time Change in second since last:" + time / 1000.0);
                Log.e(TAG, "Byte transfer in above changed time:" + (total - tempTotal));

                speed = ((total - tempTotal) / 1024.0 / (time / 1000.0)); // Calculate the transmission rate, byte to Kb, milliseconds to seconds

                remainingTime = (fileSize - total) / 1024.0 / speed; // Estimated remaining completion time
                Log.e(TAG, "Transmission rate in Kbps:" + speed);
                Log.e(TAG, "Estimated remaining completion time:" + remainingTime);

                Progress _progress = new Progress(progress, speed, remainingTime, totalSent);
                broadcaster.onFileTransferProgress(_progress);

                tempTotal = total; // Cache - the total number of bytes transferred when the update progress

                tempTime = System.currentTimeMillis(); // Cache - the time when the update progress
            }
        }

        Progress _progress = new Progress(progress, speed, remainingTime, totalSent);
        broadcaster.onFileTransferProgress(_progress);
        fileOutputStream.close();
        return file.getAbsolutePath();
    }

    private void sendAck() throws IOException {
        Log.d("TAG", "Sending ACK");
        Ack ack = new Ack(true);
        objectOutputStream.writeObject(new Gson().toJson(ack));
        objectOutputStream.flush();
    }
}
