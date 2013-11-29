$(document).ready(function() {

// In case we forget to take out console statements.
if(typeof(console) === 'undefined') {
    var console = {}
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

window.distance = 1;
window.max = 500;
window.zoomToRoute = false;

var from_data, to_data;
var routes = [];
var circles = [];
var startcircles = [];

// Instruct Leaflet to prefer canvas rendering
L_PREFER_CANVAS = true; 

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
var osmlayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});



var map = L.map('map', {
    // layers: [satlayer, osmlayer]
    layers: [osmlayer]
}).setView([52.13854550670474,5.811767578125], 8);
var hash = new L.Hash(map);




var baseMaps = {
    "Satellite": satlayer,
    "OSM": osmlayer
};
L.control.layers(baseMaps, {}, {position: 'bottomleft'}).addTo(map);


var legend = L.control({position: 'bottomright'});

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

legend.addTo(map);


var about = L.control({position: 'bottomright'});

about.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend desktop');
    div.innerHTML = "<strong>Wat is dit?</strong><br><hr size='0' noshade/><div style='width:121px;'>Klik ergens op de kaart om een bereikbaarheids-<br/>analyse te doen.</div>";
    return div;
};

about.addTo(map);


// Map clickhandler
map.on('click', function(e1){
    clearCircles();
    $.ajax({
      url: "/edge?lat="+e1.latlng.lat+"&lon="+e1.latlng.lng
    }).done(function(data) {
        to_data = JSON.parse(data);
        // console.log('to_data',to_data);
        var startcircle = new L.CircleMarker(e1.latlng, {stroke:false, fillOpacity: 100, fillColor:'black'}).addTo(map); //.bindPopup(edgedata.osm_name + "...");
        startcircles.push(startcircle);
          
        NProgress.start();
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
});
L.control.scale().addTo(map);

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

console.log('geometry:', layer.toGeoJSON().geometry);

if (type === 'polygon') {
$.ajax({
  type: "POST",
  url: "/polygon/" + window.clientid,
  data: {"polygon": JSON.stringify(layer.toGeoJSON().geometry)}
}).done(function( msg ) {
  console.log('Done!', msg);
});
map.addLayer(layer);
}
});


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




var SimulationValues = function() {
  this.distance = window.distance;
  this.max = window.max;
  this.zoomToRoute = false;
  this.message = 'Heerenveen';  
  this.saveImage = function(e) { 

    leafletImage(map, function(err, canvas) {
        // now you have canvas
        // example thing to do with that canvas:
        var img = document.createElement('img');
        var dimensions = map.getSize();
        img.width = dimensions.x;
        img.height = dimensions.y;
        img.src = canvas.toDataURL();
        var url = img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        window.open(url);
    });

  }; 
};
var ControlValues = function() {
    this.resetRoutes = function() {
        clearStartCircles();
        clearRoutes();
    };
    this.resetCircles = function() {
        clearStartCircles();
        clearCircles();
    };
    this.type = "0";
};
var simulation = new SimulationValues();
var controls = new ControlValues();

window.controls = controls;

var gui = new dat.GUI();
// gui.remember(simulation);
gui.close();


var f1 = gui.addFolder("Instellingen");
var f2 = gui.addFolder("Besturing");

f2.open();

// var distance_controller = f1.add(simulation, 'distance', 0, 50, 0.1).name("Distance (km)");
var max_controller = f1.add(simulation, 'max', 0, 9000).name("Max resultaten");
var zoomtoroute_controller = f1.add(simulation, 'zoomToRoute').name('Zoom naar route');
var scenario_controller = f1.add(simulation, 'message').name('3Di model');


var reset_routes_controller = f2.add(controls, 'resetRoutes').name('Verwijder routes');
var reset_circles_controller = f2.add(controls, 'resetCircles').name('Verwijder punten');
var type_controller = f2.add(controls, 'type', { 'Bereikbaarheid': 0, 'Punt-naar-punt': 1 } ).name('Type');
// f1.add(simulation, 'saveImage').name('Kaart opslaan');


type_controller.onChange(function(value) {
    console.log(value);
});

max_controller.onChange(function(value) {
  console.log("Maximum: ", max);
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


// get color depending on population density value
function getColor(d) {
// grades = [0, 5, 10, 15, 20, 25, 30, 35],
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

// Clears map of all layers, markers, lines and such.
function clearMap() {
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
    for(var i in circles) { map.removeLayer(circles[i]); }
}
function clearStartCircles() {
    for(var i in startcircles) { map.removeLayer(startcircles[i]); }
}
function clearRoutes() {
    for(var i in routes) { map.removeLayer(routes[i]); }
}


});