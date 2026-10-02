const openapi = {
  openapi: "3.0.3",

  info: {
    title: "Maintenance API",
    version: "4.0.0",
    description: "API сервиса учёта заявок на обслуживание оборудования"
  },

  servers: [
    {
      url: "http://localhost:3000"
    }
  ],

  tags: [
    {
      name: "Auth"
    },
    {
      name: "Health"
    },
    {
      name: "Equipment"
    },
    {
      name: "Requests"
    },
    {
      name: "Analytics"
    }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },

    schemas: {
      Error: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: {
                type: "string"
              },
              message: {
                type: "string"
              },
              details: {}
            }
          }
        }
      },

      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          email: {
            type: "string",
            format: "email"
          },
          role: {
            type: "string",
            enum: [
              "viewer",
              "technician",
              "admin"
            ]
          },
          technicianId: {
            type: "string",
            format: "uuid",
            nullable: true
          }
        }
      },

      AuthResponse: {
        type: "object",
        properties: {
          accessToken: {
            type: "string"
          },
          user: {
            $ref: "#/components/schemas/User"
          }
        }
      },

      Equipment: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          name: {
            type: "string"
          },
          type: {
            type: "string",
            enum: [
              "turbine",
              "inverter",
              "sensor",
              "substation"
            ]
          },
          serialNumber: {
            type: "string"
          },
          status: {
            type: "string",
            enum: [
              "operational",
              "maintenance",
              "fault",
              "decommissioned"
            ]
          },
          installedAt: {
            type: "string",
            format: "date-time",
            nullable: true
          }
        }
      },

      Request: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          equipmentId: {
            type: "string",
            format: "uuid"
          },
          title: {
            type: "string"
          },
          description: {
            type: "string"
          },
          priority: {
            type: "string",
            enum: [
              "low",
              "medium",
              "high",
              "critical"
            ]
          },
          status: {
            type: "string",
            enum: [
              "new",
              "in_progress",
              "done",
              "rejected"
            ]
          }
        }
      }
    }
  },

  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Регистрация пользователя",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "email",
                  "password"
                ],
                properties: {
                  email: {
                    type: "string",
                    format: "email"
                  },
                  password: {
                    type: "string",
                    minLength: 8
                  }
                }
              }
            }
          }
        },

        responses: {
          "201": {
            description: "Пользователь создан"
          },
          "409": {
            description: "Пользователь уже существует"
          },
          "422": {
            description: "Ошибка валидации"
          }
        }
      }
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Вход",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "email",
                  "password"
                ],
                properties: {
                  email: {
                    type: "string",
                    format: "email"
                  },
                  password: {
                    type: "string"
                  }
                }
              }
            }
          }
        },

        responses: {
          "200": {
            description: "Успешный вход",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse"
                }
              }
            }
          },
          "401": {
            description: "Неверный email или пароль"
          },
          "429": {
            description: "Слишком много попыток"
          }
        }
      }
    },

    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Обновление access-токена",

        responses: {
          "200": {
            description: "Токен обновлён"
          },
          "401": {
            description: "Недействительный refresh-токен"
          }
        }
      }
    },

    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Выход",
        security: [
          {
            bearerAuth: []
          }
        ],

        responses: {
          "204": {
            description: "Сессия завершена"
          },
          "401": {
            description: "Неавторизован"
          }
        }
      }
    },

    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Текущий пользователь",
        security: [
          {
            bearerAuth: []
          }
        ],

        responses: {
          "200": {
            description: "Текущий пользователь",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      $ref: "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          "401": {
            description: "Неавторизован"
          }
        }
      }
    },

    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Проверка состояния API",

        responses: {
          "200": {
            description: "API работает"
          }
        }
      }
    },

    "/api/health/live": {
      get: {
        tags: ["Health"],
        summary: "Liveness",

        responses: {
          "200": {
            description: "Процесс работает"
          }
        }
      }
    },

    "/api/health/ready": {
      get: {
        tags: ["Health"],
        summary: "Readiness",

        responses: {
          "200": {
            description: "API и БД готовы"
          },
          "503": {
            description: "База данных недоступна"
          }
        }
      }
    },

    "/metrics": {
      get: {
        tags: ["Health"],
        summary: "Метрики Prometheus",

        responses: {
          "200": {
            description: "Метрики"
          }
        }
      }
    },

    "/api/equipment": {
      get: {
        tags: ["Equipment"],
        summary: "Список оборудования",
        security: [
          {
            bearerAuth: []
          }
        ]
      },

      post: {
        tags: ["Equipment"],
        summary: "Создание оборудования",
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    },

    "/api/equipment/{id}": {
      get: {
        tags: ["Equipment"],
        summary: "Получение оборудования",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            }
          }
        ]
      },

      patch: {
        tags: ["Equipment"],
        summary: "Изменение оборудования",
        security: [
          {
            bearerAuth: []
          }
        ]
      },

      delete: {
        tags: ["Equipment"],
        summary: "Удаление оборудования",
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    },

    "/api/requests": {
      get: {
        tags: ["Requests"],
        summary: "Список заявок",
        security: [
          {
            bearerAuth: []
          }
        ]
      },

      post: {
        tags: ["Requests"],
        summary: "Создание заявки",
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    },

    "/api/requests/{id}": {
      get: {
        tags: ["Requests"],
        summary: "Получение заявки",
        security: [
          {
            bearerAuth: []
          }
        ]
      },

      patch: {
        tags: ["Requests"],
        summary: "Изменение заявки",
        security: [
          {
            bearerAuth: []
          }
        ]
      },

      delete: {
        tags: ["Requests"],
        summary: "Удаление заявки",
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    },

    "/api/requests/{id}/status": {
      patch: {
        tags: ["Requests"],
        summary: "Изменение статуса заявки",
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    },

    "/api/requests/{id}/history": {
      get: {
        tags: ["Requests"],
        summary: "История статусов",
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    },

    "/api/requests/{id}/assignees": {
      post: {
        tags: ["Requests"],
        summary: "Назначение техника",
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    },

    "/api/requests/{id}/assignees/{userId}": {
      delete: {
        tags: ["Requests"],
        summary: "Удаление техника",
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    },

    "/api/sites/{id}/summary": {
      get: {
        tags: ["Analytics"],
        summary: "Сводка площадки",
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    },

    "/api/reports/equipment-load": {
      get: {
        tags: ["Analytics"],
        summary: "Отчёт по загрузке оборудования",
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    }
  }
};

export default openapi;