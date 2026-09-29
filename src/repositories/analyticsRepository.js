import { QueryTypes } from "sequelize";
import sequelize from "../config/database.js";

export async function getSiteSummary(siteId) {
  const rows = await sequelize.query(
    `
      SELECT
        s.id,
        s.name,
        s.code,

        COUNT(DISTINCT e.id)::int AS equipment_count,

        COUNT(DISTINCT mr.id) FILTER (
          WHERE mr.status = 'new'
        )::int AS new_requests,

        COUNT(DISTINCT mr.id) FILTER (
          WHERE mr.status = 'in_progress'
        )::int AS in_progress_requests,

        COUNT(DISTINCT mr.id) FILTER (
          WHERE mr.status = 'done'
        )::int AS done_requests,

        COUNT(DISTINCT mr.id) FILTER (
          WHERE mr.status = 'rejected'
        )::int AS rejected_requests,

        COUNT(DISTINCT mr.id) FILTER (
          WHERE mr.priority = 'low'
        )::int AS low_priority,

        COUNT(DISTINCT mr.id) FILTER (
          WHERE mr.priority = 'medium'
        )::int AS medium_priority,

        COUNT(DISTINCT mr.id) FILTER (
          WHERE mr.priority = 'high'
        )::int AS high_priority,

        COUNT(DISTINCT mr.id) FILTER (
          WHERE mr.priority = 'critical'
        )::int AS critical_priority,

        ROUND(
          AVG(
            EXTRACT(
              EPOCH FROM (
                done_history.changed_at - mr."createdAt"
              )
            ) / 3600
          )::numeric,
          2
        ) AS average_close_hours

      FROM sites s

      LEFT JOIN equipment e
        ON e.site_id = s.id

      LEFT JOIN maintenance_requests mr
        ON mr.equipment_id = e.id

      LEFT JOIN request_status_history done_history
        ON done_history.request_id = mr.id
        AND done_history.new_status = 'done'

      WHERE s.id = :siteId

      GROUP BY s.id, s.name, s.code
    `,
    {
      replacements: { siteId },
      type: QueryTypes.SELECT
    }
  );

  return rows[0] || null;
}

export async function getEquipmentLoad({
  dateFrom = null,
  dateTo = null,
  minCount = 0
}) {
  const rows = await sequelize.query(
    `
      WITH filtered_requests AS (
        SELECT
          mr.id,
          mr.equipment_id,
          mr.status
        FROM maintenance_requests mr
        WHERE (:dateFrom IS NULL OR mr."createdAt" >= :dateFrom)
          AND (:dateTo IS NULL OR mr."createdAt" <= :dateTo)
      ),

      request_stats AS (
        SELECT
          equipment_id,
          COUNT(*)::int AS request_count,
          COUNT(*) FILTER (
            WHERE status = 'done'
          )::int AS closed_count
        FROM filtered_requests
        GROUP BY equipment_id
      ),

      hours_stats AS (
        SELECT
          fr.equipment_id,
          COALESCE(SUM(ra.hours), 0)::numeric AS planned_hours
        FROM filtered_requests fr
        JOIN request_assignees ra
          ON ra.request_id = fr.id
        GROUP BY fr.equipment_id
      ),

      service_stats AS (
        SELECT
          fr.equipment_id,
          MAX(rsh.changed_at) AS last_service_at
        FROM filtered_requests fr
        JOIN request_status_history rsh
          ON rsh.request_id = fr.id
          AND rsh.new_status = 'done'
        GROUP BY fr.equipment_id
      )

      SELECT
        e.id AS equipment_id,
        e.name,
        e.serial_number,
        e.type,
        e.status AS equipment_status,

        s.id AS site_id,
        s.name AS site_name,
        s.code AS site_code,

        COALESCE(rs.request_count, 0)::int AS request_count,
        COALESCE(rs.closed_count, 0)::int AS closed_count,
        COALESCE(hs.planned_hours, 0)::numeric AS planned_hours,
        ss.last_service_at

      FROM equipment e

      JOIN sites s
        ON s.id = e.site_id

      LEFT JOIN request_stats rs
        ON rs.equipment_id = e.id

      LEFT JOIN hours_stats hs
        ON hs.equipment_id = e.id

      LEFT JOIN service_stats ss
        ON ss.equipment_id = e.id

      WHERE COALESCE(rs.request_count, 0) >= :minCount

      ORDER BY request_count DESC, e.name ASC
    `,
    {
      replacements: {
        dateFrom,
        dateTo,
        minCount
      },
      type: QueryTypes.SELECT
    }
  );

  return rows;
}