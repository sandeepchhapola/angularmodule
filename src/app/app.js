'use strict';

(function (angular) {
    angular.module("myApp", ['ngResource', 'ngAnimate'])
        .value('LAST_ACCESSED_USER', {
            name: '',
            age: '',
            salary: ''
        })
        .value('defaultFilterRange', {
            max: '25000',
            min: '23000'
        })
        .constant('REQUEST_URL', {
            apiBaseUrl: 'http://localhost:3000'
        })
        .constant('API_URLs', {
            fetchAllUsers: '/app/users/all/v1',
            fetchUserByName: '/app/user/v1/:name'
        })
        .provider('configData', [function () {
            var configData = {
                emailPattern: "[a-z0-9_]*([.][a-z0-9_]+)*([+][0-9]+)*[@][a-z0-9]*[a-z0-9.]+[a-z0-9]*",
                mobileNumberPattern: "^\\d*$",
                mobileNumberSize: 10,
                passwordMinSize: 6,
                passwordPattern: "^(?=.*[a-z])(?!.*\\s).{6,15}$"
            };
            this.$get = function () {
                return {
                    configData: configData
                }
            };
            this.addConfigDataValue = function (key, value) {
                configData[key] = value;
            };
            return this

        }])
        .config(['$provide', 'configDataProvider', function ($provide, configDataProvider) {

            $provide.decorator('LAST_ACCESSED_USER', ['$delegate', function ($delegate) {
                $delegate.name = $delegate.name ? $delegate.name : 'Not Provided';
                $delegate.age = $delegate.age ? $delegate.age : 'Not Provided';
                $delegate.salary = $delegate.salary ? $delegate.salary : 0;
                return $delegate;
            }]);

            var configData = configDataProvider.$get().configData;

            console.log('-----------before addConfigDataValue--------------', configData);

            configDataProvider.addConfigDataValue('usernameMaxSize', 40);

            configData = configDataProvider.$get().configData;

            console.log('-----------after addConfigDataValue--------------', configData);

        }])
        .run(['HomeFactory', '$rootScope', '$filter', 'defaultFilterRange', function (HomeFactory, $rootScope, $filter, defaultFilterRange) {
            (function () {
                HomeFactory.FetchAllUsers.fetchAllUsers(function (response) {
                    $rootScope.usersList = response;
                    $rootScope.users = [];
                    $rootScope.usersList.forEach(function (user) {
                        var filterUser = $filter('between')(user.salary, defaultFilterRange.min, defaultFilterRange.max);
                        if (filterUser) {
                            $rootScope.users.push(user);
                        }
                    });
                }, function (error) {
                    console.log('-----------Home fetchAllUsers error---------------', error);
                });
            })();
        }])
        .service('HomeService', ['$resource', 'REQUEST_URL', 'API_URLs', function ($resource, REQUEST_URL, API_URLs) {
            return {
                FetchUserByName: $resource(REQUEST_URL.apiBaseUrl + API_URLs.fetchUserByName, {'name': '@name'}, {
                    'fetchUserByName': {
                        'method': 'GET'
                    }
                })
            }
        }])
        .factory('HomeFactory', ['$resource', 'REQUEST_URL', 'API_URLs', function ($resource, REQUEST_URL, API_URLs) {
            return {
                FetchAllUsers: $resource(REQUEST_URL.apiBaseUrl + API_URLs.fetchAllUsers, {}, {
                    'fetchAllUsers': {
                        'method': 'GET',
                        'isArray': true
                    }
                })
            }
        }])
        .controller('HomeCtrl', ['HomeService', 'LAST_ACCESSED_USER', function (HomeService, LAST_ACCESSED_USER) {
            var _self = this;
            _self.searchedUser = LAST_ACCESSED_USER;
            _self.minRange = 20000;
            _self.maxRange = 30000;
            _self.fetchUserByName = function (_name) {
                if (!_name) {
                    alert('Name field must be required.');
                } else {
                    HomeService.FetchUserByName.fetchUserByName({'name': _name}, function (response) {
                        if (response.data) {
                            _self.searchedUser = response.data;
                        } else {
                            _self.searchedUser = LAST_ACCESSED_USER;
                        }
                    }, function (error) {
                        _self.searchedUser = null;
                        console.log('-----------Home fetchUserByName error---------------', error);
                    });
                }
            };
        }])
        .directive('rangeSelector', ['$timeout', '$rootScope', '$filter', 'defaultFilterRange', function ($timeout, $rootScope, $filter, defaultFilterRange) {
            return {
                scope: {
                    users: '=',
                    min: '=',
                    max: '='
                },
                replace: true,
                restrict: 'E',
                templateUrl: 'views/main.html',
                link: function ($scope, element) {
                    function refreshSwatch() {
                        var _values = element.slider("values");
                        $rootScope.users = [];
                        $scope.$apply(function () {
                            $scope.users.forEach(function (user) {
                                var filterUser = $filter('between')(user.salary, _values[0], _values[1]);
                                if (filterUser) {
                                    $rootScope.users.push(user);
                                }
                            });
                        });
                    }

                    $timeout(function () {
                        element.slider({
                            orientation: "horizontal",
                            range: true,
                            max: $scope.max,
                            min: $scope.min,
                            values: [defaultFilterRange.min, defaultFilterRange.max],
                            stop: refreshSwatch
                        }, 500);
                    });
                }
            }
        }])
        .filter('between', [function () {
            return function (_input, _min, _max) {
                return (_input > _min && _input < _max) ? _input : null;
            };
        }]);
})
(window.angular);
