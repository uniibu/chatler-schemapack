const schema = require('./schema.json');
const sp = require('schemapack');
const builds = { in: {}, out: {} };

for (const [k, v] of Object.entries(schema.in)) {
  if (k !== 'ids') {
    const _id = schema.in.ids[k];
    builds.in[`_${_id}`] = {
      event: k,
      build: sp.build({
        _id: 'uint8',
        data: v,
        nsp: 'string'
      })
    };
  }
}
for (const [k, v] of Object.entries(schema.out)) {
  if (k !== 'ids') {
    const _id = schema.out.ids[k];
    builds.out[`_${_id}`] = {
      event: k,
      build: sp.build({
        _id: 'uint8',
        data: v,
        nsp: 'string'
      })
    };
  }
}

module.exports = {
  builds,
  ids: {
    in: schema.in.ids,
    out: schema.out.ids
  }
};
