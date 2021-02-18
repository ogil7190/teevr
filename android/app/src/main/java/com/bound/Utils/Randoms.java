package com.bound.Utils;

public class Randoms {

    public static String randomWithCustomCharSet(int length, String charset) {
        int index;
        StringBuilder builder = new StringBuilder();

        for (int i = 0; i < length; i++) {
            index = (int) Math.floor(Math.random() * charset.length());
            builder.append(charset.charAt(index));
        }

        return builder.toString();
    }

    public static String randomString(int length) {
        String charset = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuioplkjhgfdsazxcvbnm";
        return randomWithCustomCharSet(length, charset);
    }

    public static String randomNumber(int length) {
        String charset = "1234567890";
        return randomWithCustomCharSet(length, charset);
    }

    public static String randomPassword(int length) {
        String charset = "@#$%^&QWERTYUIOPASDFGHJKLZXCVBNMqwertyuioplkjhgfdsazxcvbnm1234567890&^%$#@";
        return randomWithCustomCharSet(length, charset);
    }
}
