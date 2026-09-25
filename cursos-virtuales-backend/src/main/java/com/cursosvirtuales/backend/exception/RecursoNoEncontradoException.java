package com.cursosvirtuales.backend.exception;

// Algo no existe → 404
public class RecursoNoEncontradoException extends RuntimeException {
    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}