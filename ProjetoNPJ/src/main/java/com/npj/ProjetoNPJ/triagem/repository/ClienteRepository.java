package com.npj.ProjetoNPJ.triagem.repository;

import com.npj.ProjetoNPJ.triagem.entitie.Cadastro;
import com.npj.ProjetoNPJ.triagem.entitie.Cliente;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends MongoRepository<Cadastro, String> {

    @Query("{ 'cliente.nome': ?0 }")
    Optional<Cliente> findByNome(String nome);

    @Query("{ 'cliente.cpf': ?0 }")
    Optional<Cliente> findByCpf(String cpf);


}
