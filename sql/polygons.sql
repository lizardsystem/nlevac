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

-- ----------------------------
--  Records of "polygons"
-- ----------------------------
BEGIN;
INSERT INTO "polygons" VALUES ('0103000000010000001500000000000000F0391240DC27F6FCFA254A400000000010DD1240826CD233F8224A4000000000B00F134077601E97A61B4A400000000030801340FD26F2DBBB114A4000000000D0DF1340449B470E7F0E4A4000000000406F1440F53DB6F71E0C4A4000000000F0DC1440283C8C5E95074A4000000000D04715404388B7FAB0034A400000000010AD1540F5269ABD4F014A400000000020151640F5269ABD4F014A4000000000106116404BE30602B8064A400000000020151640283C8C5E95074A4000000000309C1540D3CB5CA0BE094A400000000050311540D64D1767330D4A4000000000A0691440956C2822E4134A40FFFFFFFF3FBB13400B2E1E858E174A40FFFFFFFF5F7D13403BB640E7CD1D4A400000000050421340BF827CA579244A400000000010DD12409AAF3B6034294A400000000070501240B59B93626B294A4000000000F0391240DC27F6FCFA254A40', '0');
INSERT INTO "polygons" VALUES ('0103000000010000000E00000000000000A00F1440CE2BF12272004A4000000000C0DF14404A02BE33BFF4494000000000C0471640DDBDE273CBF249400000000050C61640DE908D5049064A400000000040121740D204F052B60E4A400000000060B517403107458C8D0C4A400000000040991740F5269ABD4F014A40FFFFFFFF7F1D17400F2F13C632E6494000000000C0ED1540A5116F6E6AE649400000000010451440EF6BF2D424F2494000000000904D13402B43EECE3FFB494000000000C096124013B13E3A42034A400000000010FC11407A9C32A2CA0F4A4000000000A00F1440CE2BF12272004A40', '0');
INSERT INTO "polygons" VALUES ('010300000001000000040000000000000020D717403ABD0CAE006B4A40FFFFFFFF1FB818405DDB7A0D5A634A4000000000C0BD184072F40C6CCB714A400000000020D717403ABD0CAE006B4A40', '0');
INSERT INTO "polygons" VALUES ('0103000000010000000400000000000000007D1940D11294EF18704A4000000000801A1A40D53196A43F6F4A4000000000801A1A40C8A7BB6FA6614A4000000000007D1940D11294EF18704A40', '0');
INSERT INTO "polygons" VALUES ('01030000000100000004000000FFFFFFFF5F5B17402849801ABBA54A400000000060961840E5100E350D944A400000000060011740E5100E350D944A40FFFFFFFF5F5B17402849801ABBA54A40', '116');
INSERT INTO "polygons" VALUES ('010300000001000000120000000000000000B0134032B3F8EBF5014A4000000000E05515400DDBFB30D9EB4940FFFFFFFFDF631640BA0FFCF99FF049400000000020231740328B2DE76B054A4000000000E0D91840FEEDAE870B244A400000000080661940E2D3252720174A400000000060771940D64D1767330D4A4000000000A0361A40CD294242560C4A4000000000E0411A40B161447BE11E4A400000000060FE194035283B75A7354A40000000004001194035283B75A7354A400000000000E81740D5C06264A2294A400000000040E51640C016018C241A4A40000000002015164053D20BB91F044A40FFFFFFFF5F6C154053D20BB91F044A400000000060B814404BE30602B8064A4000000000C02B144013F67FB272084A400000000000B0134032B3F8EBF5014A40', '117');
INSERT INTO "polygons" VALUES ('01030000000100000004000000FFFFFFFFBFB2144019B8CDC621F749400000000000611740FF7DED2287014A400000000080881540F9B9BD05D0124A40FFFFFFFFBFB2144019B8CDC621F74940', '119');
INSERT INTO "polygons" VALUES ('0103000000010000000600000000000000A0931740E63304374D8D4A400000000040B5194026A523DB466C4A4000000000E0C81A40EC0354D20B814A400000000060A41940E22242F850954A400000000040A71840E22242F850954A4000000000A0931740E63304374D8D4A40', '120');
INSERT INTO "polygons" VALUES ('010300000001000000140000000000000000941140F266A83FEEFE494000000000C00F1240F266A83FEEFE49400000000000CF124052F627B8F6F4494000000000204513409DB047878BEA494000000000A0881340BFD70F717CCC4940FFFFFFFFDF7414406582C73D5EC6494000000000A04A1540473D2D5D7EC54940FFFFFFFFFF251640B48B03F7EBB74940FFFFFFFF9FDF1640CDCB6D7B51AA49400000000080771740B09790AE5C9B49400000000000BB17408FBCDFC815A1494000000000A01A1840EA2BA72026AF494000000000A01A1840CEC7227C2EC4494000000000C0DC17407D9E0540ECCC494000000000804A17409A8A6A5CFAE0494000000000803C1640C6EB8FFA69EB494000000000A01D1540F30B60BF65F54940FFFFFFFF5F7D13404388B7FAB0034A400000000060E8114046118E2439104A400000000000941140F266A83FEEFE4940', '121');
INSERT INTO "polygons" VALUES ('0103000000010000000400000000000000807717409AAF3B6034294A400000000060F018401913403A7C274A400000000060F01840FABDAD5B393E4A4000000000807717409AAF3B6034294A40', '121');
INSERT INTO "polygons" VALUES ('010300000001000000040000000000000060F612409F5E90726F1B4A4000000000406C1740A40DA195A9F349400000000060FE1940380AE5DE9B0A4A400000000060F612409F5E90726F1B4A40', '121');
INSERT INTO "polygons" VALUES ('010300000001000000040000000000000080AA1140A40DA195A9F34940000000004042144071C7CAAE87F44940FFFFFFFF3FDA124013A16C50362C4A400000000080AA1140A40DA195A9F34940', '10179');
INSERT INTO "polygons" VALUES ('0103000000010000000500000000000000203415409907C89E84114A400000000080C31640B102F0BA3A004A4000000000406C1740CC07BE679D234A400000000000451540EBCBA9452F234A4000000000203415409907C89E84114A40', '10179');
INSERT INTO "polygons" VALUES ('010300000001000000040000000000000080F01640876424A37D484A40FFFFFFFF7FDF1840898C398481304A40000000008066194010A65DA9304D4A400000000080F01640876424A37D484A40', '10179');
INSERT INTO "polygons" VALUES ('01030000000100000004000000FFFFFFFF1FC9164048ED26D43B884A4000000000203F1940C9FC71ADA0644A400000000060D119408F471DE61E864A40FFFFFFFF1FC9164048ED26D43B884A40', '10179');
INSERT INTO "polygons" VALUES ('0103000000010000000400000000000000009F15401C9D682572DA494000000000804A17406D8F7F4916D6494000000000804A174030DA2A2ED9E1494000000000009F15401C9D682572DA4940', '10179');
INSERT INTO "polygons" VALUES ('010300000001000000050000000000000000CF124043F39CF49A504A40FFFFFFFFBFD11340DFB3C465B9554A400000000040E813400BD54AD8823C4A400000000020BE12401335C232CC3A4A400000000000CF124043F39CF49A504A40', '10179');
INSERT INTO "polygons" VALUES ('010300000001000000080000000000000060C91240EBFB60C743F64940000000008088154078F3226ADDC9494000000000E0EA1640F266A83FEEFE4940FFFFFFFF5F7D134002459318F3114A400000000040801240AB650F97ED0E4A4000000000200A12404BE30602B8064A4000000000200A1240303B16B1A1FD49400000000060C91240EBFB60C743F64940', '10249');
INSERT INTO "polygons" VALUES ('0103000000010000000600000000000000C0CE16404E80F159C6284A4000000000C04419403C9A47667E2A4A4000000000A0281940CB070A845E3A4A400000000060691840CB070A845E3A4A400000000060B51740CB070A845E3A4A4000000000C0CE16404E80F159C6284A40', '10249');
INSERT INTO "polygons" VALUES ('0103000000010000000500000000000000E09E174082099C0F54664A40000000002004184095615995695A4A4000000000C0CB19406166C8627A654A40FFFFFFFF7FDF1840BD4E4B58D07C4A4000000000E09E174082099C0F54664A40', '10249');
INSERT INTO "polygons" VALUES ('0103000000010000000B0000000000000060E2174068933B758E044A400000000020E51840A4CF462FFD044A4000000000A0FB1840FA75105A08FB4940FFFFFFFF1F99194050ECFCF1C3FC49400000000080C019406A1EDC14790B4A40FFFFFFFF3F5B1940449B470E7F0E4A4000000000E0AC1840AB650F97ED0E4A4000000000600F1840AB650F97ED0E4A400000000000BB1740F6AB5B83100E4A400000000060881740A4CF462FFD044A400000000060E2174068933B758E044A40', '10249');
INSERT INTO "polygons" VALUES ('010300000001000000080000000000000020531440C6EB8FFA69EB494000000000206F16401C9D682572DA494000000000607A1640C6EB8FFA69EB49400000000080A71440E34A980904084A4000000000C0771340E129698AA9004A4000000000C0771340925AE62005EE494000000000E0ED13409A8A6A5CFAE049400000000020531440C6EB8FFA69EB4940', '10258');
INSERT INTO "polygons" VALUES ('0103000000010000000A00000000000000409C1440740C73C4D4F549400000000020231740BDB134BAC1EF4940000000000015184050ECFCF1C3FC494000000000C0361840460263C689144A400000000000E8174022EA1759C82B4A4000000000006F18404A692FD3F0394A4000000000C0AF17400BD54AD8823C4A4000000000809616409592EAD7372F4A4000000000E0FB1440D3CB5CA0BE094A4000000000409C1440740C73C4D4F54940', '10260');
INSERT INTO "polygons" VALUES ('0103000000010000000A00000000000000C0281740303B16B1A1FD494000000000800C1940B102F0BA3A004A4000000000800C1940DF80A33A6B184A4000000000800C194035283B75A7354A4000000000A07418407AF557DF393B4A400000000080F0164016446FC1F0364A40000000002042164030D1EC05051E4A4000000000E0DC1540E34A980904084A400000000080E2154019B8CDC621F7494000000000C0281740303B16B1A1FD4940', '10261');
INSERT INTO "polygons" VALUES ('010300000001000000040000000000000048D014401B0CBD0A34014A40000000006012154024D6537AD7114A4000000000402315402813ED9DE7FF49400000000048D014401B0CBD0A34014A40', '10262');
INSERT INTO "polygons" VALUES ('0103000000010000000B000000FFFFFFFFFF361440D570A9E4D0FA49400000000090881440FEB56B8D10FE494000000000402315406AF9D80628F649400000000080011540A40DA195A9F3494000000000C81315403B805AC1BBF0494000000000C0661540A40DA195A9F34940000000005865154051F87A5C68F94940000000005031154057F99BD232FD4940000000000091144053D20BB91F044A40FFFFFFFF97081440CE2BF12272004A40FFFFFFFFFF361440D570A9E4D0FA4940', '10264');
INSERT INTO "polygons" VALUES ('0103000000010000000500000000000000C0661540F6B143B163FE4940FFFFFFFF070016403DE2F559EF064A40FFFFFFFFE73D164044895C6634F4494000000000A805164092F28E5E5EED494000000000C0661540F6B143B163FE4940', '10264');
INSERT INTO "polygons" VALUES ('010300000001000000060000000000000080C61340B940B4A66B094A400000000060D71340E5A755F509FF494000000000284C13406BFD57F1E0004A400000000018E41240B8550D9D3A0C4A40FFFFFFFF0F371340CEDBFC42E60F4A400000000080C61340B940B4A66B094A40', '10264');
INSERT INTO "polygons" VALUES ('010300000001000000050000000000000090011440059C13E4DE104A400000000078731440372B9F155A134A400000000020AD1440E4971090640A4A400000000048491440E9A5B2EFBE054A400000000090011440059C13E4DE104A40', '10264');
INSERT INTO "polygons" VALUES ('0103000000010000000700000000000000405E164042EDE79AC9434A4000000000807717401ED79829802D4A400000000060771940C5C06797A04A4A4000000000A0ED174025B507E3E0684A40FFFFFFFFFF251640A68C2D890D654A4000000000E0AF154010A65DA9304D4A4000000000405E164042EDE79AC9434A40', '10266');
COMMIT;

