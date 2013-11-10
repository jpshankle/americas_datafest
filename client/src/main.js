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

app.run(['$rootScope', '_', function ($rootScope, _) {
    $rootScope.countries={
        selectedCountry: {},
        countryData: {},
    };
    $rootScope.countryById = {};
    $rootScope.highlightCountries = function(countries) {
        var countriesToHighlight = (!_.isEmpty(countries)) ? countries : [];
        d3.select('.globeElement')
            .select('svg')
            .selectAll("path")
            .classed('has-data', function(d, i){
                return _.contains(countriesToHighlight, d.id);
            });
    }
    $rootScope.playTour = true;
    $rootScope.tourCountries = [];
    $rootScope.tourIndex = 0;
    $rootScope.setTourCountries = function(countries) {
        $rootScope.tourCountries = countries;
        $rootScope.tourIndex = 0;
    };
    
}]);