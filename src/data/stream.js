import socketIO from "socket.io-client";

import { URL } from "./constants";

// eslint-disable-next-line
class DataStream {
  constructor() {
    this.socket = socketIO.connect(URL);
    this.socket.emit("SubAdd", { subs: ["5~CCCAGG~BTC~USD"] });
  }

  subscribe() {
    this.socket.emit("SubAdd", { subs: ["5~CCCAGG~BTC~USD"] });
  }

  unsubscribe() {
    this.socket.emit("SubRemove", { subs: ["5~CCCAGG~BTC~USD"] });
  }

  getSocket() {
    return this.socket;
  }
}

export default DataStream;
