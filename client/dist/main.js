var app = angular.module('immiviz', [
    'ngRoute',
    'google-maps'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'DashboardCtrl',
            templateUrl: '/dashboard/view.html'
        })
        .when('/map', {
            controller: 'MapCtrl',
            templateUrl: '/map/view.html'
        })
        .otherwise('/');
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
              from: '1lqWreQHRPfRTZbhb1vU6ubCYVm0n1dCQk6wx-bA'
            }
          });
          layer.setMap(_instance);

          var mariluLayer = new google.maps.KmlLayer('/directives/marilu/marilu.kml');
          mariluLayer.setMap(_instance);
          console.log(mariluLayer)
          
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
		template: '<div class="globeElement"></div>',
		scope: {
			selectedCountry: '='
		},
		link: function (scope, element, attrs) {

			var globeElement = element.children('.globeElement'),
				globeWidth = globeElement.width(),
				halfGlobeWidth = globeWidth / 2;
			globeElement.empty();
			globeElement.height(globeWidth);
			var activeFeature = null;
			var feature;

			var projection = d3.geo.orthographic()
			    .scale(halfGlobeWidth)
			    .translate([halfGlobeWidth, halfGlobeWidth])
			    .rotate([-71.03,42.37])
			    .clipAngle(90)
			    .precision(.1);

			var circle = d3.geo.circle()
			    .origin(projection.rotate());

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

			var svg = d3.select(globeElement[0]).append("svg:svg")
			    .attr("width", globeWidth)
			    .attr("height", globeWidth)
			    .on("mousedown", mousedown);

			function makeShitHappen(){


				d3.json("world-countries.json", function(collection) {
				  feature = svg.selectAll("path")
				    .data(collection.features)
				    .enter().append("svg:path")
				    .attr("d", path);

				  feature.append("svg:title")
				      .text(function(d) { return d.properties.name; });
				  feature.append("id")
				      .text(function(d) { return d.id; });
				  feature.on("click", click);
				  /*
				  feature.on("click", function(){
				  	if (activeFeature !== null) { 
				  		activeFeature.style("fill", "#8399b0");
				  	}
				  	activeFeature = d3.select(this);
				  	//console.log(scope);
				  	scope.$parent.changeCountry({name: activeFeature.select("id")[0][0].textContent, fullName: activeFeature.select("title")[0][0].textContent});
				  	//scope.selectedCountry.name = activeFeature.select("id")[0][0].textContent;
				  	activeFeature.style("fill", "magenta");
				  });
				  */
				});

				d3.select(window)
				    .on("mousemove", mousemove)
				    .on("mouseup", mouseup);

				d3.select("select").on("change", function() {
				  projection.mode(this.value).scale(scale[this.value]);
				  refresh(750);
				});

			}

			var m0,
			    o0;

			function mousedown() {
			  m0 = [d3.event.pageX, d3.event.pageY];
			  o0 = projection.rotate();
			  d3.event.preventDefault();
			}

			function mousemove() {
			  if (m0) {
			    var m1 = [d3.event.pageX, d3.event.pageY]
			      , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
			    projection.rotate(o1);
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

			function click(d) {
			  if (activeFeature === d) return reset();

			  activeFeature = d;
			  scope.$parent.changeCountry({name: d.id, fullName: d.properties.name});
			  svg.selectAll(".active").classed("active", false);
			  d3.select(this).classed("active", active = d);

			  var b = path.bounds(d);
			  feature.transition().duration(750).attr("transform",
			      "translate(" + projection.translate() + ")"
			      + "scale(" + .95 / Math.max((b[1][0] - b[0][0]) / globeWidth, (b[1][1] - b[0][1]) / globeWidth) + ")"
			      + "translate(" + -(b[1][0] + b[0][0]) / 2 + "," + -(b[1][1] + b[0][1]) / 2 + ")");
			}

			function reset() {
			  feature.selectAll(".active").classed("active", active = false);
			  feature.transition().duration(750).attr("transform", "");
			}

			function refresh(duration) {
			  (duration ? feature.transition().duration(duration) : feature).attr("d", path);
			}

			makeShitHappen();
		}
	};
}]);;app.directive('marilu', [function () {
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
}]);;app.directive('ofRickshaw', [function () {
	return {
		restrict: 'E',
		template: '<div class="rickshawtwolines"></div>',
		scope: {
			lines: '='
		},
		link: function (scope, element, attrs) {
			var margin = {
				top: 20,
				right: 20,
				bottom: 30,
				left: 50
			};

			var rickshawTwoLines = element.children('.rickshawtwolines');

			scope.$watchCollection('lines', function (newValues, oldValues) {
				var containingWidth = rickshawTwoLines.width() - 100;
				rickshawTwoLines.empty();
				rickshawTwoLines.html('<div class="leftaxis"></div><div class="chart"></div><div class="rightaxis"></div>')

				var leftAxis = rickshawTwoLines.find('.leftaxis')[0],
					chart = rickshawTwoLines.find('.chart')[0],
					rightAxis = rickshawTwoLines.find('.rightaxis')[0];

				if (typeof newValues === 'object') {
					var data = [];
					 for (var i in newValues) {
					 	var item = newValues[i];
						data.push({
							x: new Date(item.year,1,1).getTime() / 1000,
							y: item.gdp
						});
					};

					var second = data.map(function (thing) {
						return {
							x: thing.x,
							y: thing.y / 2
						};
					});

					var palette = new Rickshaw.Color.Palette({
						scheme: 'spectrum14'
					});

					var graph = new Rickshaw.Graph( {
					    element: chart, 
					    width: containingWidth,
                        renderer: 'line',
                        interpolation: 'linear',
					    series: [
					    	{
						        color: palette.color(),
						        data: data	
					    	},
					    	{
						        color: palette.color(),
						        data: second	
					    	}
					    ]
					});

					var yScale = new Rickshaw.Graph.Axis.Y.Scaled({
						graph: graph,
						grid: false,
						orientation: 'left',
						tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
						element: leftAxis,
						scale: d3.scale.linear(d3.extent(data, function (item) {
							return item.y; 
						}))
					});

					new Rickshaw.Graph.Axis.Y.Scaled({
						element: rightAxis,
						graph: graph,
						grid: false,
						orientation: 'right',
						scale: d3.scale.linear(d3.extent(second, function (item) {
							return item.y; 
						}))
					});

					var time = new Rickshaw.Graph.Axis.Time({
						graph: graph
					});


					var hover = new Rickshaw.Graph.HoverDetail({
						graph: graph
					});

					graph.render();
				}
			});

		}
	};
}]);;app.controller('DashboardCtrl', ['$scope', function ($scope) {
    var i, c, year,
        allCountriesData = {};

    $scope.countries={};


    $.getJSON('world-countries.json', function(json) {
        for (num in json.features) {
            var feature = json.features[num];
            c = feature.id;
            allCountriesData[c] = {};

            $scope.countries[c] = {
                properties: {
                    name: feature.properties.name
                }
            };
            for (i = 0; i < 25; i++) {
                year = i < 10 ? '200' : '20';
                allCountriesData[c][i] = {
                    year: parseInt(year + i),
                    gdp: Math.random() * 10000
                };
            }
        }


        $scope.selectedCountry = {
            name: 'USA',
            fullName: 'Please Select a Country'
        };

        $scope.changeCountry($scope.selectedCountry);
    });

    $scope.changeCountry = function (selectedCountry) {
        $scope.selectedCountry = selectedCountry;
        $scope.lineData = allCountriesData[selectedCountry.name];
        $scope.$apply();
    };
    $scope.$watch('selectedCountry', function() {
        //console.log($scope.selectedCountry);
    }, true);
}]);;app.controller('MapCtrl', ['$scope', function ($scope) {
        angular.extend($scope, {
                center: {
                        latitude: 19.0000, // initial map center latitude
                        longitude: -102.3667 // initial map center longitude
                },
                markers: [], // an array of markers,
                zoom: 5, // the zoom level
        });
}]);