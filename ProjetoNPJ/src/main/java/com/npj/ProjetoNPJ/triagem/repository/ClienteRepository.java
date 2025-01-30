package com.npj.ProjetoNPJ.triagem.repository;

import com.npj.ProjetoNPJ.triagem.entitie.Cadastro;
import com.npj.ProjetoNPJ.triagem.entitie.Cliente;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends MongoRepository<Cliente, String> {

    @Query("{ 'nome': { $regex: ?0, $options: 'i' } }")
    Optional<List<Cadastro>> findByNome(String nome);


    Optional<List<Cadastro>> findByCpf(String cpf);



    Boolean existsByCpf(String cpf);
}
