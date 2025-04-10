package com.npj.ProjetoNPJ.agendamentos.controller;


import com.npj.ProjetoNPJ.agendamentos.dto.AgendamentoDto;
import com.npj.ProjetoNPJ.agendamentos.dto.ResponseAgendamentoDto;
import com.npj.ProjetoNPJ.agendamentos.service.AgendaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/agenda")
public class AgendaController {

    @Autowired
    private AgendaService service;


    @PostMapping(value = "/insert")
    public ResponseEntity<ResponseAgendamentoDto> inserir(@Valid @RequestBody AgendamentoDto dto) {
        ResponseAgendamentoDto agendamento = service.criarAgendamento(dto);
        return ResponseEntity.ok().body(agendamento);
    }

    @PutMapping(value = "/upd/{id}")
    public ResponseEntity<ResponseAgendamentoDto> atualizar(@Valid @PathVariable String id, @RequestBody AgendamentoDto dto) {
        ResponseAgendamentoDto agendamento = service.atualizarAgendamento(dto, id);
        return ResponseEntity.ok().body(agendamento);
    }

    @GetMapping(value = "/buscarPorId/{id}")
    public ResponseEntity<ResponseAgendamentoDto> buscarPorId(@PathVariable String id) {
        ResponseAgendamentoDto agendamento = service.buscaId(id);
        return ResponseEntity.ok().body(agendamento);
    }


    @GetMapping(value = "/todos")
    public ResponseEntity<List<ResponseAgendamentoDto>> buscarTodos() {
        List<ResponseAgendamentoDto> agendamentos = service.buscaTodos();
        return ResponseEntity.ok().body(agendamentos);
    }


    @GetMapping(value = "/nome/{nome}")
    public ResponseEntity<List<ResponseAgendamentoDto>> buscarPorNome(@PathVariable String nome) {
        List<ResponseAgendamentoDto> agendamentos = service.buscaNome(nome);
        return ResponseEntity.ok().body(agendamentos);
    }


    @GetMapping(value = "/cpf/{cpf}")
    public ResponseEntity<List<ResponseAgendamentoDto>> buscarPorCpf(@PathVariable String cpf) {
        List<ResponseAgendamentoDto> agendamentos = service.buscaCpf(cpf);
        return ResponseEntity.ok().body(agendamentos);
    }
}
