import SocketIO from "socket.io-client";
export default {
  initialize() {
    const options = {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
      jsonp: false
      //      transports: ['websocket']
    };

    //http://13.238.107.123
    //http://172.10.20.180
    return SocketIO("http://13.238.107.123:5004", options);
  }
};
