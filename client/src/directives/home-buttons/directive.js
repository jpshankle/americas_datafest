app.directive('homeButton', ['$rootScope', '$location', function($rootScope, $location) {
  return {
      restrict: 'E',
      transclude: true,
      scope: {
        newLocation: '@'
      },
      template: '<h1 class="text-center"><a href="" ng-click="homeButtonClick(newLocation)"><span ng-transclude></span></a></h1>',
      link: function(scope, element, attrs) {
        scope.homeButtonClick = function (newLocation) {
          d3.selectAll('.globeElement').selectAll('.active').classed('active', false);
          $rootScope.countries.selectedCountry = null;
          $location.path(newLocation);
        };
      }
  };
}]);