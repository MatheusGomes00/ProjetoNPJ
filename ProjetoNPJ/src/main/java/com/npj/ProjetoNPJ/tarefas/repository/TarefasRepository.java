package com.npj.ProjetoNPJ.tarefas.repository;

import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface TarefasRepository extends MongoRepository<Tarefas, String> {

    @Query("{'responsavel.id': ?0 }")
    List<Tarefas> findByAdvogado(String advogadoId);
}
