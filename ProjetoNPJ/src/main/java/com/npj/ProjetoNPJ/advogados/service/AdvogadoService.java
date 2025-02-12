package com.npj.ProjetoNPJ.advogados.service;

import com.npj.ProjetoNPJ.advogados.dtos.DtoAdvogado;
import com.npj.ProjetoNPJ.advogados.dtos.ResponseAdvogadoDto;
import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.mapper.AdvogadoMapper;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.exceptions.CpfUnicoException;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class AdvogadoService {

    @Autowired
    private AdvogadoRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void validarCpf(String cpf) {
        Boolean verificador = repository.existsByCpf(cpf);
        if (verificador) {
            throw new CpfUnicoException("CPF " + cpf + " já cadastrado!");
        }
    }

    public String normalizarCpf(String cpf) {
        return cpf.replaceAll("[.\\-\\s]", "");
    }

    public Advogado insert(DtoAdvogado dto){
        dto.setCpf(normalizarCpf(dto.getCpf()));
        validarCpf(dto.getCpf());
        dto.setStatus(true);
        dto.setSenha(passwordEncoder.encode(dto.getSenha()));
        Advogado newAdvogado = AdvogadoMapper.toEntitie(dto);
        repository.insert(newAdvogado);
        return newAdvogado;
    }

    public void update(DtoAdvogado dto, String id){

        Advogado advAtualizado = AdvogadoMapper.toEntitie(dto);

        Advogado advAntigo = repository
                .findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado."));

        advAtualizado.setId(id);
        updateData(advAntigo, advAtualizado);
        advAtualizado.setSenha(passwordEncoder.encode(advAtualizado.getSenha()));
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

    public List<ResponseAdvogadoDto> findAll(){
        List<Advogado> cadastros = repository.findAll();
        return AdvogadoMapper.toListDto(cadastros);
    }

    public List<ResponseAdvogadoDto> findByNome(String nome){

        List<Advogado> advogados = repository.findByNome(nome);
        if(advogados.isEmpty()) {
            throw new RecursoNaoEncontradoException("Nome não localizado");
        }
        return AdvogadoMapper.toListDto(advogados);
    }

    public List<ResponseAdvogadoDto> findByCpf(String cpf){

        String cpfTratado = normalizarCpf(cpf);
        List<Advogado> advogados = repository.findExistsByCpf(cpfTratado);
        if(advogados.isEmpty()) {
            throw new RecursoNaoEncontradoException("CPF não localizado.");
        }
        return AdvogadoMapper.toListDto(advogados);
    }

    public ResponseAdvogadoDto findById(String id) {
        Advogado advogado = repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Id não localizado"));

        return AdvogadoMapper.responseDto(advogado);
    }
}
