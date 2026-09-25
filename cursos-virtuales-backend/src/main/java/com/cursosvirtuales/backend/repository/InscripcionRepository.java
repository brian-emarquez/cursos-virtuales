package com.cursosvirtuales.backend.repository;

import com.cursosvirtuales.backend.model.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {

    List<Inscripcion> findByEstudianteId(Long estudianteId);

    List<Inscripcion> findByCursoId(Long cursoId);

    boolean existsByEstudianteIdAndCursoId(Long estudianteId, Long cursoId);

    boolean existsByCursoId(Long cursoId);

    boolean existsByEstudianteId(Long estudianteId);
}