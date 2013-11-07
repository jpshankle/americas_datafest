app.controller('DashboardCtrl', ['$scope', function ($scope) {
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


        $scope.selectedCountry = {
            name: 'USA',
            fullName: 'Please Select a Country'
        };

        $scope.changeCountry($scope.selectedCountry);
    });

    $scope.changeCountry = function (selectedCountry) {
        $scope.selectedCountry = selectedCountry;
        $scope.lineData = allCountriesData[selectedCountry.name];
        $scope.$apply();
    };
    $scope.$watch('selectedCountry', function() {
        console.log($scope.selectedCountry);
    }, true);
}]);