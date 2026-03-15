package com.iagoEstevez.gameboxd_backend.controller;

import com.iagoEstevez.gameboxd_backend.model.Videojuego;
import com.iagoEstevez.gameboxd_backend.repository.VideojuegoRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
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

    @PostMapping
    public Videojuego guardarJuego(@RequestBody Videojuego nuevoJuego) {
        return videojuegoRepository.save(nuevoJuego);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Videojuego> obtenerJuegosPorUsuario(@PathVariable Integer usuarioId) {
        return videojuegoRepository.findByUsuarioId(usuarioId);
    }

    @GetMapping("/rawg/{idRawg}")
    public ResponseEntity<List<Videojuego>> obtenerResenasDeUnJuego(@PathVariable Long idRawg) {
    List<Videojuego> resenas = videojuegoRepository.findByIdRawg(idRawg);
        return ResponseEntity.ok(resenas);
}
}