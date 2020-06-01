'use strict';

process.env.ENV = 'test';

let ServerConfig = require('../src/config/config.server');

let chai = require('chai');
let chaiHttp = require('chai-http');
var should = require('chai').should();
let server = require('../start');
chai.use(chaiHttp);


// DEFAULTS
describe('DEFAULTS', () => {
  describe('OK', () => {
    it('GET /ping returns an 200 OK', (done) => {
      chai.request(server)
        .get('/ping')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.status.should.be.equal('ok');
          res.body.data.should.be.equal('pong');
          done();
        });
    });
  });

  describe('ERRORS', () => {
    it('GET /wrongroute returns an 404 ERROR wrong default route', (done) => {
      chai.request(server)
        .get('/wrongroute')
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.status.should.be.equal('error');
          done();
        });
    });
    it('GET /buggyroute returns an 400 ERROR buggy route', (done) => {
      chai.request(server)
        .get('/buggyroute')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.status.should.be.equal('error');
          done();
        });
    });
    it('GET /servererror returns an 500 ERROR server error', (done) => {
      chai.request(server)
        .get('/servererror')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json;
          res.body.should.be.a('object');
          done();
        });
    });

    it('POST /api/me returns an 403 ERROR wrong clientkey', (done) => {
      chai.request(server)
        .post('/api/me')
        .send({
          clientkey: ServerConfig.clientkey + 'asd',
        })
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.errors[0].param.should.be.equal('clientkey');
          done();
        });
    });
  });
});

