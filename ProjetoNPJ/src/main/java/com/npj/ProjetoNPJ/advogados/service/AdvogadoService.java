package com.npj.ProjetoNPJ.advogados.service;

import com.npj.ProjetoNPJ.advogados.dtos.dtoAdvogado;
import com.npj.ProjetoNPJ.advogados.entity.advogado;
import com.npj.ProjetoNPJ.advogados.mapper.AdvogadoMapper;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.advogados.tratadoresErros.AdvogadoNaoAchado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class AdvogadoService {

    @Autowired
    private AdvogadoRepository repository;



    public void insert(dtoAdvogado dto){
        dto.setStatus(true);
        advogado newAdvogado = AdvogadoMapper.toEntitie(dto);
        repository.insert(newAdvogado);
    }

    public void update(dtoAdvogado dto, String id){

        advogado advAtualizado = AdvogadoMapper.toEntitie(dto);

        advogado advAntigo = repository.findById(id).orElseThrow(() -> new RuntimeException("Advogado não encontrado."));

        advAtualizado.setId(id);
        updateData(advAntigo, advAtualizado);

        repository.save(advAtualizado);
        }

    public void delete(dtoAdvogado dto, String id){

        advogado advativo = repository.findById(id).orElseThrow(() -> new RuntimeException("Advogado não encontrado"));

        advativo.setStatus(false);

        repository.save(advativo);
    }

    public void updateData(advogado oldObj, advogado newObj) {

        oldObj.setNome(newObj.getNome());
        oldObj.setDatanasc(newObj.getDatanasc());
        oldObj.setCpf(newObj.getCpf());
        oldObj.setRegistroOab(newObj.getRegistroOab());
        oldObj.setSecaoOab(newObj.getSecaoOab());
    }

    public List<dtoAdvogado> findAll(){
        List<advogado> cadastros = repository.findAll();
        return AdvogadoMapper.toListDto(cadastros);
    }

    public List<dtoAdvogado> findByNome(String nome){

        List<advogado> advogados = repository
                .findByNome(nome)
                .orElseThrow((()-> new RuntimeException("Advogado não localizado")));
        if (advogados.isEmpty()){
            throw new AdvogadoNaoAchado("Advogado não localizado");
        }
        return AdvogadoMapper.toListDto(advogados);

    }

    public List<dtoAdvogado> findByCpf(String cpf){
        List<advogado> advogados = repository
                .findByCpf(cpf)
                .orElseThrow((()-> new RuntimeException("Advogado não localizado")));

        if (advogados.isEmpty()){
            throw new AdvogadoNaoAchado("Advogado não localizado");
        }
        return AdvogadoMapper.toListDto(advogados);
    }
}
