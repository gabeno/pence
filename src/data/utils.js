// const constants = require("./constants");
import { CURRENTAGG, TRADE_FIELDS } from "./constants";

class Cache {
  /**
   * A simple class to cache and reuse data
   * It does not reduce network calls but helps to fill
   * in gaps in received data.
   */
  constructor() {
    this.store = {};
  }

  get (key) {
    if (this.store.hasOwnProperty(key)) {
      return this.store[key];
    }
  }

  set (key, value) {
    if (value) this.store[key] = value;
  }
}

const cache = new Cache();

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

    return extract(unpacked);
  }

  return false;
};

const extract = data => {
  // filter undefined values from source
  // return only values I want to use
  const { price, lastUpdate } = data;

  cache.set('price', price);
  cache.set('lastUpdate', dateFormatter(lastUpdate));

  const resObj = {
    price: cache.get('price'),
    lastUpdate: cache.get('lastUpdate') 
  };
  
  return resObj;
};

const dateFormatter = timestamp => {
  return timestamp * 1000;
}

export { unpack };
