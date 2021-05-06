const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('GET /groupPage', () => {
  it('should succesfully return data of the group where the user is a member', (done) => {
    request
      .get('/groupPage')
      .query({ userId: 1, groupId: 1 })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
