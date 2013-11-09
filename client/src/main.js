var body = $('body');
body.height(window.innerHeight);

var app = angular.module('immiviz', [
    'ngRoute',
    'ngAnimate'
]);

app.config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider
        .when('/', {
            controller: 'HomeCtrl',
            templateUrl: '/home/view.html'
        })
        .when('/about', {
            controller: 'AboutCtrl',
            templateUrl: '/about/view.html'
        })
        .when('/numbers', {
            controller: 'NumbersCtrl',
            templateUrl: '/numbers/view.html'
        })
        .when('/stories', {
            controller: 'StoriesCtrl',
            templateUrl: '/stories/view.html'
        })
        .otherwise('/');
}]);

app.run(['$rootScope', function ($rootScope) {
    $rootScope.countries={
        selectedCountry: {},
        countryData: {}
    };
}]);

app.controller('AppCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.immivizContentAnimateClass = 'back-button';
    $scope.backButton = function (direction) {
        window.history.back();
    };
}]);