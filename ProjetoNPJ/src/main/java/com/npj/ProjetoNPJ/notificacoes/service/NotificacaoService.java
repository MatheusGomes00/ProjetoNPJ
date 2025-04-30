package com.npj.ProjetoNPJ.notificacoes.service;


import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.notificacoes.entitie.Notificacao;
import com.npj.ProjetoNPJ.notificacoes.repository.NotificacaoRepository;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacaoService{

    @Autowired
    private NotificacaoRepository repository;


    public Notificacao criarNotificacao(String mensagem, String advogadoId){
        Notificacao notificacao = new Notificacao();
        notificacao.setAdvogadoId(advogadoId);
        notificacao.setMensagem(mensagem);
        notificacao.setDataCriacao(LocalDateTime.now());

        return repository.save(notificacao);
    }

    public List<Notificacao> buscarNotificacoesPorAdvogado(String advogadoId){
        return repository.findByAdvogadoId(advogadoId);
    }

    public List<Notificacao> buscarNotificacoesNaoLidas(String advogadoId){

        return repository.findByAdvogadoAndLida(advogadoId);
    }

    public Notificacao finalizar(String id){
         Notificacao notificacao = repository.findById(id).orElseThrow(()-> new RecursoNaoEncontradoException("Notificacao não encontrada"));


        notificacao.setLida(true);

        repository.save(notificacao);
        return notificacao;
    }


}