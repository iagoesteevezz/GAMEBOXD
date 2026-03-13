package com.iagoEstevez.gameboxd_backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "videojuegos")
public class Videojuego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String titulo;
    private String descripcion;
    private String desarrollador;

    @Column(name = "fecha_lanzamiento")
    private LocalDate fechaLanzamiento;

    @Column(name = "portada_url")
    private String portadaUrl;

    @Column(name = "usuario_id")
    private Integer usuarioId;
    
    @Column(name = "puntuacion")
    private Double puntuacion; 

    // Reseña escrita por el usuario 
    @Column(name = "resena", columnDefinition = "TEXT")
    private String resena;

    // La fecha en la que el usuario se pasó o jugó al juego
    @Column(name = "fecha_jugado")
    private String fechaJugado;

    public Videojuego() {}

    public Integer getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getDesarrollador() {
        return desarrollador;
    }

    public LocalDate getFechaLanzamiento() {
        return fechaLanzamiento;
    }

    public String getPortadaUrl() {
        return portadaUrl;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setDesarrollador(String desarrollador) {
        this.desarrollador = desarrollador;
    }

    public void setFechaLanzamiento(LocalDate fechaLanzamiento) {
        this.fechaLanzamiento = fechaLanzamiento;
    }

    public void setPortadaUrl(String portadaUrl) {
        this.portadaUrl = portadaUrl;
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    
    public void setPuntuacion(Double puntuacion) {
        this.puntuacion = puntuacion;
    }

    public void setResena(String resena) {
        this.resena = resena;
    }

    public void setFechaJugado(String fechaJugado) {
        this.fechaJugado = fechaJugado;
    }

    public Double getPuntuacion() {
        return puntuacion;
    }

    public String getResena() {
        return resena;
    }

    public String getFechaJugado() {
        return fechaJugado;
    }
}