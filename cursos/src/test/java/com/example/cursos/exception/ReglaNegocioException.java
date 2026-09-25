package com.example.cursos.exception;

// Se usa cuando la operación viola una regla del negocio → 409
public class ReglaNegocioException extends RuntimeException {
    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}