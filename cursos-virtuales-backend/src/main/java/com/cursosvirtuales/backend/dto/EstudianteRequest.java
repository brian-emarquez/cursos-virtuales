package com.cursosvirtuales.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EstudianteRequest(
        @NotBlank(message = "Los nombres son obligatorios")
        @Size(max = 100, message = "Máximo 100 caracteres")
        String nombres,

        @NotBlank(message = "Los apellidos son obligatorios")
        @Size(max = 100, message = "Máximo 100 caracteres")
        String apellidos,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no tiene un formato válido")
        @Size(max = 150, message = "Máximo 150 caracteres")
        String email,

        @Size(max = 20, message = "Máximo 20 caracteres")
        String telefono
) {}