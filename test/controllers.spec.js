'use strict';

describe('Unit : HomeCtrl', function () {
  var $controller,
    HomeService,
    LAST_ACCESSED_USER,
    Home;

  beforeEach(module('myApp'));

  beforeEach(inject(function (_$controller_, _LAST_ACCESSED_USER_, _HomeService_) {
    $controller = _$controller_;
    HomeService = _HomeService_;
    LAST_ACCESSED_USER = _LAST_ACCESSED_USER_;
  }));


  beforeEach(function () {
    Home = $controller('HomeCtrl', {
      HomeService: HomeService,
      LAST_ACCESSED_USER: LAST_ACCESSED_USER
    });
  });

  describe('Should be defined:', function () {
    it('it should pass if Home is defined', function () {
      expect(Home).not.toBeUndefined();
    });
    it('it should pass if HomeService is defined', function () {
      expect(HomeService).not.toBeUndefined();
    });
    it('it should pass if LAST_ACCESSED_USER is defined', function () {
      expect(LAST_ACCESSED_USER).not.toBeUndefined();
    });
  });

  describe('Home.searchedUser', function () {
    it('it should pass if searchedUser has default values', function () {
      expect(Home.searchedUser).toEqual({name: 'Not Provided', age: 'Not Provided', salary: 0});
    });
  });

  describe('Home.minRange', function () {
    it('it should pass if minRange match the result', function () {
      expect(Home.minRange).toEqual(20000);
    });
    it('it should pass if minRange doesn\'t match the result', function () {
      expect(Home.minRange).not.toEqual(21000);
    });
  });
  describe('Home.maxRange', function () {
    it('it should pass if maxRange match the result', function () {
      expect(Home.maxRange).toEqual(30000);
    });
    it('it should pass if maxRange doesn\'t match the result', function () {
      expect(Home.maxRange).not.toEqual(35000);
    });
  });
});
