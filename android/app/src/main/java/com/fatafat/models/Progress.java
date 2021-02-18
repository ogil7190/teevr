package com.fatafat.models;

public class Progress {
    private double progressInPercent;
    private double speedInKbps;
    private double estimatedTimeInSeconds;
    private long totalSent;

    public Progress(double progressInPercent, double speedInKbps, double estimatedTimeInSeconds, long totalSent) {
        this.progressInPercent = progressInPercent;
        this.speedInKbps = speedInKbps;
        this.estimatedTimeInSeconds = estimatedTimeInSeconds;
        this.totalSent = totalSent;
    }

    public double getProgressInPercent() {
        return progressInPercent;
    }

    public void setProgressInPercent(double progressInPercent) {
        this.progressInPercent = progressInPercent;
    }

    public double getSpeedInKbps() {
        return speedInKbps;
    }

    public void setSpeedInKbps(double speedInKbps) {
        this.speedInKbps = speedInKbps;
    }

    public double getEstimatedTimeInSeconds() {
        return estimatedTimeInSeconds;
    }

    public void setEstimatedTimeInSeconds(double estimatedTimeInSeconds) {
        this.estimatedTimeInSeconds = estimatedTimeInSeconds;
    }

    public long getTotalSent() {
        return totalSent;
    }

    public void setTotalSent(long totalSent) {
        this.totalSent = totalSent;
    }
}
