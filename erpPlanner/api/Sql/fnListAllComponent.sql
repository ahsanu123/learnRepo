CREATE OR REPLACE FUNCTION fnSelectVersionInfo ( count INTEGER)
RETURNS TABLE ( value text)
AS  $$ 
SELECT "Description" FROM "VersionInfo" 
$$
LANGUAGE SQL
