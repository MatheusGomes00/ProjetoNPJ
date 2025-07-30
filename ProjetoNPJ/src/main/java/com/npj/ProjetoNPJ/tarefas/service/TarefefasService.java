package com.npj.ProjetoNPJ.tarefas.service;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.security.JwtService;
import com.npj.ProjetoNPJ.security.UserAutenticado;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import com.npj.ProjetoNPJ.tarefas.mapper.TarefasMapper;
import com.npj.ProjetoNPJ.tarefas.repository.TarefasRepository;
import com.npj.ProjetoNPJ.utils.ConversorDataHora;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TarefefasService {

    @Autowired
    private AdvogadoRepository advogadoRepository;

    @Autowired
    private TarefasRepository repository;

    @Autowired
    private JwtService jwtService;


    public String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserAutenticado) {
            return ((UserAutenticado) principal).getId();
        } else {
            return principal.toString();
        }
    }

    public DtoTarefas insert(DtoTarefas dto) {
        dto.setStatus(true);
        List<Advogado> advogados = dto.getResponsaveisId().stream()
                .map(id -> advogadoRepository.findById(id)
                        .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado: " + id)))
                .collect(Collectors.toList());

        Tarefas newTask = TarefasMapper.toEntity(dto, advogados);
        newTask.setCriador(dto.getCriador());
        repository.save(newTask);
        return TarefasMapper.toDto(newTask);
    }

    public DtoTarefas update(DtoTarefas dto, String id){

        Tarefas tarefa = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Tarefa não encontrada."));
        updateData(tarefa, dto);
        repository.save(tarefa);
        //System.out.println(tarefa.getDataCriacao());
        // return tarefa;
        return TarefasMapper.toDto(tarefa);
    }

    public void updateData(Tarefas tarefa, DtoTarefas dto) {
        if (dto.getNomeTarefa() != null) tarefa.setNomeTarefa(dto.getNomeTarefa());
        //if (dto.getDataCriacao() != null) tarefa.setDataCriacao(ConversorDataHora.convertInstant(dto.getDataCriacao()));
        if (dto.getDescricao() != null) tarefa.setDescricao(dto.getDescricao());
        if (dto.getPrioridade() != null) tarefa.setPrioridade(dto.getPrioridade());
        if (dto.getPrazoLimite() != null) tarefa.setPrazoLimite(ConversorDataHora.convertInstant(dto.getPrazoLimite()));

        //Metodo que atualizei para o update conseguir atualizar os responsáveis também
        if (dto.getResponsaveisId() != null && !dto.getResponsaveisId().isEmpty()) {
            List<Advogado> advogados = dto.getResponsaveisId().stream()
                    .map(id -> advogadoRepository.findById(id)
                            .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado: " + id)))
                    .collect(Collectors.toList());
            // System.out.println("Advogados encontrados para atualização: " + advogados);
            tarefa.setResponsaveis(advogados);
        }
    }

    public DtoTarefas finalizar(String id, String advogadoId){
        Tarefas task = repository.findById(id).orElseThrow(()-> new RecursoNaoEncontradoException("Tarefa não encontrada"));

        Advogado advogado = advogadoRepository.findById(advogadoId)
                .orElseThrow(() -> new RuntimeException("Advogado não encontrado com ID: " + advogadoId));

        task.setFinalizadoPor(advogadoId);
        task.setAdvogadoFinalizadorId(advogado.getNome());
        task.setStatus(false);
        task.setDataFinalizacao(Instant.now());
        repository.save(task);
        return TarefasMapper.toDto(task);
    }

    public DtoTarefas reativarTarefa(String id){

        Tarefas task = repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Tarefa Não encontrada"));
        task.setFinalizadoPor(null);
        task.setStatus(true);
        repository.save(task);
        return TarefasMapper.toDto(task);
    }

    public List<DtoTarefas> getTarefasAutenticado() {
        List<Tarefas> tarefa = repository.findByAdvogado(getAuthenticatedUsername());
        return TarefasMapper.toListDto(tarefa);
    }

    public List<DtoTarefas> findByNome(String nome){

        List<Tarefas> tarefas = repository.findByNome(nome);
        if(tarefas.isEmpty()) {
            throw new RecursoNaoEncontradoException("Tarefa Nao localizada");
        }
        return TarefasMapper.toListDto(tarefas);
    }


    public DtoTarefas findById(String id){

        Tarefas tarefas = repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrada"));

        return TarefasMapper.toDto(tarefas);

    }
}
