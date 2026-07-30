# Guia Para Probar

Esta guia explica como probar el sistema paso a paso.

## 1. Revisar que MySQL este prendido

En XAMPP, `MySQL` debe estar en verde.

## 2. Revisar backend

Abre:

```txt
http://localhost:8080/swagger-ui.html
```

Si Swagger abre, el backend esta prendido.

## 3. Revisar frontend

En la carpeta del frontend:

```powershell
npm run dev
```

Abre:

```txt
http://localhost:5173
```

## 4. Probar login

Credenciales iniciales:

```txt
Usuario: admin
Contrasena: admin123
```

Resultado esperado:

```txt
Debe abrir el panel de administrador general.
```

## 5. Probar usuarios

En el panel administrador:

1. Ve a Crear usuario.
2. Llena nombre, apellido, cedula, usuario, contrasena y rol.
3. Presiona Crear usuario.
4. Debe aparecer en la tabla de usuarios.

Si falla, revisar:

- Que el usuario no exista ya.
- Que la cedula no exista ya.
- Que el backend siga prendido.
- Que existan los roles en base de datos.

## 6. Probar servicios

En Servicios publicos:

1. Escribe `Energia`, `Agua` o `Gas`.
2. Escribe una tarifa.
3. Presiona Crear servicio.

Debe aparecer en la lista inferior.

## 7. Probar concesionarios

En Concesionarios:

1. Escribe NIT.
2. Escribe nombre/local.
3. Escribe ubicacion.
4. Escribe propietario.
5. Opcionalmente escribe telefono.
6. Presiona Crear concesionario.

Debe aparecer en la lista inferior.

## 8. Probar contador por servicio

Antes deben existir:

- Al menos un concesionario.
- Al menos un servicio.

Luego:

1. Selecciona concesionario.
2. Selecciona servicio.
3. Escribe numero de contador.
4. Selecciona estado.
5. Presiona Asociar contador.

Debe aparecer en la lista inferior.

## 9. Probar build

Para confirmar que el proyecto compila:

```powershell
npm run build
```

## 10. Probar calidad basica de codigo

```powershell
npm run lint
```

Si ambos comandos pasan, el frontend esta sano a nivel basico.
