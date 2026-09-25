# cursos-virtuales-frontend

Panel administrativo en Angular 22 para el backend `cursos-virtuales-backend` (Spring Boot 4 + SQL Server).

## Requisitos
- Node.js **22.22.3+** o **24.15+** (verifica con `node -v`)
- Backend corriendo en `http://localhost:8080`

## Cómo ejecutarlo
```bash
npm install
npm start
```
Abre http://localhost:4200

## Estructura
```
src/app
├── core/            → modelos, servicios HTTP, utilidades
├── layout/          → barra lateral + barra superior
├── shared/          → componentes reutilizables (modal, toast, gráfico, íconos)
└── pages/           → dashboard, cursos, categorias, estudiantes, inscripciones
```

La URL del backend se cambia en `src/app/core/api.config.ts`.
