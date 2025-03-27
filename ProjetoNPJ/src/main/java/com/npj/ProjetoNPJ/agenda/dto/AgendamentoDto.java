package com.npj.ProjetoNPJ.agenda.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class AgendamentoDto {

    @NotBlank
    private String nome;

    @NotBlank
    private String cpf;

    @NotBlank
    private String dataAgendamento;

    @NotBlank
    private String casoTipo;

    @NotNull
    private List<String> responsaveis;
}
