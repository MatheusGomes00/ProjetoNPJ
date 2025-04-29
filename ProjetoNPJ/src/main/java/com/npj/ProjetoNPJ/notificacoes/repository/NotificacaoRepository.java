package com.npj.ProjetoNPJ.notificacoes.repository;

import com.npj.ProjetoNPJ.notificacoes.entitie.Notificacao;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificacaoRepository extends MongoRepository<Notificacao, String> {

    List<Notificacao> findByAdvogadoId(String advogaoId);
}
