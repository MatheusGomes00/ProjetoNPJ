package com.npj.ProjetoNPJ.advogados.controller;


import com.npj.ProjetoNPJ.advogados.dtos.dtoAdvogado;

import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.advogados.service.AdvogadoService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/adv")
public class AdvogadoController {


    @Autowired
    private AdvogadoService service;

    @PostMapping(value = "/ins")
    public ResponseEntity<dtoAdvogado> criarAdvogado(@RequestBody dtoAdvogado advogadod){
        service.insert(advogadod);

        return ResponseEntity.ok().body(advogadod);
    }

}
