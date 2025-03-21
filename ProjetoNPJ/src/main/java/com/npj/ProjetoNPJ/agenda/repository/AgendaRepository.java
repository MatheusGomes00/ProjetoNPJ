package com.npj.ProjetoNPJ.agenda.repository;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.agenda.entity.Agendamento;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgendaRepository extends MongoRepository<Agendamento, String> {

    @Query("{ 'nome': { $regex: ?0, $options: 'i' } }")
    List<Agendamento> findByNome(String nome);

    @Query("{ 'cpf': { $regex: ?0 } }")
    List<Agendamento> findByCpf(String cpf);
}
