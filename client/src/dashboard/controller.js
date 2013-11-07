app.controller('DashboardCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    var i, c, year,
        allCountriesData = {};

    $scope.countries={};


    $.getJSON('world-countries.json', function(json) {
        for (num in json.features) {
            var feature = json.features[num];
            c = feature.id;
            allCountriesData[c] = {};

            $scope.countries[c] = {
                properties: {
                    name: feature.properties.name
                }
            };
            for (i = 0; i < 25; i++) {
                year = i < 10 ? '200' : '20';
                allCountriesData[c][i] = {
                    year: parseInt(year + i),
                    gdp: Math.random() * 10000
                };
            }
        }
    });

    $rootScope.$watch('selectedCountry', function() {
       $scope.lineData = allCountriesData[$rootScope.selectedCountry.name];
    }, true);
}]);