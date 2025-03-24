package com.npj.ProjetoNPJ.tarefas.controller;



import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.security.JwtService;
import com.npj.ProjetoNPJ.security.JwtService.*;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import com.npj.ProjetoNPJ.tarefas.service.TarefefasService;
import io.jsonwebtoken.Jwt;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/task")
public class TarefasController {

    @Autowired
    private TarefefasService service;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AdvogadoRepository advogadoRepository;

    @PostMapping(value = "/create")
    public ResponseEntity<DtoTarefas> criarTarefa(@RequestBody  DtoTarefas tarefaDto, @RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");

        String advogadoId = jwtService.extractId(token);

        Advogado advogado = advogadoRepository.findById(advogadoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado: " + advogadoId));

        tarefaDto.setCriador(advogado.getNome());

        DtoTarefas tarefa = service.insert(tarefaDto);
        return ResponseEntity.ok().body(tarefa);
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
    public ResponseEntity<Tarefas> finalizarTarefa(@PathVariable String id, @RequestHeader("Authorization") String authorizationHeader){

        try {
            String token = authorizationHeader.replace("Bearer ", "");

            String advogadoId = jwtService.extractId(token);

            Tarefas tarefaAtualizada = service.finalizar(id, advogadoId);

            return ResponseEntity.ok(tarefaAtualizada);
        } catch (Exception e) {
            System.err.println("Erro ao finalizar tarefa: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }

    }

    @GetMapping("/get")
    public ResponseEntity<List<DtoTarefas>> listarTarefas() {

        List<DtoTarefas> dto = service.getTarefasAutenticado();
        return ResponseEntity.ok(dto);
    }

    @GetMapping(value = "/search/{nome}")
    public ResponseEntity<List<DtoTarefas>> buscarPorNome(@PathVariable String nome){

        List<DtoTarefas> tarefas = service.findByNome(nome);
        return ResponseEntity.ok(tarefas);
    }
}
