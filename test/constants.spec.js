'use strict';

describe('Unit : Constants', function () {
  var REQUEST_URL, API_URLs;
  beforeEach(module('myApp'));

  beforeEach(inject(function (_REQUEST_URL_, _API_URLs_) {
    REQUEST_URL = _REQUEST_URL_;
    API_URLs = _API_URLs_;
  }));

  describe('REQUEST_URL', function () {
    it('it should pass if REQUEST_URL match the result', function () {
      expect(REQUEST_URL).toEqual({
        apiBaseUrl: 'http://localhost:3000'
      });
    });
    it('it should pass if REQUEST_URL.apiBaseUrl match the value', function () {
      expect(REQUEST_URL.apiBaseUrl).toEqual('http://localhost:3000');
    });
  });

  describe('API_URLs', function () {
    it('it should pass if API_URLs match the result', function () {
      expect(API_URLs).toEqual({
        fetchAllUsers: '/app/users/all/v1'
      });
    });
    it('it should pass if API_URLs.fetchAllUsers match the value', function () {
      expect(API_URLs.fetchAllUsers).toEqual('/app/users/all/v1');
    });
  });
});
