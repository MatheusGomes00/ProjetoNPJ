package com.npj.ProjetoNPJ.tarefas.controller;


import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import com.npj.ProjetoNPJ.tarefas.repository.TarefasRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/task")
public class TarefasController {

    @Autowired
    private TarefasRepository repository;

    @PostMapping(value = "create")
    public ResponseEntity<DtoTarefas> criarTarefa(@RequestBody @Valid DtoTarefas tarefas){


        return ResponseEntity.ok().build();
    }
}
