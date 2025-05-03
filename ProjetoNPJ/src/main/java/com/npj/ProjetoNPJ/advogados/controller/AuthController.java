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
@RequestMapping(value = "/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationService authenticationService;

    private final AdvogadoService advogadoService;

    private final long refreshTokenExpiration;

    private final Environment environment;

    public AuthController(
            AuthenticationService authenticationService,
            AdvogadoService advogadoService,
            @Value("${jwt.refreshTokenExpiration}") long refreshTokenExpiration,
            Environment environment) {
        this.authenticationService = authenticationService;
        this.advogadoService = advogadoService;
        this.refreshTokenExpiration = refreshTokenExpiration;
        this.environment = environment;
    }

    private boolean isDevProfileActive() {
        for (String profile : environment.getActiveProfiles()) {
            if ("dev".equals(profile)) {
                logger.info("Perfil dev ativo, omitindo Secure");
                return true;
            }
        }
        logger.info("Perfil dev não ativo, incluindo Secure");
        return false;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            logger.info("Tentativa de login para username: {}", authRequest.getUsername());
            String username = advogadoService.getUsername(authRequest.getUsername());
            Map<String, String> tokens = authenticationService.authenticate(username, authRequest.getPassword());
            if (tokens == null || tokens.get("refreshToken") == null || tokens.get("accessToken") == null) {
                logger.error("Falha ao gerar tokens para username: {}", username);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Falha ao gerar tokens"));
            }
            long maxAgeInSeconds = refreshTokenExpiration / 1000;
            String secureAttribute = isDevProfileActive() ? "" : "; Secure";
            String cookieValue = String.format("refreshToken=%s; HttpOnly%s; SameSite=Strict; Path=/; Max-Age=%d",
                    tokens.get("refreshToken"), secureAttribute, maxAgeInSeconds);
            logger.info("Definindo cookie: {}", cookieValue);
            return ResponseEntity.ok()
                    .header("Set-Cookie", cookieValue)
                    .body(Map.of("accessToken", tokens.get("accessToken")));
        } catch (CustomAuthenticationException ex) {
            logger.warn("Falha de autenticação: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            logger.error("Erro interno no login: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro interno no servidor"));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {
        try {
            logger.info("Tentativa de renovação de token com refreshToken: {}", refreshToken);
            if (refreshToken == null || refreshToken.isEmpty()) {
                logger.warn("Refresh token não fornecido no cookie");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Refresh token não fornecido"));
            }
            Map<String, String> tokens = authenticationService.refreshAccessToken(refreshToken);
            if (tokens == null || tokens.get("refreshToken") == null || tokens.get("accessToken") == null) {
                logger.error("Falha ao gerar novos tokens");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Falha ao gerar novos tokens"));
            }
            long maxAgeInSeconds = refreshTokenExpiration / 1000;
            String secureAttribute = isDevProfileActive() ? "" : "; Secure";
            String cookieValue = String.format("refreshToken=%s; HttpOnly%s; SameSite=Strict; Path=/; Max-Age=%d",
                    tokens.get("refreshToken"), secureAttribute, maxAgeInSeconds);
            logger.info("Definindo novo cookie: {}", cookieValue);
            return ResponseEntity.ok()
                    .header("Set-Cookie", cookieValue)
                    .body(Map.of("accessToken", tokens.get("accessToken")));
        } catch (Exception e) {
            logger.error("Erro ao renovar token: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Refresh token inválido ou expirado: "));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {
        String secureAttribute = isDevProfileActive() ? "" : "; Secure";
        try {
            logger.info("Tentativa de logout");
            authenticationService.logout(refreshToken);
            String cookieValue = "refreshToken=; HttpOnly" + secureAttribute + "; SameSite=Strict; Path=/; Max-Age=0";
            logger.info("Apagando cookie: {}", cookieValue);
            return ResponseEntity.ok()
                    .header("Set-Cookie", cookieValue)
                    .build();
        } catch (RuntimeException ex) {
            logger.warn("Erro ao fazer logout: {}", ex.getMessage());
            String cookieValue = "refreshToken=; HttpOnly" + secureAttribute + "; SameSite=Strict; Path=/; Max-Age=0";
            logger.info("Apagando cookie apesar de erro: {}", cookieValue);
            return ResponseEntity.ok()
                    .header("Set-Cookie", cookieValue)
                    .build();
        }
    }
}
