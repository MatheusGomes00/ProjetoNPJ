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

    @GetMapping("/{tarefaId}/responsavel")
    public ResponseEntity<String> getNomeAdvogadoPorTarefa(@PathVariable String tarefaId) {
        String nomeAdvogado = service.getNomeAdvogadoPorTarefa(tarefaId);
        return ResponseEntity.ok(nomeAdvogado);
    }

    @PutMapping(value = "/upd/{id}")
    public ResponseEntity<Void> update(@PathVariable String id, @RequestBody DtoTarefas dto) {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("O ID da tarefa não pode ser nulo ou vazio.");
        }
        service.update(dto, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/end/{id}")
    public ResponseEntity<String> finalizarTarefa(@PathVariable String id){
        service.finalizar(id);
        return ResponseEntity.ok().body("Tarefa FInalizada com sucesso");
    }

    @GetMapping("/get")
    public ResponseEntity<List<DtoTarefas>> listarTarefas() {

        List<DtoTarefas> dto = service.getTarefasAutenticado();

        //List<Tarefas> tarefas = repository.findAll();
        if (dto.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(dto);
    }


}
