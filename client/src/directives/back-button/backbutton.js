app.directive('backButton', ['$rootScope', '$location', function($rootScope, $location) {
  return {
      restrict: 'E',
      template: '<a href="" ng-click="backButton()" class="icon-link icon-link-arrows"><i class="icon-double-angle-left"></i></a>',
      link: function(scope, element, attrs) {
        scope.backButton = function () {
          d3.selectAll('.globeElement').selectAll('.active').classed('active', false);
          $rootScope.countries.selectedCountry = undefined;
          $location.path('/');
        };
      }
  };
}]);