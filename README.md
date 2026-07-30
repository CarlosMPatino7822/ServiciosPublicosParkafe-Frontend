# Servicios Publicos Parque del Cafe - Frontend

Frontend web para gestionar las lecturas de servicios publicos del Parque del Cafe.

La aplicacion esta pensada para reemplazar el manejo manual en Excel por una pantalla web donde los electricos registran lecturas y los administradores consultan, administran usuarios, gestionan concesionarios y preparan la informacion para exportaciones futuras.

## Que permite hacer hoy

- Iniciar sesion con usuario y contrasena usando el backend Spring Boot.
- Enviar al usuario a su panel segun el rol que devuelve el backend.
- Ver panel de administrador general.
- Ver y crear usuarios desde el panel administrativo.
- Ver y crear servicios publicos: energia, agua, gas u otros.
- Ver y crear concesionarios.
- Asociar concesionarios con servicios y numero de contador.
- Ver panel de administrador electrico para manejo de usuarios electricos.
- Ver panel de electrico con formato tipo planilla mensual para registrar lecturas.
- Probar en PC y tablet gracias al diseno responsive.

## Roles del sistema

| Rol en backend | Vista del frontend | Que hace |
| --- | --- | --- |
| `SISTEMAS` | Administrador general | Maneja usuarios, catalogos, formatos, registros y futuras exportaciones. |
| `ADMINELECTRICOS` | Administrador electrico | Maneja usuarios electricos: crear, activar e inactivar. |
| `ELECTRICO` | Electrico | Registra lecturas mensuales de energia, agua y gas. |

## Como prender el proyecto completo

Primero debe estar prendido el backend y despues el frontend.

### 1. Prender MySQL

Abre XAMPP y prende `MySQL`.

La base de datos debe llamarse:

```sql
servicios_publicos_parkcafe
```

### 2. Prender backend

En una terminal:

```powershell
cd "C:\Users\shado\Documents\GitHub\_tmp_servicios_backend_review\ServiciosPublicosParkcafe"
.\gradlew.bat bootRun
```

Debe abrir:

```txt
http://localhost:8080/swagger-ui.html
```

### 3. Prender frontend

En otra terminal:

```powershell
cd "C:\Users\shado\Documents\GitHub\ServiciosPublicosParkfe-FRONTEND"
npm run dev
```

Normalmente abre en:

```txt
http://localhost:5173
```

## Usuario inicial de pruebas

Se creo un usuario inicial directamente en MySQL para poder entrar mientras el backend queda con datos semilla formales:

```txt
Usuario: admin
Contrasena: admin123
Rol: SISTEMAS
```

## Conexion frontend-backend

En desarrollo el frontend usa un proxy de Vite.

El frontend llama a:

```txt
/parcafe
```

Y Vite redirige internamente hacia:

```txt
http://localhost:8080/parcafe
```

Esto evita errores de CORS mientras desarrollamos localmente.

## Documentacion detallada

- [Guia del frontend](./docs/frontend-guide.md)
- [Conexion con backend](./docs/backend-integration.md)
- [Guia para probar](./docs/testing-guide.md)
- [Pendientes y decisiones](./docs/roadmap.md)

## Comandos utiles

```powershell
npm run dev
npm run lint
npm run build
```

`npm run lint` revisa errores de codigo.

`npm run build` confirma que el proyecto puede compilar para produccion.
