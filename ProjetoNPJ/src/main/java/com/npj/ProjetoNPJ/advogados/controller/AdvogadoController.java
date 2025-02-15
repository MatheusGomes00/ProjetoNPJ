package com.npj.ProjetoNPJ.advogados.controller;


import com.npj.ProjetoNPJ.advogados.dtos.DtoAdvogado;
import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.advogados.service.AdvogadoService;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(value = "/adv")
public class AdvogadoController {

    @Autowired
    private AdvogadoService service;

    @GetMapping("/buscar/{id}")
    public ResponseEntity<DtoAdvogado> buscarAdvogadoPorId(@PathVariable String id) {
        try {

            Optional<DtoAdvogado> dtoAdvogadoOpt = service.findById(id);


            if (dtoAdvogadoOpt.isPresent()) {
                return ResponseEntity.ok(dtoAdvogadoOpt.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  //
            }
        } catch (RecursoNaoEncontradoException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

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

    @GetMapping(value= "/buscarTodos")
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
    public ResponseEntity<List<DtoAdvogado>> buscarPorCpf(@RequestBody Map<String, String> request){

        String cpf = request.get("cpf");
        List<DtoAdvogado> advogados = service.findByCpf(cpf);
        return ResponseEntity.ok(advogados);

    }

    }






