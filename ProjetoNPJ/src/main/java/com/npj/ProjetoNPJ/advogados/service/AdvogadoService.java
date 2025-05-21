package com.npj.ProjetoNPJ.advogados.service;

import com.npj.ProjetoNPJ.advogados.dtos.DtoAdvogado;
import com.npj.ProjetoNPJ.advogados.dtos.ResponseAdvogadoDto;
import com.npj.ProjetoNPJ.advogados.dtos.UpdateRequestDto;
import com.npj.ProjetoNPJ.advogados.dtos.UpdateSenhaDto;
import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.entity.Roles;
import com.npj.ProjetoNPJ.advogados.mapper.AdvogadoMapper;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.exceptions.CpfUnicoException;
import com.npj.ProjetoNPJ.exceptions.NullPointerException;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.exceptions.SenhaInvalidaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class AdvogadoService {

    @Autowired
    private AdvogadoRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername(); // username do usuário autenticado
        } else {
            return principal.toString(); // Caso seja um token simples
        }
    }

    public void validarCpf(String cpf) {
        Boolean verificador = repository.existsByCpf(cpf);
        if (verificador) {
            throw new CpfUnicoException("CPF " + cpf + " já cadastrado!");
        }
    }

    public String buscarNomeAutenticado() {
        Advogado advogado = repository.findById(getAuthenticatedUsername())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado"));
        return advogado.getNome();
    }

    public String normalizarCpf(String cpf) {
        return cpf.replaceAll("[.\\-\\s]", "");
    }


    public ResponseAdvogadoDto insert(DtoAdvogado dto){
        dto.setCpf(normalizarCpf(dto.getCpf()));
        validarCpf(dto.getCpf());
        dto.setStatus(true);
        dto.setSenha(passwordEncoder.encode(dto.getSenha()));
        Advogado newAdvogado = AdvogadoMapper.toEntitie(dto);
        repository.insert(newAdvogado);
        return AdvogadoMapper.responseDto(newAdvogado);
    }

    public void update(UpdateRequestDto dto, String id){

        Advogado advAntigo = repository
                .findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado."));

        String cpfNovo = normalizarCpf(dto.getCpf());
        String cpfAntigo = normalizarCpf(advAntigo.getCpf());

        if(!cpfAntigo.equals(cpfNovo)) {
            validarCpf(cpfNovo);
        }

        updateData(advAntigo, dto);
        repository.save(advAntigo);
    }

    public void updateData(Advogado advogado, UpdateRequestDto dto) {
        if (dto.getNome() != null) {
            advogado.setNome(dto.getNome());
        }
        if (dto.getDatanasc() != null) {
            advogado.setDatanasc(dto.getDatanasc());
        }
        if (dto.getCpf() != null) {
            advogado.setCpf(normalizarCpf(dto.getCpf()));
        }
        if (dto.getRegistroOab() != null) {
            advogado.setRegistroOab(dto.getRegistroOab());
        }
        if (dto.getSecaoOab() != null) {
            advogado.setSecaoOab(dto.getSecaoOab());
        }
        if (dto.getRole() != null) {
            advogado.setRole(Roles.valueOf(dto.getRole()));
        }
        if (dto.getSenha() != null) {
            advogado.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        advogado.setStatus(dto.isStatus());
    }

    public void updateSenha(UpdateSenhaDto senhaDto) {
        // String username = getAuthenticatedUsername();
        Advogado advogado = repository
                .findById(getAuthenticatedUsername())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario não localizado."));

        if (!senhaDto.getNovaSenha().equals(senhaDto.getRepeteSenha())) {
            throw new SenhaInvalidaException("Nova senha e repete senha não conferem.");
        }

        String novaSenha = senhaDto.getNovaSenha();
        advogado.setSenha(passwordEncoder.encode(novaSenha));
        repository.save(advogado);
    }

    public void alterarStatus(String id) {
        Advogado advogado = repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado"));
        advogado.setStatus(!advogado.getStatus());
        repository.save(advogado);
    }

    public List<ResponseAdvogadoDto> findAll(){
        List<Advogado> cadastros = repository.findAll();
        return AdvogadoMapper.toListDto(cadastros);
    }

    public List<ResponseAdvogadoDto> findByNome(String nome){
        if (nome == null || nome.isBlank()) {
            throw new NullPointerException("Nome não pode ser nulo ou estar em branco.");
        }
        List<Advogado> advogados = repository.findByNome(nome);
        if(advogados.isEmpty()) {
            throw new RecursoNaoEncontradoException("Nome não localizado");
        }
        return AdvogadoMapper.toListDto(advogados);
    }

    public List<ResponseAdvogadoDto> findByCpf(String cpf){

        if(cpf == null || cpf.isBlank()) {
            throw new NullPointerException("CPF não pode ser nulo ou estar em branco");
        }
        String cpfTratado = normalizarCpf(cpf);
        List<Advogado> advogados = repository.findExistsByCpf(cpfTratado);
        if(advogados.isEmpty()) {
            throw new RecursoNaoEncontradoException("CPF não localizado.");
        }
        return AdvogadoMapper.toListDto(advogados);
    }

    public ResponseAdvogadoDto findById(String id) {
        if(id == null || id.isBlank()) {
            throw new NullPointerException("ID não pode ser nulo ou estar em branco.");
        }
        Advogado advogado = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não localizado."));
        return AdvogadoMapper.responseDto(advogado);
    }

    public String getUsername(String cpf) {

        Advogado advogado = repository.findByCpf(normalizarCpf(cpf))
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não localizado."));

        return advogado.getId();
    }
}
