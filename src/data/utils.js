// const constants = require("./constants");
import { CURRENTAGG, TRADE_FIELDS } from "./constants";

const unpack = str => {
  const values = str.split("~");
  const type = values[0];

  if (type === CURRENTAGG) {
    const mask = values.pop();
    const maskInt = parseInt(mask, 16);
    const unpacked = {};
    let currentField = 0;
    for (let property in TRADE_FIELDS) {
      if (TRADE_FIELDS[property] === 0) {
        unpacked[property] = values[currentField];
        currentField++;
      } else if (maskInt & TRADE_FIELDS[property]) {
        if (property === "LASTMARKET") {
          unpacked[property] = values[currentField];
        } else {
          unpacked[property] = parseFloat(values[currentField]);
        }
        currentField++;
      }
    }

    return unpacked;
  }

  return false;
};

export default unpack;
