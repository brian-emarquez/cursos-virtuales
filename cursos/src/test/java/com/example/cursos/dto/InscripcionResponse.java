package com.example.cursos.dto;

import com.example.cursos.model.EstadoInscripcion;
import com.example.cursos.model.Inscripcion;
import java.time.LocalDateTime;

public record InscripcionResponse(
        Long id,
        LocalDateTime fechaInscripcion,
        EstadoInscripcion estado,
        Long estudianteId,
        String estudianteNombre,
        Long cursoId,
        String cursoTitulo
) {
    public static InscripcionResponse from(Inscripcion i) {
        return new InscripcionResponse(
                i.getId(), i.getFechaInscripcion(), i.getEstado(),
                i.getEstudiante().getId(),
                i.getEstudiante().getNombres() + " " + i.getEstudiante().getApellidos(),
                i.getCurso().getId(),
                i.getCurso().getTitulo()
        );
    }
}