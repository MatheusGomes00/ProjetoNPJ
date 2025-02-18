package com.npj.ProjetoNPJ.tarefas.dtos;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
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

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate prazoLimite;

    private LocalDate dataCriacao;

    @NotBlank
    private String responsavelId;

    @NotBlank
    private String responsavelNome;

    private String criador;

}
