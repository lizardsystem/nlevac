// In case we forget to take out console statements.
if(typeof(console) === 'undefined') {
    var console = {}
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

$(document).ready(function() {

// Application wide variables
window.distance = 1;
window.max = 500;
window.zoomToRoute = false;

var from_data, to_data;
var routes = [];
var start_popups = [];
var end_popups = [];
var circles = [];
var startcircles = [];
var mapClicked = 1;
var startingPoint, finishPoint;

// Instruct Leaflet to prefer canvas rendering
// window.L.PREFER_CANVAS = true; 

// Define some colors
var Color = net.brehaut.Color;
var Green = Color("#00FF00");
var Red = Color({hue: 0, saturation: 1, value: 1});
var Blue = Color("rgb(0,0,255)");
var Cyan = Color({hue: 180, saturation: 1, lightness: 0.5});
var Magenta = Color("hsl(300, 100%, 50%)");
var Yellow = Color([255,255,0]);

// Satellite baselayer
var satlayer = L.tileLayer('http://khm1.googleapis.com/kh/v=137&src=app&x={x}&y={y}&z={z}&s=&token=66417.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

// Define and add an OSM baselayer
var osmlayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});



// Instantiate Leaflet
var map = L.map('map', {
    layers: [osmlayer]
}).setView([52.13854550670474,5.811767578125], 8);
window.mapobj = map;
var hash = new L.Hash(map);
var scale = new L.control.scale().addTo(map);

// Configure basemaps object
var baseMaps = {
    "Satellite": satlayer,
    "OSM": osmlayer
};
// Add basemap selector
L.control.layers(baseMaps, {}, {position: 'bottomleft'}).addTo(map);




/**
 * Configure and add about text
 */
var about = L.control({position: 'bottomright'});

about.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend desktop');
    div.innerHTML = "<strong>Wat is dit?</strong><br><hr size='0' noshade/><div style='width:121px;'>Dit is een prototype voor evacuaties in Nederland op basis van 3Di.</div>";
    return div;
};

about.addTo(map);

/**
 * Configure and add legend
 */
var legend = L.control({position: 'bottomright'}); window.legend = legend;
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend desktop'),
        grades = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+') + ' min.');
    }
    div.innerHTML = '<strong><img src="/images/icon-car.png"/>&nbsp;Rijtijd</strong><br><hr size="0" noshade/><div style="width:121px;"><i style="background:black;"></i> Start<br/>' + labels.join('<br>') + '</div>';
    return div;
};





function showStartPopup(obj) {
  var geobj = obj.reverseGeoResponse.reverseGeoResult;
  var latlong = new L.LatLng(geobj.latitude, geobj.longitude);
  startingPoint = latlong;
  return true;
}

function showEndPopup(obj) {
  var geobj = obj.reverseGeoResponse.reverseGeoResult;
  var latlong = new L.LatLng(geobj.latitude, geobj.longitude);
  finishPoint = latlong;

  return L.marker(latlong).addTo(map)
          .bindPopup("...naar " + geobj.formattedAddress + " (" + data.route.summary.totalDistanceMeters + " meter)").openPopup();
}





/**
 *  Map click event
 */
map.on('click', function(e1){
    NProgress.start();
    if(window.controls.type === 'Bereikbaarheid') {

        clearCircles();
        $.ajax({
          url: "/edge?lat="+e1.latlng.lat+"&lon="+e1.latlng.lng
        }).done(function(data) {
            to_data = JSON.parse(data);
            // console.log('to_data',to_data);
            var startcircle = new L.CircleMarker(e1.latlng, {stroke:false, fillOpacity: 100, fillColor:'black'}).addTo(map); //.bindPopup(edgedata.osm_name + "...");
            startcircles.push(startcircle);
              
            NProgress.inc();
            $.ajax({
                url: "/catchment/"+window.clientid+"?startingpoint=" + to_data.source + "&length=" + window.distance + "&max=" + window.max
            }).done(function(catchment_data) {
                NProgress.done();
                var cd = JSON.parse(catchment_data);
                //console.log('catchment_data:', cd);

                $.each(cd, function(i, v) {
                    var cost = (v.cost*100);

                    var colorCost = getColor(cost);

                    var circle = new L.CircleMarker(
                        new L.LatLng(v.y1,v.x1),
                        {
                            stroke: false,
                            fillColor: colorCost
                        })
                        .addTo(map)
                        .bindPopup("Gemiddeld " + Math.round(cost) + " minuten rijden naar dit punt.");

                    circles.push(circle);

                    circle.on('click', function(e2) {
                        NProgress.start();
                        $.ajax({
                          url: "/edge?lat="+e2.latlng.lat+"&lon="+e2.latlng.lng
                        }).done(function(data) {
                          NProgress.set(0.4);
                          var from_data = JSON.parse(data);
                            $.ajax({
                                url: "/route/"+window.clientid+"?startedge="+from_data.source+"&endedge="+to_data.target
                            }).done(function(e3) {
                                // $.each(routes, function(i,v) { map.removeLayer(v); });

                                var route_data = JSON.parse(e3);
                                var latlngs = [];
                                
                                latlngs.push(e2.latlng);
                                $.each(route_data, function(i, value) {
                                    latlngs.push(new L.LatLng(value.y1, value.x1));
                                });
                                latlngs.push(e1.latlng);
                                var pl = new L.Polyline(latlngs, {color:'blue', weight: 10, clickable: false}).addTo(map);

                                routes.push(pl);
                                NProgress.done();
                                if(window.zoomtoroute) {
                                    map.fitBounds(pl.getBounds());
                                }
                            });
                        });
                    });
                    circles.push(circle);
                });
            });
        });
    }


    if(window.controls.type === 'Punt-naar-punt') {

        mapClicked++;

        if(mapClicked % 2 === 0) {
            // Start of route
            NProgress.inc();
            $.ajax({
                url: "/edge?lat="+e1.latlng.lat+"&lon="+e1.latlng.lng
            }).done(function(data) {
                NProgress.done();
                from_data = JSON.parse(data);
                var startpopup = L.marker(e1.latlng).addTo(map)
                    .bindPopup("Van " + from_data.osm_name + "...").openPopup();
                start_popups.push(startpopup);
            });
            return true;
        } else {
            // End of route
            NProgress.start();
            $.ajax({
                url: "/edge?lat="+e1.latlng.lat+"&lon="+e1.latlng.lng
            }).done(function(data) {
                to_data = JSON.parse(data);
                var endpopup = L.marker(e1.latlng, {
                        bounceOnAdd: true,
                        bounceOnAddOptions: {duration: 500, height: 100}
                    }).addTo(map)
                    .bindPopup("Naar " + to_data.osm_name + "...").openPopup();
                    end_popups.push(endpopup);

                $.ajax({
                    url: "/route/"+window.clientid+"?startedge="+from_data.source+"&endedge="+to_data.target
                }).done(function(e) {
                    NProgress.done();
                    var route_data = JSON.parse(e);
                    var latlngs = [];
                    
                    // latlngs.push(e1.latlng);
                    $.each(route_data, function(i,value) {
                        latlngs.push(new L.LatLng(value.y1, value.x1));
                    });
                    latlngs.push(endpopup._latlng);
                    
                    var pl = new L.Polyline(latlngs, {color:'red', weight: 10, clickable: false}).addTo(map);
                    routes.push(pl);
                    if(window.zoomtoroute) { map.fitBounds(pl.getBounds()); }
                });
            });
        }

    }
});




/**
 * Leaflet.draw configuration
 */


var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    draw: {
        position: 'topleft',
        circle: false,
        rectangle: false,
        polyline: false,
        marker: false,
        polygon: {
            title: 'Teken een polygoon om een blokkade aan te duiden.',
            allowIntersection: false,
            drawError: {
                color: '#b00b00',
                timeout: 1000
            },
            shapeOptions: {
                color: 'teal',
                fillOpacity: 0.7
            }
        }
    },
    edit: false
});
map.addControl(drawControl);


map.on('draw:created', function (e) {
    var type = e.layerType,
    layer = e.layer;

    if (type === 'polygon') {
        $.ajax({
          type: "POST",
          url: "/polygon/" + window.clientid,
          data: {"polygon": JSON.stringify(layer.toGeoJSON().geometry)}
        }).done(function( msg ) {
          // console.log('Done!', msg);
        });
        map.addLayer(layer);
    }
});





/**
 * Load and draw all polygon data for this client id
 */

$.ajax({
  url: "/polygons/" + window.clientid
}).done(function(polygons) {
  for (var i = 0; i < polygons.length; i++) {
    if(polygons[i].geometry){
        L.geoJson(
            JSON.parse(polygons[i].geometry), {
                style: function (feature) {
                    return {
                        color: 'teal',
                        stroke: false,
                        fillOpacity: 0.7
                    };
                }
            }
        ).addTo(map);
    }
  }
});





/**
 * DAT.gui configuration
 */

var SimulationValues = function() {
    // Object to hold simulation variables
    this.distance = window.distance;
    this.max = window.max;
    this.zoomToRoute = false;
    this.modelname = '';
    this.savemap = function() {
        console.log('save map');
        leafletImage(
            window.mapobj, doImage
        );
    };
};
var ControlValues = function() {
    this.resetRoutes = function() {
        clearStartCircles(); clearRoutes();
    };
    this.resetCircles = function() {
        clearStartCircles(); clearCircles();
    };
    this.resetApp = function() {
        window.location.href = "../";
    };
    this.type = 'Punt-naar-punt';
};

// Instantiate the value objects
var simulation = new SimulationValues(); window.simulation = simulation;
var controls = new ControlValues(); window.controls = controls;


var gui = new dat.GUI(); gui.close();


var type_controller = gui.add(controls, 'type', [ 'Bereikbaarheid', 'Punt-naar-punt' ] ).name('Type');
var scenario_controller = gui.add(simulation, 'modelname').name('3Di model');
var max_controller = gui.add(simulation, 'max', 0, 9000).name("Max resultaten");
var zoomtoroute_controller = gui.add(simulation, 'zoomToRoute').name('Zoom naar route');
// var export_controller = gui.add(simulation, 'savemap').name('Exporteer afbeelding');

var reset_routes_controller = gui.add(controls, 'resetRoutes').name('Verwijder routes');
var reset_circles_controller = gui.add(controls, 'resetCircles').name('Verwijder punten');
var reset_total_controller = gui.add(controls, 'resetApp').name('Nieuwe sessie');

max_controller.onChange(function(value) {
  window.max = Math.round(value);
});
zoomtoroute_controller.onChange(function(checked) {
  if(checked) {
    window.zoomtoroute = true;
  } else {
    window.zoomtoroute = false;
  }
});     
scenario_controller.onFinishChange(function(value) {
    console.log('scenario:',value);
});


window.controls.watch("type", function (id, oldval, newval) {
    // console.log( "window." + id + " changed from " + oldval + " to " + newval );
    if(newval === 'Bereikbaarheid') {
        window.legend.addTo(mapobj);
    } else {
        window.legend.removeFrom(mapobj);
    }
    return newval;
});



/**
 * Convenience functions
 */

function getColor(d) {
    // Get color depending on integer value 0-50
    return d > 45  ? '#660000' : // very very dark red
           d > 40  ? '#AA0000' : // very dark red
           d > 35  ? '#CC0000' : // dark red
           d > 30  ? '#FF0000' : // red
           d > 25  ? '#CC0066' : // rose
           d > 20  ? '#DD6F00' : // dark orange
           d > 15  ? '#FF8000' : // orange
           d > 10  ? '#EEEE00' : // yellow
           d > 5   ? '#74C476' : // matte green
           d > 0   ? '#00FF00' : // bright geen
                     '#00FF84';  // blueish green
}

function clearMap() {
    // Clears map of all layers, markers, lines and such.
    for(i in map._layers) {
        if(map._layers[i]._path != undefined) {
            try {
                map.removeLayer(map._layers[i]);
            }
            catch(e) {
                console.log("Problem with " + e + map._layers[i]);
            }
        }
    }
}
function clearCircles() {
    // Removes circles from map
    for(var i in circles) { map.removeLayer(circles[i]); }
}
function clearStartCircles() {
    // Removes startpoints from map
    for(var i in startcircles) { map.removeLayer(startcircles[i]); }
}
function clearRoutes() {
    // Removes route polygons from map
    for(var i in routes) { map.removeLayer(routes[i]); }
    for(var i in start_popups) { map.removeLayer(start_popups[i]); }
    for(var i in end_popups) { map.removeLayer(end_popups[i]); }
}
function doImage(err, canvas) {
    window.open(canvas.toDataURL("image/png"));
}


});

















/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
 
// object.watch
if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
          enumerable: false
        , configurable: true
        , writable: false
        , value: function (prop, handler) {
            var
              oldval = this[prop]
            , newval = oldval
            , getter = function () {
                return newval;
            }
            , setter = function (val) {
                oldval = newval;
                return newval = handler.call(this, prop, oldval, val);
            }
            ;
            
            if (delete this[prop]) { // can't watch constants
                Object.defineProperty(this, prop, {
                      get: getter
                    , set: setter
                    , enumerable: true
                    , configurable: true
                });
            }
        }
    });
}
 
// object.unwatch
if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
          enumerable: false
        , configurable: true
        , writable: false
        , value: function (prop) {
            var val = this[prop];
            delete this[prop]; // remove accessors
            this[prop] = val;
        }
    });
}