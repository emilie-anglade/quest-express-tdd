const request = require('supertest');
const app = require('../app');
const connection = require('../connection');

describe('Test routes', () => {
  beforeEach(done => connection.query('TRUNCATE bookmark', done));

  it('GET / sends "Hello World" as json', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { message: 'Hello World!'};
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it('POST /bookmarks sends status422 and error message', (done) => {
    request(app)
      .post('/bookmarks')
      .send({})
      .expect(422)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { "error": "required field(s) missing" };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it('POST /bookmarks sends status 201 and JSON', (done) => {
    request(app)
      .post('/bookmarks')
      .send({url: 'https://jestjs.io', title: 'Jest'})
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { "id": expect.any(Number), "url": "https://jestjs.io", "title": "Jest" };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  describe('GET /bookmarks/:id', () => {
    const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
    beforeEach((done) => connection.query(
      'TRUNCATE bookmark', () => connection.query(
        'INSERT INTO bookmark SET ?', testBookmark, done
      )
    ));
  
    it('GET /bookmarks/:id with wrong id', (done) => {
      request(app)
        .get('/bookmarks/9')
        .expect(404)
        .expect('Content-Type', /json/)
        .then(response => {
          const expected = { error: 'Bookmark not found'};
          expect(response.body).toEqual(expected);
          done();
        });
    });

    it('GET /bookmarks/:id with existing id', (done) => {
      request(app)
        .get('/bookmarks/1')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          const expected = { id: 1, url: 'https://nodejs.org/', title: 'Node.js'};
          expect(response.body).toEqual(expected);
          done();
        });
    });
  });
});
