package com.npj.ProjetoNPJ.agenda.service;

import com.npj.ProjetoNPJ.agenda.dto.EventoDto;
import com.npj.ProjetoNPJ.agenda.dto.EventoItemDto;
import com.npj.ProjetoNPJ.agenda.mapper.EventoMapper;
import com.npj.ProjetoNPJ.agendamentos.entity.Agendamento;
import com.npj.ProjetoNPJ.agendamentos.mapper.AgendamentoMapper;
import com.npj.ProjetoNPJ.agendamentos.repository.AgendamentoRepository;
import com.npj.ProjetoNPJ.exceptions.IllegalArgumentException;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import com.npj.ProjetoNPJ.tarefas.mapper.TarefasMapper;
import com.npj.ProjetoNPJ.tarefas.repository.TarefasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AgendaService {

    @Autowired
    private EventoMapper eventoMapper;

    @Autowired
    private TarefasRepository tarefasRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    public void validateDateRange(LocalDateTime start, LocalDateTime end) {
        if (start.isAfter(end)) {
            throw new IllegalArgumentException("A data de início deve ser anterior ou igual à data de fim.");
        }
    }

    public List<EventoItemDto> getTarefas(LocalDateTime start, LocalDateTime end) {
        validateDateRange(start, end);
        LocalDate startDate = start.toLocalDate();
        LocalDate endDate = end.toLocalDate();
        List<Tarefas> tarefas = tarefasRepository.findByPrazoLimiteBetween(startDate, endDate);
        return eventoMapper.toEventoItemDtoListTarefas(TarefasMapper.toListDto(tarefas));
    }

    public List<EventoItemDto> getAgendamentos(LocalDateTime start, LocalDateTime end) {
        validateDateRange(start, end);
        List<Agendamento> agendamentos = agendamentoRepository.findByPeriod(start, end);
        return eventoMapper.toEventoItemDtoList(AgendamentoMapper.toListDto(agendamentos));
    }

    public EventoDto getEventos(LocalDateTime start, LocalDateTime end) {
        validateDateRange(start, end);
        List<EventoItemDto> eventos = new ArrayList<>();
        eventos.addAll(getTarefas(start, end));
        eventos.addAll(getAgendamentos(start, end));
        EventoDto eventoDto = new EventoDto();
        eventoDto.setEventos(eventos);
        return eventoDto;
    }


}
