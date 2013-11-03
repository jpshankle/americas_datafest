app.controller('DashboardCtrl', ['$scope', function ($scope) {
    var i, c, year,
        allgdp = {
            name: 'GDP',
            attr: 'gdp',
            data: {
                'United States': [],
                'Mexico': [],
                'Canada': []
            }
    }, allage = {
        name: 'Age',
        attr: 'age',
        data: {

        }
    };

    $scope.countries = [];

    for (c in allgdp.data) {
        allage.data[c] = [];
        for (i = 0; i < 99; i++) {
            year = i < 10 ? '200' : '20';
            year++;
            allgdp.data[c][i] = {
                year: year,
                gdp: Math.random() * 10000
            };
            allage.data[c][i] = {
                year: year,
                age: i + 5
            }
        }
        $scope.countries.push({
            properties: {
                name: c
            }
        });
    }

    

    $scope.changeCountry = function (selectedCountry) {
        $scope.linesData = [
            allgdp[selectedCountry],
            allage[selectedCountry]
        ];
    };

    $scope.selectedCountry = 'United States';

}]);