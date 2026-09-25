package com.cursosvirtuales.backend.dto;

import jakarta.validation.constraints.NotNull;

public record InscripcionRequest(
        @NotNull(message = "El estudiante es obligatorio") Long estudianteId,
        @NotNull(message = "El curso es obligatorio") Long cursoId
) {}