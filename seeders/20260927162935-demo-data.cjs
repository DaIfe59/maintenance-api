"use strict";

function uuid(number) {
  return `00000000-0000-0000-0000-${String(number).padStart(12, "0")}`;
}

module.exports = {
  async up(queryInterface) {
    const now = "2026-09-27T12:00:00.000Z";

    const sites = [
      {
        id: uuid(1),
        name: "Северная площадка",
        code: "SITE-001",
        region: "Северный регион",
        latitude: 55.752,
        longitude: 37.618,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(2),
        name: "Южная площадка",
        code: "SITE-002",
        region: "Южный регион",
        latitude: 48.856,
        longitude: 2.352,
        createdAt: now,
        updatedAt: now
      }
    ];

    const equipment = [
      {
        id: uuid(101),
        site_id: uuid(1),
        name: "Турбина 1",
        type: "turbine",
        serial_number: "TR-001",
        status: "operational",
        installed_at: "2024-03-15T10:00:00.000Z",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(102),
        site_id: uuid(1),
        name: "Турбина 2",
        type: "turbine",
        serial_number: "TR-002",
        status: "maintenance",
        installed_at: "2024-04-20T10:00:00.000Z",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(103),
        site_id: uuid(1),
        name: "Инвертор 1",
        type: "inverter",
        serial_number: "INV-001",
        status: "operational",
        installed_at: "2024-05-10T10:00:00.000Z",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(104),
        site_id: uuid(2),
        name: "Датчик температуры",
        type: "sensor",
        serial_number: "SNS-001",
        status: "operational",
        installed_at: "2024-06-01T10:00:00.000Z",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(105),
        site_id: uuid(2),
        name: "Подстанция 1",
        type: "substation",
        serial_number: "SUB-001",
        status: "fault",
        installed_at: "2023-11-15T10:00:00.000Z",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(106),
        site_id: uuid(2),
        name: "Инвертор 2",
        type: "inverter",
        serial_number: "INV-002",
        status: "decommissioned",
        installed_at: "2023-08-01T10:00:00.000Z",
        createdAt: now,
        updatedAt: now
      }
    ];

    const passports = [
      {
        id: uuid(401),
        equipment_id: uuid(101),
        manufacturer: "NordWind",
        model: "NW-500",
        nominal_power: 500.0,
        last_verification_at: "2026-06-01T10:00:00.000Z",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(402),
        equipment_id: uuid(102),
        manufacturer: "NordWind",
        model: "NW-500",
        nominal_power: 500.0,
        last_verification_at: "2026-05-15T10:00:00.000Z",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(403),
        equipment_id: uuid(103),
        manufacturer: "PowerTech",
        model: "PT-100",
        nominal_power: 100.0,
        last_verification_at: "2026-04-20T10:00:00.000Z",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(404),
        equipment_id: uuid(104),
        manufacturer: "SensorLab",
        model: "SL-20",
        nominal_power: 20.0,
        last_verification_at: "2026-03-10T10:00:00.000Z",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(405),
        equipment_id: uuid(105),
        manufacturer: "GridWorks",
        model: "GW-800",
        nominal_power: 800.0,
        last_verification_at: "2026-02-15T10:00:00.000Z",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(406),
        equipment_id: uuid(106),
        manufacturer: "PowerTech",
        model: "PT-150",
        nominal_power: 150.0,
        last_verification_at: "2026-01-25T10:00:00.000Z",
        createdAt: now,
        updatedAt: now
      }
    ];

    const technicians = [
      {
        id: uuid(201),
        full_name: "Иванов Иван Иванович",
        specialization: "Механик",
        employee_number: "EMP-001",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(202),
        full_name: "Петров Петр Петрович",
        specialization: "Электрик",
        employee_number: "EMP-002",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(203),
        full_name: "Сидоров Алексей Викторович",
        specialization: "Инженер КИП",
        employee_number: "EMP-003",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(204),
        full_name: "Кузнецов Максим Сергеевич",
        specialization: "Инженер-механик",
        employee_number: "EMP-004",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(205),
        full_name: "Смирнов Дмитрий Андреевич",
        specialization: "Энергетик",
        employee_number: "EMP-005",
        createdAt: now,
        updatedAt: now
      }
    ];

    const requests = [
      {
        id: uuid(301),
        equipment_id: uuid(101),
        title: "Плановый осмотр турбины",
        description: "Ежемесячный осмотр",
        priority: "low",
        status: "new",
        planned_at: "2026-10-01T09:00:00.000Z",
        author: "Иванов И.И.",
        createdAt: "2026-09-01T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(302),
        equipment_id: uuid(101),
        title: "Проверка тормозной системы",
        description: "Проверка узлов торможения",
        priority: "medium",
        status: "in_progress",
        planned_at: "2026-09-20T09:00:00.000Z",
        author: "Петров П.П.",
        createdAt: "2026-08-25T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(303),
        equipment_id: uuid(102),
        title: "Замена масла",
        description: "Замена масла редуктора",
        priority: "high",
        status: "done",
        planned_at: "2026-08-10T09:00:00.000Z",
        author: "Иванов И.И.",
        createdAt: "2026-07-20T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(304),
        equipment_id: uuid(102),
        title: "Проверка подшипников",
        description: "Проверка состояния подшипников",
        priority: "critical",
        status: "rejected",
        planned_at: "2026-07-15T09:00:00.000Z",
        author: "Сидоров А.В.",
        createdAt: "2026-07-01T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(305),
        equipment_id: uuid(103),
        title: "Диагностика инвертора",
        description: "Плановая диагностика",
        priority: "medium",
        status: "new",
        planned_at: "2026-10-03T09:00:00.000Z",
        author: "Петров П.П.",
        createdAt: "2026-09-02T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(306),
        equipment_id: uuid(103),
        title: "Замена фильтра",
        description: "Замена воздушного фильтра",
        priority: "low",
        status: "done",
        planned_at: "2026-08-05T09:00:00.000Z",
        author: "Кузнецов М.С.",
        createdAt: "2026-07-10T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(307),
        equipment_id: uuid(104),
        title: "Калибровка датчика",
        description: "Калибровка температурного датчика",
        priority: "high",
        status: "in_progress",
        planned_at: "2026-09-25T09:00:00.000Z",
        author: "Сидоров А.В.",
        createdAt: "2026-09-05T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(308),
        equipment_id: uuid(104),
        title: "Проверка кабеля",
        description: "Проверка кабельной линии",
        priority: "medium",
        status: "new",
        planned_at: "2026-10-05T09:00:00.000Z",
        author: "Смирнов Д.А.",
        createdAt: "2026-09-06T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(309),
        equipment_id: uuid(105),
        title: "Аварийная диагностика",
        description: "Диагностика неисправности",
        priority: "critical",
        status: "in_progress",
        planned_at: "2026-09-26T09:00:00.000Z",
        author: "Иванов И.И.",
        createdAt: "2026-09-07T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(310),
        equipment_id: uuid(105),
        title: "Замена автомата",
        description: "Замена неисправного автомата",
        priority: "high",
        status: "done",
        planned_at: "2026-08-20T09:00:00.000Z",
        author: "Петров П.П.",
        createdAt: "2026-08-01T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(311),
        equipment_id: uuid(106),
        title: "Проверка ресурса",
        description: "Проверка остаточного ресурса",
        priority: "low",
        status: "rejected",
        planned_at: "2026-07-01T09:00:00.000Z",
        author: "Сидоров А.В.",
        createdAt: "2026-06-20T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(312),
        equipment_id: uuid(106),
        title: "Проверка отключения",
        description: "Проверка оборудования перед демонтажом",
        priority: "medium",
        status: "done",
        planned_at: "2026-08-12T09:00:00.000Z",
        author: "Смирнов Д.А.",
        createdAt: "2026-07-25T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(313),
        equipment_id: uuid(101),
        title: "Осмотр лопастей",
        description: "Визуальный осмотр",
        priority: "high",
        status: "new",
        planned_at: "2026-10-10T09:00:00.000Z",
        author: "Иванов И.И.",
        createdAt: "2026-09-10T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(314),
        equipment_id: uuid(102),
        title: "Контроль вибрации",
        description: "Измерение уровня вибрации",
        priority: "critical",
        status: "in_progress",
        planned_at: "2026-09-28T09:00:00.000Z",
        author: "Петров П.П.",
        createdAt: "2026-09-11T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(315),
        equipment_id: uuid(103),
        title: "Проверка охлаждения",
        description: "Проверка системы охлаждения",
        priority: "medium",
        status: "done",
        planned_at: "2026-08-25T09:00:00.000Z",
        author: "Кузнецов М.С.",
        createdAt: "2026-08-05T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(316),
        equipment_id: uuid(104),
        title: "Замена датчика",
        description: "Плановая замена",
        priority: "high",
        status: "rejected",
        planned_at: "2026-08-15T09:00:00.000Z",
        author: "Смирнов Д.А.",
        createdAt: "2026-07-30T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(317),
        equipment_id: uuid(105),
        title: "Проверка релейной защиты",
        description: "Проверка настроек защиты",
        priority: "critical",
        status: "new",
        planned_at: "2026-10-12T09:00:00.000Z",
        author: "Иванов И.И.",
        createdAt: "2026-09-12T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(318),
        equipment_id: uuid(106),
        title: "Проверка изоляции",
        description: "Измерение сопротивления изоляции",
        priority: "medium",
        status: "done",
        planned_at: "2026-08-30T09:00:00.000Z",
        author: "Петров П.П.",
        createdAt: "2026-08-10T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(319),
        equipment_id: uuid(101),
        title: "Профилактический осмотр",
        description: "Плановое обслуживание",
        priority: "low",
        status: "new",
        planned_at: "2026-10-15T09:00:00.000Z",
        author: "Сидоров А.В.",
        createdAt: "2026-09-14T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: uuid(320),
        equipment_id: uuid(105),
        title: "Проверка после ремонта",
        description: "Контрольная проверка",
        priority: "high",
        status: "in_progress",
        planned_at: "2026-09-29T09:00:00.000Z",
        author: "Кузнецов М.С.",
        createdAt: "2026-09-15T10:00:00.000Z",
        updatedAt: now
      }
    ];

    const history = [];

    for (const request of requests) {
      history.push({
        id: uuid(500 + Number(request.id.slice(-3))),
        request_id: request.id,
        previous_status: null,
        new_status: "new",
        author: request.author,
        comment: "Заявка создана",
        changed_at: request.createdAt
      });

      if (
        request.status === "in_progress" ||
        request.status === "done"
      ) {
        history.push({
          id: uuid(
            600 + Number(request.id.slice(-3))
          ),
          request_id: request.id,
          previous_status: "new",
          new_status: "in_progress",
          author: request.author,
          comment: "Заявка принята в работу",
          changed_at: request.updatedAt
        });
      }

      if (request.status === "done") {
        history.push({
          id: uuid(
            700 + Number(request.id.slice(-3))
          ),
          request_id: request.id,
          previous_status: "in_progress",
          new_status: "done",
          author: request.author,
          comment: "Работы завершены",
          changed_at: request.updatedAt
        });
      }

      if (request.status === "rejected") {
        history.push({
          id: uuid(
            800 + Number(request.id.slice(-3))
          ),
          request_id: request.id,
          previous_status: "new",
          new_status: "rejected",
          author: request.author,
          comment: "Заявка отклонена",
          changed_at: request.updatedAt
        });
      }
    }

    const assignees = requests
      .filter(
        (request) =>
          request.status !== "new"
      )
      .map((request, index) => ({
        id: uuid(900 + index),
        request_id: request.id,
        technician_id: uuid(
          201 + (index % 5)
        ),
        role: "lead",
        hours: 4,
        createdAt: now,
        updatedAt: now
      }));

    await queryInterface.bulkInsert(
      "sites",
      sites
    );

    await queryInterface.bulkInsert(
      "equipment",
      equipment
    );

    await queryInterface.bulkInsert(
      "equipment_passports",
      passports
    );

    await queryInterface.bulkInsert(
      "technicians",
      technicians
    );

    await queryInterface.bulkInsert(
      "maintenance_requests",
      requests
    );

    await queryInterface.bulkInsert(
      "request_status_history",
      history
    );

    await queryInterface.bulkInsert(
      "request_assignees",
      assignees
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      "request_assignees",
      null
    );

    await queryInterface.bulkDelete(
      "request_status_history",
      null
    );

    await queryInterface.bulkDelete(
      "maintenance_requests",
      null
    );

    await queryInterface.bulkDelete(
      "equipment_passports",
      null
    );

    await queryInterface.bulkDelete(
      "equipment",
      null
    );

    await queryInterface.bulkDelete(
      "technicians",
      null
    );

    await queryInterface.bulkDelete(
      "sites",
      null
    );
  }
};