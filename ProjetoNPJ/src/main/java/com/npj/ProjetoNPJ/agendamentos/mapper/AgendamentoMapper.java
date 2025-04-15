package com.npj.ProjetoNPJ.agendamentos.mapper;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.agendamentos.dto.AgendamentoDto;
import com.npj.ProjetoNPJ.agendamentos.entity.Agendamento;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class AgendamentoMapper {


    public static AgendamentoDto toDto(Agendamento agendamento) {

        return new ModelMapper().map(agendamento, AgendamentoDto.class);
    }

    public static Agendamento toEntity(AgendamentoDto dto) {

        return new ModelMapper().map(dto, Agendamento.class);
    }

    public static List<AgendamentoDto> toListDto(List<Agendamento> agendamentos) {

        return agendamentos.stream().map(agendamento -> toDto(agendamento)).collect(Collectors.toList());
    }
}
