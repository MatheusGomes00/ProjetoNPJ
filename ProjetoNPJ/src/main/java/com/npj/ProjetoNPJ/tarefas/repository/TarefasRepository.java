package com.npj.ProjetoNPJ.tarefas.repository;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface TarefasRepository extends MongoRepository<Tarefas, String> {

    @Query("{'responsaveis.id': ?0 }")
    List<Tarefas> findByAdvogado(String advogadoId);


    @Query("{ 'nomeTarefa': { $regex: ?0, $options: 'i' } }")
    List<Tarefas> findByNome(String nome);



    @Query("{'responsaveis.id': ?0 }")
    Page<Tarefas> findAllPageable(String id, Pageable pageable);

    @Query("{ 'prazoLimite': { $gte: ?0, $lte: ?1 } }")
    List<Tarefas> findByPrazoLimiteBetween(LocalDate start, LocalDate end);


}
