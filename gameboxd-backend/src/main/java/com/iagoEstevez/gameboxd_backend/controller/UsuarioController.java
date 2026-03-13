package com.iagoEstevez.gameboxd_backend.controller;

import com.iagoEstevez.gameboxd_backend.model.Usuario;
import com.iagoEstevez.gameboxd_backend.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin // Súper importante para que tu web HTML pueda hablar con Java
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Usamos @PostMapping porque vamos a RECIBIR datos para crear algo nuevo
    @PostMapping("/registro")
    public Usuario registrarUsuario(@RequestBody Usuario nuevoUsuario) {
        // En un proyecto profesional de DAM aquí encriptaríamos la contraseña antes de guardar.
        // Por ahora, para ver que funciona, lo guardamos directamente en la base de datos.
        return usuarioRepository.save(nuevoUsuario);
    }
}