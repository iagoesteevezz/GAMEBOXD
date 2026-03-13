package com.iagoEstevez.gameboxd_backend.controller;

import com.iagoEstevez.gameboxd_backend.model.Usuario;
import com.iagoEstevez.gameboxd_backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // 1. EL QUE YA TENÍAS: Para registrarse
    @PostMapping("/registro")
    public Usuario registrarUsuario(@RequestBody Usuario nuevoUsuario) {
        return usuarioRepository.save(nuevoUsuario);
    }

    // 2. EL NUEVO: Para iniciar sesión
    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");

        // Buscamos si existe alguien con ese email
        Optional<Usuario> usuarioEncontrado = usuarioRepository.findByEmail(email);

        // Si existe (isPresent) y además la contraseña coincide...
        if (usuarioEncontrado.isPresent() && usuarioEncontrado.get().getPasswordHash().equals(password)) {
            // ¡Login correcto! Devolvemos los datos del usuario (con un código 200 OK)
            return ResponseEntity.ok(usuarioEncontrado.get());
        } else {
            // Falla el login (Devolvemos un error 401 Unauthorized)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Correo o contraseña incorrectos");
        }
    }
}