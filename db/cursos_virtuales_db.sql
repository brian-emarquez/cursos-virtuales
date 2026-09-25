-- =============================================
-- BASE DE DATOS: cursos_virtuales_db
-- =============================================
USE master;
GO

IF DB_ID('cursos_virtuales_db') IS NOT NULL
BEGIN
    ALTER DATABASE cursos_virtuales_db SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE cursos_virtuales_db;
END
GO

CREATE DATABASE cursos_virtuales_db;
GO

USE cursos_virtuales_db;
GO

-- ---------------------------------------------
-- categorias
-- ---------------------------------------------
CREATE TABLE categorias (
    id           BIGINT IDENTITY(1,1) NOT NULL,
    nombre       NVARCHAR(100)        NOT NULL,
    descripcion  NVARCHAR(255)        NULL,
    CONSTRAINT PK_categorias PRIMARY KEY (id),
    CONSTRAINT UQ_categorias_nombre UNIQUE (nombre)
);
GO

-- ---------------------------------------------
-- cursos
-- ---------------------------------------------
CREATE TABLE cursos (
    id              BIGINT IDENTITY(1,1) NOT NULL,
    titulo          NVARCHAR(150)        NOT NULL,
    descripcion     NVARCHAR(500)        NULL,
    instructor      NVARCHAR(100)        NOT NULL,
    precio          DECIMAL(10,2)        NOT NULL,
    duracion_horas  INT                  NOT NULL,
    nivel           VARCHAR(20)          NOT NULL,
    activo          BIT                  NOT NULL CONSTRAINT DF_cursos_activo DEFAULT 1,
    fecha_creacion  DATETIME2            NOT NULL CONSTRAINT DF_cursos_fecha DEFAULT SYSDATETIME(),
    categoria_id    BIGINT               NOT NULL,
    CONSTRAINT PK_cursos PRIMARY KEY (id),
    CONSTRAINT FK_cursos_categorias FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    CONSTRAINT CK_cursos_precio   CHECK (precio >= 0),
    CONSTRAINT CK_cursos_duracion CHECK (duracion_horas > 0),
    CONSTRAINT CK_cursos_nivel    CHECK (nivel IN ('BASICO', 'INTERMEDIO', 'AVANZADO'))
);
GO

-- ---------------------------------------------
-- estudiantes
-- ---------------------------------------------
CREATE TABLE estudiantes (
    id              BIGINT IDENTITY(1,1) NOT NULL,
    nombres         NVARCHAR(100)        NOT NULL,
    apellidos       NVARCHAR(100)        NOT NULL,
    email           VARCHAR(150)         NOT NULL,
    telefono        VARCHAR(20)          NULL,
    fecha_registro  DATETIME2            NOT NULL CONSTRAINT DF_estudiantes_fecha DEFAULT SYSDATETIME(),
    CONSTRAINT PK_estudiantes PRIMARY KEY (id),
    CONSTRAINT UQ_estudiantes_email UNIQUE (email)
);
GO

-- ---------------------------------------------
-- inscripciones (estudiante <-> curso)
-- ---------------------------------------------
CREATE TABLE inscripciones (
    id                 BIGINT IDENTITY(1,1) NOT NULL,
    estudiante_id      BIGINT               NOT NULL,
    curso_id           BIGINT               NOT NULL,
    fecha_inscripcion  DATETIME2            NOT NULL CONSTRAINT DF_inscripciones_fecha DEFAULT SYSDATETIME(),
    estado             VARCHAR(20)          NOT NULL CONSTRAINT DF_inscripciones_estado DEFAULT 'ACTIVA',
    CONSTRAINT PK_inscripciones PRIMARY KEY (id),
    CONSTRAINT FK_inscripciones_estudiantes FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
    CONSTRAINT FK_inscripciones_cursos      FOREIGN KEY (curso_id)      REFERENCES cursos(id),
    CONSTRAINT UQ_inscripciones_estudiante_curso UNIQUE (estudiante_id, curso_id),
    CONSTRAINT CK_inscripciones_estado CHECK (estado IN ('ACTIVA', 'COMPLETADA', 'CANCELADA'))
);
GO

-- =============================================
-- DATOS DE PRUEBA
-- =============================================
INSERT INTO categorias (nombre, descripcion) VALUES
(N'Programación',  N'Cursos de desarrollo de software'),
(N'Diseño',        N'Diseño gráfico y UX/UI'),
(N'Base de Datos', N'SQL, modelado y administración');

INSERT INTO cursos (titulo, descripcion, instructor, precio, duracion_horas, nivel, categoria_id) VALUES
(N'Spring Boot desde cero',   N'APIs REST con Spring Boot 4',         N'Ana Torres',  49.90, 20, 'BASICO',     1),
(N'Java avanzado',            N'Streams, concurrencia y más',         N'Luis Pérez',  79.90, 35, 'AVANZADO',   1),
(N'Figma para principiantes', N'Diseña interfaces modernas',          N'María Ruiz',   0.00, 10, 'BASICO',     2),
(N'SQL Server práctico',      N'Consultas, índices y procedimientos', N'Carlos Díaz', 59.90, 25, 'INTERMEDIO', 3);

INSERT INTO estudiantes (nombres, apellidos, email, telefono) VALUES
(N'Brian', N'Márquez', 'brian@correo.com', '999111222'),
(N'Lucía', N'Gómez',   'lucia@correo.com', '999333444');

INSERT INTO inscripciones (estudiante_id, curso_id) VALUES
(1, 1),
(1, 4),
(2, 3);
GO

-- Verificación rápida
SELECT * FROM categorias;
SELECT * FROM cursos;