TODO
====

Important
---------
* Integrate 3Di when this becomes possible through an API (polygon endpoint needed in
  the form of or similar to www.3di.nl/api/v1/<modelname>/<timestep>/result.json)

* Improve error handling ([Error: Stream unexpectedly ended during query execution])
	* This one is due to PostGIS crashing with a segfault and node-pg not being able to recover
	* See post-crash PG logs for more details


Would be nice
-------------
* Recalc routes button

* Save routes in a seperate table for saving and fast redrawing of scenarios

* Consider floodzones in DD calculation

* Exclude points in 'floodzones' from the Driving Distance results (but this can be gauged visually by the user)

* Solve iPad polygons drawing bug (depends on Leaflet.Draw issue #2)


Maybe
-----
* Include neighboring country OSM data for more realistic routing near country borders

* Export to png option (Perhaps do this server side using leaflet-headless?)

* Draw route polygons using their geometry instead concatenating their edge latlngs

* Integrate with Ionic or Bootstrap and move settings in a tab instead of dat.gui


