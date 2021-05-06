const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('GET /recentActivity', () => {
  it('should succesfully return recent activity of the user', (done) => {
    request
      .get('/recentActivity')
      .query({ userId: 1 })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
