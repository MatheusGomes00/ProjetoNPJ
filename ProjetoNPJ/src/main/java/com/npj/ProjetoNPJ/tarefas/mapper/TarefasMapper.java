package com.npj.ProjetoNPJ.tarefas.mapper;

import com.npj.ProjetoNPJ.advogados.dtos.DtoAdvogado;
import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.mapper.AdvogadoMapper;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class TarefasMapper {

    public static Tarefas toEntity(DtoTarefas dtoTarefas){
        return new ModelMapper().map(dtoTarefas, Tarefas.class);
    }
    public static DtoTarefas toDto(Tarefas tarefas){
        return new ModelMapper().map(tarefas, DtoTarefas.class);
    }

    public static List<DtoTarefas> toListDto(List<Tarefas> list){
        return list.stream().map(TarefasMapper::toDto).collect(Collectors.toList());
    }
}
