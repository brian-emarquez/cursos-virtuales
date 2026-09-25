package com.example.cursos.dto;

import com.example.cursos.model.Curso;
import com.example.cursos.model.Nivel;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CursoResponse(
        Long id,
        String titulo,
        String descripcion,
        String instructor,
        BigDecimal precio,
        Integer duracionHoras,
        Nivel nivel,
        boolean activo,
        LocalDateTime fechaCreacion,
        Long categoriaId,
        String categoriaNombre
) {
    public static CursoResponse from(Curso c) {
        return new CursoResponse(
                c.getId(), c.getTitulo(), c.getDescripcion(), c.getInstructor(),
                c.getPrecio(), c.getDuracionHoras(), c.getNivel(), c.isActivo(),
                c.getFechaCreacion(),
                c.getCategoria().getId(),
                c.getCategoria().getNombre()
        );
    }
}