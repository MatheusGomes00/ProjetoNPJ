package com.npj.ProjetoNPJ.advogados.controller;


import com.npj.ProjetoNPJ.advogados.dtos.dtoAdvogado;
import com.npj.ProjetoNPJ.advogados.service.AdvogadoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/adv")
public class AdvogadoController {

    @Autowired
    private AdvogadoService service;

    @PostMapping(value = "/ins")
    public ResponseEntity<dtoAdvogado> criarAdvogado(@RequestBody @Valid dtoAdvogado advogadod){
        service.insert(advogadod);

        return ResponseEntity.ok().body(advogadod);
    }

    @PutMapping(value = "/upd/{id}")
    public ResponseEntity<Void> atualizar(@RequestBody dtoAdvogado dto, @PathVariable String id){
        service.update(dto, id);

        return ResponseEntity.noContent().build();
    }
    @PutMapping(value = "/del/{id}")
    public ResponseEntity<Void> excluir( dtoAdvogado dto, @PathVariable String id){
        service.delete(dto, id);

        return ResponseEntity.ok().build();
    }
    @GetMapping
    public ResponseEntity<List<dtoAdvogado>> buscarTodos(){
        List<dtoAdvogado> cadastros = service.findAll();
        return ResponseEntity.ok(cadastros);
    }

    @GetMapping(value = "/buscanome/{nome}")
    public ResponseEntity<List<dtoAdvogado>> buscarPorNome(@PathVariable String nome){
        List<dtoAdvogado> cadastros = service.findByNome(nome);
        return ResponseEntity.ok(cadastros);
    }

    @GetMapping(value = "/buscacpf")
    public ResponseEntity<List<dtoAdvogado>> buscarPorCpf(@RequestBody Map<String, String> request){

        String cpf = request.get("cpf");
        List<dtoAdvogado> advogados = service.findByCpf(cpf);
        return ResponseEntity.ok(advogados);

    }

}




