package com.npj.ProjetoNPJ.agenda.repository;

import com.npj.ProjetoNPJ.agenda.entity.Agendamento;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgendaRepository extends MongoRepository<Agendamento, String> {

    @Query("{ 'cpf': ?0 }")
    Optional<Agendamento> findByCpf(String cpf);
}
