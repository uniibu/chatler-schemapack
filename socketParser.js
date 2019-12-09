const Emitter = require('component-emitter');
const parser = require('./schemaParser');
const { builds, ids } = parser;
const TYPES = {
  CONNECT: 0,
  DISCONNECT: 1,
  EVENT: 2,
  ACK: 3,
  ERROR: 4,
  BINARY_EVENT: 5,
  BINARY_ACK: 6
};
const errorPacket = {
  type: TYPES.ERROR,
  data: 'parser error'
};

class Encoder {
  encode (packet, callback) {
    switch (packet.type) {
    case TYPES.EVENT:
      /* eslint-disable-next-line */
      return callback([this.pack(packet)]);
    default:
      /* eslint-disable-next-line */
      return callback([JSON.stringify(packet)]);
    }
  }
  pack ({ data, nsp }) {
    const eventName = data[0];
    const eventId = ids.out[eventName];
    if (!eventId) {
      throw new Error(`unknown event name: ${eventName}`);
    }
    const flatPacket = {
      _id: eventId,
      data: data[1],
      nsp
    };
    try {
      return builds.out[`_${eventId}`].build.encode(flatPacket);
    } catch (e) {
      console.error(e);
    }
  }
}

class Decoder extends Emitter {
  add (obj) {
    if (typeof obj === 'string') {
      this.parseJSON(obj);
    } else {
      this.parseBinary(obj);
    }
  }
  parseJSON (obj) {
    try {
      const decoded = JSON.parse(obj);
      this.emit('decoded', decoded);
    } catch (e) {
      this.emit('decoded', errorPacket);
    }
  }
  parseBinary (obj) {
    const view = new Uint8Array(obj);
    const packetId = view[0];
    try {
      const b = builds.in[`_${packetId}`];
      const decoded = b.build.decode(obj);
      const packet = {
        data: [b.event, decoded.data],
        type: TYPES.EVENT,
        nsp: decoded.nsp
      };
      this.emit('decoded', packet);
    } catch (e) {
      console.error(e);
      this.emit('decoded', errorPacket);
    }
  }
  destroy () { }
}

module.exports = {
  Encoder,
  Decoder
};
