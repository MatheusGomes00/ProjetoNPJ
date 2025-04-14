package com.npj.ProjetoNPJ.notificacoes.service;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.notificacoes.NotificacoesMain;
import com.npj.ProjetoNPJ.notificacoes.dtos.NotificacoesDto;
import com.npj.ProjetoNPJ.notificacoes.mapperNotificacoes.NotificacoesMapper;
import com.npj.ProjetoNPJ.notificacoes.repository.NotificacaoRepository;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import com.npj.ProjetoNPJ.tarefas.mapper.TarefasMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository repository;

    @Autowired
    private AdvogadoRepository advogadoRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void criarNotificacao(String advogadoId, String mensagem, String tarefaId){

        NotificacoesMain notificacoesMain = new NotificacoesMain();
        notificacoesMain.setAdvogadoId(advogadoId);
        notificacoesMain.setMensagem(mensagem);
        notificacoesMain.setTarefaId(tarefaId);
        notificacoesMain.setLida(false);
        notificacoesMain.setDataCriacao(LocalDate.now());

        repository.save(notificacoesMain);

        messagingTemplate.convertAndSend("/topic/notificacoes/" + advogadoId, notificacoesMain );

    }

    public String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    public List<NotificacoesDto> getTarefasAutenticado() {

        Advogado advogado = advogadoRepository.findByCpf(getAuthenticatedUsername())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrada"));
        List<NotificacoesMain> notificacao = repository.findByAdvogadoIdAndLidaFalse(advogado.getId());

        return NotificacoesMapper.toListDto(notificacao);
    }


}

