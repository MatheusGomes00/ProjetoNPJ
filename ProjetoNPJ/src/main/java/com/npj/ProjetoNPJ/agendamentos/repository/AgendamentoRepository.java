package com.npj.ProjetoNPJ.agendamentos.repository;

import com.npj.ProjetoNPJ.agendamentos.entity.Agendamento;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgendaRepository extends MongoRepository<Agendamento, String> {

    @Query("{ 'nome': { $regex: ?0, $options: 'i' } }")
    List<Agendamento> findByNome(String nome);

    @Query("{ 'cpf': { $regex: ?0 } }")
    List<Agendamento> findByCpf(String cpf);
}
