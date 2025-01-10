package com.npj.ProjetoNPJ.advogados.repository;

import com.npj.ProjetoNPJ.triagem.entitie.Cliente;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdvogadoRepository extends MongoRepository<Cliente, String> {
}
