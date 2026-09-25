package com.example.cursos.repository;

import com.example.cursos.model.Curso;
import com.example.cursos.model.Nivel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CursoRepository extends JpaRepository<Curso, Long> {

    List<Curso> findByTituloContainingIgnoreCase(String titulo);

    List<Curso> findByNivel(Nivel nivel);

    List<Curso> findByActivoTrue();

    // "Categoria.Id" → navega la relación: WHERE categoria_id = ?
    List<Curso> findByCategoriaId(Long categoriaId);

    boolean existsByCategoriaId(Long categoriaId);
}