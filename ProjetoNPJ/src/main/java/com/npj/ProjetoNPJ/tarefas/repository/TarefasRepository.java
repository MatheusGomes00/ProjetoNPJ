package com.npj.ProjetoNPJ.tarefas.repository;

import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TarefasRepository extends MongoRepository<Tarefas, String> {
}
