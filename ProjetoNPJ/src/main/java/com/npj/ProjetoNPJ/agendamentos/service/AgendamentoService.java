package com.npj.ProjetoNPJ.agendamentos.service;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.agendamentos.dto.AgendamentoDto;
import com.npj.ProjetoNPJ.agendamentos.entity.Agendamento;
import com.npj.ProjetoNPJ.agendamentos.mapper.AgendamentoMapper;
import com.npj.ProjetoNPJ.agendamentos.repository.AgendamentoRepository;
import com.npj.ProjetoNPJ.exceptions.NullPointerException;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.clientes.repository.CadastroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendaRepository;

    @Autowired
    private AdvogadoRepository advogadoRepository;

    @Autowired
    private CadastroRepository clienteRepository;


    public String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername(); // username do usuário autenticado
        } else {
            return principal.toString(); // Caso seja um token simples
        }
    }

    public String normalizarCpf(String cpf) {
        return cpf.replaceAll("[.\\-\\s]", "");
    }


    public AgendamentoDto criarAgendamento(AgendamentoDto dto) {
        dto.setCpf(normalizarCpf(dto.getCpf()));
        List<Advogado> advogados = dto.getResponsaveis().stream()
                .map(responsavel -> advogadoRepository.findById(responsavel.getResponsavelId())
                        .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado: "
                                + responsavel.getResponsavelId())))
                .collect(Collectors.toList());

        Agendamento novoAgendamento = agendaRepository.insert(AgendamentoMapper.toEntity(dto, advogados));
        novoAgendamento.setResponsaveis(dto.getResponsaveis());
        return AgendamentoMapper.toDto(novoAgendamento);
    }

    // public void notificarResponsaveis() {
    //
    // }

    // public void criarAlerta() {
    //
    // }


    public AgendamentoDto atualizarAgendamento(AgendamentoDto updateDto, String id) {
        Agendamento registro = agendaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agendamento não localizado"));

        updateData(registro, updateDto);
        agendaRepository.save(registro);
        updateDto.setId(id);

        return updateDto;
    }

    public void updateData(Agendamento registro, AgendamentoDto updateDto) {
        if(updateDto.getNome() != null) {
            registro.setNome(updateDto.getNome());
        }
        if(updateDto.getCpf() != null) {
            registro.setCpf(updateDto.getCpf());
        }
        if(updateDto.getStart() != null) {
            registro.setStart(updateDto.getStart());
        }
        if(updateDto.getEnd() != null) {
            registro.setEnd(updateDto.getEnd());
        }
        if(updateDto.getCasoTipo() != null) {
            registro.setCasoTipo(updateDto.getCasoTipo());
        }
        if(updateDto.getResponsaveis() != null) {
            registro.setResponsaveis(updateDto.getResponsaveis());
        }
    }

    public AgendamentoDto buscaId(String id) {
        if(id == null || id.isBlank()) {
            throw new NullPointerException("ID não pode ser nulo ou estar em branco.");
        }
        Agendamento agendamento = agendaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agendamento não localizado."));
        return AgendamentoMapper.toDto(agendamento);
    }

    public List<AgendamentoDto> buscaTodos() {
        List<Agendamento> agendamentos = agendaRepository.findAll();
        return AgendamentoMapper.toListDto(agendamentos);
    }

    public List<AgendamentoDto> buscaNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new NullPointerException("Nome não pode ser nulo ou estar em branco.");
        }
        List<Agendamento> agendamentos = agendaRepository.findByNome(nome);
        if(agendamentos.isEmpty()) {
            throw new RecursoNaoEncontradoException("Nome não localizado.");
        }
        return AgendamentoMapper.toListDto(agendamentos);
    }

    public List<AgendamentoDto> buscaCpf(String cpf) {
        if(cpf == null || cpf.isBlank()) {
            throw new NullPointerException("CPF não pode ser nulo ou estar em branco");
        }
        String cpfTratado = normalizarCpf(cpf);
        List<Agendamento> agendamentos = agendaRepository.findByCpf(cpfTratado);
        if (agendamentos.isEmpty()) {
            throw new RecursoNaoEncontradoException("CPF não localizado.");
        }
        return AgendamentoMapper.toListDto(agendamentos);
    }


}
