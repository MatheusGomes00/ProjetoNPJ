package com.npj.ProjetoNPJ.agenda.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class CreateAgendamentoDto {

    @NotBlank
    private String nome;

    @NotBlank
    private String cpf;

    @NotBlank
    private LocalDateTime dataAgendamento;

    @NotBlank
    private String casoTipo;

    @NotBlank
    private List<String> responsaveis;
}
