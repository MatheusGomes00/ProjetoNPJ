package com.npj.ProjetoNPJ.advogados.controller;


import com.npj.ProjetoNPJ.advogados.dtos.DtoAdvogado;
import com.npj.ProjetoNPJ.advogados.dtos.ResponseAdvogadoDto;
import com.npj.ProjetoNPJ.advogados.dtos.UpdateRequestDto;
import com.npj.ProjetoNPJ.advogados.dtos.UpdateSenhaDto;
import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.mapper.AdvogadoMapper;
import com.npj.ProjetoNPJ.advogados.service.AdvogadoService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/adv")
public class AdvogadoController {

    @Autowired
    private AdvogadoService service;

    @GetMapping("/buscar/{id}")
    public ResponseEntity<ResponseAdvogadoDto> buscarAdvogadoPorId(@PathVariable String id) {
        ResponseAdvogadoDto advogadoDto = service.findById(id);
        return ResponseEntity.ok(advogadoDto);
    }

    @PostMapping(value = "/ins")
    public ResponseEntity<ResponseAdvogadoDto> criarAdvogado(@RequestBody @Valid DtoAdvogado advogadoDto){
        ResponseAdvogadoDto advogado = service.insert(advogadoDto);
        return ResponseEntity.ok(advogado);
    }

    @PutMapping(value = "/upd/{id}")
    public ResponseEntity<Void> atualizar(@Valid @RequestBody UpdateRequestDto dto, @PathVariable String id){

        service.update(dto, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/upd")
    public ResponseEntity<Void> alterarSenha(@Valid @RequestBody UpdateSenhaDto dto) {

        service.updateSenha(dto);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(value = "/del/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id){

        service.alterarStatus(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/buscarTodos")
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




