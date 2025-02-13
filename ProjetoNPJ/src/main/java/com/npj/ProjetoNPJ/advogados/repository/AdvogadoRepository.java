package com.npj.ProjetoNPJ.advogados.repository;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdvogadoRepository extends MongoRepository<Advogado, String> {

    @Query("{ 'nome': { $regex: ?0, $options: 'i' } }}")
    List<Advogado> findByNome(String nome);

    @Query("{ 'cpf': { $regex: ?0, $options: 'i' } }}")
    List<Advogado> findByCpf(String cpf);

    Boolean existsByCpf(String cpf);



}
