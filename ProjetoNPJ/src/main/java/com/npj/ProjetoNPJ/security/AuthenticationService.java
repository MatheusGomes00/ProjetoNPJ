package com.npj.ProjetoNPJ.security;

import com.npj.ProjetoNPJ.advogados.entity.RefreshToken;
import com.npj.ProjetoNPJ.advogados.repository.TokenRepository;
import com.npj.ProjetoNPJ.exceptions.CustomAuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Autowired
    private TokenRepository tokenRepository;

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

            LocalDateTime expiration = jwtService.extractExpirationAsLocalDateTime(refreshToken);

            RefreshToken refreshTokenEntity = new RefreshToken(refreshToken, authenticatedUsername, expiration);
            tokenRepository.save(refreshTokenEntity);

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

        RefreshToken storedToken = tokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token não encontrado ou inválido"));

        if(!storedToken.isActive() || storedToken.getExpiresAt().isBefore(LocalDateTime.now())){
            throw new RuntimeException("Refresh token inválido ou expirado");
        }

        if (!jwtService.validateToken(refreshToken)) {
            storedToken.setActive(false); // Invalida no banco se a assinatura estiver errada
            tokenRepository.save(storedToken);
            throw new RuntimeException("Refresh token inválido ou expirado");
        }

        String username = jwtService.extractUsername(refreshToken);
        String newAccess =  jwtService.generateAccessToken(username);
        String newRefresh = jwtService.generateRefreshToken(username);

        storedToken.setActive(false);
        tokenRepository.save(storedToken);

        LocalDateTime newExpiration = jwtService.extractExpirationAsLocalDateTime(newRefresh);
        RefreshToken newTokenEntity = new RefreshToken(newRefresh, username, newExpiration);
        tokenRepository.save(newTokenEntity);

        return Map.of("accessToken", newAccess, "refreshToken", newRefresh);

    }

    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new IllegalArgumentException("Refresh token não pode ser nulo ou vazio!");
        }

        Optional<RefreshToken> tokenOptional = tokenRepository.findByToken(refreshToken);
        if (tokenOptional.isPresent()) {
            RefreshToken storedToken = tokenOptional.get();
            if (storedToken.isActive()) {
                storedToken.setActive(false);
                tokenRepository.save(storedToken);
            }
        } else {
            throw new RuntimeException("Refresh token não encontrado");
        }
    }
}