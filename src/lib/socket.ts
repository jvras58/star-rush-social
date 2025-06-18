import { io, Socket } from 'socket.io-client';

// By default connect to localhost; override by defining VITE_SERVER_URL in .env
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

export const socket: Socket = io(SERVER_URL, {
  autoConnect: false,
});

export default socket;
