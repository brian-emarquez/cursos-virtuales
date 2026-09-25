package com.example.cursos.dto;

import com.example.cursos.model.EstadoInscripcion;
import jakarta.validation.constraints.NotNull;

public record EstadoRequest(
        @NotNull(message = "El estado es obligatorio") EstadoInscripcion estado
) {}