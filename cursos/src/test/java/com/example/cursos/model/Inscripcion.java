package com.example.cursos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscripciones")
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Muchas inscripciones → un estudiante
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    // Muchas inscripciones → un curso
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    @Column(name = "fecha_inscripcion", nullable = false, updatable = false)
    private LocalDateTime fechaInscripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoInscripcion estado = EstadoInscripcion.ACTIVA;

    @PrePersist
    void alCrear() {
        this.fechaInscripcion = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Estudiante getEstudiante() { return estudiante; }
    public void setEstudiante(Estudiante estudiante) { this.estudiante = estudiante; }
    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }
    public LocalDateTime getFechaInscripcion() { return fechaInscripcion; }
    public EstadoInscripcion getEstado() { return estado; }
    public void setEstado(EstadoInscripcion estado) { this.estado = estado; }
}