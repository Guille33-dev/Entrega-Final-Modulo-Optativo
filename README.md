# GymManager API

Aplicación de gestión de gimnasio desarrollada con Node.js, Express, MongoDB, Mongoose, Pug, JWT, tests, OpenAPI, logs, health check, GitHub Actions y despliegue en Render.

GymManager permite gestionar entrenadores, clases, socios, reservas y usuarios desde una API REST y varias vistas web.

## Capturas de pantalla

### Health en Render

![Health en Render](https://res.cloudinary.com/dahfnhc1h/image/upload/v1780790677/Captura_de_pantalla_2026-06-07_020423_h3vkbb.png)

### Configuración del health check

![Configuración del health check en Render](https://res.cloudinary.com/dahfnhc1h/image/upload/v1780790753/Captura_de_pantalla_2026-06-07_020536_ns0vyz.png)

### Logs de Render

![Logs de Render](https://res.cloudinary.com/dahfnhc1h/image/upload/v1780790904/Captura_de_pantalla_2026-06-07_020754_j3jikw.png)

### GitHub Actions

![Workflow de GitHub Actions en verde](https://res.cloudinary.com/dahfnhc1h/image/upload/v1780790408/Captura_de_pantalla_2026-06-07_015947_jul2nm.png)

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

## Estructura del proyecto

```text
app.js
db.js
index.js
server.js
middlewares/
models/
routes/
scripts/
utils/
views/
public/
tests/
openapi/
postman/
```

- `index.js`: arranca la aplicación, conecta con MongoDB y levanta el servidor.
- `app.js`: configura Express, middlewares, vistas Pug y rutas.
- `db.js`: gestiona la conexión a MongoDB.
- `middlewares/authMiddleware.js`: valida el access token.
- `middlewares/roleMiddleware.js`: comprueba permisos por rol.
- `utils/tokenUtils.js`: genera y verifica tokens JWT.
- `utils/logger.js`: genera logs en formato JSON.

## Instalación

```bash
npm install
```

Copia el archivo de variables de entorno:

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

## Ejecución

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

Comprobar sintaxis:

```bash
npm run check
```

La aplicación queda disponible en:

```text
http://localhost:3000
```

## Usuarios de prueba

Para crear usuarios de prueba y entrenadores iniciales:

```bash
npm run seed:admin
```

Credenciales generadas:

```text
usuario: admin
contraseña: admin123
roles: admin

usuario: profesor
contraseña: profesor123
roles: profesor
```

Las clases solo pueden crearlas cuentas con rol `admin` o `profesor`.

## Vistas Pug

| Vista | Ruta | Descripción |
|---|---|---|
| Página principal | `/` | Inicio de la aplicación |
| Listado de clases | `/classes` | Muestra las clases programadas |
| Programar clase | `/classes/new` | Formulario para crear una clase |
| Acceso del equipo | `/login` | Login para admin o profesor |

## Modelos MongoDB / Mongoose

La aplicación incluye 5 modelos:

- `User`
- `Trainer`
- `GymClass`
- `Member`
- `Booking`

Relaciones 1:N:

- `Trainer` -> `GymClass`: un entrenador puede tener muchas clases.
- `Member` -> `Booking`: un socio puede tener muchas reservas.
- `GymClass` -> `Booking`: una clase puede tener muchas reservas.

## Endpoints principales

### Auth

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Registra un usuario normal |
| POST | `/auth/login` | Inicia sesión |
| POST | `/auth/refresh` | Refresca el token |

### Usuarios

| Método | Ruta | Protección |
|---|---|---|
| GET | `/api/users` | Admin |
| GET | `/api/users/:id` | Admin |
| POST | `/api/users` | Admin |
| PUT | `/api/users/:id` | Admin |
| DELETE | `/api/users/:id` | Admin |

### Entrenadores

| Método | Ruta | Protección |
|---|---|---|
| GET | `/api/trainers` | Pública |
| GET | `/api/trainers/:id` | Pública |
| POST | `/api/trainers` | Admin |
| PUT | `/api/trainers/:id` | Admin |
| DELETE | `/api/trainers/:id` | Admin |

### Clases

| Método | Ruta | Protección |
|---|---|---|
| GET | `/api/classes` | Pública |
| GET | `/api/classes/:id` | Pública |
| POST | `/api/classes` | Admin o profesor |
| PUT | `/api/classes/:id` | Admin o profesor |
| DELETE | `/api/classes/:id` | Admin |

### Socios

| Método | Ruta | Protección |
|---|---|---|
| GET | `/api/members` | Usuario autenticado |
| GET | `/api/members/:id` | Usuario autenticado |
| POST | `/api/members` | Admin |
| PUT | `/api/members/:id` | Admin |
| DELETE | `/api/members/:id` | Admin |

### Reservas

| Método | Ruta | Protección |
|---|---|---|
| GET | `/api/bookings` | Usuario autenticado |
| GET | `/api/bookings/:id` | Usuario autenticado |
| POST | `/api/bookings` | Usuario autenticado |
| PUT | `/api/bookings/:id` | Admin o profesor |
| DELETE | `/api/bookings/:id` | Admin |

## Health check

```text
GET /health
```

Comprueba que la API responde y que MongoDB está conectado.

Respuesta correcta esperada:

```json
{
  "status": "ok",
  "api": "ok",
  "database": "conectada",
  "timestamp": "2026-06-06T00:00:00.000Z"
}
```

## Tests y cobertura

Ejecutar tests:

```bash
npm test
```

Ejecutar cobertura:

```bash
npm run coverage
```

La aplicación incluye 13 pruebas para los modelos `Trainer` y `GymClass`, con casos positivos y negativos de validación Mongoose.

## OpenAPI y Postman

Documento OpenAPI:

```text
openapi/gymclass.openapi.yaml
```

Colección de Postman:

```text
postman/GymManager_API_Final.postman_collection.json
```

## GitHub Actions y Render

El workflow está en:

```text
.github/workflows/test-and-deploy-render.yml
```

El workflow:

1. Descarga el repositorio.
2. Configura Node.js.
3. Instala dependencias.
4. Ejecuta tests.
5. Calcula cobertura.
6. Lanza despliegue en Render si todo pasa.

Secret necesario en GitHub:

```text
RENDER_DEPLOY_HOOK_URL
```

El servicio de Render usa:

```yaml
healthCheckPath: /health
```
