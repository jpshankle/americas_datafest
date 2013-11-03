app.directive('ofRickshaw', [function () {
	return {
		restrict: 'E',
		templateUrl: '/directives/ofrickshaw-directive/view.html',
		scope: {
			lines: '='
		},
		link: function (scope, element, attrs) {
			var margin = {
				top: 20,
				right: 20,
				bottom: 30,
				left: 50
			}
			scope.$watchCollection('lines', function (newValues, oldValues) {
				if (typeof newValues === 'object') {
					console.log(newValues)
					var data = [];
					 for (var i in newValues) {
					 	var item = newValues[i];
						data.push({
							x: item.year,
							y: item.gdp
						});
					};
					element.empty();
					var graph = new Rickshaw.Graph( {
					    element: element[0], 
					    width: 300, 
					    height: 300,
					    series: [{
					        color: 'steelblue',
					        data: data	
					    }]
					});

					graph.render();
				}
			});

		}
	};
}]);