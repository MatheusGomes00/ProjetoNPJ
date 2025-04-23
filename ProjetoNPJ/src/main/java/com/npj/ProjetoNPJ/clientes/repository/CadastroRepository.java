package com.npj.ProjetoNPJ.clientes.repository;

import com.npj.ProjetoNPJ.clientes.entitie.Cadastro;
import com.npj.ProjetoNPJ.processos.entity.Processos;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

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
