package com.npj.ProjetoNPJ.processos.repository;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.clientes.entitie.Cadastro;
import com.npj.ProjetoNPJ.processos.entity.Processos;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProcessosRepositorio extends MongoRepository<Processos, String> {

    @Query("{ 'numeroProcesso': ?0 }")
    List<Processos> findByNumeroProcesso(String numeroProcesso);

    @Query("{ 'clienteId': ?0 }")
    List<Processos> findByClienteId(String clienteId);

    @Query("{ 'cliente': ?0 }")
    List<Processos> findByCliente(String clienteNome);

    @Query("{ 'responsaveisId': ?0 }")
    List<Processos> findByAdvogadoId(String advogadoId);

}
