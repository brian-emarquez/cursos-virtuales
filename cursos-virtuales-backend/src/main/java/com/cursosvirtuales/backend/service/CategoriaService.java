package com.cursosvirtuales.backend.service;

import com.cursosvirtuales.backend.dto.CategoriaRequest;
import com.cursosvirtuales.backend.dto.CategoriaResponse;
import com.cursosvirtuales.backend.exception.RecursoNoEncontradoException;
import com.cursosvirtuales.backend.exception.ReglaNegocioException;
import com.cursosvirtuales.backend.model.Categoria;
import com.cursosvirtuales.backend.repository.CategoriaRepository;
import com.cursosvirtuales.backend.repository.CursoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final CursoRepository cursoRepository;

    public CategoriaService(CategoriaRepository categoriaRepository, CursoRepository cursoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.cursoRepository = cursoRepository;
    }

    public List<CategoriaResponse> listar() {
        return categoriaRepository.findAll().stream()
                .map(CategoriaResponse::from)
                .toList();
    }

    public CategoriaResponse obtener(Long id) {
        return CategoriaResponse.from(buscar(id));
    }

    @Transactional
    public CategoriaResponse crear(CategoriaRequest req) {
        if (categoriaRepository.existsByNombreIgnoreCase(req.nombre())) {
            throw new ReglaNegocioException("Ya existe una categoría llamada '" + req.nombre() + "'");
        }
        Categoria categoria = new Categoria();
        categoria.setNombre(req.nombre());
        categoria.setDescripcion(req.descripcion());
        return CategoriaResponse.from(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaResponse actualizar(Long id, CategoriaRequest req) {
        Categoria categoria = buscar(id);
        if (categoriaRepository.existsByNombreIgnoreCaseAndIdNot(req.nombre(), id)) {
            throw new ReglaNegocioException("Ya existe otra categoría llamada '" + req.nombre() + "'");
        }
        categoria.setNombre(req.nombre());
        categoria.setDescripcion(req.descripcion());
        return CategoriaResponse.from(categoriaRepository.save(categoria));
    }

    @Transactional
    public void eliminar(Long id) {
        Categoria categoria = buscar(id);
        if (cursoRepository.existsByCategoriaId(id)) {
            throw new ReglaNegocioException("No se puede eliminar: la categoría tiene cursos asociados");
        }
        categoriaRepository.delete(categoria);
    }

    private Categoria buscar(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoría con id " + id + " no existe"));
    }
}