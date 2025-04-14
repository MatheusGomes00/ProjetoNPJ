package com.npj.ProjetoNPJ.notificacoes.repository;

import com.npj.ProjetoNPJ.notificacoes.NotificacoesMain;
import com.npj.ProjetoNPJ.notificacoes.dtos.NotificacoesDto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoRepository extends MongoRepository<NotificacoesMain, String> {


    List<NotificacoesMain> findByAdvogadoIdAndLidaFalse(String advogadoId);


}
