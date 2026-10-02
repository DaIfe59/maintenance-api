# Maintenance API

REST API на Express для учёта оборудования производственной площадки и заявок на техническое обслуживание.

## Требования

- Node.js 20+
- npm

## Установка

```bash
npm install
Запуск
npm start

Для разработки:

npm run dev

Сервер запускается по адресу:

http://localhost:3000
Переменные окружения

Создайте файл .env на основе .env.example.

Переменная	Описание
PORT	Порт сервера
NODE_ENV	Режим работы
CORS_ORIGINS	Разрешённые источники CORS
RATE_LIMIT_WINDOW_MS	Окно rate limit
RATE_LIMIT_MAX	Максимальное количество запросов
WEATHER_API_URL	URL погодного API
REQUEST_TIMEOUT_MS	Таймаут внешнего API
WEATHER_MAX_PRECIPITATION	Максимальные осадки для наружных работ
WEATHER_MAX_WIND_SPEED	Максимальная скорость ветра
LOG_LEVEL	Уровень логирования
Модель оборудования
{
  "id": "uuid",
  "name": "Turbina 1",
  "type": "turbine",
  "serialNumber": "TR-001",
  "location": {
    "lat": 52.1,
    "lon": 4.3
  },
  "status": "operational",
  "installedAt": "2025-05-10T10:00:00.000Z"
}

Типы оборудования:

turbine
inverter
sensor
substation

Статусы:

operational
maintenance
fault
decommissioned

id генерируется сервером.

serialNumber должен быть уникальным.

installedAt не может быть датой из будущего.

Модель заявки
{
  "id": "uuid",
  "equipmentId": "uuid",
  "title": "Проверка турбины",
  "description": "Плановая проверка оборудования",
  "priority": "medium",
  "status": "new",
  "plannedAt": "2026-10-01T10:00:00.000Z",
  "createdAt": "2026-09-22T10:00:00.000Z",
  "updatedAt": "2026-09-22T10:00:00.000Z"
}

Приоритеты:

low
medium
high
critical

Статусы:

new
in_progress
done
rejected
Переходы статусов
new → in_progress → done
 │          │
 └──────────┴──→ rejected

Из done и rejected переходы запрещены.

Недопустимый переход возвращает 409 Conflict.

API
Method	Endpoint	Назначение
GET	/api/health	Проверка сервиса
GET	/api/equipment	Список оборудования
POST	/api/equipment	Создание оборудования
GET	/api/equipment/:id	Получение оборудования
PATCH	/api/equipment/:id	Изменение оборудования
DELETE	/api/equipment/:id	Удаление оборудования
GET	/api/equipment/:id/requests	Заявки оборудования
GET	/api/equipment/:id/weather	Прогноз погоды
GET	/api/requests	Список заявок
POST	/api/requests	Создание заявки
GET	/api/requests/:id	Получение заявки
PATCH	/api/requests/:id	Изменение заявки
PATCH	/api/requests/:id/status	Изменение статуса
DELETE	/api/requests/:id	Удаление заявки
Фильтрация, сортировка и пагинация

Для /api/equipment:

?page=1
&limit=10
&sortBy=name
&sortOrder=asc
&status=maintenance
&type=turbine

Для /api/requests:

?page=1
&limit=10
&sortBy=createdAt
&sortOrder=desc
&status=new
&priority=high
&equipmentId=<uuid>

Ответ списка:

{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10
  }
}
Ошибки

Все ошибки возвращаются в едином формате:

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Некорректные данные запроса",
    "details": [
      {
        "field": "priority",
        "message": "Недопустимое значение приоритета."
      }
    ],
    "requestId": "uuid"
  }
}

Основные HTTP-коды:

200 — успешный запрос
201 — ресурс создан
204 — ресурс удалён
400 — некорректный JSON
404 — ресурс или маршрут не найден
409 — конфликт данных или недопустимый переход
422 — ошибка валидации
429 — превышение лимита запросов
502 — внешнее погодное API недоступно
Погодный прогноз

Эндпоинт:

GET /api/equipment/:id/weather

Сервис использует координаты оборудования и внешний Open-Meteo API.

День считается подходящим для наружных работ, если:

precipitation <= WEATHER_MAX_PRECIPITATION

и

windSpeed <= WEATHER_MAX_WIND_SPEED

Текущие значения задаются через .env.

Безопасность

Используются:

CORS с явным списком разрешённых источников;
rate limiting для /api;
Helmet;
ограничение JSON body до 100kb;
requestId для каждого запроса;
централизованная обработка ошибок.

Секреты и .env не хранятся в репозитории.

Архитектура
routes
  ↓
controllers
  ↓
services
  ↓
repositories

Бизнес-логика находится в сервисах.

Работа с JSON-файлами находится в репозиториях.

Погодный API вынесен в отдельный модуль.

Запуск сервера отделён от сборки Express-приложения.

Структура проекта
src/
├── app.js
├── server.js
├── routes/
├── controllers/
├── services/
├── repositories/
├── middlewares/
├── validators/
├── errors/
├── config/
└── weather/

data/
docs/
└── postman/
Postman

Коллекция находится:

docs/postman/maintenance-api.postman_collection.json

Используется Environment:

Maintenance API Local

Переменные:

baseUrl
equipmentId
requestId

Этот README закрывает обязательные пункты по установке, окружению, API, модели данных, статусам, ошибкам, безопасности и структуре проекта. :contentReference[oaicite:5]{index=5}

---


В терминале:

```powershell
git status

Потом:

git add .
git commit -m "docs: finalize project documentation"

## Case 3 — PostgreSQL и Sequelize

В третьем кейсе сервис технического обслуживания переведён с хранения данных в JSON на PostgreSQL с использованием Sequelize.

### Требования

- Node.js 20+
- Docker Desktop
- PostgreSQL 16 через Docker Compose

### Запуск PostgreSQL

Запустить контейнер:

```powershell
docker compose up -d