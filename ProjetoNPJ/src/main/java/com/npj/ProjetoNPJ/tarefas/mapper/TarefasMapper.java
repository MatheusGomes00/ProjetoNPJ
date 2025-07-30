package com.npj.ProjetoNPJ.tarefas.mapper;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import com.npj.ProjetoNPJ.utils.ConversorDataHora;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public class TarefasMapper {

    public static Tarefas toEntity(DtoTarefas dtoTarefas, List<Advogado> advogados) {
        Tarefas tarefas = new Tarefas();
        tarefas.setId(dtoTarefas.getId());
        tarefas.setNomeTarefa(dtoTarefas.getNomeTarefa());
        tarefas.setDescricao(dtoTarefas.getDescricao());
        tarefas.setStatus(dtoTarefas.isStatus());
        tarefas.setPrioridade(dtoTarefas.getPrioridade());
        tarefas.setPrazoLimite(ConversorDataHora.convertInstant(dtoTarefas.getPrazoLimite()));
        tarefas.setDataCriacao(ConversorDataHora.convertInstant(dtoTarefas.getDataCriacao()));
        tarefas.setCriador(dtoTarefas.getCriador());
        tarefas.setAdvogadoFinalizadorId(tarefas.getAdvogadoFinalizadorId());
        tarefas.setFinalizadoPor(dtoTarefas.getFinalizadoPor());
        // Agora lidamos com uma lista de advogados (responsáveis)
        List<Advogado> responsaveis = advogados.stream()
                .filter(advogado -> dtoTarefas.getResponsaveisId().contains(advogado.getId()))
                .collect(Collectors.toList());
        tarefas.setResponsaveis(responsaveis);
        tarefas.setReativadoPor(dtoTarefas.getReativadaPor());
        tarefas.setDataFinalizacao(ConversorDataHora.convertInstant(dtoTarefas.getDataFinalizacao()));
        return tarefas;
    }

    public static DtoTarefas toDto(Tarefas tarefas) {
        DtoTarefas dtoTarefas = new DtoTarefas();
        dtoTarefas.setId(tarefas.getId());
        dtoTarefas.setNomeTarefa(tarefas.getNomeTarefa());
        dtoTarefas.setDescricao(tarefas.getDescricao());
        dtoTarefas.setStatus(tarefas.isStatus());
        dtoTarefas.setPrioridade(tarefas.getPrioridade());
        dtoTarefas.setPrazoLimite(ConversorDataHora.convertLocalDate(tarefas.getPrazoLimite()));
        dtoTarefas.setDataCriacao(ConversorDataHora.convertLocalDate(tarefas.getDataCriacao()));
        dtoTarefas.setCriador(tarefas.getCriador());
        dtoTarefas.setFinalizadoPor(tarefas.getFinalizadoPor());
        dtoTarefas.setAdvogadoFinalizadorId(tarefas.getAdvogadoFinalizadorId());
        dtoTarefas.setDataFinalizacao(ConversorDataHora.convertLocalDate(tarefas.getDataFinalizacao()));

        // Métod que atualizei para atualizar os responsáveis também
        if (tarefas.getResponsaveis() != null && !tarefas.getResponsaveis().isEmpty()) {
            List<String> ids = tarefas.getResponsaveis().stream()
                    .map(Advogado::getId)
                    .collect(Collectors.toList());
            dtoTarefas.setResponsaveisId(ids);

            List<String> nomes = tarefas.getResponsaveis().stream()
                    .map(Advogado::getNome)
                    .collect(Collectors.toList());
            dtoTarefas.setResponsaveisNome(nomes);
        }

        return dtoTarefas;
    }

    public static List<DtoTarefas> toListDto(List<Tarefas> list) {
        return list.stream().
                map(TarefasMapper::toDto)
                .collect(Collectors.toList());
    }
}
