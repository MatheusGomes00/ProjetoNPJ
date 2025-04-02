package com.npj.ProjetoNPJ.processos.controller;

import com.npj.ProjetoNPJ.processos.dtos.DtoProcessos;
import com.npj.ProjetoNPJ.processos.entity.Processos;
import com.npj.ProjetoNPJ.processos.repository.ProcessosRepositorio;
import com.npj.ProjetoNPJ.processos.service.ProcessosService;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/proc")
public class ProcessosController {

    @Autowired
    private ProcessosService service;

    @Autowired
    private ProcessosRepositorio processosRepositorio;

    @PostMapping(value = "/newProc")
    public ResponseEntity<DtoProcessos> insert(@RequestBody DtoProcessos dto, @RequestHeader("Authorization") String authorizationHeader){

       DtoProcessos novoProcesso = service.insert(dto);

       return ResponseEntity.ok().body(novoProcesso);

    }
    @PutMapping(value = "/updProc/{id}")
    public ResponseEntity<Processos> atualizarProcesso(@PathVariable String id, @RequestBody DtoProcessos dto){

        Processos processo = service.update(dto, id);

        return ResponseEntity.ok().body(processo);
    }
    @GetMapping(value = "/searchProc/{numeroProcesso}")
    public ResponseEntity<List<DtoProcessos>> buscarPorNumero(@PathVariable String numeroProcesso){

        List<DtoProcessos> processos = service.findByNumeroProcesso(numeroProcesso);
        return ResponseEntity.ok(processos);
    }

    @GetMapping(value = "/findAll")
    public ResponseEntity<List<DtoProcessos>> findAll(){

        List<DtoProcessos> novoProcesso = service.findAll();

        return ResponseEntity.ok(novoProcesso);
    }

    @PutMapping(value = "/finalizar/{id}")
    public ResponseEntity<Processos> excluirProc(@PathVariable String id){

        Processos processos = service.excluir(id);
        return ResponseEntity.ok().body(processos);
    }

    @GetMapping(value = "/porId/{id}")
    public ResponseEntity<Processos> acharPorID(@PathVariable String id){

        Processos processos = service.findById(id);
        return ResponseEntity.ok().body(processos);
    }

}
