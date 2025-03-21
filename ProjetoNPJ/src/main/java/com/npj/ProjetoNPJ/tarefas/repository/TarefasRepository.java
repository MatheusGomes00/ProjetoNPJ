package com.npj.ProjetoNPJ.tarefas.repository;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface TarefasRepository extends MongoRepository<Tarefas, String> {

    @Query("{'responsaveis.id': ?0 }")
    List<Tarefas> findByAdvogado(String advogadoId);


    @Query("{ 'nomeTarefa': { $regex: ?0, $options: 'i' } }")
    List<Tarefas> findByNome(String nome);





}
