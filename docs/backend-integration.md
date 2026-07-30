# Conexion Con Backend

Esta guia explica como el frontend se conecta con el backend Spring Boot.

## Backend usado para pruebas

La carpeta revisada del backend esta en:

```txt
C:\Users\shado\Documents\GitHub\_tmp_servicios_backend_review\ServiciosPublicosParkcafe
```

El backend corre en:

```txt
http://localhost:8080
```

Swagger esta en:

```txt
http://localhost:8080/swagger-ui.html
```

## Base de datos

Nombre de la base:

```txt
servicios_publicos_parkcafe
```

Motor:

```txt
MySQL
```

## Lo que se hizo manualmente en backend/base de datos

Se encontro que Spring Boot prendia, pero la base no tenia tablas.

Para poder iniciar pruebas se crearon tablas minimas:

- `rol`
- `usuario`
- `rol_asignado`

Tambien se insertaron roles base:

- `SISTEMAS`
- `ELECTRICO`
- `ADMINELECTRICOS`

Y se creo un usuario inicial:

```txt
Usuario: admin
Contrasena: admin123
Rol: SISTEMAS
```

## Endpoints detectados

### Usuarios

```txt
POST   /parcafe/usuarios
GET    /parcafe/usuarios
GET    /parcafe/usuarios/{id}
PUT    /parcafe/usuarios/{cedula}
DELETE /parcafe/usuarios/{cedula}
POST   /parcafe/usuarios/login
```

### Roles

```txt
POST   /parcafe/roles
GET    /parcafe/roles
GET    /parcafe/roles/{id}
PUT    /parcafe/roles/{id}
DELETE /parcafe/roles/{id}
```

### Roles asignados

```txt
POST   /parcafe/roles-asignados
GET    /parcafe/roles-asignados
GET    /parcafe/roles-asignados/{id}
GET    /parcafe/roles-asignados/usuario/{idUsuario}
PUT    /parcafe/roles-asignados/{id}
DELETE /parcafe/roles-asignados/{id}
```

### Servicios publicos

```txt
POST   /parcafe/servicios
GET    /parcafe/servicios
GET    /parcafe/servicios/{id}
PUT    /parcafe/servicios/{id}
DELETE /parcafe/servicios/{id}
```

### Concesionarios

```txt
POST   /parcafe/concesionarios
GET    /parcafe/concesionarios
GET    /parcafe/concesionarios/{id}
GET    /parcafe/concesionarios/{nit}
PUT    /parcafe/concesionarios/{nit}
DELETE /parcafe/concesionarios/{nit}
```

Nota tecnica: hay dos rutas `GET` con el mismo formato `/{algo}` para id y nit. Eso puede causar ambiguedad. Conviene cambiarlo mas adelante a algo como `/id/{id}` y `/nit/{nit}`.

### Relaciones concesionario-servicio

```txt
POST   /parcafe/concesionario-servicios
GET    /parcafe/concesionario-servicios
GET    /parcafe/concesionario-servicios/{id}
PUT    /parcafe/concesionario-servicios/{id}
DELETE /parcafe/concesionario-servicios/{id}
```

### Lecturas

```txt
POST   /parcafe/lecturas
GET    /parcafe/lecturas
GET    /parcafe/lecturas/{id}
GET    /parcafe/lecturas/usuario/{idUsuario}
GET    /parcafe/lecturas/planilla?periodo=yyyy-MM
PUT    /parcafe/lecturas/{id}
DELETE /parcafe/lecturas/{id}
```

## Proxy de Vite

El frontend no llama directamente a `http://localhost:8080` desde el navegador.

En desarrollo llama a:

```txt
/parcafe
```

Y `vite.config.js` redirige internamente a:

```txt
http://localhost:8080
```

Esto evita bloqueo CORS local.

## Bug encontrado en backend

El endpoint para crear roles rechaza roles validos por esta validacion:

```java
if(!(rolDto.getNombre().equals(NombreRol.values()))){
    throw new IllegalArgumentException("No existe un rol con ese nombre");
}
```

El problema es que compara un solo rol contra el arreglo completo de roles.

Deberia cambiarse por una validacion correcta o eliminarse, porque si `nombre` ya es enum, Java ya valida que sea un valor permitido.

## Recomendaciones backend

- Crear scripts oficiales de base de datos o migraciones.
- Agregar datos semilla para roles.
- Agregar CORS formal para el dominio del frontend.
- No devolver contrasenas en las respuestas de usuario.
- Encriptar contrasenas.
- Corregir rutas ambiguas de concesionarios.
- Agregar estados de documento: borrador, publicado, cancelado.
- Agregar endpoint de exportacion Excel cuando se trabaje esa fase.
