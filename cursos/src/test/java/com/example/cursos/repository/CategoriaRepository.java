package com.example.cursos.repository;

import com.example.cursos.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    boolean existsByNombreIgnoreCase(String nombre);

    // Para actualizar: ¿existe OTRA categoría (id distinto) con ese nombre?
    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);
}