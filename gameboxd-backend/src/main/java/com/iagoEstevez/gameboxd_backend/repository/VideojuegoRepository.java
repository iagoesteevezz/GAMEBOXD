package com.iagoEstevez.gameboxd_backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.iagoEstevez.gameboxd_backend.model.Videojuego;
import java.util.List;

@Repository
public interface VideojuegoRepository extends JpaRepository<Videojuego, Integer> {
    List<Videojuego> findByUsuarioId(Integer usuarioId);
    // Busca todas las reseñas de un juego en concreto
    List<Videojuego> findByIdRawg(Long idRawg);
}
