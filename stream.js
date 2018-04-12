const io = require("socket.io-client");

const TYPE = require("./constants");

const socket = io.connect("https://streamer.cryptocompare.com/");

const subscription = ["5~CCCAGG~BTC~USD"];
const messages = [];

socket.emit("SubAdd", { subs: subscription });
socket.on("m", message => {
  if (message[0] == "5") {
    console.log(message);
    messages.push(message);
  }

  if (messages.length == 10) {
    process.exit(0);
  }
});
