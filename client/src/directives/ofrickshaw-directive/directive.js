app.directive('ofRickshaw', [function () {
	return {
		restrict: 'E',
		templateUrl: '/directives/ofrickshaw-directive/view.html',
		link: function (scope, element, attrs) {
			var margin = {
				top: 20,
				right: 20,
				bottom: 30,
				left: 50
			}
			console.log(scope.lines);
			scope.$watchCollection('lines', function (newValues, oldValues) {
				if (typeof newValues === 'object') {
					element.empty();
					var graph = new Rickshaw.Graph( {
					    element: element[0], 
					    width: 300, 
					    height: 300, 
					    series: [{
					        color: 'steelblue',
					        data: [ 
					            { x: 0, y: 40 }, 
					            { x: 1, y: 49 }, 
					            { x: 2, y: 38 }, 
					            { x: 3, y: 30 }, 
					            { x: 4, y: 32 } ]
					    }]
					});

					graph.render();
				}
			});

		}
	};
}]);