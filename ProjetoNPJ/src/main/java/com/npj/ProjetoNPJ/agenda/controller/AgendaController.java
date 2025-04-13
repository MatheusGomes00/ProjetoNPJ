package com.npj.ProjetoNPJ.agenda.controller;


import com.npj.ProjetoNPJ.agenda.dto.EventoDto;
import com.npj.ProjetoNPJ.agenda.dto.EventoItemDto;
import com.npj.ProjetoNPJ.agenda.service.AgendaService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(name = "/agenda")
public class AgendaController {

    @Autowired
    private AgendaService agendaService;

    @GetMapping("/tarefas")
    public ResponseEntity<List<EventoItemDto>> getTarefas( @Valid
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        List<EventoItemDto> tarefas = agendaService.getTarefas(start, end);
        return ResponseEntity.ok(tarefas);
    }

    @GetMapping("/agendamentos")
    public ResponseEntity<List<EventoItemDto>> getAgendamentos( @Valid
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        List<EventoItemDto> agendamentos = agendaService.getAgendamentos(start, end);
        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/eventos")
    public ResponseEntity<EventoDto> getEventos( @Valid
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        EventoDto eventos = agendaService.getEventos(start, end);
        return ResponseEntity.ok(eventos);
    }
}
