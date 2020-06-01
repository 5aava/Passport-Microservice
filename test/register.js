'use strict';

process.env.ENV = 'test';

let ServerConfig = require('../src/config/config.server');

let chai = require('chai');
let chaiHttp = require('chai-http');
var should = require('chai').should();
let server = require('../start');
chai.use(chaiHttp);

import {Users} from '../src/database/models';


// CLEAN USER
after(function () {
  return Users.destroy({
    where: {
      email: ServerConfig.test.email,
    },
  }).catch(err => console.log(err));
});


// REGISTER
describe('REGISTER', () => {
  describe('OK', () => {

    it('POST /register LOCAL returns an 200 OK', (done) => {
      chai.request(server)
        .post('/register')
        .send({
          clientkey: ServerConfig.clientkey,
          email: ServerConfig.test.email,
          type: 'local',
          name: ServerConfig.test.name,
          password: ServerConfig.test.password,

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

    it('POST /register LOCAL returns an 409 wrong dublicate email', (done) => {
      chai.request(server)
        .post('/register')
        .send({
          clientkey: ServerConfig.clientkey,
          email: ServerConfig.test.email,
          type: 'local',
          name: ServerConfig.test.name,
          password: ServerConfig.test.password,

        })
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.status.should.be.equal('error');
          done();
        });
    });

    it('POST /register LOCAL returns an 403 wrong clientKey', (done) => {
      chai.request(server)
        .post('/register')
        .send({
          clientkey: ServerConfig.clientkey + 'asd',
          email: ServerConfig.test.email,
          type: 'local',
          name: ServerConfig.test.name,
          password: ServerConfig.test.password,
        })
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.errors[0].param.should.be.equal('clientkey');
          done();
        });
    });


    it('POST /register LOCAL returns an 403 wrong params', (done) => {
      chai.request(server)
        .post('/register')
        .send({
          clientkey: ServerConfig.clientkey,
          email: 'asdasdasd',
          type: 'asd',
          name: 's',
          password: 'asda',

        })
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.errors[0].param.should.be.equal('email');
          res.body.errors[1].param.should.be.equal('name');
          res.body.errors[2].param.should.be.equal('type');
          res.body.errors[3].param.should.be.equal('password');
          done();
        });
    });


  });
});
