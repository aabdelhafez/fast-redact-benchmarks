const Benchmark = require('benchmark');
const fastRedact = require('fast-redact');

const suite = new Benchmark.Suite();

suite
  .add('jsonStringify', function () {
    jsonStringify(getDummyObject());
  })
  .add('fastRedactWithSerialization', function () {
    fastRedactWithSerialization(getDummyObject());
  })
  .add('fastRedactWithoutSerialization', function () {
    fastRedactWithoutSerialization(getDummyObject());
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });

function getDummyObject() {
  return {
    headers: {
      host: 'http://example.com',
      cookie: `oh oh we don't want this exposed in logs in etc.`,
      referer: `if we're cool maybe we'll even redact this`,
    },
  };
}

function jsonStringify(object) {
  JSON.stringify(object);
}

function fastRedactWithSerialization(object) {
  fastRedact({
    paths: ['headers.cookie', 'headers.referer'],
  })(object);
}

function fastRedactWithoutSerialization(object) {
  fastRedact({
    paths: ['headers.cookie', 'headers.referer'],
    serialize: false,
  })(object);
}
