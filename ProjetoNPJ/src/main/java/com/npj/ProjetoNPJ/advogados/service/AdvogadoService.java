package com.npj.ProjetoNPJ.advogados.service;

import com.npj.ProjetoNPJ.advogados.dtos.dtoAdvogado;
import com.npj.ProjetoNPJ.advogados.entity.advogado;
import com.npj.ProjetoNPJ.advogados.mapper.AdvogadoMapper;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdvogadoService {

    @Autowired
    private AdvogadoRepository repository;

    public void insert(dtoAdvogado dto){
        dto.setStatus(true);
        advogado newAdvogado = AdvogadoMapper.toEntitie(dto);
        repository.insert(newAdvogado);

    }
}
