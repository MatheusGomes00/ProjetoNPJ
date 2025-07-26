package com.npj.ProjetoNPJ.tarefas.dtos;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DtoTarefas {

    private String id;

    @NotBlank
    private String nomeTarefa;

    @NotBlank
    private String descricao;

    @NotNull
    private boolean status;

    @NotBlank
    private String prioridade;

    @NotNull
    private LocalDateTime prazoLimite;

    private LocalDateTime dataCriacao;

    @NotEmpty
    private List<String> responsaveisId;

    @NotEmpty
    private List<String> responsaveisNome;

    private String finalizadoPor;

    private String advogadoFinalizadorId;

    private String reativadaPor;

    private String criador;

}
