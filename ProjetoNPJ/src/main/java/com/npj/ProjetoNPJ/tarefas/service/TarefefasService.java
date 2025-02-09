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
import org.springframework.stereotype.Service;

@Service
public class TarefefasService {

    @Autowired
    private AdvogadoRepository advogadoRepository;

    @Autowired
    private TarefasRepository repository;

    public void insert(DtoTarefas dto) {
        dto.setStatus(true);
        Advogado advogado = advogadoRepository.findById(dto.getResponsavelId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado"));


        if (!advogado.getNome().equals(dto.getResponsavelNome())) {
            throw new IllegalArgumentException("O nome do advogado não corresponde ao ID informado.");
        }


        Tarefas newTask = TarefasMapper.toEntity(dto);
        newTask.setResponsavel(advogado);


        if (newTask.getId() == null) {
            newTask.setId(new ObjectId().toString()); // Garantir que o ID da tarefa seja único
        }

        // Salva a tarefa
        repository.save(newTask); // Use save para evitar problema com insert e chave duplicada

    }
    public String getNomeAdvogadoPorTarefa(String tarefaId) {
        // Buscar a tarefa pelo ID
        Tarefas tarefa = repository.findById(tarefaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Tarefa não encontrada"));

        // Acessar o nome do advogado associado
        String nomeAdvogado = tarefa.getResponsavel().getNome();

        return nomeAdvogado;
    }

    public void update(DtoTarefas dto, String id){

        Tarefas tarefaNova = TarefasMapper.toEntity(dto);

        Tarefas tarefaAntiga = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado."));

        tarefaNova.setId(id);

        updateData(tarefaAntiga, tarefaNova);

        repository.save(tarefaNova);

    }

    public void updateData(Tarefas oldTask, Tarefas newTask) {
        oldTask.setNomeTarefa(newTask.getNomeTarefa());
        oldTask.setDataCriacao(newTask.getDataCriacao());
        oldTask.setDescricao(newTask.getDescricao());
        oldTask.setPrioridade(newTask.getPrioridade());
        oldTask.setPrazoLimite(newTask.getPrazoLimite());
        oldTask.setResponsavel(newTask.getResponsavel());

    }

    public void finalizar(String id){
        Tarefas task = repository.findById(id).orElseThrow(()-> new RecursoNaoEncontradoException("Tarefa não encontrada"));
        task.setStatus(false);
        repository.save(task);
    }


}
