package com.bound.Interfaces;

import java.net.ServerSocket;
import java.net.Socket;

public interface OnServerSocketConnection {
    void onConnection(ServerSocket socket);

    void onClientConnection(Socket socket);
}
