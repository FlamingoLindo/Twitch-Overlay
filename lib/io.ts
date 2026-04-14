import type { Server as SocketIOServer } from "socket.io";

const globalForIO = globalThis as unknown as {
  __twitchOverlayIO?: SocketIOServer;
};

export const setIO = (nextIO: SocketIOServer) => {
  globalForIO.__twitchOverlayIO = nextIO;
};

export const getIO = () => globalForIO.__twitchOverlayIO;
