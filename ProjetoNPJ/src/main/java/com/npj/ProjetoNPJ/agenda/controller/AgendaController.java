package com.npj.ProjetoNPJ.agenda.controller;


import com.npj.ProjetoNPJ.agenda.dto.AgendamentoDto;
import com.npj.ProjetoNPJ.agenda.dto.ResponseAgendamentoDto;
import com.npj.ProjetoNPJ.agenda.service.AgendaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/age")
public class AgendaController {

    @Autowired
    private AgendaService service;

    @PostMapping(value = "/insert")
    public ResponseEntity<ResponseAgendamentoDto> inserir(@Valid @RequestBody AgendamentoDto dto) {
        ResponseAgendamentoDto agendamento = service.criarAgendamento(dto);
        return ResponseEntity.ok().body(agendamento);
    }

    @PutMapping(value = "/upd{id}")
    public ResponseEntity<ResponseAgendamentoDto> atualizar(@Valid @PathVariable String id, @RequestBody AgendamentoDto dto) {
        ResponseAgendamentoDto agendamento = service.atualizarAgendamento(dto, id);
        return ResponseEntity.ok().body(agendamento);
    }
}
