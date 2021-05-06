const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('GET /dashboard/getGroupNames', () => {
  it('should succesfully return group names', (done) => {
    request
      .get('/dashboard/getGroupNames')
      .query({ userId: 1 })
      .expect(200, [
        { group_id: 1, group_name: 'Daily' },
      ], done);
  });
});
