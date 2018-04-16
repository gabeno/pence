import React, { Component } from "react";
import socketIO from "socket.io-client";
import "./App.css";
import DataStream from "./data/stream";
import unpack from "./data/utils";

// Data source
const stream = new DataStream({ client: socketIO });
stream.subscribe("5~CCCAGG~BTC~USD");
setTimeout(() => {
  stream.unsubscribe("5~CCCAGG~BTC~USD");
}, 10000);
stream.getSocket().on("m", message => {
  const msg = unpack(message);
  if (msg) console.log(msg);
});

class App extends Component {
  render() {
    return <div className="App" />;
  }
}

export default App;
