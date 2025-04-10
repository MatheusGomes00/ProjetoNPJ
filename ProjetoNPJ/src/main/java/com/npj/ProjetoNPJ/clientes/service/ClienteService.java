package com.npj.ProjetoNPJ.clientes.service;

import com.npj.ProjetoNPJ.clientes.dto.PreCadastroDto;
import com.npj.ProjetoNPJ.clientes.entitie.PreCadastro;
import com.npj.ProjetoNPJ.exceptions.NullPointerException;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.clientes.dto.CadastroDto;
import com.npj.ProjetoNPJ.clientes.entitie.Cadastro;
import com.npj.ProjetoNPJ.exceptions.CpfUnicoException;
import com.npj.ProjetoNPJ.clientes.mapper.CadastroMapper;
import com.npj.ProjetoNPJ.clientes.repository.CadastroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public PreCadastroDto precadastro(PreCadastroDto dto){
        dto.setNome(dto.getNome());
        dto.setDataNasc(dto.getDataNasc());
        dto.setDiaAgendado(dto.getDiaAgendado());
        dto.setCelular(dto.getCelular());
        dto.setCpf(dto.getCpf());

        return dto;
    }

    public CadastroDto insert(CadastroDto obj) {
        String cpf = normalizarCpf(obj.getCliente().getCpf());
        validarCpf(cpf);
        obj.getCliente().setCpf(cpf);
        obj.setStatus(true);
        Cadastro cadastro = cadastroRepository.insert(CadastroMapper.toEntitie(obj));
        return CadastroMapper.toDto(cadastro);
    }

    public CadastroDto update(CadastroDto objNovo, String id) {

        Cadastro objAntigo = cadastroRepository
                .findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Erro ao localizar cliente"));

        String cpfNovo = normalizarCpf(objNovo.getCliente().getCpf());
        String cpfAntigo = normalizarCpf(objAntigo.getCliente().getCpf());

        if(!cpfAntigo.equals(cpfNovo)) {
            validarCpf(cpfNovo);
        }

        updateData(objAntigo, objNovo);
        cadastroRepository.save(objAntigo);

        return CadastroMapper.toDto(objAntigo);
    }

    private void updateData(Cadastro oldObj, CadastroDto dto) {
        Cadastro dtoAtualizado = CadastroMapper.toEntitie(dto);
        if (dto.getStatus() != null) {
            oldObj.setStatus(dto.getStatus());
        }
        if (dto.getCliente() != null) {
            oldObj.getCliente().setCpf(normalizarCpf(dto.getCliente().getCpf()));
        }
        if (dto.getRepresentante() != null) {
            oldObj.setRepresentante(dtoAtualizado.getRepresentante());
        }
        if (dto.getParteContraria() != null) {
            oldObj.setParteContraria(dtoAtualizado.getParteContraria());
        }
        if (dto.getDadosProcessuais() != null) {
            oldObj.setDadosProcessuais(dtoAtualizado.getDadosProcessuais());
        }
        if (dto.getNatureza() != null) {
            oldObj.setNatureza(dtoAtualizado.getNatureza());
        }
        if (dto.getResponsaveis() != null) {
            oldObj.setResponsaveis(dtoAtualizado.getResponsaveis());
        }
    }

    public List<CadastroDto> findByNome(String nome) {
        List<Cadastro> cadastros = cadastroRepository.findByNome(nome);
        if(cadastros.isEmpty()) {
            throw new RecursoNaoEncontradoException("Nome não localizado.");
        }
        return CadastroMapper.toListDto(cadastros);
    }

    public List<CadastroDto> findByCpf(String cpf) {

        if(cpf == null || cpf.isBlank()) {
            throw new NullPointerException("CPF não pode ser nulo ou estar em branco");
        }
        
        String cpfTratado = normalizarCpf(cpf);
        List<Cadastro> cadastros = cadastroRepository.findByCpf(cpfTratado);
        if(cadastros.isEmpty()) {
            throw new RecursoNaoEncontradoException("CPF não localizado.");
        }
        return CadastroMapper.toListDto(cadastros);
    }

    public List<CadastroDto> findAll() {
        List<Cadastro> cadastros = cadastroRepository.findAll();
        if(cadastros.isEmpty()) {
            throw new RecursoNaoEncontradoException("Sem registros");
        }
        return CadastroMapper.toListDto(cadastros);
    }

    public void delete(String id) {
        Cadastro cadastro = cadastroRepository
                .findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("ID Não localizado"));

        cadastro.setStatus(!cadastro.getStatus());
        cadastroRepository.save(cadastro);
    }
}
