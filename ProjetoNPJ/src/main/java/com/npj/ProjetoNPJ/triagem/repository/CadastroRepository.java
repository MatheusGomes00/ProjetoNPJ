package com.npj.ProjetoNPJ.triagem.repository;

import com.npj.ProjetoNPJ.triagem.entitie.Cadastro;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CadastroRepository extends MongoRepository<Cadastro, String> {

    @Query("{ $or: [ { 'cliente.nome': { $regex: ?0, $options: 'i' } }, " +
            "{ 'representante.nome': { $regex: ?0, $options: 'i' } }, " +
            "{ 'parteContraria.nome': { $regex: ?0, $options: 'i' } } ] }")
    List<Cadastro> findByNome(String nome);

    @Query("{ $or: [ { 'cliente.cpf': { $regex: ?0 } }, " +
            "{ 'representante.cpf': { $regex: ?0 } }, " +
            "{ 'parteContraria.cpfCnpj': { $regex: ?0 } } ] }")
    List<Cadastro> findByCpf(String cpf);

    Boolean existsByClienteCpf(String cpf);
}
