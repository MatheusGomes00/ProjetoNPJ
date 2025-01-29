package com.npj.ProjetoNPJ.triagem.service;

import com.mongodb.DuplicateKeyException;
import com.npj.ProjetoNPJ.triagem.dto.CadastroDto;
import com.npj.ProjetoNPJ.triagem.entitie.Cadastro;
import com.npj.ProjetoNPJ.triagem.exceptions.CpfNaoEncontradoException;
import com.npj.ProjetoNPJ.triagem.exceptions.CpfUnicoException;
import com.npj.ProjetoNPJ.triagem.exceptions.NomeNaoLocalizadoException;
import com.npj.ProjetoNPJ.triagem.mapper.CadastroMapper;
import com.npj.ProjetoNPJ.triagem.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    public void verificarCpf(String cpf) {
        Boolean verificador = repository.existsByCpf(cpf);
        if (verificador) {
            throw new CpfUnicoException("CPF já cadastrado!");
        }
    }

    public String tratarCpf(String cpf) {
        return cpf.replaceAll("[.\\-\\s]", "");
    }

    public CadastroDto insert(CadastroDto obj) {
        try {
            String cpf = tratarCpf(obj.getCliente().getCpf());
            obj.getCliente().setCpf(cpf);
            obj.setStatus(true);
            Cadastro cadastro = repository.insert(CadastroMapper.toEntitie(obj));
            return CadastroMapper.toDto(cadastro);
        }
        catch (DuplicateKeyException ex) {
            throw new CpfUnicoException("CPF " +
                    obj.getCliente().getCpf() +
                    " já cadastrado no sistema!");
        }
        catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public CadastroDto update(CadastroDto obj, String id) {
        Cadastro objAtualizado = CadastroMapper.toEntitie(obj);
        String cpfNovo = tratarCpf(obj.getCliente().getCpf());

        Cadastro objAntigo = repository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Erro ao localizar cliente"));
        String cpfAntigo = tratarCpf(objAntigo.getCliente().getCpf());

        if(!cpfAntigo.equals(cpfNovo)) {
            verificarCpf(cpfNovo);
        } else {
            objAtualizado.setId(id);
            objAtualizado.getCliente().setCpf(cpfNovo);
            objAtualizado.setStatus(true);
            objAtualizado = updateData(objAntigo, objAtualizado);
            repository.save(objAtualizado);
        }
        return CadastroMapper.toDto(objAtualizado);
    }

    public Cadastro updateData(Cadastro oldObj, Cadastro newObj) {
        oldObj.setStatus(newObj.getStatus());
        oldObj.setCliente(newObj.getCliente());
        oldObj.setRepresentante(newObj.getRepresentante());
        oldObj.setParteContraria(newObj.getParteContraria());
        oldObj.setDadosProcessuais(newObj.getDadosProcessuais());
        oldObj.setNatureza(newObj.getNatureza());
        oldObj.setResponsaveis(newObj.getResponsaveis());
        return oldObj;
    }

    public List<CadastroDto> findByNome(String nome) {
        List<Cadastro> cadastros = repository
                .findByNome(nome)
                .orElseThrow(() -> new NomeNaoLocalizadoException("Nome não localizado."));
        return CadastroMapper.toListDto(cadastros);
    }

    public List<CadastroDto> findByCpf(String cpf) {
        List<Cadastro> cadastros = repository
                .findByCpf(cpf)
                .orElseThrow(() -> new CpfNaoEncontradoException("CPF não localizado."));
        return CadastroMapper.toListDto(cadastros);
    }

    public List<CadastroDto> findAll() {
        List<Cadastro> cadastros = repository.findAll();
        if(cadastros.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Não localizado");
        }
        return CadastroMapper.toListDto(cadastros);
    }

    public void delete(String id) {
        Optional<Cadastro> cadastro = repository.findById(id);
        if(cadastro.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Não localizado");
        }
        cadastro.get().setStatus(false);
        repository.save(cadastro.get());
    }
}
