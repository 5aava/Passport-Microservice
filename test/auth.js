'use strict';

process.env.ENV = 'test';

let ServerConfig = require('../src/config/config.server');

let chai = require('chai');
let chaiHttp = require('chai-http');
var should = require('chai').should();
let server = require('../start');
chai.use(chaiHttp);


let jwttoken;

// REGISTER
describe('AUTH', () => {

  describe('OK', () => {

    it('POST /login LOCAL returns an 200 OK', (done) => {
      chai.request(server)
        .post('/login')
        .send({
          clientkey: ServerConfig.clientkey,
          email: ServerConfig.test.email,
          type: 'local',
          password: ServerConfig.test.password,
        })
        .end((err, res) => {
          jwttoken = res.body.data.token;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.status.should.be.equal('ok');
          res.body.data.token.should.be.a('string');
          done();
        });
    });

    it('POST /auth/me LOCAL returns an 200 OK', (done) => {
      chai.request(server)
        .post('/auth/me')
        .set('x-api-key', jwttoken)
        .send({
          clientkey: ServerConfig.clientkey,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.status.should.be.equal('ok');
          done();
        });
    });
    it('POST /auth/changedata LOCAL returns an 200 OK', (done) => {
      chai.request(server)
        .post('/auth/changedata')
        .set('x-api-key', jwttoken)
        .send({
          clientkey: ServerConfig.clientkey,
          isSubscribe: true,
          referral: 'envTest',
          name: 'envTest',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.status.should.be.equal('ok');
          done();
        });
    });
  });


  describe('ERRORS', () => {

    it('POST /auth/me LOCAL returns an 500 wrong jwttoken', (done) => {
      chai.request(server)
        .post('/auth/me')
        .set('x-api-key', jwttoken + '!')
        .send({
          clientkey: ServerConfig.clientkey,
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.status.should.be.equal('error');
          done();
        });
    });

    it('POST /auth/changedata LOCAL returns an 500 wrong jwttoken', (done) => {
      chai.request(server)
        .post('/auth/changedata')
        .set('x-api-key', jwttoken + '!')
        .send({
          clientkey: ServerConfig.clientkey,
          isSubscribe: true,
          referral: 'envTest',
          name: 'envTest',
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.status.should.be.equal('error');
          done();
        });
    });

  });
});
