package com.cursosvirtuales.backend.dto;

import com.cursosvirtuales.backend.model.EstadoInscripcion;
import jakarta.validation.constraints.NotNull;

public record EstadoRequest(
        @NotNull(message = "El estado es obligatorio") EstadoInscripcion estado
) {}