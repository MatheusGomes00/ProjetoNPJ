package com.npj.ProjetoNPJ.advogados.controller;

import com.npj.ProjetoNPJ.advogados.dtos.AuthRequest;
import com.npj.ProjetoNPJ.advogados.dtos.RefreshTokenRequest;
import com.npj.ProjetoNPJ.security.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Map<String, String>> login(@RequestBody AuthRequest authRequest) {

        Map<String, String> tokens = authenticationService
                .authenticate(authRequest.getUsername(), authRequest.getPassword());
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody RefreshTokenRequest refreshToken) {
        try {
            String newAccessToken = authenticationService.refreshAccessToken(refreshToken.getRefreshToken());
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Refresh token inválido ou expirado!"));
        }
    }


}
