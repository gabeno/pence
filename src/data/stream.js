import socketIO from "socket.io-client";

import { URL } from "./constants";

// eslint-disable-next-line
class DataStream {
  constructor({ ...channels } = {}) {
    this.socket = this.connect(URL, socketIO);
    this.socket.emit("SubAdd", { subs: channels });
  }

  subscribe(...channels) {
    this.socket.emit("SubAdd", { subs: channels });
  }

  unsubscribe(...channels) {
    this.socket.emit("SubRemove", { subs: channels });
  }

  getSocket() {
    return this.socket;
  }
}

export default DataStream;
