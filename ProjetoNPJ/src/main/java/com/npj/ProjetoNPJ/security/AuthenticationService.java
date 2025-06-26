package com.npj.ProjetoNPJ.security;


import com.npj.ProjetoNPJ.exceptions.CustomAuthenticationException;
import com.npj.ProjetoNPJ.exceptions.InvalidTokenException;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthenticationService(AuthenticationManager authenticationManager,
                                 JwtService jwtService, UserDetailsServiceImpl userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }


    public Map<String, String> autenticar(String username, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            UserAutenticado user = (UserAutenticado) authentication.getPrincipal();
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
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

        String userId = jwtService.extractUserId(refreshToken);
        UserAutenticado user = (UserAutenticado) userDetailsService.loadUserById(userId);

        String newAccess =  jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        return Map.of("accessToken", newAccess, "refreshToken", newRefreshToken);
    }
}