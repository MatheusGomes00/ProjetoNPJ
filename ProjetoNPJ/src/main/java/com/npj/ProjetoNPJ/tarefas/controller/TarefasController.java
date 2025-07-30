package com.npj.ProjetoNPJ.tarefas.controller;



import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.notificacoes.service.NotificacaoService;
import com.npj.ProjetoNPJ.security.JwtService;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import com.npj.ProjetoNPJ.tarefas.service.TarefefasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping(value = "/task")
public class TarefasController {


    @Autowired
    private TarefefasService service;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AdvogadoRepository advogadoRepository;

    @Autowired
    private TarefefasService services;

    @PostMapping(value = "/create")
    public ResponseEntity<DtoTarefas> criarTarefa(@RequestBody  DtoTarefas tarefaDto) {
        DtoTarefas tarefa = service.insert(tarefaDto);
        return ResponseEntity.ok().body(tarefa);
    }

    @PutMapping(value = "/upd/{id}")
    public ResponseEntity<DtoTarefas> update(@PathVariable String id, @RequestBody DtoTarefas dto) {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("O ID da tarefa não pode ser nulo ou vazio.");
        }
        DtoTarefas task = service.update(dto, id);
        return ResponseEntity.ok(task);
    }

    @PutMapping(value = "/end/{tarefaId}")
    public ResponseEntity<DtoTarefas> finalizarTarefa(@PathVariable String tarefaId){
        try {
            DtoTarefas tarefaAtualizada = service.finalizar(tarefaId);

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

    @GetMapping(value = "/{id}")
    public ResponseEntity <DtoTarefas> listarTarefaNotifi(@PathVariable String id){
        DtoTarefas dto = services.findById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping(value = "/search/{nome}")
    public ResponseEntity<List<DtoTarefas>> buscarPorNome(@PathVariable String nome){

        List<DtoTarefas> tarefas = service.findByNome(nome);
        return ResponseEntity.ok(tarefas);
    }

    @PutMapping(value = "/reopen/{id}")
    public ResponseEntity <DtoTarefas> reabrirTarefas(@PathVariable String id){

        DtoTarefas tarefaAtualiza = service.reativarTarefa(id);

        return ResponseEntity.ok(tarefaAtualiza);
    }
}
