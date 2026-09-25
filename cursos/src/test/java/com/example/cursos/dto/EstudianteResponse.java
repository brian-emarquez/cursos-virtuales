package com.example.cursos.dto;

import com.example.cursos.model.Estudiante;
import java.time.LocalDateTime;

public record EstudianteResponse(
        Long id, String nombres, String apellidos,
        String email, String telefono, LocalDateTime fechaRegistro
) {
    public static EstudianteResponse from(Estudiante e) {
        return new EstudianteResponse(
                e.getId(), e.getNombres(), e.getApellidos(),
                e.getEmail(), e.getTelefono(), e.getFechaRegistro()
        );
    }
}