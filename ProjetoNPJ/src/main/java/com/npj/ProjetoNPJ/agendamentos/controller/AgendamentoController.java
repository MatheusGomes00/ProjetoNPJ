package com.npj.ProjetoNPJ.agendamentos.controller;


import com.npj.ProjetoNPJ.agendamentos.dto.AgendamentoDto;
import com.npj.ProjetoNPJ.agendamentos.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/agendamento")
public class AgendamentoController {

    @Autowired
    private AgendamentoService service;


    @PostMapping(value = "/insert")
    public ResponseEntity<AgendamentoDto> inserir(@Valid @RequestBody AgendamentoDto dto) {
        AgendamentoDto agendamento = service.criarAgendamento(dto);
        return ResponseEntity.ok().body(agendamento);
    }

    @PutMapping(value = "/upd/{id}")
    public ResponseEntity<AgendamentoDto> atualizar(@Valid @PathVariable String id, @RequestBody AgendamentoDto dto) {
        AgendamentoDto agendamento = service.atualizarAgendamento(dto, id);
        return ResponseEntity.ok().body(agendamento);
    }

    @GetMapping(value = "/buscarPorId/{id}")
    public ResponseEntity<AgendamentoDto> buscarPorId(@PathVariable String id) {
        AgendamentoDto agendamento = service.buscaId(id);
        return ResponseEntity.ok().body(agendamento);
    }


    @GetMapping(value = "/todos")
    public ResponseEntity<List<AgendamentoDto>> buscarTodos() {
        List<AgendamentoDto> agendamentos = service.buscaTodos();
        return ResponseEntity.ok().body(agendamentos);
    }


    @GetMapping(value = "/nome/{nome}")
    public ResponseEntity<List<AgendamentoDto>> buscarPorNome(@PathVariable String nome) {
        List<AgendamentoDto> agendamentos = service.buscaNome(nome);
        return ResponseEntity.ok().body(agendamentos);
    }


    @GetMapping(value = "/cpf/{cpf}")
    public ResponseEntity<List<AgendamentoDto>> buscarPorCpf(@PathVariable String cpf) {
        List<AgendamentoDto> agendamentos = service.buscaCpf(cpf);
        return ResponseEntity.ok().body(agendamentos);
    }
}
