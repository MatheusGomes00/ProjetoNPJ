package com.npj.ProjetoNPJ.advogados.repository;

import com.npj.ProjetoNPJ.advogados.entity.advogado;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdvogadoRepository extends MongoRepository<advogado, String> {

    @Query("{ 'nome': { $regex: ?0, $options: 'i' } }}")
    Optional<List<advogado>> findByNome(String nome);

    @Query("{ 'cpf': { $regex: ?0, $options: 'i' } }}")
    Optional<List<advogado>> findByCpf(String cpf);
}
