package com.npj.ProjetoNPJ.advogados.repository;

import com.npj.ProjetoNPJ.advogados.entity.RefreshToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TokenRepository extends MongoRepository<RefreshToken, String> {

    Optional<RefreshToken> findByToken(String token);
}
