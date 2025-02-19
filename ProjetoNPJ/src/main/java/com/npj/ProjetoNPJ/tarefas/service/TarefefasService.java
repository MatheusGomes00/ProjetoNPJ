package com.npj.ProjetoNPJ.tarefas.service;

import com.npj.ProjetoNPJ.advogados.dtos.DtoAdvogado;
import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.mapper.AdvogadoMapper;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import com.npj.ProjetoNPJ.tarefas.mapper.TarefasMapper;
import com.npj.ProjetoNPJ.tarefas.repository.TarefasRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class TarefefasService {

    @Autowired
    private AdvogadoRepository advogadoRepository;

    @Autowired
    private TarefasRepository repository;

    public String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername(); // username do usuário autenticado
        } else {
            return principal.toString(); // Caso seja um token simples
        }
    }

    public DtoTarefas insert(DtoTarefas dto) {
        dto.setStatus(true);
        Advogado advogado = advogadoRepository.findById(dto.getResponsavelId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado"));
        if (!advogado.getNome().equals(dto.getResponsavelNome())) {
            throw new IllegalArgumentException("O nome do advogado não corresponde ao ID informado.");
        }
        Tarefas newTask = TarefasMapper.toEntity(dto);
        newTask.setResponsavel(advogado);
        newTask.setCriador(getAuthenticatedUsername());
        repository.save(newTask);
        return TarefasMapper.toDto(newTask);
    }

    public String getNomeAdvogadoPorTarefa(String tarefaId) {

        Tarefas tarefa = repository.findById(tarefaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Tarefa não encontrada"));
        return tarefa.getResponsavel().getNome();
    }

    public void update(DtoTarefas dto, String id){

        Tarefas tarefa = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado."));
        updateData(tarefa, dto);
        repository.save(tarefa);
    }

    public void updateData(Tarefas tarefa, DtoTarefas dto) {
        tarefa.setNomeTarefa(dto.getNomeTarefa());
        tarefa.setDataCriacao(dto.getDataCriacao());
        tarefa.setDescricao(dto.getDescricao());
        tarefa.setPrioridade(dto.getPrioridade());
        tarefa.setPrazoLimite(dto.getPrazoLimite());
    }

    public void finalizar(String id){
        Tarefas task = repository.findById(id).orElseThrow(()-> new RecursoNaoEncontradoException("Tarefa não encontrada"));
        task.setStatus(false);
        repository.save(task);
    }


}
