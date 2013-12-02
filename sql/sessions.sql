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

 Date: 11/29/2013 15:31:30 PM
*/

-- ----------------------------
--  Table structure for "sessions"
-- ----------------------------
DROP TABLE IF EXISTS "sessions";
CREATE TABLE "sessions" (
	"id" int4 NOT NULL DEFAULT nextval('serial'::regclass),
	"timestamp" timestamp(6) NULL DEFAULT now()
)
WITH (OIDS=FALSE);
ALTER TABLE "sessions" OWNER TO "pgrouting";

-- ----------------------------
--  Records of "sessions"
-- ----------------------------
BEGIN;
INSERT INTO "sessions" VALUES ('4', '2013-11-29 09:59:18.38109');
INSERT INTO "sessions" VALUES ('5', '2013-11-29 10:04:34.177409');
INSERT INTO "sessions" VALUES ('6', '2013-11-29 10:06:19.661477');
INSERT INTO "sessions" VALUES ('7', '2013-11-29 10:08:35.179881');
INSERT INTO "sessions" VALUES ('8', '2013-11-29 10:09:41.811041');
INSERT INTO "sessions" VALUES ('9', '2013-11-29 10:09:44.344575');
INSERT INTO "sessions" VALUES ('10', '2013-11-29 10:09:58.409118');
INSERT INTO "sessions" VALUES ('11', '2013-11-29 10:10:48.200863');
INSERT INTO "sessions" VALUES ('12', '2013-11-29 10:10:51.473703');
INSERT INTO "sessions" VALUES ('13', '2013-11-29 10:12:22.528495');
COMMIT;

-- ----------------------------
--  Primary key structure for table "sessions"
-- ----------------------------
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

