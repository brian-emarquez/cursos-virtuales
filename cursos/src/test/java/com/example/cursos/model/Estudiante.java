package com.example.cursos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "estudiantes")
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 20)
    private String telefono;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    void alCrear() {
        this.fechaRegistro = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }
    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
}