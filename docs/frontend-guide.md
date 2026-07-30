# Guia Del Frontend

Esta guia explica el frontend sin asumir que la persona sabe programar.

## Que es este frontend

Es la parte visual del sistema. Es lo que ve el usuario en el navegador: login, paneles, formularios, tablas, botones y mensajes.

El backend vive en otro proyecto. El frontend no guarda datos por si mismo de forma permanente; para guardar o consultar informacion real debe comunicarse con el backend.

## Estructura principal

```txt
src/
  App.jsx
  App.css
  index.css
  main.jsx
  assets/
  components/
  data/
  pages/
  services/
  utils/
```

## Que contiene cada carpeta

### `src/App.jsx`

Es el centro de la aplicacion.

Hace tres cosas principales:

- Muestra el login si el usuario no ha entrado.
- Llama al backend para validar usuario y contrasena.
- Decide que panel mostrar segun el rol recibido.

### `src/components/`

Contiene piezas reutilizables.

- `RoleLogin.jsx`: pantalla de inicio de sesion. Aunque el nombre quedo como `RoleLogin`, ya no tiene selector de rol. Solo pide usuario y contrasena.
- `AppLayout.jsx`: estructura visual interna con menu lateral, logo y boton de salida.
- `Metric.jsx`: tarjetas pequenas de resumen, por ejemplo usuarios activos.

### `src/pages/`

Contiene las pantallas grandes del sistema.

- `SystemAdminPanel.jsx`: panel del administrador general o sistemas.
- `ElectricalAdminPanel.jsx`: panel del administrador electrico.
- `ElectricianPanel.jsx`: panel del electrico que registra lecturas.

### `src/services/`

Contiene las llamadas al backend.

- `apiClient.js`: funcion base para llamar a la API.
- `authService.js`: login y lectura del rol.
- `userService.js`: crear, listar, editar y eliminar usuarios.
- `readingService.js`: planilla y lecturas.
- `catalogService.js`: servicios publicos, concesionarios y relaciones con contadores.

### `src/data/`

Tiene datos de muestra para que algunas pantallas se vean completas aunque el backend aun no tenga todos los datos.

Esto debe irse reemplazando poco a poco por datos reales del backend.

### `src/utils/`

Funciones pequenas de ayuda. Por ejemplo, formato de numeros.

## Pantalla de login

El login ahora es unico.

Antes habia un selector temporal para elegir rol manualmente. Eso ya se quito.

Ahora el flujo correcto es:

1. El usuario escribe usuario y contrasena.
2. El frontend llama a `/parcafe/usuarios/login`.
3. El backend responde con los datos del usuario y su `idRol`.
4. El frontend abre la vista correspondiente.

## Panel administrador general

Este panel es el mas completo.

Permite:

- Ver usuarios activos e inactivos.
- Crear usuarios de cualquier rol.
- Cambiar estado activo/inactivo.
- Ver historial visual de documentos.
- Ver formatos configurables.
- Crear servicios publicos.
- Crear concesionarios.
- Asociar contador a un concesionario y servicio.

## Panel administrador electrico

Esta vista esta pensada para una funcion mas limitada.

Permite:

- Crear electricos.
- Ver electricos.
- Activar o inactivar electricos.

No debe crear documentos de servicios publicos.

## Panel electrico

Esta vista es para quien toma lecturas.

Debe terminar funcionando asi:

- Crear solo el documento del mes actual.
- Registrar lecturas de energia, agua y gas.
- Calcular consumos en pantalla.
- Guardar borrador si aun no termina.
- Publicar cuando ya queda final.
- No crear dos documentos para el mismo mes.

Actualmente conserva parte visual de maqueta mientras se termina de conectar la planilla real del backend.

## Diseno responsive

La aplicacion fue ajustada para PC y tablet.

En pantallas grandes se usan columnas amplias.

En tablet, los bloques se reorganizan en una sola columna o dos columnas para evitar que se rompa la vista.

## Estilo visual

El proyecto usa:

- Logo real del Parque del Cafe.
- Imagen de fondo real.
- Tipografia `Source Sans 3`.
- Colores verdes, rojos y neutros asociados a la marca.
- Tarjetas blancas, bordes suaves y sombras livianas para lectura empresarial.

## Validaciones actuales

Se ejecutaron correctamente:

```powershell
npm run lint
npm run build
```

Esto confirma que el codigo no tiene errores basicos y puede compilar.
