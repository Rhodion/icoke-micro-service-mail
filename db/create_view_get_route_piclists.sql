CREATE VIEW _v_get_route_piclists AS
SELECT
  piclists.id,
  piclist_sap_logs.data
FROM
  piclists
INNER JOIN
  piclist_sap_logs
ON
  piclist_sap_logs.piclist_id = piclists.id
WHERE
  piclists.status = 0
AND
  (
    (
        piclists.automation_step = 2
      AND
        piclist_sap_logs.status = 200
      AND
        piclist_sap_logs.automation_step = 1
      
    )
  OR
    (
        piclists.automation_step = 1
      AND
        piclist_sap_logs.status = 200
      AND
        piclist_sap_logs.automation_step = 0
    )
  OR
    (
        piclists.automation_step = 0
      AND
        piclist_sap_logs.status = 200
      AND
        piclist_sap_logs.automation_step = 0
    )
  )
AND
  DATE(piclists.created_at) < DATE(NOW())
ORDER BY 
  piclists.created_at;