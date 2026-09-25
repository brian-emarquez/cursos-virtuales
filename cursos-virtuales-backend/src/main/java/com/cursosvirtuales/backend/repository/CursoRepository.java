package com.cursosvirtuales.backend.repository;

import com.cursosvirtuales.backend.model.Curso;
import com.cursosvirtuales.backend.model.Nivel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CursoRepository extends JpaRepository<Curso, Long> {

    List<Curso> findByTituloContainingIgnoreCase(String titulo);

    List<Curso> findByNivel(Nivel nivel);

    List<Curso> findByActivoTrue();

    List<Curso> findByCategoriaId(Long categoriaId);

    boolean existsByCategoriaId(Long categoriaId);
}