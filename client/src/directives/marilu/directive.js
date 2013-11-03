app.directive('marilu', [function () {
	return {
		restrict: 'E',
		templateUrl: '/directives/marilu/view.html',
		link: function (scope, element, attrs) {
		        var mexico = new google.maps.LatLng(19.0000, -102.3667);
		        var mapOptions = {
		          center: mexico,
		          zoom: 5,
		          mapTypeId: google.maps.MapTypeId.TERRAIN
		        };
		        var map = new google.maps.Map(element.find('#map-replace')[0],
		            mapOptions);
		        
		        var humanRightsLayer = new google.maps.FusionTablesLayer({
		          query: {
		            select: 'Location',
		            from: ''
		          },
		        });
		        humanRightsLayer.setMap(map);
		        //"Original data and analysis on military human abuses of formal complaints of human rights abuses and formal reports by Mexico’s national human rights commission," 516 victims, 2005-2011, http://justiceinmexico.org/data-portal/
	      console.log(element.find('#map-replace')[0])
		}
	};
}]);