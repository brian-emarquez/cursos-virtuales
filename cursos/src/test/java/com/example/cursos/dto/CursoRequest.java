package com.example.cursos.dto;

import com.example.cursos.model.Nivel;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CursoRequest(
        @NotBlank(message = "El título es obligatorio")
        @Size(max = 150, message = "Máximo 150 caracteres")
        String titulo,

        @Size(max = 500, message = "Máximo 500 caracteres")
        String descripcion,

        @NotBlank(message = "El instructor es obligatorio")
        @Size(max = 100, message = "Máximo 100 caracteres")
        String instructor,

        @NotNull(message = "El precio es obligatorio")
        @PositiveOrZero(message = "El precio no puede ser negativo")
        @Digits(integer = 8, fraction = 2, message = "Formato de precio inválido")
        BigDecimal precio,

        @NotNull(message = "La duración es obligatoria")
        @Positive(message = "La duración debe ser mayor a 0")
        Integer duracionHoras,

        @NotNull(message = "El nivel es obligatorio")
        Nivel nivel,

        Boolean activo,   // opcional: si no se envía, queda en true (o sin cambios)

        @NotNull(message = "La categoría es obligatoria")
        Long categoriaId  // el cliente solo manda el ID, no la categoría completa
) {}