package com.npj.ProjetoNPJ.tarefas.controller;



import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.notificacoes.service.NotificacaoService;
import com.npj.ProjetoNPJ.security.JwtService;
import com.npj.ProjetoNPJ.security.JwtService.*;
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

    private static final Logger LOGGER = Logger.getLogger(TarefasController.class.getName());
    @Autowired
    private TarefefasService service;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AdvogadoRepository advogadoRepository;

    @Autowired
    private NotificacaoService notificacaoService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private TarefefasService services;

    @PostMapping(value = "/create")
    public ResponseEntity<DtoTarefas> criarTarefa(@RequestBody  DtoTarefas tarefaDto, @RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");

        String advogadoId = jwtService.extractUsername(token);

        Advogado advogado = advogadoRepository.findById(advogadoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado: " + advogadoId));

        tarefaDto.setCriador(advogado.getNome());

        DtoTarefas tarefa = service.insert(tarefaDto);

        String mensagem = "Uma nova tarefa foi atribuída a você: " + tarefa.getNomeTarefa();
        List<String> responsaveisId = tarefa.getResponsaveisId();
        if (responsaveisId != null && !responsaveisId.isEmpty()) {
            try {
                notificacaoService.criarNotificacoesParaResponsaveis(mensagem, responsaveisId, tarefa.getId())
                        .forEach(notificacao -> {
                            messagingTemplate.convertAndSend(
                                    "/topic/notificacoes/" + notificacao.getAdvogadoId(),
                                    notificacao
                            );
                        });
            } catch (Exception e) {
                LOGGER.severe("Erro ao criar notificações: " + e.getMessage());
                // Continue to return the task, as notification failure shouldn’t block creation
            }

        }
        return ResponseEntity.ok().body(tarefa);
    }
    @PutMapping(value = "/upd/{id}")
    public ResponseEntity<Tarefas> update(@PathVariable String id, @RequestBody DtoTarefas dto) {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("O ID da tarefa não pode ser nulo ou vazio.");
        }
        Tarefas task = service.update(dto, id);
        return ResponseEntity.ok(task);
    }

    @PutMapping(value = "/end/{id}")
    public ResponseEntity<Tarefas> finalizarTarefa(@PathVariable String id, @RequestHeader("Authorization") String authorizationHeader){

        try {
            String token = authorizationHeader.replace("Bearer ", "");

            String advogadoId = jwtService.extractUsername(token);

            Tarefas tarefaAtualizada = service.finalizar(id, advogadoId);

            return ResponseEntity.ok(tarefaAtualizada);
        } catch (Exception e) {
            System.err.println("Erro ao finalizar tarefa: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }

    }
    @GetMapping("/page")
    public ResponseEntity<Page<DtoTarefas>> listarTarefasPage(Pageable page){
        Page<DtoTarefas> dto = service.getTarefasAutenticadoPage(page);
        return ResponseEntity.ok(dto);
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
    public ResponseEntity <Tarefas> reabrirTarefas(@PathVariable String id){

        Tarefas tarefaAtualiza = service.reativarTarefa(id);

        return ResponseEntity.ok(tarefaAtualiza);
    }

    @GetMapping(value = "/search/{prioridade}")
    public ResponseEntity<List<DtoTarefas>> buscaPorPrioridade(@PathVariable String prioridade){

        List<DtoTarefas> tarefas = service.findByPrioridade(prioridade);
        return ResponseEntity.ok(tarefas);
    }




}
