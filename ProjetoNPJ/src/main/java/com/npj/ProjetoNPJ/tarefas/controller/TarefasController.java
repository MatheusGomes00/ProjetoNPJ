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
    public ResponseEntity<Object> criarTarefa(@RequestBody @Valid DtoTarefas tarefas) {
        try {
            Tarefas novaTarefa = TarefasMapper.toEntity(tarefas);


            novaTarefa.setId(null);

            Advogado advogado = repositoryAdv.findById(tarefas.getResponsavelId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado"));

            novaTarefa.setResponsavel(advogado);
            System.out.println("Prazo Limite recebido: " + tarefas.getPrazoLimite());
            Tarefas tarefaCriada = repository.save(novaTarefa);

            return ResponseEntity.ok().body(tarefaCriada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    public void update(DtoTarefas dto, String id){


        Advogado advogado = repositoryAdv.findById(dto.getResponsavelId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado"));


        Tarefas tarefaNova = TarefasMapper.toEntity(dto);


        Tarefas tarefaAntiga = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Tarefa não encontrada"));


        tarefaNova.setId(id);
        tarefaNova.setResponsavel(advogado);
        service.updateData(tarefaAntiga, tarefaNova);


        repository.save(tarefaNova);
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
