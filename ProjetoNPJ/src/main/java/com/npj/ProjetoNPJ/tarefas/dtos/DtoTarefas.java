package com.npj.ProjetoNPJ.tarefas.dtos;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
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

    @NotBlank
    private String responsavelId;
    @NotBlank
    private String responsavelNome;


    //private boolean processoRelacionado;

}
