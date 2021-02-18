package com.fatafat.models;

import java.io.Serializable;

public class FileTransfer implements Serializable, Comparable<FileTransfer> {
    private String filePath;
    private double fileLength;
    private String hash;
    private String id;
    private String fileExtension;
    private String fileName;
    private String fileType;
    private String thumbnail;

    public FileTransfer() {
    }

    public FileTransfer(String id, String filePath, String fileType, double fileLength) {
        this.id = id;
        this.filePath = filePath;
        this.fileLength = fileLength;
        this.fileType = fileType;
        handleOtherFields();
    }

    private void handleOtherFields() {
        String[] dotSplits = filePath.split("\\.");
        this.fileExtension = "." + dotSplits[dotSplits.length - 1];

        String[] slashSplits = filePath.split("/");
        String nameWithExtension = slashSplits[slashSplits.length - 1];
        this.fileName = nameWithExtension.substring(0, nameWithExtension.length() - this.fileExtension.length());

    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public double getFileLength() {
        return fileLength;
    }

    public void setFileLength(double fileLength) {
        this.fileLength = fileLength;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public String getFileExtension() {
        return fileExtension;
    }

    public void setFileExtension(String fileExtension) {
        this.fileExtension = fileExtension;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFileType() {
        return fileType;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public int compareTo(FileTransfer fileTransfer) {
        return getFileType().compareToIgnoreCase(fileTransfer.getFileType());
    }
}
