package com.npj.ProjetoNPJ.agendamentos.mapper;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.agenda.dto.ResponsavelDto;
import com.npj.ProjetoNPJ.agendamentos.dto.AgendamentoDto;
import com.npj.ProjetoNPJ.agendamentos.entity.Agendamento;
import com.npj.ProjetoNPJ.utils.ConversorDataHora;
import org.modelmapper.ModelMapper;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class AgendamentoMapper {


    public static Agendamento toEntity(AgendamentoDto dto) {
        Agendamento agendamento = new Agendamento();
        agendamento.setId(dto.getId());
        agendamento.setNome(dto.getNome());
        agendamento.setCpf(dto.getCpf());
        agendamento.setStart(ConversorDataHora.convertInstant(dto.getStart()));
        agendamento.setEnd(ConversorDataHora.convertInstant(dto.getEnd()));
        agendamento.setCasoTipo(dto.getCasoTipo());
        agendamento.setResponsaveis(dto.getResponsaveis());
        return agendamento;

        // return new ModelMapper().map(dto, Agendamento.class);
    }

    public static AgendamentoDto toDto(Agendamento agendamento) {
        AgendamentoDto dto = new AgendamentoDto();
        dto.setId(agendamento.getId());
        dto.setNome(agendamento.getNome());
        dto.setCpf(agendamento.getCpf());
        dto.setStart(ConversorDataHora.convertLocalDate(agendamento.getStart()));
        dto.setEnd(ConversorDataHora.convertLocalDate(agendamento.getEnd()));
        dto.setCasoTipo(agendamento.getCasoTipo());
        dto.setResponsaveis(agendamento.getResponsaveis());
        return dto;
        // return new ModelMapper().map(agendamento, AgendamentoDto.class);
    }

    public static List<AgendamentoDto> toListDto(List<Agendamento> agendamentos) {

        return agendamentos.stream().map(agendamento -> toDto(agendamento)).collect(Collectors.toList());
    }
}
