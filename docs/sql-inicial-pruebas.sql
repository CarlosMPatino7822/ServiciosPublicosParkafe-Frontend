CREATE DATABASE IF NOT EXISTS servicios_publicos_parkcafe;

USE servicios_publicos_parkcafe;

CREATE TABLE IF NOT EXISTS rol (
  id INT NOT NULL AUTO_INCREMENT,
  nombre ENUM('SISTEMAS','ELECTRICO','ADMINELECTRICOS') NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_rol_nombre (nombre)
);

CREATE TABLE IF NOT EXISTS usuario (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  cedula VARCHAR(255) NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  apellido VARCHAR(45) NOT NULL,
  password VARCHAR(45) NOT NULL,
  usuario VARCHAR(45) NOT NULL,
  estado ENUM('ACTIVO','INACTIVO') NOT NULL,
  PRIMARY KEY (idUsuario),
  UNIQUE KEY uk_usuario_cedula (cedula),
  UNIQUE KEY uk_usuario_usuario (usuario)
);

CREATE TABLE IF NOT EXISTS rol_asignado (
  id INT NOT NULL AUTO_INCREMENT,
  fecha_asignada DATETIME NOT NULL,
  id_rol INT NOT NULL,
  idUsuario INT NOT NULL,
  PRIMARY KEY (id),
  KEY fk_rol_asignado_rol (id_rol),
  KEY fk_rol_asignado_usuario (idUsuario),
  CONSTRAINT fk_rol_asignado_rol FOREIGN KEY (id_rol) REFERENCES rol(id),
  CONSTRAINT fk_rol_asignado_usuario FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
);

INSERT IGNORE INTO rol (id, nombre, descripcion) VALUES
  (1, 'SISTEMAS', 'Administrador del sistema'),
  (2, 'ELECTRICO', 'Usuario electrico encargado de lecturas'),
  (3, 'ADMINELECTRICOS', 'Administrador de usuarios electricos');

INSERT INTO usuario (cedula, nombre, apellido, password, usuario, estado)
SELECT '1000000000', 'Admin', 'Sistema', 'admin123', 'admin', 'ACTIVO'
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE usuario = 'admin');

INSERT INTO rol_asignado (fecha_asignada, id_rol, idUsuario)
SELECT NOW(), 1, u.idUsuario FROM usuario u
WHERE u.usuario = 'admin'
AND NOT EXISTS (
  SELECT 1 FROM rol_asignado ra
  WHERE ra.idUsuario = u.idUsuario AND ra.id_rol = 1
);

CREATE TABLE IF NOT EXISTS servicio (
  idServicio INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  tarifa DOUBLE NOT NULL,
  PRIMARY KEY (idServicio)
);

CREATE TABLE IF NOT EXISTS concesionario (
  idConcesionario INT NOT NULL AUTO_INCREMENT,
  nit VARCHAR(255) NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  ubicacion VARCHAR(45) NOT NULL,
  propietario VARCHAR(45) NOT NULL,
  telefono VARCHAR(45),
  PRIMARY KEY (idConcesionario),
  UNIQUE KEY uk_concesionario_nit (nit)
);

CREATE TABLE IF NOT EXISTS concesionarioservicio (
  idConcesionarioServicio INT NOT NULL AUTO_INCREMENT,
  idServicio INT NOT NULL,
  idConcesionario INT NOT NULL,
  numeroContador INT,
  estado VARCHAR(45) NOT NULL,
  PRIMARY KEY (idConcesionarioServicio),
  KEY fk_cs_servicio (idServicio),
  KEY fk_cs_concesionario (idConcesionario),
  CONSTRAINT fk_cs_servicio FOREIGN KEY (idServicio) REFERENCES servicio(idServicio),
  CONSTRAINT fk_cs_concesionario FOREIGN KEY (idConcesionario) REFERENCES concesionario(idConcesionario)
);

CREATE TABLE IF NOT EXISTS lectura (
  idLectura INT NOT NULL AUTO_INCREMENT,
  idConcesionarioServicio INT NOT NULL,
  idUsuario INT NOT NULL,
  periodo VARCHAR(7) NOT NULL,
  fecha_lectura DATE NOT NULL,
  lectura_anterior INT,
  lectura_nueva INT,
  lectura_ajustada INT,
  num_vueltas VARCHAR(45) NOT NULL,
  consumo VARCHAR(45) NOT NULL,
  observaciones VARCHAR(45),
  PRIMARY KEY (idLectura),
  KEY fk_lectura_cs (idConcesionarioServicio),
  KEY fk_lectura_usuario (idUsuario),
  CONSTRAINT fk_lectura_cs FOREIGN KEY (idConcesionarioServicio) REFERENCES concesionarioservicio(idConcesionarioServicio),
  CONSTRAINT fk_lectura_usuario FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
);

INSERT INTO servicio (nombre, tarifa)
SELECT 'Energia', 325 WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE nombre = 'Energia');

INSERT INTO servicio (nombre, tarifa)
SELECT 'Agua', 4600 WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE nombre = 'Agua');

INSERT INTO servicio (nombre, tarifa)
SELECT 'Gas', 2850 WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE nombre = 'Gas');
