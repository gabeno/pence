import { URL } from "./constants";

// eslint-disable-next-line
class DataStream {
  constructor({ client, ...channels } = {}) {
    this.socket = this.connect(URL, client);
    this.socket.emit("SubAdd", { subs: channels });
  }

  connect(url, client) {
    return client.connect(url);
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
