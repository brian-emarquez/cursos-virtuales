package com.example.cursos.exception;

// Se usa cuando algo no existe → 404
public class RecursoNoEncontradoException extends RuntimeException {
    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}