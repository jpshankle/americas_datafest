app.controller('DashboardCtrl', ['$scope', function ($scope) {
    var i, c, year,
        allCountriesData = {
            'United States': [],
            'Mexico': [],
            'Canada': []
        };

    for (c in allCountriesData) {
        for (i = 0; i < 25; i++) {
            year = i < 10 ? '20' : '200';
            allCountriesData[c][i] = {
                year: year + i,
                gdp: Math.random() * 10000
            };
        }
    }

    $scope.countries = [
        {
            properties: {
                name: 'United States'
            }
        },
        {
            properties: {
                name: 'Mexico'
            }
        }
    ];

    $scope.changeCountry = function (selectedCountry) {
        $scope.lineData = allCountriesData[selectedCountry];
    };

    $scope.selectedCountry = 'United States';

    $scope.changeCountry($scope.selectedCountry);
}]);