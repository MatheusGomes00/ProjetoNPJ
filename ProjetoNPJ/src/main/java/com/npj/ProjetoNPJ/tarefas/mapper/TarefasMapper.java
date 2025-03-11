package com.npj.ProjetoNPJ.tarefas.mapper;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;

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
        tarefas.setPrazoLimite(dtoTarefas.getPrazoLimite());
        tarefas.setDataCriacao(dtoTarefas.getDataCriacao());
        tarefas.setCriador(dtoTarefas.getCriador());
        tarefas.setResponsaveis(advogados); // Lista de Advogados já resolvida
        return tarefas;
    }

    public static DtoTarefas toDto(Tarefas tarefas) {
        DtoTarefas dtoTarefas = new DtoTarefas();
        dtoTarefas.setId(tarefas.getId());
        dtoTarefas.setNomeTarefa(tarefas.getNomeTarefa());
        dtoTarefas.setDescricao(tarefas.getDescricao());
        dtoTarefas.setStatus(tarefas.isStatus());
        dtoTarefas.setPrioridade(tarefas.getPrioridade());
        dtoTarefas.setPrazoLimite(tarefas.getPrazoLimite());
        dtoTarefas.setDataCriacao(tarefas.getDataCriacao());
        dtoTarefas.setCriador(tarefas.getCriador());

        // Obs para verificações futuras: Converte lista de Advogados para lista de IDs e Nomes
        if (tarefas.getResponsaveis() != null) {
            List<String> ids = tarefas.getResponsaveis().stream()
                    .map(Advogado::getId)
                    .collect(Collectors.toList());
            dtoTarefas.setResponsaveisId(ids);

            // Obs para verificações futuras: Adicionando os nomes dos advogados ao DTO
            List<String> nomes = tarefas.getResponsaveis().stream()
                    .map(Advogado::getNome)
                    .collect(Collectors.toList());
            dtoTarefas.setResponsaveisNome(nomes);
        }

        return dtoTarefas;
    }

    public static List<DtoTarefas> toListDto(List<Tarefas> list) {
        return list.stream().map(TarefasMapper::toDto).collect(Collectors.toList());
    }
}
