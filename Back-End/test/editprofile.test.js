const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('PUT /profilePage', () => {
  it('should succesfully edit name', (done) => {
    request
      .put('/profilePage/editName')
      .send({ userId: 1, name: 'Admin' })
      .expect(200, done);
  });

  it('should succesfully edit email', (done) => {
    request
      .put('/profilePage/editEmail')
      .send({ userId: 1, email: 'admin@gmail.com' })
      .expect(200, done);
  });

  it('should return error for already used email', (done) => {
    request
      .put('/profilePage/editEmail')
      .send({ userId: 1, email: 'admin@gmail.com' })
      .expect(500, done);
  });

  it('should succesfully edit phone number', (done) => {
    request
      .put('/profilePage/editPhoneNumber')
      .send({ userId: 1, phone: '90987431' })
      .expect(200, done);
  });
});
