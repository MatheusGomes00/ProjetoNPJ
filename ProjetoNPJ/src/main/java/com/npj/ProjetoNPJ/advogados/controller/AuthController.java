package com.npj.ProjetoNPJ.advogados.controller;

import com.npj.ProjetoNPJ.advogados.dtos.AuthRequest;
import com.npj.ProjetoNPJ.advogados.service.AdvogadoService;
import com.npj.ProjetoNPJ.exceptions.CustomAuthenticationException;
import com.npj.ProjetoNPJ.security.AuthenticationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    private final long refreshTokenExpiration;

    public AuthController(
            AuthenticationService authenticationService,
            @Value("${jwt.refreshTokenExpiration}") long refreshTokenExpiration
            ) {
        this.authenticationService = authenticationService;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Map<String, String> tokens = authenticationService.autenticar(authRequest.getUsername(), authRequest.getPassword());
            if (tokens == null || tokens.get("refreshToken") == null || tokens.get("accessToken") == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Falha ao gerar tokens"));
            }
            long maxAgeInSeconds = refreshTokenExpiration / 1000;
            String cookieValue = String.format(
                    "refreshToken=%s; HttpOnly; SameSite=Lax; Path=/; Max-Age=%d",
                    tokens.get("refreshToken"),
                    maxAgeInSeconds
            );
            return ResponseEntity.ok()
                    .header("Set-Cookie", cookieValue)
                    .body(Map.of("accessToken", tokens.get("accessToken")));

        } catch (CustomAuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro interno no servidor"));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {
        try {
            if (refreshToken == null || refreshToken.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Refresh token não fornecido"));
            }
            Map<String, String> tokens = authenticationService.refreshAccessToken(refreshToken);
            if (tokens == null || tokens.get("accessToken") == null || tokens.get("refreshToken") == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Falha ao gerar novo token"));
            }
            long maxAgeInSeconds = refreshTokenExpiration / 1000;
            String cookieValue = String.format(
                    "refreshToken=%s; HttpOnly; SameSite=Lax; Path=/; Max-Age=%d",
                    tokens.get("refreshToken"),
                    maxAgeInSeconds
            );
            return ResponseEntity.ok()
                    .header("Set-Cookie", cookieValue)
                    .body(Map.of("accessToken", tokens.get("accessToken")));
        }  catch (CustomAuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro interno no servidor"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {
        String cookieValue = "refreshToken=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0";
        return ResponseEntity.ok().header("Set-Cookie", cookieValue).build();
    }
}
