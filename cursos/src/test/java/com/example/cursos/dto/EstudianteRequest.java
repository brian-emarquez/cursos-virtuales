package com.example.cursos.dto;

import jakarta.validation.constraints.*;

public record EstudianteRequest(
        @NotBlank(message = "Los nombres son obligatorios")
        @Size(max = 100)
        String nombres,

        @NotBlank(message = "Los apellidos son obligatorios")
        @Size(max = 100)
        String apellidos,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no tiene un formato válido")
        @Size(max = 150)
        String email,

        @Size(max = 20, message = "Máximo 20 caracteres")
        String telefono
) {}