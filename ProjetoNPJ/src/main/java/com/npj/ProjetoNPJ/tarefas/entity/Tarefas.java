package com.npj.ProjetoNPJ.tarefas.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cadastroTarefas")
public class Tarefas {

    @Id
    private String id;

    private String nomeTarefa;

    private String descricao;

    private boolean status;

    private String prioridade;

    private LocalDateTime prazoLimite;

    private LocalDateTime dataCriacao;

    private Object responsavel;

    private boolean processoRelacionado;


}
