package com.npj.ProjetoNPJ.agenda.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class EventoItemDto {

    private String id;
    private String title;
    private LocalDateTime start;
    private LocalDateTime end;
    private boolean allDay;
    private String type; // "agendamento" ou "tarefa"
    private List<ResponsavelDto> responsaveis;
    private List<String> responsaveisId;
    private List<String> responsaveisNome;
    private String casoTipo; // Para agendamentos
    private String descricao; // Para tarefas
    private String prioridade; // Para tarefas
    private Boolean status; // Para tarefas
}
