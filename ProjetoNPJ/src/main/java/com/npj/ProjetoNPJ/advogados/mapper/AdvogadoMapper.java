package com.npj.ProjetoNPJ.advogados.mapper;

import com.npj.ProjetoNPJ.advogados.dtos.DtoAdvogado;
import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class AdvogadoMapper {

    public static Advogado toEntitie(DtoAdvogado dto){

        return new ModelMapper().map(dto, Advogado.class);

    }

    public static DtoAdvogado toDto(Advogado advogado){
        return new ModelMapper().map(advogado, DtoAdvogado.class);
    }

    public static List<DtoAdvogado> toListDto(List<Advogado> list){
        return list.stream().map(AdvogadoMapper::toDto).collect(Collectors.toList());
    }
}
