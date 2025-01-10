package com.npj.ProjetoNPJ.triagem.service;

import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdvogadoService {

    @Autowired
    private AdvogadoRepository repository;
}
