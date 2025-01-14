package com.npj.ProjetoNPJ.triagem.controller;


import com.npj.ProjetoNPJ.triagem.dto.CadastroDto;
import com.npj.ProjetoNPJ.triagem.entitie.Cadastro;
import com.npj.ProjetoNPJ.triagem.mapper.CadastroMapper;
import com.npj.ProjetoNPJ.triagem.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/cad")
public class ClienteController {

    @Autowired
    private ClienteService service;

    @PostMapping(value = "/ins")
    public ResponseEntity<CadastroDto> insert(@RequestBody CadastroDto objDto) {
        CadastroDto novoObj = service.insert(objDto);
        return ResponseEntity.ok().body(novoObj);
    }

    @PutMapping(value =  "/upd/{id}")
    public ResponseEntity<Void> update(@RequestBody CadastroDto dto, @PathVariable String id) {
        service.update(dto, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/nome/{nome}")
    public ResponseEntity<List<CadastroDto>> getByName(@PathVariable String nome) {
        List<CadastroDto> cadastros = service.findByNome(nome);
        return ResponseEntity.ok().body(cadastros);
    }

    @PostMapping(value = "/cpf")
    public ResponseEntity<List<CadastroDto>> getByCpf(@RequestBody Map<String, String> request) {
        String cpf = request.get("cpf");
        List<CadastroDto> cadastros = service.findByCpf(cpf);
        return ResponseEntity.ok().body(cadastros);
    }

    @GetMapping
    public ResponseEntity<List<CadastroDto>> getAll() {
        List<CadastroDto> cadastros = service.findAll();
        return ResponseEntity.ok().body(cadastros);
    }

    @PostMapping(value = "/del/{id}")
    public ResponseEntity<Void> toggleStatus(@PathVariable String id) {
        service.changeStatus(id);
        return ResponseEntity.noContent().build();
    }


}
