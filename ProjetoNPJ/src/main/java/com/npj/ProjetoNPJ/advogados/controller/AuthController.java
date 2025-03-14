package com.npj.ProjetoNPJ.advogados.controller;

import com.npj.ProjetoNPJ.advogados.dtos.AuthRequest;
import com.npj.ProjetoNPJ.advogados.dtos.RefreshTokenRequest;
import com.npj.ProjetoNPJ.exceptions.CustomAuthenticationException;
import com.npj.ProjetoNPJ.security.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Map<String, String> tokens = authenticationService
                    .authenticate(authRequest.getUsername(), authRequest.getPassword());
            return ResponseEntity.ok()
                    .header(
                            "Set-Cookie",
                            "refreshToken="
                                    + tokens.get("refreshToken")
                                    + "; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=21600")
                    .body(Map.of("accessToken", tokens.get("accessToken")));
        } catch (CustomAuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED) // 401
                    .body(Map.of("message", ex.getMessage())); // "CPF ou senha incorretos"
        } catch (Exception ex) {
            ex.printStackTrace(); // Outros erros inesperados
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro interno no servidor"));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody RefreshTokenRequest refreshToken) {
        try {
            Map<String, String> tokens = authenticationService.refreshAccessToken(refreshToken.getRefreshToken());
            return ResponseEntity.ok(tokens);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Refresh token inválido ou expirado!"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        try {
            authenticationService.logout(refreshToken);
            // Apagar o cookie definindo Max-Age=0
            return ResponseEntity.ok()
                    .header("Set-Cookie", "refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0")
                    .build();
        } catch (IllegalArgumentException ex) {
            // Se o token for inválido ou não encontrado, ainda apaga o cookie e retorna sucesso
            return ResponseEntity.ok()
                    .header("Set-Cookie", "refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0")
                    .build();
        } catch (RuntimeException ex) {
            return ResponseEntity.ok()
                    .header("Set-Cookie", "refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0")
                    .build();
        }
    }
}
