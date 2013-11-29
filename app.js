var config = require('./config');
var cluster = require('cluster');
var polylineEncoded = require('./public/javascripts/polyline-encoded');
var express = require('express');
var http = require('http');
var request = require('request');
var path = require('path');
var pg = require('pg');
var fs = require('fs');
var Hashids = require("hashids"),
    hashids = new Hashids("$#f4f34f4444dasdsadaddddioij3n2nn#");



if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }  
} else {


// Initialize application
var app = express();


// Configure Express
app.configure(function(){
  app.set('port', process.env.PORT || 3034);
  app.set('views', __dirname + '/views');
  // app.set('view engine', 'ejs');
  app.set('view engine', 'html');
  // app.enable('view cache');
  app.engine('jade', require('jade').__express);
  app.set('layout', 'layout');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  // app.use(express.bodyParser());
  app.use(express.bodyParser({strict: false}));
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
  app.use(express.compress());
  app.use(express.methodOverride());
  app.use(express.cookieParser('nlevac010103'));
  app.use(express.session());
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// var pgroutingTable = 'routing_beira_new';
var pgroutingTable = 'nl_2po_4pgr';
// var geometryFieldName = 'geom';
var geometryFieldName = 'geom_way';

var client = new pg.Client(config.pg.conString);
client.connect();


app.get('/edge',
function(req, res) {

  var lonlat = [req.query.lon, req.query.lat];
  console.log('lonlat:',lonlat);
  var search_factor = .01;

  var lon = parseFloat(lonlat[0]);
  var lat = parseFloat(lonlat[1]);
  var lonmin = parseFloat(lon - search_factor);
  var latmin = parseFloat(lat - search_factor);
  var lonplus = parseFloat(lon + search_factor);
  var latplus = parseFloat(lat + search_factor);

  var sql = "SELECT id::int4, \
              osm_name::VARCHAR,\
              source::int8, \
              target::int8, \
              "+geometryFieldName+", \
              ST_Distance( \
                ST_Transform("+geometryFieldName+", 4326), \
                ST_GeometryFromText(\'POINT("+lon+" "+lat+")\', 4326) \
              ) AS dist \
             FROM \
                "+pgroutingTable+" \
             ORDER BY \
                dist \
             LIMIT 1";

  console.log('edge sql: ', sql);             
  var query = client.query(sql, []);

  query.on('row', function(row) {
    console.log('row:', row);
    return res.json(JSON.stringify(row));
  });
  query.on('error', function(error) {
    console.log(error);
  });
});



app.get('/route/:clientid',
function(req, res) {

  var startEdge = parseFloat(req.query.startedge);
  var endEdge = parseFloat(req.query.endedge);
  var clientid = parseInt(req.param('clientid'));

  var sql = "SELECT * FROM                                                          \
             pgr_astar(                                                             \
               'SELECT id, source, target, cost, x1, y1, x2, y2                     \
               FROM "+pgroutingTable+" AS a                                         \
               WHERE a.id NOT IN(                                                   \
                 SELECT b.id                                                        \
                   FROM "+pgroutingTable+" AS b,                                    \
                   (SELECT ST_SetSRID(ST_Collect(the_geom), 4326) AS the_geom FROM polygons WHERE clientid = "+clientid+") AS c     \
                 WHERE ST_Intersects(b.geom_way,c.the_geom)                         \
               )',                                                                  \
            "+startEdge+", "+endEdge+", false, false)                               \
            JOIN "+pgroutingTable+"                                                 \
            ON id2 = "+pgroutingTable+".id ORDER BY seq";



  var query = client.query(sql, function(err, result) {
    //NOTE: error handling not present
    if(result) {

      var json = JSON.stringify(result.rows);
      // console.log('result:', result);
      // console.log('route json:', json);
      res.json(json);
    } else {
      console.log(err);
      res.json({});
    }
  });
  query.on('error', function(error) {
    console.log(error);
  });
});

app.get('/catchment/:clientid',
function(req, res) {
  var clientid = parseInt(req.param('clientid'));
  var length = parseFloat(req.query.length);
  // var length = 1;
  var startingPoint = parseFloat(req.query.startingpoint);
  var max = req.query.max;

  var sql = "SELECT osm_name, km, kmh, x1, y1, x2, y2, route.cost     \
      FROM "+pgroutingTable+"                                   \
      JOIN                                                      \
      (SELECT id2 AS vertex_id, cost FROM pgr_drivingdistance(' \
            SELECT id AS id,                                    \
                source::int4,                                   \
                target::int4,                                   \
                cost::float8                                    \
            FROM "+pgroutingTable+"',                           \
            " + startingPoint + ",                              \
            " + length + ",                                     \
            false,                                              \
            false)) AS route                                    \
      ON "+pgroutingTable+".id = route.vertex_id ORDER BY "+pgroutingTable+".cost LIMIT " + max;



  console.log('catchment sql: ', sql);

  var query = client.query(sql, function(err, result) {
    //NOTE: error handling not present
    if(result) {
      // console.log('result:', result);
      var json = JSON.stringify(result.rows);
      res.json(json);
    } else {
      console.log('catchment error:', err);
      res.json('{}');
    }
  });
  query.on('error', function(error) {
    console.log(error);
  });
});


app.post('/polygon/:clientid',
function(req, res) {
  console.log('req.body.polygon:', req.body.polygon);
  console.log('id:', req.param('clientid'));
  var clientid = parseInt(req.param('clientid'));

  var query = client.query('INSERT INTO "polygons" (the_geom, clientid) VALUES (ST_GeomFromGeoJSON($1), ($2))', [req.body.polygon, clientid]);
  query.on('end', function() {
    res.json(req.body.polygon);
  });
  query.on('error', function(error) {
    console.log(error);
  });
});

app.get('/polygons/:clientid',
function(req, res) {
  var clientid = parseInt(req.param('clientid'));
  var query = client.query('SELECT ST_AsGeoJSON(the_geom) AS geometry FROM "polygons" WHERE clientid = $1', [clientid]);
  var rows = [];
  query.on('row', function(row) {
    console.log(row);
    rows.push(row);
  });
  query.on('end', function(result) {
    res.json(rows);
  });
});



app.get('/',
function(req, res) {

  // A fresh visit. Create and return a new record
  var query = client.query('INSERT INTO "sessions" VALUES(default) RETURNING id, timestamp');
  query.on('row', function(row) {

    // Generate hash based on ID
    var id = hashids.encrypt(parseInt(row.id));
    
    // Redirect to hash
    res.redirect('/' + id);
  });
  query.on('error', function(error) {
    console.error('Error:', error);
  });
});


app.get('/:hash',
function(req, res) {

  // We're getting a hash
    if(req.param('hash')) {
      var hash = req.param('hash');  

      // Let's turn that into the original ID
      var id = hashids.decrypt(hash);
      console.log('id: ' + id + ', hash: ' + hash);

      if (!parseInt(id)) {
        // No integer returned by hash decryptor
        // Return to homepage to generate new session
        res.redirect('/');
      } else {
        // Check if it exists
        var query = client.query('SELECT COUNT(*) AS total FROM "sessions" WHERE id = $1', [parseInt(id)]);
        query.on('row', function(row) {
          console.log(row.total);
          if(row.total > 0) {
            // If so, pass it into the template
            res.render('index.jade', {
              id: id
            }); 
          } else {
            // Else, return to homepage to generate new session
            res.redirect('/');
          }
        });
        query.on('error', function(error) {
          console.error('Error:', error);
        });           
      }
    }
});

// Kick off the server workers
http.createServer(app).listen(3034, '0.0.0.0');
console.log('Worker ' + cluster.worker.id + ' running!');
// http.createServer(app).listen(80, '0.0.0.0');


} // end of (cluster.isMaster)


cluster.on('exit', function (worker) {
    // Replace the dead worker, we're not sentimental
    console.log('Worker ' + worker.id + ' died :(');
    cluster.fork();
});