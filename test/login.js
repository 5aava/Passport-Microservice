'use strict';

process.env.ENV = 'test';

let ServerConfig = require('../src/config/config.server');

let chai = require('chai');
let chaiHttp = require('chai-http');
var should = require('chai').should();
let server = require('../start');
chai.use(chaiHttp);

import {Users} from '../src/database/models';


// REGISTER
describe('LOGIN', () => {
  describe('OK', () => {

    before(function () {
      return Users.update({
        isEmail: true,
      }, {
        where: {
          email: ServerConfig.test.email,
        },
      }).catch(err => console.log(err));
    });

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
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.status.should.be.equal('ok');
          done();
        });
    });
  });

  describe('ERRORS', () => {

    it('POST /login LOCAL returns an 401 wrong creds', (done) => {
      chai.request(server)
        .post('/login')
        .send({
          clientkey: ServerConfig.clientkey,
          email: ServerConfig.test.email,
          type: 'local',
          password: 'asdafdgdf',
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.status.should.be.equal('error');
          done();
        });
    });


    it('POST /login LOCAL returns an 403 wrong clientKey', (done) => {
      chai.request(server)
        .post('/login')
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


    it('POST /login LOCAL returns an 403 wrong params', (done) => {
      chai.request(server)
        .post('/login')
        .send({
          clientkey: ServerConfig.clientkey,
          email: 'asdasdasd',
          type: 'asd',
          password: 'asda',

        })
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.errors[0].param.should.be.equal('email');
          res.body.errors[1].param.should.be.equal('type');
          res.body.errors[2].param.should.be.equal('password');
          done();
        });
    });


  });
});
