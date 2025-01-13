package com.npj.ProjetoNPJ.triagem.mapper;

import com.npj.ProjetoNPJ.triagem.dto.CadastroDto;
import com.npj.ProjetoNPJ.triagem.entitie.Cadastro;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class CadastroMapper {

    public static Cadastro toEntitie(CadastroDto dto) {
        return new ModelMapper().map(dto, Cadastro.class);
    }

    public static CadastroDto toDto(Cadastro cadastro) {
        return new ModelMapper().map(cadastro, CadastroDto.class);
    }

    public static List<CadastroDto> toListDto(List<Cadastro> list) {
        return list.stream().map(cadastro -> toDto(cadastro)).collect(Collectors.toList());
    }
}
