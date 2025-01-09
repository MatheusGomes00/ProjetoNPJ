package com.npj.ProjetoNPJ.clientes.service;

import com.npj.ProjetoNPJ.clientes.entitie.Cliente;
import com.npj.ProjetoNPJ.clientes.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    public Cliente insert(Cliente obj) {
        return repository.insert(obj);
    }

    public Cliente update(Cliente obj) {
        Cliente newObj = repository.findById(obj.getId()).orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        updateData(newObj, obj);
        return repository.save(newObj);
    }

    public void updateData(Cliente newObj, Cliente obj) {
        newObj.setCpf(obj.getCpf());
        newObj.setStatus(obj.getStatus());
        newObj.setCasaPropria(obj.getCasaPropria());
        newObj.setContato(obj.getContato());
        newObj.setEndereco(obj.getEndereco());
    }

//    public Cliente findByName(String nome) {
//        return repository.findByNome()
//    }
}
