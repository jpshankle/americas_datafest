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
        .when('/data', {
            controller: 'DataCtrl',
            templateUrl: '/data/view.html'
        })
        .otherwise('/');
}]);

app.run(['$rootScope', function ($rootScope) {
    $rootScope.countries={
        selectedCountry: {},
        countryData: {}
    };
}]);