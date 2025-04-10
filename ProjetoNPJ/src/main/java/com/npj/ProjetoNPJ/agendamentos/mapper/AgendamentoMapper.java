package com.npj.ProjetoNPJ.agendamentos.mapper;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.agendamentos.dto.AgendamentoDto;
import com.npj.ProjetoNPJ.agendamentos.dto.ResponseAgendamentoDto;
import com.npj.ProjetoNPJ.agendamentos.entity.Agendamento;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class AgendaMapper {

    public static ResponseAgendamentoDto toResponseDto(AgendamentoDto dto) {

        return new ModelMapper().map(dto, ResponseAgendamentoDto.class);
    }

    public static ResponseAgendamentoDto toDto(Agendamento agendamento) {

        return new ModelMapper().map(agendamento, ResponseAgendamentoDto.class);
    }

    public static Agendamento toEntity(AgendamentoDto dto,  List<Advogado> advogados) {

        return new ModelMapper().map(dto, Agendamento.class);
    }

    public static List<ResponseAgendamentoDto> toListDto(List<Agendamento> agendamentos) {

        return agendamentos.stream().map(agendamento -> toDto(agendamento)).collect(Collectors.toList());
    }
}
