app.directive('backButton', ['$rootScope', function($rootScope) {
  return {
      restrict: 'E',
      template: '<a href="" ng-click="backButton()" class="icon-link icon-link-arrows"><i class="icon-double-angle-left"></i></a>',
      link: function(scope, element, attrs) {
        scope.backButton = function () {
          $rootScope.countries.selectedCountry = null;
          d3.selectAll('.globeElement').selectAll('.active').classed('active', false)
          window.history.back();
        };
      }
  };
}]);
    