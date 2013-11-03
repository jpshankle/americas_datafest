app.controller('DashboardCtrl', ['$scope', function ($scope) {
    var i, c, year,
        allCountriesData = {};

    $scope.countries={};


    $.getJSON('world-countries.json', function(json) {
        for (num in json.features) {
            var feature = json.features[num];
            c = feature.id;
            //console.log(c);
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


        //console.log($scope.countries);


        $scope.selectedCountry = {
            name: 'USA'
        };

        $scope.changeCountry($scope.selectedCountry);
    });

    $scope.changeCountry = function (selectedCountry) {
        console.log(selectedCountry);
        $scope.selectedCountry = {
            name: selectedCountry.name,
            fullName: $scope.countries[c].properties.name
        };
        //$scope.selectedCountry["fullName"] = $scope.countries[c].properties.name;
        //$scope.lineData = allCountriesData[selectedCountry.name];
    };

    $scope.$watch('selectedCountry', function() {
        console.log($scope.selectedCountry);
    }, true);
}]);