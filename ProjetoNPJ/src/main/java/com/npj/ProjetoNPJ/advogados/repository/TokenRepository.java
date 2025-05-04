package com.npj.ProjetoNPJ.advogados.repository;

import com.npj.ProjetoNPJ.advogados.entity.RefreshToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface TokenRepository extends MongoRepository<RefreshToken, String> {

    @Query("{ 'token': ?0, 'active': true }")
    Optional<RefreshToken> findByToken(String token);

    @Query("{ 'username': ?0, 'active': true }")
    RefreshToken findByUsername(String authenticatedUsername);
}
