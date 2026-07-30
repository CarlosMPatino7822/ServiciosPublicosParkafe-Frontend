# Pendientes Y Decisiones

Este documento resume lo que ya se decidio y lo que falta.

## Decisiones tomadas

- Habra un solo login.
- El rol no se elige manualmente en frontend.
- El backend decide el rol del usuario.
- El administrador general puede manejar usuarios y catalogos.
- El administrador electrico solo maneja usuarios electricos.
- El electrico crea y diligencia documentos mensuales.
- El formato debe ser dinamico porque pueden entrar o salir concesionarios.
- La exportacion Excel es necesaria, pero se trabajara en una fase posterior.

## Fase actual

La fase actual es conectar frontend con backend para pruebas reales.

Ya se conecto:

- Login.
- Usuarios.
- Roles para interpretar vistas.
- Servicios publicos.
- Concesionarios.
- Relaciones concesionario-servicio.

## Pendientes frontend

- Reemplazar todos los datos mock por respuestas reales del backend.
- Conectar la planilla del electrico con `/parcafe/lecturas/planilla`.
- Guardar lecturas reales.
- Manejar borrador/publicado/cancelado cuando el backend tenga estados de documento.
- Mejorar mensajes de error por campo.
- Agregar edicion completa de usuarios, concesionarios y servicios.
- Agregar eliminacion o inactivacion de concesionarios y contadores.
- Agregar pantalla especifica de historial real.
- Agregar exportacion Excel cuando exista el endpoint o la logica definida.

## Pendientes backend

- Crear migraciones o scripts oficiales de base de datos.
- Crear datos semilla de roles.
- Corregir bug de validacion al crear roles.
- Corregir rutas duplicadas de concesionarios.
- Agregar CORS formal para produccion.
- Encriptar contrasenas.
- Evitar devolver password en respuestas.
- Agregar autenticacion real con token si el proyecto lo requiere.
- Agregar entidad/documento mensual con estados.
- Agregar endpoint para exportar Excel con el formato oficial.

## Riesgos importantes

- Si la base de datos no tiene tablas, varios endpoints fallan.
- Si los roles no existen, no se pueden crear usuarios correctamente.
- Si se cambia el orden de ids de roles, el frontend puede abrir una vista incorrecta. Lo ideal es que el backend devuelva tambien el nombre del rol.
- El backend actualmente devuelve contrasenas, eso no es seguro para produccion.
- El login actual no usa token, por ahora solo sirve para pruebas internas.
