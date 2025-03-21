package com.npj.ProjetoNPJ.agenda.service;

import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.agenda.dto.AgendamentoDto;
import com.npj.ProjetoNPJ.agenda.dto.ResponseAgendamentoDto;
import com.npj.ProjetoNPJ.agenda.entity.Agendamento;
import com.npj.ProjetoNPJ.agenda.mapper.AgendaMapper;
import com.npj.ProjetoNPJ.agenda.repository.AgendaRepository;
import com.npj.ProjetoNPJ.exceptions.CpfUnicoException;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.triagem.repository.CadastroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AgendaService {

    @Autowired
    private AgendaRepository agendaRepository;

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


    public ResponseAgendamentoDto criarAgendamento(AgendamentoDto dto) {
        dto.setCpf(normalizarCpf(dto.getCpf()));
        // ... lógica para programar notificação

        agendaRepository.insert(AgendaMapper.toEntity(dto));
        return AgendaMapper.toResponseDto(dto);
    }

    // public void notificarResponsaveis() {
    //
    // }

    // public void criarAlerta() {
    //
    // }


    public ResponseAgendamentoDto atualizarAgendamento(AgendamentoDto updateDto, String id) {
        Agendamento registro = agendaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agendamento não localizado"));

        updateData(registro, updateDto);
        agendaRepository.save(registro);

        return AgendaMapper.toResponseDto(updateDto);
    }

    public void updateData(Agendamento registro, AgendamentoDto updateDto) {
        if(updateDto.getNome() != null) {
            registro.setNome(updateDto.getNome());
        }
        if(updateDto.getCpf() != null) {
            registro.setCpf(updateDto.getCpf());
        }
        if(updateDto.getDataAgendamento() != null) {
            registro.setDataAgendamento(updateDto.getDataAgendamento());
        }
        if(updateDto.getCasoTipo() != null) {
            registro.setCasoTipo(updateDto.getCasoTipo());
        }
        if(updateDto.getResponsaveis() != null) {
            registro.setResponsaveis(updateDto.getResponsaveis());
        }
    }

    public ResponseAgendamentoDto buscarNome(String nome) {

    }

}
