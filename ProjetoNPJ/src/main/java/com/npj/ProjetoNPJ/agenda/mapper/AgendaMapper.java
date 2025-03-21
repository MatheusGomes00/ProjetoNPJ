package com.npj.ProjetoNPJ.agenda.mapper;

import com.npj.ProjetoNPJ.agenda.dto.AgendamentoDto;
import com.npj.ProjetoNPJ.agenda.dto.ResponseAgendamentoDto;
import com.npj.ProjetoNPJ.agenda.entity.Agendamento;
import org.modelmapper.ModelMapper;

public class AgendaMapper {

    public static ResponseAgendamentoDto toResponseDto(AgendamentoDto dto) {

        return new ModelMapper().map(dto, ResponseAgendamentoDto.class);
    }

    public static Agendamento toEntity(AgendamentoDto dto) {

        return new ModelMapper().map(dto, Agendamento.class);
    }
}
