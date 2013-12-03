/*
 Navicat Premium Data Transfer

 Source Server         : 33.33.33.44
 Source Server Type    : PostgreSQL
 Source Server Version : 90110
 Source Host           : 33.33.33.44
 Source Database       : pgrouting
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 90110
 File Encoding         : utf-8

 Date: 11/29/2013 15:31:25 PM
*/

-- ----------------------------
--  Table structure for "polygons"
-- ----------------------------
DROP TABLE IF EXISTS "polygons";
CREATE TABLE "polygons" (
	"the_geom" "geometry",
	"clientid" int4 DEFAULT 0
)
WITH (OIDS=FALSE);
ALTER TABLE "polygons" OWNER TO "pgrouting";

