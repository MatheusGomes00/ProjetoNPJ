package com.npj.ProjetoNPJ.triagem.service;

import com.npj.ProjetoNPJ.triagem.dto.CadastroDto;
import com.npj.ProjetoNPJ.triagem.entitie.Cadastro;
import com.npj.ProjetoNPJ.triagem.mapper.CadastroMapper;
import com.npj.ProjetoNPJ.triagem.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    public CadastroDto insert(CadastroDto obj) {

        try {
            obj.setStatus(true);
            Cadastro cadastro = CadastroMapper.toEntitie(obj);
            repository.insert(cadastro);
            return CadastroMapper.toDto(cadastro);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public void update(CadastroDto obj, String id) {
        Cadastro objAtualizado = CadastroMapper.toEntitie(obj);

        Cadastro objAntigo = repository.findById(id).orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        objAtualizado.setId(id);
        objAtualizado.setStatus(true);
        updateData(objAntigo, objAtualizado);

        repository.save(objAtualizado);

    }

    public void updateData(Cadastro oldObj, Cadastro newObj) {
        oldObj.setStatus(newObj.getStatus());
        oldObj.setCliente(newObj.getCliente());
        oldObj.setRepresentante(newObj.getRepresentante());
        oldObj.setParteContraria(newObj.getParteContraria());
        oldObj.setDadosProcessuais(newObj.getDadosProcessuais());
        oldObj.setNatureza(newObj.getNatureza());
        oldObj.setResponsaveis(newObj.getResponsaveis());

    }

    public List<CadastroDto> findByNome(String nome) {
        List<Cadastro> cadastros = repository
                .findByNome(nome)
                .orElseThrow(() -> new RuntimeException("Não localizado."));
        return CadastroMapper.toListDto(cadastros);
    }

    public List<CadastroDto> findByCpf(String cpf) {
        List<Cadastro> cadastros = repository
                .findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Não localizado."));
        return CadastroMapper.toListDto(cadastros);
    }

    public List<CadastroDto> findAll() {
        List<Cadastro> cadastros =   repository.findAll();
        return CadastroMapper.toListDto(cadastros);
    }

    public void changeStatus(String id) {
        Optional<Cadastro> cadastro = repository.findById(id);
        if(cadastro.isEmpty()) {
            throw new RuntimeException("Não localizado");
        }
        cadastro.get().setStatus(!cadastro.get().getStatus());
        repository.save(cadastro.get());
    }
    
}
