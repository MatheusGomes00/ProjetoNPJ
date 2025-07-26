package com.npj.ProjetoNPJ.tarefas.entity;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "cadastroTarefas")
public class Tarefas {

    @Id
    private String id;

    private String nomeTarefa;

    private String descricao;

    private boolean status;

    private String prioridade;

    private Instant prazoLimite;

    private Instant dataCriacao;

    @DBRef(lazy = false)
    private List<Advogado> responsaveis;

    private String finalizadoPor;

    private String advogadoFinalizadorId;

    private String criador;

    private String reativadoPor;


}
