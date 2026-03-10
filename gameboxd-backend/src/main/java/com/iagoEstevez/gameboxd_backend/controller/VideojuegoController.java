package com.iagoEstevez.gameboxd_backend.controller;

import com.iagoEstevez.gameboxd_backend.model.Videojuego;
import com.iagoEstevez.gameboxd_backend.repository.VideojuegoRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/juegos")
public class VideojuegoController {

    private final VideojuegoRepository videojuegoRepository;

    // Esto es la "Inyección por constructor" que te pedía VS Code
    public VideojuegoController(VideojuegoRepository videojuegoRepository) {
        this.videojuegoRepository = videojuegoRepository;
    }

    @GetMapping
    public List<Videojuego> obtenerTodosLosJuegos() {
        return videojuegoRepository.findAll();
    }
}