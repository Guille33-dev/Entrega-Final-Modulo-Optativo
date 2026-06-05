# GymManager API - Entrega Final Node.js

API nueva de gestión de gimnasio desarrollada con **Node.js**, **Express**, **MongoDB**, **Mongoose**, **Pug**, **JWT**, **tests**, **OpenAPI**, **logs**, **health check** y **GitHub Actions**.

La temática es distinta a la utilizada durante el curso, ya que esta aplicación se centra en la gestión de un gimnasio: entrenadores, clases, socios y reservas.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Pug
- JSON Web Tokens
- bcryptjs
- dotenv
- node:test
- c8
- GitHub Actions
- Render

## Instalación

```bash
npm install
```

Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configura el archivo `.env`:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/gymmanager_final
JWT_SECRET=cambia_este_secreto_access_token
JWT_REFRESH_SECRET=cambia_este_secreto_refresh_token
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## Ejecutar la aplicación

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

La aplicación queda disponible en:

```text
http://localhost:3000
```

## Usuario administrador de prueba

Para crear un usuario administrador y algunos entrenadores de ejemplo:

```bash
npm run seed:admin
```

Credenciales generadas:

```text
usuario: admin
contraseña: admin123
rol: admin
```

## Vistas Pug

La aplicación incluye las vistas pedidas en UD1 y UD2:

| Vista | Ruta | Descripción |
|---|---|---|
| Página principal | `/` | Index de la aplicación |
| Listar recursos | `/classes` | Lista clases del gimnasio |
| Crear recurso | `/classes/new` | Formulario para crear una clase |

## Modelos MongoDB / Mongoose

La aplicación incluye 5 modelos:

- `User`
- `Trainer`
- `GymClass`
- `Member`
- `Booking`

### Relación 1:N

Existe relación 1:N entre:

- `Trainer` → `GymClass`: un entrenador puede tener muchas clases.
- `Member` → `Booking`: un socio puede tener muchas reservas.
- `GymClass` → `Booking`: una clase puede tener muchas reservas.

## Validaciones Mongoose

Los esquemas incluyen:

- campos `String`
- campos enumerados
- campos `Number`
- campos `Boolean`
- campos `Date`
- `required`
- `default`
- `min`, `max`, `minlength` y `maxlength`
- mensajes personalizados de validación

## Endpoints principales

### Auth

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/refresh` | Refrescar access token |

### Trainers

| Método | Ruta | Protección |
|---|---|---|
| GET | `/api/trainers` | Pública |
| GET | `/api/trainers/:id` | Pública |
| POST | `/api/trainers` | Admin |
| PUT | `/api/trainers/:id` | Admin |
| DELETE | `/api/trainers/:id` | Admin |

### Classes

| Método | Ruta | Protección |
|---|---|---|
| GET | `/api/classes` | Pública |
| GET | `/api/classes/:id` | Pública |
| POST | `/api/classes` | Admin o trainer |
| PUT | `/api/classes/:id` | Admin o trainer |
| DELETE | `/api/classes/:id` | Admin |

### Members

| Método | Ruta | Protección |
|---|---|---|
| GET | `/api/members` | Usuario autenticado |
| GET | `/api/members/:id` | Usuario autenticado |
| POST | `/api/members` | Admin |
| PUT | `/api/members/:id` | Admin |
| DELETE | `/api/members/:id` | Admin |

### Bookings

| Método | Ruta | Protección |
|---|---|---|
| GET | `/api/bookings` | Usuario autenticado |
| GET | `/api/bookings/:id` | Usuario autenticado |
| POST | `/api/bookings` | Usuario autenticado |
| PUT | `/api/bookings/:id` | Admin o trainer |
| DELETE | `/api/bookings/:id` | Admin |

Con esto se cumplen los requisitos de UD5:

- al menos 2 rutas con cualquier rol autenticado: `/api/members`, `/api/bookings`, etc.
- al menos 2 rutas con rol concreto: `POST /api/trainers`, `DELETE /api/classes`, etc.

## Health check

Ruta de comprobación de salud:

```text
GET /health
```

Comprueba:

- que la API responde
- que Mongoose está conectado
- que MongoDB responde con `ping`

Respuesta correcta esperada:

```json
{
  "status": "ok",
  "api": "ok",
  "database": {
    "connected": true,
    "ping": true,
    "readyState": 1
  }
}
```

## Logs

Los logs se generan en formato JSON desde:

- `utils/logger.js`
- `middlewares/requestLogger.js`

Ejemplo:

```json
{
  "timestamp": "2026-06-05T12:00:00.000Z",
  "level": "info",
  "message": "HTTP request",
  "method": "GET",
  "path": "/health",
  "statusCode": 200,
  "durationMs": 15
}
```

En Render se visualizarán en la pestaña **Logs** del servicio desplegado.

## Tests

La aplicación incluye pruebas para 2 modelos:

- `Trainer`
- `GymClass`

Hay 13 pruebas en total y más de 4 casos negativos con errores de validación de Mongoose.

Ejecutar tests:

```bash
npm test
```

Ejecutar cobertura:

```bash
npm run coverage
```

## OpenAPI

El documento OpenAPI está en:

```text
openapi/gymclass.openapi.yaml
```

Describe las operaciones CRUD del modelo `GymClass`.

## Postman

La colección de Postman está en:

```text
postman/GymManager_API_Final.postman_collection.json
```

Incluye las rutas principales de:

- Auth
- Health
- Trainers
- Classes
- Members
- Bookings
- Vistas Pug

## GitHub Actions

Workflow incluido:

```text
.github/workflows/test-and-deploy-render.yml
```

El workflow realiza:

1. descarga del repositorio
2. configuración de Node.js
3. instalación de dependencias
4. ejecución de tests
5. paso extra de cobertura con `c8`
6. despliegue automático en Render mediante Deploy Hook

Para que el despliegue funcione, crea en GitHub el secret:

```text
RENDER_DEPLOY_HOOK_URL
```

## Render

El proyecto incluye `render.yaml` con:

```yaml
healthCheckPath: /health
```

Variables necesarias en Render:

```text
NODE_ENV=production
MONGODB_URI=tu_uri_real_de_mongodb
JWT_SECRET=secreto_access_token
JWT_REFRESH_SECRET=secreto_refresh_token
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## Capturas de pantalla para la entrega

Añade las capturas reales en la carpeta:

```text
docs/render-capturas/
```

Capturas recomendadas:

1. `/health` funcionando en Render.
2. Configuración de Render con `Health Check Path: /health`.
3. Logs visibles en Render.
4. Workflow de GitHub Actions en verde.

> Las capturas deben hacerse después del despliegue real porque dependen de tu cuenta de GitHub y Render.

## Resumen de cumplimiento de la rúbrica

| Unidad | Requisito | Estado |
|---|---|---|
| UD1/UD2 | Rutas GET, POST, PUT, DELETE | Cumplido |
| UD1/UD2 | Colección Postman | Cumplido |
| UD1/UD2 | Vistas Pug | Cumplido |
| UD3 | MongoDB + Mongoose | Cumplido |
| UD3 | Al menos 3 modelos | Cumplido |
| UD3 | Validaciones personalizadas | Cumplido |
| UD3 | CRUD para cada modelo principal | Cumplido |
| UD3 | Relación 1:N | Cumplido |
| UD4 | 10+ tests y 4+ negativos | Cumplido |
| UD4 | OpenAPI CRUD de 1 modelo | Cumplido |
| UD5 | dotenv | Cumplido |
| UD5 | User con contraseña cifrada | Cumplido |
| UD5 | JWT register/login/refresh | Cumplido |
| UD5 | Rutas por autenticación y rol | Cumplido |
| UD6 | GitHub Actions + tests + deploy | Cumplido |
| UD6 | Health check con base de datos | Cumplido |
| UD6 | Logs | Cumplido |
| UD6 | Paso extra en workflow | Cumplido |
