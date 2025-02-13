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

            // Garante que o ID seja null para forçar a criação de uma nova tarefa
            novaTarefa.setId(null);

            // Buscar o Advogado pelo ID para associá-lo à tarefa
            Advogado advogado = repositoryAdv.findById(tarefas.getResponsavelId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado"));

            novaTarefa.setResponsavel(advogado);
            System.out.println("Prazo Limite recebido: " + tarefas.getPrazoLimite());
            // Salvar a nova tarefa no banco
            Tarefas tarefaCriada = repository.save(novaTarefa);

            return ResponseEntity.ok().body(tarefaCriada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    public void update(DtoTarefas dto, String id){

        // Buscar o Advogado pelo ID
        Advogado advogado = repositoryAdv.findById(dto.getResponsavelId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado"));

        // Converter DTO para entidade Tarefa
        Tarefas tarefaNova = TarefasMapper.toEntity(dto);

        // Buscar a tarefa existente
        Tarefas tarefaAntiga = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Tarefa não encontrada"));

        // Atualizar os dados da tarefa
        tarefaNova.setId(id);
        tarefaNova.setResponsavel(advogado); // Atualizando o advogado
        service.updateData(tarefaAntiga, tarefaNova);

        // Salvar a tarefa atualizada
        repository.save(tarefaNova);
    }

    @PutMapping(value = "/end/{id}")
    public ResponseEntity<String> finalizarTarefa(@PathVariable String id){
        service.finalizar(id);
        return ResponseEntity.ok().body("Tarefa FInalizada com sucesso");
    }
    @GetMapping("/get")
    public ResponseEntity<List<Tarefas>> listarTarefas() {
        List<Tarefas> tarefas = repository.findAll(); // Retorna todas as tarefas cadastradas
        if (tarefas.isEmpty()) {
            return ResponseEntity.noContent().build(); // Retorna 204 se não houver tarefas
        }
        return ResponseEntity.ok(tarefas); // Retorna 200 com a lista de tarefas
    }
}
