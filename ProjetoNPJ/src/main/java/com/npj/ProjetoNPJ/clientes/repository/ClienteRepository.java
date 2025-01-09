package com.npj.ProjetoNPJ.clientes.repository;

import com.npj.ProjetoNPJ.clientes.entitie.Cliente;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends MongoRepository<Cliente, String> {
}
