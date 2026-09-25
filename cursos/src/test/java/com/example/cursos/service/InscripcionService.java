package com.example.cursos.service;


import com.example.cursos.dto.InscripcionRequest;
import com.example.cursos.dto.InscripcionResponse;
import com.example.cursos.exception.RecursoNoEncontradoException;
import com.example.cursos.exception.ReglaNegocioException;
import com.example.cursos.model.*;
import com.example.cursos.repository.CursoRepository;
import com.example.cursos.repository.EstudianteRepository;
import com.example.cursos.repository.InscripcionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class InscripcionService {

    private final InscripcionRepository inscripcionRepository;
    private final EstudianteRepository estudianteRepository;
    private final CursoRepository cursoRepository;

    public InscripcionService(InscripcionRepository inscripcionRepository,
                              EstudianteRepository estudianteRepository,
                              CursoRepository cursoRepository) {
        this.inscripcionRepository = inscripcionRepository;
        this.estudianteRepository = estudianteRepository;
        this.cursoRepository = cursoRepository;
    }

    public List<InscripcionResponse> listar() {
        return aResponse(inscripcionRepository.findAll());
    }

    public InscripcionResponse obtener(Long id) {
        return InscripcionResponse.from(buscar(id));
    }

    public List<InscripcionResponse> listarPorEstudiante(Long estudianteId) {
        if (!estudianteRepository.existsById(estudianteId)) {
            throw new RecursoNoEncontradoException("Estudiante con id " + estudianteId + " no existe");
        }
        return aResponse(inscripcionRepository.findByEstudianteId(estudianteId));
    }

    public List<InscripcionResponse> listarPorCurso(Long cursoId) {
        if (!cursoRepository.existsById(cursoId)) {
            throw new RecursoNoEncontradoException("Curso con id " + cursoId + " no existe");
        }
        return aResponse(inscripcionRepository.findByCursoId(cursoId));
    }

    @Transactional
    public InscripcionResponse inscribir(InscripcionRequest req) {
        Estudiante estudiante = estudianteRepository.findById(req.estudianteId())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Estudiante con id " + req.estudianteId() + " no existe"));

        Curso curso = cursoRepository.findById(req.cursoId())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Curso con id " + req.cursoId() + " no existe"));

        // Regla 1: el curso debe estar activo
        if (!curso.isActivo()) {
            throw new ReglaNegocioException("El curso '" + curso.getTitulo() + "' no está disponible");
        }
        // Regla 2: no inscribirse dos veces
        if (inscripcionRepository.existsByEstudianteIdAndCursoId(estudiante.getId(), curso.getId())) {
            throw new ReglaNegocioException("El estudiante ya está inscrito en este curso");
        }

        Inscripcion inscripcion = new Inscripcion();
        inscripcion.setEstudiante(estudiante);
        inscripcion.setCurso(curso);
        return InscripcionResponse.from(inscripcionRepository.save(inscripcion));
    }

    @Transactional
    public InscripcionResponse cambiarEstado(Long id, EstadoInscripcion nuevoEstado) {
        Inscripcion inscripcion = buscar(id);
        // Regla 3: una inscripción cancelada no se puede reactivar ni completar
        if (inscripcion.getEstado() == EstadoInscripcion.CANCELADA) {
            throw new ReglaNegocioException("La inscripción está cancelada y no puede cambiar de estado");
        }
        inscripcion.setEstado(nuevoEstado);
        return InscripcionResponse.from(inscripcionRepository.save(inscripcion));
    }

    @Transactional
    public void eliminar(Long id) {
        inscripcionRepository.delete(buscar(id));
    }

    private Inscripcion buscar(Long id) {
        return inscripcionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Inscripción con id " + id + " no existe"));
    }

    private List<InscripcionResponse> aResponse(List<Inscripcion> lista) {
        return lista.stream().map(InscripcionResponse::from).toList();
    }
}