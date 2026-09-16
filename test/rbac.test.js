const test = require('node:test');
const assert = require('node:assert/strict');
const { authorize } = require('../middleware/authMiddleware');

const runAuthorization = (role, allowedRoles) => {
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
  let nextCalled = false;

  authorize(...allowedRoles)({ user: role ? { role } : null }, response, () => {
    nextCalled = true;
  });

  return { response, nextCalled };
};

test('pemilik dapat melewati middleware pemilik', () => {
  const result = runAuthorization('pemilik', ['pemilik']);

  assert.equal(result.nextCalled, true);
  assert.equal(result.response.statusCode, null);
});

test('kasir ditolak dari middleware pemilik', () => {
  const result = runAuthorization('kasir', ['pemilik']);

  assert.equal(result.nextCalled, false);
  assert.equal(result.response.statusCode, 403);
});

test('kasir dapat melewati middleware kasir atau pemilik', () => {
  const result = runAuthorization('kasir', ['kasir', 'pemilik']);

  assert.equal(result.nextCalled, true);
  assert.equal(result.response.statusCode, null);
});

test('request tanpa user ditolak', () => {
  const result = runAuthorization(null, ['pemilik']);

  assert.equal(result.nextCalled, false);
  assert.equal(result.response.statusCode, 403);
});