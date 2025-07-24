package com.npj.ProjetoNPJ.notificacoes.controller;

import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.notificacoes.entitie.Notificacao;
import com.npj.ProjetoNPJ.notificacoes.service.NotificacaoService;
import com.npj.ProjetoNPJ.security.JwtService;
import com.npj.ProjetoNPJ.security.UserAutenticado;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping(value = "/api/notificacao")
public class NotificacaoController {

    private static final Logger LOGGER = Logger.getLogger(NotificacaoController.class.getName());

    @Autowired
    private NotificacaoService notificacaoService;

    @Autowired
    private JwtService jwtService;

    public String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserAutenticado) {
            return ((UserAutenticado) principal).getId(); // username do usuário autenticado
        } else {
            return principal.toString(); // Caso seja um token simples
        }
    }

    @GetMapping(value = "/get")
    public ResponseEntity<List<Notificacao>> getNotificacao(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // String token = authorizationHeader.replace("Bearer ", "").trim();
            String advogadoId = getAuthenticatedUsername();
            List<Notificacao> notificacoes = notificacaoService.buscarNotificacoesPorAdvogado(advogadoId);
            return ResponseEntity.ok(notificacoes);
        } catch (Exception e) {
            throw new RuntimeException("Erro interno ao buscar notificações: " + e.getMessage(), e);
        }
    }
    @GetMapping(value = "/getNaoLida")
    public ResponseEntity<List<Notificacao>> getNotificacaoNaoLida(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // String token = authorizationHeader.replace("Bearer ", "").trim();
            String advogadoId = getAuthenticatedUsername();
            List<Notificacao> notificacoes = notificacaoService.buscarNotificacoesNaoLidas(advogadoId);
            return ResponseEntity.ok(notificacoes);
        } catch (Exception e) {
            throw new RuntimeException("Erro interno ao buscar notificações: " + e.getMessage(), e);
        }
    }

    @PutMapping(value = "/end/{id}")
    public ResponseEntity<Notificacao> finalizarTarefa(@PathVariable String id, @RequestHeader("Authorization") String authorizationHeader){

        try {
            Notificacao notificacaoAtualizada = notificacaoService.finalizar(id);
            return ResponseEntity.ok(notificacaoAtualizada);
        } catch (Exception e) {
            System.err.println("Erro ao ler a notificacao " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }

    }

    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<Void> excluirNotificacao(@PathVariable String id){

        notificacaoService.excluirNotificacoes(id);

        return ResponseEntity.ok().build();

    }

}