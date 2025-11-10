"use client";

import { io } from "socket.io-client";

let socket = null;

const createSocket = () => {
  if (!socket) {
    socket = io();

    socket.on('connect', () => console.log('Socket connected'));
    socket.on('disconnect', () => console.log('Socket disconnected'));
  }
  return socket;
};

export default createSocket();