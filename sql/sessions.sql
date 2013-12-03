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
CREATE SEQUENCE serial;
DROP TABLE IF EXISTS "sessions";
CREATE TABLE "sessions" (
	"id" int4 NOT NULL DEFAULT nextval('serial'::regclass),
	"timestamp" timestamp(6) NULL DEFAULT now()
)
WITH (OIDS=FALSE);
ALTER TABLE "sessions" OWNER TO "pgrouting";

-- ----------------------------
--  Primary key structure for table "sessions"
-- ----------------------------
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

