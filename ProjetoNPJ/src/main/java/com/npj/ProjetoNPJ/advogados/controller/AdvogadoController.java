package com.npj.ProjetoNPJ.advogados.controller;


import com.npj.ProjetoNPJ.advogados.dtos.DtoAdvogado;
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
    public ResponseEntity<DtoAdvogado> criarAdvogado(@RequestBody @Valid DtoAdvogado advogadod){
        service.insert(advogadod);

        return ResponseEntity.ok().body(advogadod);
    }

    @PutMapping(value = "/upd/{id}")
    public ResponseEntity<Void> atualizar(@Valid @RequestBody DtoAdvogado dto, @PathVariable String id){
        service.update(dto, id);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping(value = "/del/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id){
        service.delete(id);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<DtoAdvogado>> buscarTodos(){
        List<DtoAdvogado> cadastros = service.findAll();
        return ResponseEntity.ok(cadastros);
    }

    @GetMapping(value = "/buscanome/{nome}")
    public ResponseEntity<List<DtoAdvogado>> buscarPorNome(@PathVariable String nome){
        List<DtoAdvogado> cadastros = service.findByNome(nome);
        return ResponseEntity.ok(cadastros);
    }

    @PostMapping(value = "/buscacpf")
    public ResponseEntity<DtoAdvogado> buscarPorCpf(@RequestBody Map<String, String> request){

        String cpf = request.get("cpf");
        DtoAdvogado advogado = service.findByCpf(cpf);
        return ResponseEntity.ok(advogado);

    }

}




