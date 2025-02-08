package com.npj.ProjetoNPJ.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.accessTokenExpiration}")
    private long accessExpiration;

    @Value("${jwt.refreshTokenExpiration}")
    private long refreshExpiration;

    // Gera o access token
    public String generateAccessToken(String username) {
        return createToken(new HashMap<>(), username, accessExpiration);
    }

    // Gera o refresh token
    public String generateRefreshToken(String username) {
        return createToken(new HashMap<>(), username, refreshExpiration);
    }

    // Cria o token JWT
    private String createToken(Map<String, Object> claims, String username, long expiration) {
        return Jwts.builder()
                .claims(claims) // Define as claims
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey()) // Assina o token com a chave
                .compact();
    }

    // Valida o token
    public boolean validateToken(String token) {
        try {
            getJwtParser().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            log.error("Erro ao validar token: {}", e.getMessage());
            return false;
        }
    }

    // Extrai o username do token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extrai a data de expiração do token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Método genérico para extrair claims
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extrai todas as claims do token
    private Claims extractAllClaims(String token) {
        return getJwtParser()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Cria o parser JWT configurado com a chave
    private JwtParser getJwtParser() {
        return Jwts.parser()
                .verifyWith(getSigningKey()) // Define a chave de verificação
                .build();
    }

    // Gera a chave de assinatura a partir da chave secreta
    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret); // Decodifica a chave Base64
        return Keys.hmacShaKeyFor(keyBytes);
    }
}