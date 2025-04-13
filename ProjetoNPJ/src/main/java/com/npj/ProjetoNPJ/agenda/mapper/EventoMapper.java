package com.npj.ProjetoNPJ.agenda.mapper;

import com.npj.ProjetoNPJ.agenda.dto.EventoItemDto;
import com.npj.ProjetoNPJ.agenda.dto.ResponsavelDto;
import com.npj.ProjetoNPJ.agendamentos.dto.AgendamentoDto;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class EventoMapper {

    public EventoItemDto toEventoItemDto(AgendamentoDto agendamentoDto) {
        if (agendamentoDto == null) {
            return null;
        }

        EventoItemDto evento = new EventoItemDto();
        evento.setId(agendamentoDto.getId());
        evento.setTitle(agendamentoDto.getNome() + " - " + agendamentoDto.getCasoTipo());
        evento.setStart(agendamentoDto.getStart());
        evento.setEnd(agendamentoDto.getEnd());
        evento.setAllDay(false);
        evento.setType("agendamento");
        evento.setResponsaveis(agendamentoDto.getResponsaveis());
        evento.setCasoTipo(agendamentoDto.getCasoTipo());
        evento.setDescricao(null);
        evento.setPrioridade(null);
        evento.setStatus(null);

        return evento;
    }

    public EventoItemDto toEventoItemDto(DtoTarefas tarefaDto) {
        if (tarefaDto == null) {
            return null;
        }

        EventoItemDto evento = new EventoItemDto();
        evento.setId(tarefaDto.getId());
        evento.setTitle(tarefaDto.getNomeTarefa());
        evento.setStart(tarefaDto.getPrazoLimite().atStartOfDay());
        evento.setEnd(null);
        evento.setAllDay(true);
        evento.setType("tarefa");
        evento.setResponsaveisId(tarefaDto.getResponsaveisId());
        evento.setResponsaveisNome(tarefaDto.getResponsaveisNome());
        evento.setDescricao(tarefaDto.getDescricao());
        evento.setPrioridade(tarefaDto.getPrioridade());
        evento.setStatus(tarefaDto.isStatus());
        evento.setCasoTipo(null);

        return evento;
    }

    public List<EventoItemDto> toEventoItemDtoList(List<AgendamentoDto> agendamentos) {
        if (agendamentos == null) {
            return null;
        }
        return agendamentos.stream()
                .map(this::toEventoItemDto)
                .filter(evento -> evento != null)
                .toList();
    }

    public List<EventoItemDto> toEventoItemDtoListTarefas(List<DtoTarefas> tarefas) {
        if (tarefas == null) {
            return new ArrayList<>();
        }
        return tarefas.stream()
                .map(this::toEventoItemDto)
                .filter(evento -> evento != null)
                .toList();
    }
}
