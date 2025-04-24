package com.npj.ProjetoNPJ.notificacoes.service;

import com.npj.ProjetoNPJ.notificacoes.NotificacoesMain;
import com.npj.ProjetoNPJ.notificacoes.repository.NotificacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository repository;


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

}

