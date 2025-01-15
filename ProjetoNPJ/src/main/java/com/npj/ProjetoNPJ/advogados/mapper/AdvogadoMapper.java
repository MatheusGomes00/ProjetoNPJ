package com.npj.ProjetoNPJ.advogados.mapper;

import com.npj.ProjetoNPJ.advogados.dtos.dtoAdvogado;
import com.npj.ProjetoNPJ.advogados.entity.advogado;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class AdvogadoMapper {

    public static advogado toEntitie(dtoAdvogado dto){

        return new ModelMapper().map(dto, advogado.class);

    }

    public static dtoAdvogado toDto(advogado advogado){
        return new ModelMapper().map(advogado, dtoAdvogado.class);
    }

    public static List<dtoAdvogado> toListDto(List<advogado> list){
        return list.stream().map(AdvogadoMapper::toDto).collect(Collectors.toList());
    }
}
