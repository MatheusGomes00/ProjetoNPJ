package com.npj.ProjetoNPJ.advogados.controller;


import com.npj.ProjetoNPJ.advogados.dtos.DtoAdvogado;
import com.npj.ProjetoNPJ.advogados.dtos.ResponseAdvogadoDto;
import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.mapper.AdvogadoMapper;
import com.npj.ProjetoNPJ.advogados.service.AdvogadoService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/adv")
public class AdvogadoController {

    @Autowired
    private AdvogadoService service;

    @PostMapping(value = "/ins")
    public ResponseEntity<ResponseAdvogadoDto> criarAdvogado(@RequestBody @Valid DtoAdvogado advogadoDto){

        try {
            Advogado advogado = service.insert(advogadoDto);
            ResponseAdvogadoDto dto = AdvogadoMapper.responseDto(advogado);

            URI location = URI.create("/who/" + advogado.getId());
            return ResponseEntity.created(location).body(dto);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erro ao cadastrar advogado.", e.getCause());
        }
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

    @GetMapping(value = "/who/{id}")
    public ResponseEntity<ResponseAdvogadoDto> buscarPorId(@PathVariable String id) {

        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<ResponseAdvogadoDto>> buscarTodos(){

        List<ResponseAdvogadoDto> cadastros = service.findAll();
        return ResponseEntity.ok(cadastros);
    }

    @GetMapping(value = "/buscanome/{nome}")
    public ResponseEntity<List<ResponseAdvogadoDto>> buscarPorNome(@PathVariable String nome){

        List<ResponseAdvogadoDto> cadastros = service.findByNome(nome);
        return ResponseEntity.ok(cadastros);
    }

    @PostMapping(value = "/buscacpf")
    public ResponseEntity<List<ResponseAdvogadoDto>> buscarPorCpf(@RequestBody Map<String, String> request){

        String cpf = request.get("cpf");
        return ResponseEntity.ok(service.findByCpf(cpf));
    }

}




