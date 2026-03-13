package com.iagoEstevez.gameboxd_backend.repository;

import com.iagoEstevez.gameboxd_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    // Vacío, Spring Boot hace la magia por debajo
}