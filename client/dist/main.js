var app = angular.module('immiviz', [
    'ngRoute'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'DashboardCtrl',
            templateUrl: '/dashboard/view.html'
        })
        .when('/about', {
            controller: 'AboutCtrl',
            templateUrl: '/about/view.html'
        })
        .otherwise('/');
}]);

app.controller('NavCtrl', ['$scope', function ($scope) {
    $scope.navbarItems = [
        {
            text: 'Dashboard',
            url: ''
        },
        {
            text: 'About',
            url: 'about'
        }
    ];
}]);;/**!
 * The MIT License
 * 
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * angular-google-maps
 * https://github.com/nlaplante/angular-google-maps
 * 
 * @author Nicolas Laplante https://plus.google.com/108189012221374960701
 */

(function () {
  
  "use strict";
  
  /*
   * Utility functions
   */
  
  /**
   * Check if 2 floating point numbers are equal
   * 
   * @see http://stackoverflow.com/a/588014
   */
  function floatEqual (f1, f2) {
    return (Math.abs(f1 - f2) < 0.000001);
  }
  
  /* 
   * Create the model in a self-contained class where map-specific logic is 
   * done. This model will be used in the directive.
   */
  
  var MapModel = (function () {
    
    var _defaults = { 
        zoom: 8,
        draggable: false,
        container: null
      };
    
    /**
     * 
     */
    function PrivateMapModel(opts) {
      
      var _instance = null,
        _markers = [],  // caches the instances of google.maps.Marker
        _handlers = [], // event handlers
        _windows = [],  // InfoWindow objects
        o = angular.extend({}, _defaults, opts),
        that = this,
        currentInfoWindow = null;
      
      this.center = opts.center;
      this.zoom = o.zoom;
      this.draggable = o.draggable;
      this.dragging = false;
      this.selector = o.container;
      this.markers = [];
      this.options = o.options;
      
      this.draw = function () {
        
        if (that.center == null) {
          // TODO log error
          return;
        }
        
        if (_instance == null) {
          
          // Create a new map instance
          
          _instance = new google.maps.Map(that.selector, angular.extend(that.options, {
            center: that.center,
            zoom: that.zoom,
            draggable: that.draggable,
            mapTypeId : google.maps.MapTypeId.ROADMAP
          }));
          
          google.maps.event.addListener(_instance, "dragstart",
              
              function () {
                that.dragging = true;
              }
          );
          
          google.maps.event.addListener(_instance, "idle",
              
              function () {
                that.dragging = false;
              }
          );
          
          google.maps.event.addListener(_instance, "drag",
              
              function () {
                that.dragging = true;   
              }
          );  
          
          google.maps.event.addListener(_instance, "zoom_changed",
              
              function () {
                that.zoom = _instance.getZoom();
                that.center = _instance.getCenter();
              }
          );
          
          google.maps.event.addListener(_instance, "center_changed",
              
              function () {
                that.center = _instance.getCenter();
              }
          );

          var layer = new google.maps.FusionTablesLayer({
            query: {
              select: 'Location',
              from: '1YIungSkFi1TvtLpNKYh81KJqK81XrNHqfq_zSrI'
            }
          });
          layer.setMap(_instance);
          
          // Attach additional event listeners if needed
          if (_handlers.length) {
            
            angular.forEach(_handlers, function (h, i) {
              
              google.maps.event.addListener(_instance, 
                  h.on, h.handler);
            });
          }
        }
        else {
          
          // Refresh the existing instance
          google.maps.event.trigger(_instance, "resize");
          
          var instanceCenter = _instance.getCenter();
          
          if (!floatEqual(instanceCenter.lat(), that.center.lat())
            || !floatEqual(instanceCenter.lng(), that.center.lng())) {
              _instance.setCenter(that.center);
          }
        
          if (_instance.getZoom() != that.zoom) {
            _instance.setZoom(that.zoom);
          }          
        }
      };
      
      this.fit = function () {
        if (_instance && _markers.length) {
          
          var bounds = new google.maps.LatLngBounds();
          
          angular.forEach(_markers, function (m, i) {
            bounds.extend(m.getPosition());
          });
          
          _instance.fitBounds(bounds);
        }
      };
      
      this.on = function(event, handler) {
        _handlers.push({
          "on": event,
          "handler": handler
        });
      };
      
      this.addMarker = function (lat, lng, icon, infoWindowContent, label, url,
          thumbnail) {
        
        if (that.findMarker(lat, lng) != null) {
          return;
        }
        
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: _instance,
          icon: icon
        });
        
        if (label) {
          
        }
        
        if (url) {
          
        }

        if (infoWindowContent != null) {
          var infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
          });

          google.maps.event.addListener(marker, 'click', function() {
            if (currentInfoWindow != null) {
              currentInfoWindow.close();
            }
            infoWindow.open(_instance, marker);
            currentInfoWindow = infoWindow;
          });
        }
        
        // Cache marker 
        _markers.unshift(marker);
        
        // Cache instance of our marker for scope purposes
        that.markers.unshift({
          "lat": lat,
          "lng": lng,
          "draggable": false,
          "icon": icon,
          "infoWindowContent": infoWindowContent,
          "label": label,
          "url": url,
          "thumbnail": thumbnail
        });
        
        // Return marker instance
        return marker;
      };      
      
      this.findMarker = function (lat, lng) {
        for (var i = 0; i < _markers.length; i++) {
          var pos = _markers[i].getPosition();
          
          if (floatEqual(pos.lat(), lat) && floatEqual(pos.lng(), lng)) {
            return _markers[i];
          }
        }
        
        return null;
      };  
      
      this.findMarkerIndex = function (lat, lng) {
        for (var i = 0; i < _markers.length; i++) {
          var pos = _markers[i].getPosition();
          
          if (floatEqual(pos.lat(), lat) && floatEqual(pos.lng(), lng)) {
            return i;
          }
        }
        
        return -1;
      };
      
      this.addInfoWindow = function (lat, lng, html) {
        var win = new google.maps.InfoWindow({
          content: html,
          position: new google.maps.LatLng(lat, lng)
        });
        
        _windows.push(win);
        
        return win;
      };
      
      this.hasMarker = function (lat, lng) {
        return that.findMarker(lat, lng) !== null;
      };  
      
      this.getMarkerInstances = function () {
        return _markers;
      };
      
      this.removeMarkers = function (markerInstances) {
        
        var s = this;
        
        angular.forEach(markerInstances, function (v, i) {
          var pos = v.getPosition(),
            lat = pos.lat(),
            lng = pos.lng(),
            index = s.findMarkerIndex(lat, lng);
          
          // Remove from local arrays
          _markers.splice(index, 1);
          s.markers.splice(index, 1);
          
          // Remove from map
          v.setMap(null);
        });
      };
    }
    
    // Done
    return PrivateMapModel;
  }());
  
  // End model
  
  // Start Angular directive
  
  var googleMapsModule = angular.module("google-maps", []);

  /**
   * Map directive
   */
  googleMapsModule.directive("googleMap", ["$log", "$timeout", "$filter", function ($log, $timeout, 
      $filter) {

    var controller = function ($scope, $element) {
      
      var _m = $scope.map;
      
      self.addInfoWindow = function (lat, lng, content) {
        _m.addInfoWindow(lat, lng, content);
      };
    };

    controller.$inject = ['$scope', '$element'];
    
    return {
      restrict: "ECA",
      priority: 100,
      transclude: true,
      template: "<div class='angular-google-map' ng-transclude></div>",
      replace: false,
      scope: {
        center: "=center", // required
        markers: "=markers", // optional
        latitude: "=latitude", // required
        longitude: "=longitude", // required
        zoom: "=zoom", // required
        refresh: "&refresh", // optional
        windows: "=windows", // optional
        events: "=events"
      },
      controller: controller,      
      link: function (scope, element, attrs, ctrl) {
        
        // Center property must be specified and provide lat & 
        // lng properties
        if (!angular.isDefined(scope.center) || 
            (!angular.isDefined(scope.center.latitude) || 
                !angular.isDefined(scope.center.longitude))) {
        	
          $log.error("angular-google-maps: could not find a valid center property");          
          return;
        }
        
        if (!angular.isDefined(scope.zoom)) {
        	$log.error("angular-google-maps: map zoom property not set");
        	return;
        }
        
        angular.element(element).addClass("angular-google-map");

        // Parse options
        var opts = {options: {}};
        if (attrs.options) {
          opts.options = angular.fromJson(attrs.options);
        }
        
        // Create our model
        var _m = new MapModel(angular.extend(opts, {
          container: element[0],            
          center: new google.maps.LatLng(scope.center.latitude, scope.center.longitude),              
          draggable: attrs.draggable == "true",
          zoom: scope.zoom
        }));       
      
        _m.on("drag", function () {
          
          var c = _m.center;
        
          $timeout(function () {
            
            scope.$apply(function (s) {
              scope.center.latitude = c.lat();
              scope.center.longitude = c.lng();
            });
          });
        });
      
        _m.on("zoom_changed", function () {
          
          if (scope.zoom != _m.zoom) {
            
            $timeout(function () {
              
              scope.$apply(function (s) {
                scope.zoom = _m.zoom;
              });
            });
          }
        });
      
        _m.on("center_changed", function () {
          var c = _m.center;
        
          $timeout(function () {
            
            scope.$apply(function (s) {
              
              if (!_m.dragging) {
                scope.center.latitude = c.lat();
                scope.center.longitude = c.lng();
              }
            });

          });
        });
        
        if (angular.isDefined(scope.events)) {
          for (var eventName in scope.events) {
            if (scope.events.hasOwnProperty(eventName) && angular.isFunction(scope.events[eventName])) {
              _m.on(eventName, function () {
                scope.events[eventName].apply(scope, [_m, eventName, arguments]);
              });
            }
          }
        }
        
        if (attrs.markClick == "true") {
          (function () {
            var cm = null;
            
            _m.on("click", function (e) {                         
              if (cm == null) {
                
                cm = {
                  latitude: e.latLng.lat(),
                  longitude: e.latLng.lng() 
                };
                
                scope.markers.push(cm);
              }
              else {
                cm.latitude = e.latLng.lat();
                cm.longitude = e.latLng.lng();
              }
              
              
              $timeout(function () {
                scope.latitude = cm.latitude;
                scope.longitude = cm.longitude;
                scope.$apply();
              });
            });
          }());
        }
        
        // Put the map into the scope
        scope.map = _m;
        
        // Check if we need to refresh the map
        if (angular.isUndefined(scope.refresh())) {
          // No refresh property given; draw the map immediately
          _m.draw();
        }
        else {
          scope.$watch("refresh()", function (newValue, oldValue) {
            if (newValue && !oldValue) {
              _m.draw();
            }
          }); 
        }
        
        // Markers
        scope.$watch("markers", function (newValue, oldValue) {
          
          $timeout(function () {
            
            angular.forEach(newValue, function (v, i) {
              if (!_m.hasMarker(v.latitude, v.longitude)) {
                _m.addMarker(v.latitude, v.longitude, v.icon, v.infoWindow);
              }
            });
            
            // Clear orphaned markers
            var orphaned = [];
            
            angular.forEach(_m.getMarkerInstances(), function (v, i) {
              // Check our scope if a marker with equal latitude and longitude. 
              // If not found, then that marker has been removed form the scope.
              
              var pos = v.getPosition(),
                lat = pos.lat(),
                lng = pos.lng(),
                found = false;
              
              // Test against each marker in the scope
              for (var si = 0; si < scope.markers.length; si++) {
                
                var sm = scope.markers[si];
                
                if (floatEqual(sm.latitude, lat) && floatEqual(sm.longitude, lng)) {
                  // Map marker is present in scope too, don't remove
                  found = true;
                }
              }
              
              // Marker in map has not been found in scope. Remove.
              if (!found) {
                orphaned.push(v);
              }
            });

            orphaned.length && _m.removeMarkers(orphaned);           
            
            // Fit map when there are more than one marker. 
            // This will change the map center coordinates
            if (attrs.fit == "true" && newValue && newValue.length > 1) {
              _m.fit();
            }
          });
          
        }, true);
        
        
        // Update map when center coordinates change
        scope.$watch("center", function (newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          
          if (!_m.dragging) {
            _m.center = new google.maps.LatLng(newValue.latitude, 
                newValue.longitude);          
            _m.draw();
          }
        }, true);
        
        scope.$watch("zoom", function (newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          
          _m.zoom = newValue;
          _m.draw();
        });
      }
    };
  }]);  
}());;app.directive('d3Globe', [function () {
	return {
		restrict: 'E',
		scope: {
			slices: '='
		},
		templateUrl: '/directives/d3line-directive/view.html',
		link: function (scope, element, attrs) {
			element.empty();
			var feature;

			var projection = d3.geo.azimuthal()
			    .scale(380)
			    .origin([-71.03,42.37])
			    .mode("orthographic")
			    .translate([640, 400]);

			var circle = d3.geo.greatCircle()
			    .origin(projection.origin());

			// TODO fix d3.geo.azimuthal to be consistent with scale
			var scale = {
			  orthographic: 380,
			  stereographic: 380,
			  gnomonic: 380,
			  equidistant: 380 / Math.PI * 2,
			  equalarea: 380 / Math.SQRT2
			};

			var path = d3.geo.path()
			    .projection(projection);

			var svg = d3.select(element[0]).append("svg:svg")
			    .attr("width", 1280)
			    .attr("height", 800)
			    .on("mousedown", mousedown);

			d3.json("world-countries.json", function(collection) {
			  feature = svg.selectAll("path")
			      .data(collection.features)
			    .enter().append("svg:path")
			      .attr("d", clip);

			  feature.append("svg:title")
			      .text(function(d) { return d.properties.name; });
			});

			d3.select(window)
			    .on("mousemove", mousemove)
			    .on("mouseup", mouseup);

			d3.select("select").on("change", function() {
			  projection.mode(this.value).scale(scale[this.value]);
			  refresh(750);
			});

			var m0,
			    o0;

			function mousedown() {
			  m0 = [d3.event.pageX, d3.event.pageY];
			  o0 = projection.origin();
			  d3.event.preventDefault();
			}

			function mousemove() {
			  if (m0) {
			    var m1 = [d3.event.pageX, d3.event.pageY],
			        o1 = [o0[0] + (m0[0] - m1[0]) / 8, o0[1] + (m1[1] - m0[1]) / 8];
			    projection.origin(o1);
			    circle.origin(o1)
			    refresh();
			  }
			}

			function mouseup() {
			  if (m0) {
			    mousemove();
			    m0 = null;
			  }
			}

			function refresh(duration) {
			  (duration ? feature.transition().duration(duration) : feature).attr("d", clip);
			}

			function clip(d) {
			  return path(circle.clip(d));
			}
		}
	};
}]);;app.directive('ofD3Line', [function () {
	return {
		restrict: 'E',
		scope: {
			slices: '='
		},
		templateUrl: '/directives/d3line-directive/view.html',
		link: function (scope, element, attrs) {
			scope.$watchCollection(function () {
				return scope.slices;
			}, function (newValues, oldValues) {
				element.empty();
				var width = 600,
					height = 400,
					x = d3.time.scale().range([0, width]),
					y = d3.scale.linear().range([height, 0]),
					xAxis = d3.svg.axis().scale(x).orient('bottom'),
					yAxis = d3.svg.axis().scale(y).orient('left'),
					svg = d3.select(element[0]);
				svg.append('svg')
					.attr('width', width)
					.attr('height', height);


			});
		}
	};
}]);;app.controller('DashboardCtrl', ['$scope', function ($scope) {
    $scope.somethingOnScope = [
    	{
    		title: 'hello',
    		data: 'world'
    	},
    	{
    		title: 'world',
    		data: 'hello'
    	}
    ];
    $scope.changeSomething = function () {
        $scope.somethingOnScope = [
        {
            title: 'something',
            data: 'world'
        },
        {
            title: 'else',
            data: 'hello'
        }
    ];
    }
}]);;app.controller('ContactCtrl', ['$scope', '$http', function ($scope, $http) {
    
}]);