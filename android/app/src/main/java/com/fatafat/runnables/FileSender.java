package com.fatafat.runnables;

import android.content.Context;
import android.os.Environment;
import android.util.Log;

import com.fatafat.Constants;
import com.fatafat.jsModules.FileGrabber;
import com.fatafat.models.Ack;
import com.fatafat.models.FileTransfer;
import com.fatafat.models.Progress;
import com.fatafat.utils.TransferBroadcaster;
import com.google.gson.Gson;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Collections;

public class FileSender implements Runnable {
    private Socket socket;

    private ObjectOutputStream objectOutputStream;
    private ObjectInputStream objectInputStream;
    private InputStream inputStream;
    private FileInputStream fileInputStream;
    private OutputStream outputStream;
    private ArrayList<FileTransfer> filesToSend;
    private File targetFolder;
    public static final String TAG = "FileSender";
    private TransferBroadcaster broadcaster;
    private long totalSent = 0;
    private Context context;
    private String deviceInfo;

    public FileSender(Socket socket, ArrayList<FileTransfer> filesToSend, String deviceInfo, Context context) {
        this.socket = socket;
        this.context = context;
        this.filesToSend = filesToSend;
        this.deviceInfo = deviceInfo;
        this.broadcaster = new TransferBroadcaster(context);

        targetFolder = new File(Environment.getExternalStorageDirectory(), Constants.APP_FOLDER_NAME);
        Log.d("TAG Files", targetFolder.getAbsolutePath());

        if (!targetFolder.exists()) {
            targetFolder.mkdirs();
        }
    }

    private void perFormHandShake() throws Exception {
        objectOutputStream.writeObject(deviceInfo);
        objectOutputStream.flush();

        String connectionInfo = (String) objectInputStream.readObject();
        this.broadcaster.onHandShake(connectionInfo);
    }

    @Override
    public void run() {
        try {
            inputStream = socket.getInputStream();
            outputStream = socket.getOutputStream();

            objectOutputStream = new ObjectOutputStream(outputStream);
            objectInputStream = new ObjectInputStream(inputStream);

            perFormHandShake(); /* SHARE DEVICE INFO BEFORE PROCEEDING */

            Collections.sort(filesToSend);

            for (int i = 0; i < filesToSend.size(); i++) {
                String base64 = FileGrabber.getThumbnailForType(filesToSend.get(i), context);
                filesToSend.get(i).setThumbnail(base64);
            }

            String filesJSON = new Gson().toJson(filesToSend);
            Log.d("TAG", filesJSON);

            objectOutputStream.writeObject(filesJSON);
            objectOutputStream.flush();

            broadcaster.onTransferStart(filesToSend);
            totalSent = 0;

            for (FileTransfer fileTransfer : filesToSend) {
                broadcaster.onFileTransferStart(fileTransfer.getFilePath());
                writeFileToSocket(fileTransfer);
                broadcaster.onFileTransferComplete("");
            }

            waitForAck(); /* BEFORE CLOSING CONNECTION WAIT FOR ACK */

            broadcaster.onTransferComplete();

            objectOutputStream.close();
            outputStream.close();
            objectInputStream.close();
            inputStream.close();
            fileInputStream.close();
            socket.close();

            socket = null;
            objectOutputStream = null;
            outputStream = null;

            Thread.sleep(3000);
            broadcaster.notifyBgThreadDone();

        } catch (Exception e) {
            e.printStackTrace();
            broadcaster.onDisconnect();
        }
    }

    private void writeFileToSocket(FileTransfer fileTransfer) throws Exception {
        Log.d("TAG", "Writing file to Socket");
        fileInputStream = new FileInputStream(new File(fileTransfer.getFilePath()));

        byte buffer[] = new byte[Constants.BUFFER_SIZE];
        int len;

        long fileSize = (long) fileTransfer.getFileLength(); //File size
        double progress = 0; // Current transmission progress
        long total = 0; //The total number of transferred bytes
        long tempTime = System.currentTimeMillis(); // Cache - the time when the update progress
        long tempTotal = 0; // Cache - the total number of bytes transferred when the update progress
        double speed = 0; //Transmission rate (Kb/s)
        double remainingTime = 0; // Estimated remaining completion time (seconds)

        while ((len = fileInputStream.read(buffer)) != -1) {
            outputStream.write(buffer, 0, len);
            totalSent += len;
            total += len;

            long time = System.currentTimeMillis() - tempTime;

            if (time > 800) { //Update the transfer rate and transfer progress every second

                progress = (total * 100) / fileSize; // Current transmission progress
                speed = ((total - tempTotal) / 1024.0 / (time / 1000.0)); // Calculate the transmission rate, byte to Kb, milliseconds to seconds
                remainingTime = (fileSize - total) / 1024.0 / speed; // Estimated remaining completion time

                Log.e(TAG, "---------------------------");
                Log.e(TAG, "Transfer progress: " + progress);
                Log.e(TAG, "Time Change:" + time / 1000.0);
                Log.e(TAG, "Byte change:" + (total - tempTotal));
                Log.e(TAG, "Transmission rate:" + speed);
                Log.e(TAG, "Estimated remaining completion time:" + remainingTime);
                Log.e(TAG, "---------------------------");

                Progress _progress = new Progress(progress, speed, remainingTime, totalSent);
                broadcaster.onFileTransferProgress(_progress);

                tempTotal = total; // Cache - the total number of bytes transferred when the update progress

                tempTime = System.currentTimeMillis(); // Cache - the time when the update progress
            }
        }
        outputStream.flush();

        Progress _progress = new Progress(progress, speed, remainingTime, totalSent);
        broadcaster.onFileTransferProgress(_progress);
        fileInputStream.close();
    }

    private void waitForAck() throws Exception {
        Log.d("TAG", "Waiting for ACK");
        Ack ack = new Gson().fromJson((String) objectInputStream.readObject(), Ack.class);
        Log.d("TAG", "Files Sent Successfully : " + ack.isOkay());
    }
}
