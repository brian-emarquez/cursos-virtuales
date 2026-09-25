package com.example.cursos.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ManejadorGlobalExcepciones {

    // 404 - No existe
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Map<String, String>> noEncontrado(RecursoNoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
    }

    // 409 - Regla de negocio violada
    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<Map<String, String>> reglaNegocio(ReglaNegocioException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", ex.getMessage()));
    }

    // 400 - Validaciones de los DTO (@NotBlank, @Email, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> validacion(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> errores.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errores);
    }

    // 400 - JSON mal escrito o enum inválido
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> jsonInvalido(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(Map.of("error",
                "JSON inválido. Revisa el formato y los valores (nivel: BASICO/INTERMEDIO/AVANZADO, estado: ACTIVA/COMPLETADA/CANCELADA)"));
    }

    // 400 - Tipo incorrecto en la URL (ej: /api/cursos/abc)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> tipoIncorrecto(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.badRequest().body(Map.of("error",
                "Valor inválido para '" + ex.getName() + "': " + ex.getValue()));
    }

    // 409 - Red de seguridad: si la BD rechaza algo (UNIQUE, FK, CHECK)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> integridad(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error",
                "La operación viola una restricción de la base de datos"));
    }
}