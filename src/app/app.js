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
            fetchAllUsers: '/app/users/all/v1'
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

            configDataProvider.addConfigDataValue('usernameMaxSize', 40);

        }])
        .run(['HomeService', '$rootScope', '$filter', 'defaultFilterRange', function (HomeService, $rootScope, $filter, defaultFilterRange) {
            HomeService.fetchAllUsers(function (response) {
                $rootScope.usersList = response;
                $rootScope.users = [];
                $rootScope.usersList.forEach(function (user) {
                    var filterUser = $filter('between')(user.salary, defaultFilterRange.min, defaultFilterRange.max);
                    if (filterUser) {
                        $rootScope.users.push(user);
                    }
                });
            }, function (error) {
                console.log('----------- error---------------', error);
            });

        }])
        .service('HomeService', ['$resource', 'REQUEST_URL', 'API_URLs', function ($resource, REQUEST_URL, API_URLs) {
            return $resource(REQUEST_URL.apiBaseUrl + API_URLs.fetchAllUsers, {}, {
                'fetchAllUsers': {
                    'method': 'GET',
                    'isArray': true
                }
            });
        }])
        .factory('HomeFactory', ['$q', '$rootScope', function ($q, $rootScope) {
            var searchUserByName = function (_name) {
                var deferred = $q.defer();
                if ($rootScope.usersList.length > 0) {
                    var _user = null,
                        length = $rootScope.usersList.length;
                    for (var i = 0; i < length; i++) {
                        if (_name === $rootScope.usersList[i].name) {
                            _user = $rootScope.usersList[i];
                            break;
                        }
                    }
                    if (_user) {
                        deferred.resolve({data: _user});
                    } else {
                        deferred.reject({
                            message: 'User not found.'
                        });
                    }

                }
                return deferred.promise;
            };
            return {
                searchUserByName: searchUserByName
            }
        }])
        .controller('HomeCtrl', ['HomeFactory', 'LAST_ACCESSED_USER', function (HomeFactory, LAST_ACCESSED_USER) {
            var _self = this;
            _self.searchedUser = LAST_ACCESSED_USER;
            _self.minRange = 20000;
            _self.maxRange = 30000;
            _self.fetchUserByName = function (_name) {
                if (!_name) {
                    alert('Name field must be required.');
                } else {
                    HomeFactory.searchUserByName(_name).then(function (result) {
                            if (result.data) {
                                _self.searchedUser = result.data;
                            }
                        },
                        function (error) {
                            if (error) {
                                _self.searchedUser = LAST_ACCESSED_USER;
                            }
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
        }])
})
(window.angular);
