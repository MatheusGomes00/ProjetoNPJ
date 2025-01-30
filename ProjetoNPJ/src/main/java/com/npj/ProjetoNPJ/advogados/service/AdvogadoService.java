package com.npj.ProjetoNPJ.advogados.service;

import com.npj.ProjetoNPJ.advogados.dtos.DtoAdvogado;
import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.mapper.AdvogadoMapper;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.exceptions.CpfUnicoException;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class AdvogadoService {

    @Autowired
    private AdvogadoRepository repository;

    public void validarCpf(String cpf) {
        Boolean verificador = repository.existsByCpf(cpf);
        if (verificador) {
            throw new CpfUnicoException("CPF " + cpf + " já cadastrado!");
        }
    }

    public String normalizarCpf(String cpf) {
        return cpf.replaceAll("[.\\-\\s]", "");
    }

    public void insert(DtoAdvogado dto){
        dto.setCpf(normalizarCpf(dto.getCpf()));
        validarCpf(dto.getCpf());
        dto.setStatus(true);
        Advogado newAdvogado = AdvogadoMapper.toEntitie(dto);
        repository.insert(newAdvogado);
    }

    public void update(DtoAdvogado dto, String id){

        Advogado advAtualizado = AdvogadoMapper.toEntitie(dto);

        Advogado advAntigo = repository
                .findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado."));

        advAtualizado.setId(id);
        updateData(advAntigo, advAtualizado);

        repository.save(advAtualizado);
    }

    public void updateData(Advogado oldObj, Advogado newObj) {
        oldObj.setNome(newObj.getNome());
        oldObj.setDatanasc(newObj.getDatanasc());
        oldObj.setCpf(newObj.getCpf());
        oldObj.setRegistroOab(newObj.getRegistroOab());
        oldObj.setSecaoOab(newObj.getSecaoOab());
    }

    public void delete(String id) {
        Advogado advogado = repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado"));
        advogado.setStatus(!advogado.getStatus());
        repository.save(advogado);
    }

    public List<DtoAdvogado> findAll(){
        List<Advogado> cadastros = repository.findAll();
        return AdvogadoMapper.toListDto(cadastros);
    }

    public List<DtoAdvogado> findByNome(String nome){

        List<Advogado> advogados = repository.findByNome(nome);
        if(advogados.isEmpty()) {
            throw new RecursoNaoEncontradoException("Nome não localizado");
        }
        return AdvogadoMapper.toListDto(advogados);
    }

    public List<DtoAdvogado> findByCpf(String cpf){
        List<Advogado> advogados = repository.findByCpf(cpf);
        if(advogados.isEmpty()) {
            throw new RecursoNaoEncontradoException("CPF não localizado");
        }
        return AdvogadoMapper.toListDto(advogados);
    }
}
