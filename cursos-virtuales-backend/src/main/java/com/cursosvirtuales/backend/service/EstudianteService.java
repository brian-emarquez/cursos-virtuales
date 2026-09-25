package com.cursosvirtuales.backend.service;

import com.cursosvirtuales.backend.dto.EstudianteRequest;
import com.cursosvirtuales.backend.dto.EstudianteResponse;
import com.cursosvirtuales.backend.exception.RecursoNoEncontradoException;
import com.cursosvirtuales.backend.exception.ReglaNegocioException;
import com.cursosvirtuales.backend.model.Estudiante;
import com.cursosvirtuales.backend.repository.EstudianteRepository;
import com.cursosvirtuales.backend.repository.InscripcionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;
    private final InscripcionRepository inscripcionRepository;

    public EstudianteService(EstudianteRepository estudianteRepository,
                             InscripcionRepository inscripcionRepository) {
        this.estudianteRepository = estudianteRepository;
        this.inscripcionRepository = inscripcionRepository;
    }

    public List<EstudianteResponse> listar() {
        return estudianteRepository.findAll().stream()
                .map(EstudianteResponse::from)
                .toList();
    }

    public EstudianteResponse obtener(Long id) {
        return EstudianteResponse.from(buscar(id));
    }

    @Transactional
    public EstudianteResponse crear(EstudianteRequest req) {
        if (estudianteRepository.existsByEmailIgnoreCase(req.email())) {
            throw new ReglaNegocioException("El email '" + req.email() + "' ya está registrado");
        }
        Estudiante estudiante = new Estudiante();
        copiarDatos(req, estudiante);
        return EstudianteResponse.from(estudianteRepository.save(estudiante));
    }

    @Transactional
    public EstudianteResponse actualizar(Long id, EstudianteRequest req) {
        Estudiante estudiante = buscar(id);
        if (estudianteRepository.existsByEmailIgnoreCaseAndIdNot(req.email(), id)) {
            throw new ReglaNegocioException("El email '" + req.email() + "' ya lo usa otro estudiante");
        }
        copiarDatos(req, estudiante);
        return EstudianteResponse.from(estudianteRepository.save(estudiante));
    }

    @Transactional
    public void eliminar(Long id) {
        Estudiante estudiante = buscar(id);
        if (inscripcionRepository.existsByEstudianteId(id)) {
            throw new ReglaNegocioException("No se puede eliminar: el estudiante tiene inscripciones");
        }
        estudianteRepository.delete(estudiante);
    }

    private Estudiante buscar(Long id) {
        return estudianteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Estudiante con id " + id + " no existe"));
    }

    private void copiarDatos(EstudianteRequest req, Estudiante e) {
        e.setNombres(req.nombres());
        e.setApellidos(req.apellidos());
        e.setEmail(req.email().toLowerCase());
        e.setTelefono(req.telefono());
    }
}