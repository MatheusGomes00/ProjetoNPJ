package com.npj.ProjetoNPJ.security;

import com.npj.ProjetoNPJ.exceptions.CustomAuthenticationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthenticationService(AuthenticationManager authenticationManager,
                                 JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }


    public Map<String, String> authenticate(String username, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            String authenticatedUsername = authentication.getName();


            String accessToken = jwtService.generateAccessToken(authenticatedUsername);
            String refreshToken = jwtService.generateRefreshToken(authenticatedUsername);

            return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
        } catch (BadCredentialsException e) {
            throw new CustomAuthenticationException("Usuário ou senha inválidos");
        } catch (AuthenticationException e) {
            e.printStackTrace();
            throw new CustomAuthenticationException("Falha na autenticação");
        }
    }


    public String refreshAccessToken(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new IllegalArgumentException("Refresh token não pode ser nulo ou vazio!");
        }

        if (jwtService.validateToken(refreshToken)) {
            String username = jwtService.extractUsername(refreshToken);
            return jwtService.generateAccessToken(username);
        }
        throw new RuntimeException("Refresh token inválido ou expirado");
    }
}