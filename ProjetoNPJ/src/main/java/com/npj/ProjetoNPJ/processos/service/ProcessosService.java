package com.npj.ProjetoNPJ.processos.service;


import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.processos.dtos.DtoProcessos;
import com.npj.ProjetoNPJ.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProcessosService {

    @Autowired
    private AdvogadoRepository repository;

    @Autowired
    private JwtService jwtService;

    public DtoProcessos insert(DtoProcessos dto){

        dto.setSituação();
    }
}
