package com.example.cursos.controller;

import com.example.cursos.dto.EstadoRequest;
import com.example.cursos.dto.InscripcionRequest;
import com.example.cursos.dto.InscripcionResponse;
import com.example.cursos.service.InscripcionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    private final InscripcionService service;

    public InscripcionController(InscripcionService service) {
        this.service = service;
    }

    @GetMapping
    public List<InscripcionResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public InscripcionResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @GetMapping("/estudiante/{estudianteId}")
    public List<InscripcionResponse> porEstudiante(@PathVariable Long estudianteId) {
        return service.listarPorEstudiante(estudianteId);
    }

    @GetMapping("/curso/{cursoId}")
    public List<InscripcionResponse> porCurso(@PathVariable Long cursoId) {
        return service.listarPorCurso(cursoId);
    }

    @PostMapping
    public ResponseEntity<InscripcionResponse> inscribir(@Valid @RequestBody InscripcionRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.inscribir(req));
    }

    // PATCH = modificación parcial: solo cambia el estado
    @PatchMapping("/{id}/estado")
    public InscripcionResponse cambiarEstado(@PathVariable Long id, @Valid @RequestBody EstadoRequest req) {
        return service.cambiarEstado(id, req.estado());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}