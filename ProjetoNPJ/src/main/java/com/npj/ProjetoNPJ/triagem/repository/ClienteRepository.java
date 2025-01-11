package com.npj.ProjetoNPJ.triagem.repository;

import com.npj.ProjetoNPJ.triagem.entitie.Cadastro;
import com.npj.ProjetoNPJ.triagem.entitie.Cliente;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends MongoRepository<Cadastro, String> {

    @Query("{ $or: [ { 'cliente.nome': ?0 }, " +
            "{ 'representante.nome': ?0 }, " +
            "{ 'parteContraria.nome': ?0 } ] }")
    Optional<List<Cadastro>> findByNome(String nome);

    @Query("{ $or: [ { 'cliente.cpf': ?0 }, " +
            "{ 'representante.cpf': ?0 }, " +
            "{ 'parteContraria.cpf': ?0 } ] }")
    Optional<List<Cadastro>> findByCpf(String cpf);


}
