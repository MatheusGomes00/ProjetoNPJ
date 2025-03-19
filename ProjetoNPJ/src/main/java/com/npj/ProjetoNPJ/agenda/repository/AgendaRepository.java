package com.npj.ProjetoNPJ.agenda.repository;

import com.npj.ProjetoNPJ.agenda.entity.Agendamento;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgendaRepository extends MongoRepository<Agendamento, String> {
}
