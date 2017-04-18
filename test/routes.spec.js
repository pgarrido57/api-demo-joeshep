// By default, Mocha searches for tests with a “test” folder.
// That configuration can be changed with a mocha.opts file
process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../app');
const { knex } = require('../db/database');
chai.use(chaiHttp);

describe('Shows routes', () => {

  beforeEach( () => {
    return knex.migrate.rollback()
    .then( () => {
      return knex.migrate.latest()
    })
    .then( () => {
      return knex.seed.run()
    });
  });

  describe('Get all the shows', () => {
    it('should get all shows', () => {
      return chai.request(server)
      .get('/api/v1/shows')
      .then( (res) => {
        res.should.have.status(200);
        res.should.be.json
        res.body.should.be.a('array');
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('Mr. Robot');
      });
    });
  });

  describe('GET /api/v1/shows/:id', () => {
    it('should return a single show', () => {
     return chai.request(server)
     .get('/api/v1/shows/1')
     .then( (res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('name');
      res.body.name.should.equal('Mr. Robot');
     });
    });
  });

  describe('POST /api/v1/shows/new', () => {
    it('should add a new show obj to the db', () => {
      return chai.request(server)
      .post('/api/v1/shows/new')
      .send({
        name: 'The Simpsons',
        channel: 'Fox',
        genre: 'animation',
        inProduction: true
      })
      .then( (res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.should.be.a('object');
      })
    })
  });
});

describe('DELETE api/v1/:id', () => {
  it('should remove a single item for shows', () => {
    return chai.request(server)
    .delete('/api/v1/shows/1')
    .then( (res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');

      chai.request(server)
      .get('/api/v1/shows')
      .then( (res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(4);
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('The IT Crowd');
        res.body[0].should.have.property('channel');
        res.body[0].channel.should.equal('Netflix');
        res.body[0].should.have.property('genre');
        res.body[0].channel.should.equal('comedy');
        res.body[0].should.have.property('inProduction');
        res.body[0].channel.should.equal('false');
      });
    });
  });
});
