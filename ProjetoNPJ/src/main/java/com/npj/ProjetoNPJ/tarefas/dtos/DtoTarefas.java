package com.npj.ProjetoNPJ.tarefas.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DtoTarefas {

    @NotBlank
    private String nomeTarefa;

    @NotBlank
    private String descricao;


    private boolean status;

    @NotBlank
    private String prioridade;


    private LocalDateTime prazoLimite;


    private LocalDateTime dataCriacao;


    //private Object responsavel;


    private boolean processoRelacionado;

}
