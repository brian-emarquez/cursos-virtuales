package com.cursosvirtuales.backend.service;

import com.cursosvirtuales.backend.dto.CursoRequest;
import com.cursosvirtuales.backend.dto.CursoResponse;
import com.cursosvirtuales.backend.exception.RecursoNoEncontradoException;
import com.cursosvirtuales.backend.exception.ReglaNegocioException;
import com.cursosvirtuales.backend.model.Categoria;
import com.cursosvirtuales.backend.model.Curso;
import com.cursosvirtuales.backend.model.Nivel;
import com.cursosvirtuales.backend.repository.CategoriaRepository;
import com.cursosvirtuales.backend.repository.CursoRepository;
import com.cursosvirtuales.backend.repository.InscripcionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class CursoService {

    private final CursoRepository cursoRepository;
    private final CategoriaRepository categoriaRepository;
    private final InscripcionRepository inscripcionRepository;

    public CursoService(CursoRepository cursoRepository,
                        CategoriaRepository categoriaRepository,
                        InscripcionRepository inscripcionRepository) {
        this.cursoRepository = cursoRepository;
        this.categoriaRepository = categoriaRepository;
        this.inscripcionRepository = inscripcionRepository;
    }

    public List<CursoResponse> listar() {
        return aResponse(cursoRepository.findAll());
    }

    public List<CursoResponse> listarActivos() {
        return aResponse(cursoRepository.findByActivoTrue());
    }

    public CursoResponse obtener(Long id) {
        return CursoResponse.from(buscar(id));
    }

    public List<CursoResponse> buscarPorTitulo(String titulo) {
        return aResponse(cursoRepository.findByTituloContainingIgnoreCase(titulo));
    }

    public List<CursoResponse> listarPorNivel(Nivel nivel) {
        return aResponse(cursoRepository.findByNivel(nivel));
    }

    public List<CursoResponse> listarPorCategoria(Long categoriaId) {
        if (!categoriaRepository.existsById(categoriaId)) {
            throw new RecursoNoEncontradoException("Categoría con id " + categoriaId + " no existe");
        }
        return aResponse(cursoRepository.findByCategoriaId(categoriaId));
    }

    @Transactional
    public CursoResponse crear(CursoRequest req) {
        Curso curso = new Curso();
        copiarDatos(req, curso);
        return CursoResponse.from(cursoRepository.save(curso));
    }

    @Transactional
    public CursoResponse actualizar(Long id, CursoRequest req) {
        Curso curso = buscar(id);
        copiarDatos(req, curso);
        return CursoResponse.from(cursoRepository.save(curso));
    }

    @Transactional
    public void eliminar(Long id) {
        Curso curso = buscar(id);
        if (inscripcionRepository.existsByCursoId(id)) {
            throw new ReglaNegocioException(
                    "No se puede eliminar: el curso tiene estudiantes inscritos. Desactívalo con activo=false");
        }
        cursoRepository.delete(curso);
    }

    private Curso buscar(Long id) {
        return cursoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Curso con id " + id + " no existe"));
    }

    private void copiarDatos(CursoRequest req, Curso curso) {
        Categoria categoria = categoriaRepository.findById(req.categoriaId())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Categoría con id " + req.categoriaId() + " no existe"));

        curso.setTitulo(req.titulo());
        curso.setDescripcion(req.descripcion());
        curso.setInstructor(req.instructor());
        curso.setPrecio(req.precio());
        curso.setDuracionHoras(req.duracionHoras());
        curso.setNivel(req.nivel());
        curso.setCategoria(categoria);
        if (req.activo() != null) {
            curso.setActivo(req.activo());
        }
    }

    private List<CursoResponse> aResponse(List<Curso> cursos) {
        return cursos.stream().map(CursoResponse::from).toList();
    }
}