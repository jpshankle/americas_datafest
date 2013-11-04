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
					var data = [];
					 for (var i in newValues) {
					 	var item = newValues[i];
						data.push({
							x: item.year,
							y: item.gdp
						});
					};

					var second = data.map(function (thing) {
						return {
							x: thing.x,
							y: thing.y / 2
						};
					});
					console.log(second);
					element.empty();
					var graph = new Rickshaw.Graph( {
					    element: element[0], 
					    width: 300, 
					    height: 300,
                        renderer: 'line',
					    series: [
					    	{
					        color: 'red',
					        data: data	
					    	},
					    	{
					        color: '#333',
					        data: second	
					    	}
					    ]
					});

					graph.render();
				}
			});

		}
	};
}]);