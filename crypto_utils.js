const unpack = str => {
  var values = str.split("~");
  var mask = values.pop();
  var maskInt = parseInt(mask, 16);
  var unpacked = {};
  var currentField = 0;

  for (var property in FIELDS) {
    if (FIELDS[property] === 0) {
      unpacked[property] = values[currentField];
      currentField++;
    } else if (maskInt & FIELDS[property]) {
      //i know this is a hack, for cccagg, future code please don't hate me:(, i did this to avoid
      //subscribing to trades as well in order to show the last market
      if (property === "LASTMARKET") {
        unpacked[property] = values[currentField];
      } else {
        unpacked[property] = parseFloat(values[currentField]);
      }
      currentField++;
    }
  }

  return unpacked;
};

const FIELDS = {
  TYPE: 0x0,
  MARKET: 0x0,
  FROMSYMBOL: 0x0,
  TOSYMBOL: 0x0,
  FLAGS: 0x0,
  PRICE: 0x1,
  BID: 0x2,
  OFFER: 0x4,
  LASTUPDATE: 0x8,
  AVG: 0x10,
  LASTVOLUME: 0x20,
  LASTVOLUMETO: 0x40,
  LASTTRADEID: 0x80,
  VOLUMEHOUR: 0x100,
  VOLUMEHOURTO: 0x200,
  VOLUME24HOUR: 0x400,
  VOLUME24HOURTO: 0x800,
  OPENHOUR: 0x1000,
  HIGHHOUR: 0x2000,
  LOWHOUR: 0x4000,
  OPEN24HOUR: 0x8000,
  HIGH24HOUR: 0x10000,
  LOW24HOUR: 0x20000,
  LASTMARKET: 0x40000
};

const o = unpack(
  "5~CCCAGG~BTC~USD~4~6763.9~1523280315~0.0394~265.59146~223941230~87566.5820132549~612420124.9336938~115981.0424785442~812566734.1394485~7049.92~7204.28~6712.41~7074.25~7200.8~6706~Bitfinex~7ffe9"
);
console.log(o);
