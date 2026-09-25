package com.example.cursos.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cursos")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false, length = 100)
    private String instructor;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "duracion_horas", nullable = false)
    private Integer duracionHoras;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Nivel nivel;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    // RELACIÓN: muchos cursos pertenecen a UNA categoría
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)  // columna FK en la tabla cursos
    private Categoria categoria;

    @PrePersist
    void alCrear() {
        this.fechaCreacion = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public Integer getDuracionHoras() { return duracionHoras; }
    public void setDuracionHoras(Integer duracionHoras) { this.duracionHoras = duracionHoras; }
    public Nivel getNivel() { return nivel; }
    public void setNivel(Nivel nivel) { this.nivel = nivel; }
    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
}