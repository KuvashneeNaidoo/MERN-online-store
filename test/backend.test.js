// Required expect library from chai for testing.
const expect = require('chai').expect;
// Required isomorphic-fetch for making fetch requests.
const fetch = require('isomorphic-fetch');

/*
 * I used Mocha's "describe" and "it" functions to create and organise the tests.
 * The isomorphic fetch function was used to fetch the data.
 * A test assertion on the API data was created where the data fetched must be the products.
 * I also wrote a test assertion on the response that makes sure the network status code's response to equal 200 (OK).
 */

describe('Status test', function (done) {
  it('Server connects with the frontend', function () {
    fetch('http://localhost:3000', function (res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
});

describe('Status test', function (done) {
  it('Server fetches the product requests.', function () {
    fetch('http://localhost:8080/api/products', function (res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
});
