package com.npj.ProjetoNPJ.advogados.repository;

import com.npj.ProjetoNPJ.advogados.entity.advogado;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdvogadoRepository extends MongoRepository<advogado, String> {
}
