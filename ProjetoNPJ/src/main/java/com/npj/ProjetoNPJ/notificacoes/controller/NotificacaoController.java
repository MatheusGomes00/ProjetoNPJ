package com.npj.ProjetoNPJ.notificacoes.controller;

import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.notificacoes.entitie.Notificacao;
import com.npj.ProjetoNPJ.notificacoes.service.NotificacaoService;
import com.npj.ProjetoNPJ.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping(value = "/notificacao")
public class NotificacaoController {

    private static final Logger LOGGER = Logger.getLogger(NotificacaoController.class.getName());

    @Autowired
    private NotificacaoService notificacaoService;

    @Autowired
    private JwtService jwtService;

    @GetMapping(value = "/get")
    public ResponseEntity<List<Notificacao>> getNotificacao(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.replace("Bearer ", "").trim();
            String advogadoId = jwtService.extractId(token);
            List<Notificacao> notificacoes = notificacaoService.buscarNotificacoesPorAdvogado(advogadoId);
            return ResponseEntity.ok(notificacoes);
        } catch (Exception e) {
            throw new RuntimeException("Erro interno ao buscar notificações: " + e.getMessage(), e);
        }
    }
}