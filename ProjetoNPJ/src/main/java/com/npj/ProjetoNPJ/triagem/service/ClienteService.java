package com.npj.ProjetoNPJ.triagem.service;

import com.npj.ProjetoNPJ.triagem.entitie.Cadastro;
import com.npj.ProjetoNPJ.triagem.entitie.Cliente;
import com.npj.ProjetoNPJ.triagem.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    public Cadastro insert(Cadastro obj) {

        Optional<Cliente> fakeClient = repository.findByCpf(obj.getCliente().getCpf());
        if (fakeClient.isPresent()) {
            throw new RuntimeException("CPF já cadastrado!");
        }


        return repository.insert(obj);
    }

    public Cadastro update(Cadastro obj) {
        Cadastro newObj = repository.findById(obj.getId()).orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        updateData(newObj, obj);
        return repository.save(newObj);
    }
    public void updateData(Cadastro newObj, Cadastro obj) {
        newObj.setStatus(obj.getStatus());
        newObj.setCliente(obj.getCliente());
        newObj.setRepresentante(obj.getRepresentante());
        newObj.setParteContraria(obj.getParteContraria());
        newObj.setDadosProcessuais(obj.getDadosProcessuais());
        newObj.setNatureza(obj.getNatureza());
        newObj.setResponsaveis(obj.getResponsaveis());

    }

//    public Cadastro findByNome(String nome) {
//        return repository.findByNome(nome).orElseThrow(() -> new RuntimeException("Não localizado."));
//    }
}
