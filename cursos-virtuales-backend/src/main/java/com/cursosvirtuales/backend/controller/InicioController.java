package com.cursosvirtuales.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class InicioController {

    // Sirve para confirmar que Postman está hablando con ESTE backend
    @GetMapping("/estado")
    public Map<String, String> estado() {
        return Map.of(
                "aplicacion", "cursos-virtuales-backend",
                "estado", "OK"
        );
    }
}