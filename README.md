nlevac
======

This is a proof-of-concept interactive Reachability Analysis and Routing tool.


API Endpoints
-------------

 * GET /api/v1/edge/ - finds a routable edge in proximity of given latlon
 * GET /api/v1/route/:clientid - calculates route between two edges and intersects with the polygons of :clientid
 * GET /api/v1/catchment/:clientid - calculates driveshed from a given latlon, respects polygons of :clientid
 * GET /api/v1/polygons:/:clientid - returns all polygons for :clientid
 * POST /api/v1/polygon/:id - accepts a polygon in 3857 projection and stores it using :clientid


Installation
------------

This tool was developed and tested on an Ubuntu Precise (12.04 LTS) installation.

Furthermore, you'll need a recent version of PostGIS and PGRouting built with Driving Distance support.

```
$ sudo aptitude update
$ sudo aptitude install libcgal8 libcgal-dev install postgresql-9.1-postgis postgresql-server-dev-9.1 libboost-all-dev cmake
$ git clone https://github.com/pgRouting/pgrouting.git
$ cd pgrouting
$ mkdir build
$ cd build
$ cmake -DWITH_DD=ON ..
$ make
$ sudo make install
$ sudo service postgresql restart
```

[Configure PostGIS](http://bit.ly/16o7wIY). 

Download the [OpenStreetMap](http://www.openstreetmap.org/) data you need from [Geofabrik](http://download.geofabrik.de/) or an OSM mirror.

Download and install [osm2po](http://osm2po.de/). I used 4.7.7.
Install Java if you don't have it on your system already:

```
$ sudo aptitude install openjdk-7-jre-headless
```

Then run osm2po as such:

```
$ java -jar osm2po-core-4.7.7-signed.jar prefix=nl netherlands.osm
```
This will start a text-based wizard that'll ask some questions and finish with a statement. Copy-paste it into your prompt and run it:

```
$ psql -U username -W -d database -q -f "/path-to/osm2po-4.7.7/nl/nl_2po_4pgr.sql"
```

Install Node.js:

```
$ sudo aptitude install nodejs
```

Now, in this repo, run the node package manager:
```
$ npm install
```

This will read package.json and install the specified node packages in node_modules.
Edit the config.pg.conString variable in config.js to match your PostGIS setup.
Edit the variables pgroutingTable and geometryFieldName in app.js to match your PostGIS setup.

Run the application:
```
$ node app.js
```

To run it forever, look at upstart, node-forever and things like that.
