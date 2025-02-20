package com.npj.ProjetoNPJ.tarefas.controller;


import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import com.npj.ProjetoNPJ.tarefas.mapper.TarefasMapper;
import com.npj.ProjetoNPJ.tarefas.repository.TarefasRepository;
import com.npj.ProjetoNPJ.tarefas.service.TarefefasService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.security.Provider;
import java.util.List;

@RestController
@RequestMapping(value = "/task")
public class TarefasController {

    @Autowired
    private AdvogadoRepository repositoryAdv;

    @Autowired
    private TarefefasService service;

    @Autowired
    private TarefasRepository repository;

    @PostMapping(value = "/create")
    public ResponseEntity<DtoTarefas> criarTarefa(@RequestBody @Valid DtoTarefas tarefaDto) {
        DtoTarefas tarefa = service.insert(tarefaDto);
        return ResponseEntity.ok().body(tarefa);
    }

    @PutMapping(value = "/upd")
    public ResponseEntity<Void> update(DtoTarefas dto, String id){

        service.update(dto, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/end/{id}")
    public ResponseEntity<String> finalizarTarefa(@PathVariable String id){
        service.finalizar(id);
        return ResponseEntity.ok().body("Tarefa FInalizada com sucesso");
    }

    @GetMapping("/get")
    public ResponseEntity<List<Tarefas>> listarTarefas() {
        List<Tarefas> tarefas = repository.findAll();
        if (tarefas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tarefas);
    }


}
