package com.example.cursos.controller;

import com.example.cursos.dto.EstudianteRequest;
import com.example.cursos.dto.EstudianteResponse;
import com.example.cursos.service.EstudianteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {

    private final EstudianteService service;

    public EstudianteController(EstudianteService service) {
        this.service = service;
    }

    @GetMapping
    public List<EstudianteResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public EstudianteResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PostMapping
    public ResponseEntity<EstudianteResponse> crear(@Valid @RequestBody EstudianteRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(req));
    }

    @PutMapping("/{id}")
    public EstudianteResponse actualizar(@PathVariable Long id, @Valid @RequestBody EstudianteRequest req) {
        return service.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}