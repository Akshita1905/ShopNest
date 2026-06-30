const test = require('node:test');
const assert = require('node:assert/strict');
const connectDB = require('../config/db');

test('connectDB should not exit the process when MongoDB is unavailable', async () => {
  const originalUri = process.env.MONGO_URI;
  process.env.MONGO_URI = 'mongodb://127.0.0.1:1/test';

  try {
    const result = await connectDB(0);
    assert.equal(result, false);
  } finally {
    if (originalUri === undefined) {
      delete process.env.MONGO_URI;
    } else {
      process.env.MONGO_URI = originalUri;
    }
  }
});
