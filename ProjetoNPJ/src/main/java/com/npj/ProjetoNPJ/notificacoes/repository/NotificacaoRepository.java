package com.npj.ProjetoNPJ.notificacoes.repository;

import com.npj.ProjetoNPJ.notificacoes.entitie.Notificacao;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface NotificacaoRepository extends MongoRepository<Notificacao, String> {

    List<Notificacao> findByAdvogadoId(String advogadoId);

    @Query("{ 'advogadoId': ?0, 'lida': false }")
    List<Notificacao> findByAdvogadoAndLida(String advogadoId);


}
