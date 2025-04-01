package com.npj.ProjetoNPJ.processos.repository;

import com.npj.ProjetoNPJ.processos.entity.Processos;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProcessosRepositorio extends MongoRepository<Processos, String> {
}
