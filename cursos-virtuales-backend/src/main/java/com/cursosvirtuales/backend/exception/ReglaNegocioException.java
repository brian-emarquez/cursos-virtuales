package com.cursosvirtuales.backend.exception;

// Se viola una regla del negocio → 409
public class ReglaNegocioException extends RuntimeException {
    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}