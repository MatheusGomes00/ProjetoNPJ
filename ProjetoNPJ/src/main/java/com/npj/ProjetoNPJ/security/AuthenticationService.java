package com.npj.ProjetoNPJ.security;

import com.npj.ProjetoNPJ.exceptions.CustomAuthenticationException;
import com.npj.ProjetoNPJ.exceptions.InvalidTokenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

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
        } catch (InternalAuthenticationServiceException e) {
            System.out.println(e.getMessage());
            throw new CustomAuthenticationException("CPF ou senha incorretos");
        } catch (AuthenticationException e) {
            throw new CustomAuthenticationException("Falha na autenticação");
        }
    }


    public Map<String, String> refreshAccessToken(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new IllegalArgumentException("Refresh token não pode ser nulo ou vazio!");
        }
        if (!jwtService.validateToken(refreshToken)) {
            throw new InvalidTokenException("Refresh token inválido.");
        }
        if(jwtService.extractExpirationAsLocalDateTime(refreshToken).isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Refresh token expirado.");
        }

        String username = jwtService.extractUsername(refreshToken);
        String newAccess =  jwtService.generateAccessToken(username);
        String newRefreshToken = jwtService.generateRefreshToken(username);
        return Map.of("accessToken", newAccess, "refreshToken", newRefreshToken);
    }
}