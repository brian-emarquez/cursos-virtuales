# Cursos Virtuales

API REST para la gestión de cursos virtuales, construida con Spring Boot y SQL Server.

> Estado: proyecto en blanco. Por ahora solo contiene la clase principal (`CursosApplication`) y la configuración base.

## Tecnologías

| Herramienta     | Versión                     |
|-----------------|-----------------------------|
| Java            | 21                          |
| Spring Boot     | 4.1.1                       |
| Maven (wrapper) | incluido (`mvnw`)           |
| SQL Server      | 2019+ (driver `mssql-jdbc`) |

Dependencias principales:

- **Spring Web MVC**: endpoints REST.
- **Spring Data JPA**: acceso a datos con Hibernate.
- **Validation**: validación de datos de entrada (`@Valid`, `@NotBlank`, etc.).
- **mssql-jdbc**: driver de SQL Server.

## Requisitos previos

- JDK 21
- SQL Server corriendo en `localhost:1433`
- Base de datos `cursos_virtuales` creada, con sus tablas

## Base de datos

Hibernate **no** crea ni modifica las tablas (`spring.jpa.hibernate.ddl-auto=none`): el esquema se crea con un script SQL antes de levantar la aplicación.

```sql
CREATE DATABASE cursos_virtuales;
```

Luego ejecuta el script de tablas sobre esa base de datos.

## Configuración

La configuración está en [src/main/resources/application.properties](src/main/resources/application.properties):

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=cursos_virtuales;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=<tu_contraseña>

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false
```

- `show-sql` y `format_sql` muestran en consola las consultas SQL generadas (útil en desarrollo).
- `open-in-view=false` cierra la sesión de base de datos al terminar el service, evitando consultas desde el controlador.

## Cómo ejecutar

Desde la carpeta `cursos`:

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

La aplicación queda disponible en `http://localhost:8080`.

## Tests

```bash
./mvnw test
```

## Estructura del proyecto

```text
cursos/
├── pom.xml
├── mvnw / mvnw.cmd
└── src/
    ├── main/
    │   ├── java/com/example/cursos/
    │   │   └── CursosApplication.java
    │   └── resources/
    │       └── application.properties
    └── test/
        └── java/com/example/cursos/
            └── CursosApplicationTests.java
```

## Estructura

```text
com.ejemplo.cursos
├── CursosApplication.java
├── model/
│   ├── Categoria.java
│   ├── Curso.java
│   ├── Estudiante.java
│   ├── Inscripcion.java
│   ├── Nivel.java
│   └── EstadoInscripcion.java
├── dto/
│   ├── CategoriaRequest.java      CategoriaResponse.java
│   ├── CursoRequest.java          CursoResponse.java
│   ├── EstudianteRequest.java     EstudianteResponse.java
│   ├── InscripcionRequest.java    InscripcionResponse.java
│   └── EstadoRequest.java
├── repository/
│   ├── CategoriaRepository.java
│   ├── CursoRepository.java
│   ├── EstudianteRepository.java
│   └── InscripcionRepository.java
├── service/
│   ├── CategoriaService.java
│   ├── CursoService.java
│   ├── EstudianteService.java
│   └── InscripcionService.java
├── controller/
│   ├── CategoriaController.java
│   ├── CursoController.java
│   ├── EstudianteController.java
│   └── InscripcionController.java
└── exception/
    ├── RecursoNoEncontradoException.java
    ├── ReglaNegocioException.java
    └── ManejadorGlobalExcepciones.java
```