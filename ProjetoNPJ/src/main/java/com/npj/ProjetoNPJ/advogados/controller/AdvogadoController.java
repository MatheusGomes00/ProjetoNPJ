package com.npj.ProjetoNPJ.advogados.controller;


import com.npj.ProjetoNPJ.advogados.dtos.dtoAdvogado;

import com.npj.ProjetoNPJ.advogados.entity.advogado;
import com.npj.ProjetoNPJ.advogados.service.AdvogadoService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping(value = "/upd/{id}")
    public ResponseEntity<Void> update(@RequestBody dtoAdvogado dto, @PathVariable String id){
        service.update(dto, id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/del/{id}")
    public ResponseEntity<Void> excluir( dtoAdvogado dto, @PathVariable String id){
        service.delete(dto, id);

        return ResponseEntity.ok().build();
    }



}




