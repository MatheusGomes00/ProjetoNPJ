package com.npj.ProjetoNPJ.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
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

    private final UserDetailsService userDetailsService;


    public JwtService(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    public String generateAccessToken(UserAutenticado user) {
        String role = user.getAuthorities().iterator().next().getAuthority();
        String userId = user.getId();
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role); // Adiciona a role ao payload do token
        return createToken(claims, userId, accessExpiration);
    }

    public String generateRefreshToken(UserAutenticado user) {
        String role = user.getAuthorities().iterator().next().getAuthority();
        String userId = user.getId();
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return createToken(claims, userId, refreshExpiration);
    }

    private String createToken(Map<String, Object> claims, String userId, long expiration) {
        return Jwts.builder()
                .claims(claims)
                .subject(userId)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            getJwtParser().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            log.error("Erro ao validar token: {}", e.getMessage());
            return false;
        }
    }

    public String extractUserId(String token) {

        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public LocalDateTime extractExpirationAsLocalDateTime(String token) {
        Date expiration = extractExpiration(token);
        return expiration.toInstant()
                .atZone(ZoneId.of("UTC"))
                .toLocalDateTime();
    }


    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public List<SimpleGrantedAuthority> extractRoles(String token) {
        JwtParser jwtParser = Jwts.parser()
                .verifyWith(getSigningKey())
                .build();
        Claims claims = jwtParser.parseSignedClaims(token).getPayload();
        String role = (String) claims.get("role"); // pega um Map<String, Object>, faz o cast para string

        if (role != null) {
            return List.of(new SimpleGrantedAuthority(role));
        }
        return Collections.emptyList();
    }
    
    private Claims extractAllClaims(String token) {
        return getJwtParser()
                .parseSignedClaims(token)
                .getPayload();
    }

    private JwtParser getJwtParser() {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}