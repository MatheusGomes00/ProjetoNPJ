package com.npj.ProjetoNPJ.advogados.mapper;

import com.npj.ProjetoNPJ.advogados.dtos.dtoAdvogado;
import com.npj.ProjetoNPJ.advogados.entity.advogado;
import org.modelmapper.ModelMapper;

public class AdvogadoMapper {

    public static advogado toEntitie(dtoAdvogado dto){

        return new ModelMapper().map(dto, advogado.class);

    }
}
