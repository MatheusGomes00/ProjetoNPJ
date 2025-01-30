package com.npj.ProjetoNPJ.triagem.service;

import com.npj.ProjetoNPJ.triagem.dto.CadastroDto;
import com.npj.ProjetoNPJ.triagem.entitie.Cadastro;
import com.npj.ProjetoNPJ.triagem.exceptions.CpfNaoEncontradoException;
import com.npj.ProjetoNPJ.triagem.exceptions.CpfUnicoException;
import com.npj.ProjetoNPJ.triagem.exceptions.NomeNaoLocalizadoException;
import com.npj.ProjetoNPJ.triagem.mapper.CadastroMapper;
import com.npj.ProjetoNPJ.triagem.repository.CadastroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private CadastroRepository cadastroRepository;

    public void validarCpf(String cpf) {
        Boolean verificador = cadastroRepository.existsByClienteCpf(cpf);
        if (verificador) {
            throw new CpfUnicoException("CPF " + cpf + " já cadastrado!");
        }
    }

    public String normalizarCpf(String cpf) {
        return cpf.replaceAll("[.\\-\\s]", "");
    }

    public CadastroDto insert(CadastroDto obj) {
        String cpf = normalizarCpf(obj.getCliente().getCpf());
        validarCpf(cpf);
        obj.getCliente().setCpf(cpf);
        obj.setStatus(true);
        Cadastro cadastro = cadastroRepository.insert(CadastroMapper.toEntitie(obj));
        return CadastroMapper.toDto(cadastro);
    }

    public CadastroDto update(CadastroDto obj, String id) {
        Cadastro objAtualizado = CadastroMapper.toEntitie(obj);
        String cpfNovo = normalizarCpf(obj.getCliente().getCpf());

        Cadastro objAntigo = cadastroRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Erro ao localizar cliente"));
        String cpfAntigo = normalizarCpf(objAntigo.getCliente().getCpf());

        if(!cpfAntigo.equals(cpfNovo)) {
            validarCpf(cpfNovo);
        } else {
            objAtualizado.setId(id);
            objAtualizado.getCliente().setCpf(cpfNovo);
            objAtualizado.setStatus(true);
            objAtualizado = updateData(objAntigo, objAtualizado);
            cadastroRepository.save(objAtualizado);
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
        List<Cadastro> cadastros = cadastroRepository
                .findByNome(nome)
                .orElseThrow(() -> new NomeNaoLocalizadoException("Nome não localizado."));
        return CadastroMapper.toListDto(cadastros);
    }

    public List<CadastroDto> findByCpf(String cpf) {
        List<Cadastro> cadastros = cadastroRepository
                .findByCpf(cpf)
                .orElseThrow(() -> new CpfNaoEncontradoException("CPF não localizado."));
        return CadastroMapper.toListDto(cadastros);
    }

    public List<CadastroDto> findAll() {
        List<Cadastro> cadastros = cadastroRepository.findAll();
        if(cadastros.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sem registros");
        }
        return CadastroMapper.toListDto(cadastros);
    }

    public void delete(String id) {
        Optional<Cadastro> cadastro = cadastroRepository.findById(id);
        if(cadastro.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Não localizado");
        }
        cadastro.get().setStatus(false);
        cadastroRepository.save(cadastro.get());
    }
}
