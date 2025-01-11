package com.npj.ProjetoNPJ.triagem.controller;


import com.npj.ProjetoNPJ.triagem.entitie.Cadastro;
import com.npj.ProjetoNPJ.triagem.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/cad")
public class ClienteController {

    @Autowired
    private ClienteService service;

//    @PostMapping
//    public ResponseEntity<Void> insert(@RequestBody CadastroDto objDto){
//        Cadastro obj = service.fromDTO(objDto);
//        obj = service.insert(obj);
//        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
//        return ResponseEntity.created(uri).build();
//    }
}
