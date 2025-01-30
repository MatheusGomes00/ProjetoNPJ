package com.npj.ProjetoNPJ.triagem.repository;

import com.npj.ProjetoNPJ.triagem.entitie.Cadastro;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CadastroRepository extends MongoRepository<Cadastro, String> {
}
