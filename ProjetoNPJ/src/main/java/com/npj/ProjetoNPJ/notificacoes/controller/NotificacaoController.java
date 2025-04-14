package com.npj.ProjetoNPJ.notificacoes.controller;


import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.notificacoes.NotificacoesMain;
import com.npj.ProjetoNPJ.notificacoes.dtos.NotificacoesDto;
import com.npj.ProjetoNPJ.notificacoes.repository.NotificacaoRepository;
import com.npj.ProjetoNPJ.notificacoes.service.NotificacaoService;
import com.npj.ProjetoNPJ.security.JwtService;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/notificacao")
public class NotificacaoController {

    @Autowired
    private NotificacaoRepository repository;

    @Autowired
    private JwtService service;

    @Autowired
    private NotificacaoService servicenot;

    @GetMapping(value = "/{advogadoId}")
    public ResponseEntity<List<NotificacoesMain>> getNotificacoes(
            @PathVariable String advogadoId,
            @RequestHeader("Authorization") String authorizationHeader){

        String token = authorizationHeader.replace("Bearer", "").trim();
        String adogadoId = service.extractId(token);



        if (!adogadoId.equals(advogadoId)) {
            throw new RecursoNaoEncontradoException("Acesso negado: usuário não autorizado.");
        }

        List<NotificacoesMain> not = repository.findByAdvogadoIdAndLidaFalse(advogadoId);

        return ResponseEntity.ok(not);
    }
    @GetMapping("/get")
    public ResponseEntity<List<NotificacoesDto>> listarTarefas() {

        List<NotificacoesDto> dto = servicenot.getTarefasAutenticado();
        return ResponseEntity.ok(dto);
    }

}
