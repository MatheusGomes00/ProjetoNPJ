package com.npj.ProjetoNPJ.agenda.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ResponseAgendamentoDto {

    private String nome;

    private String cpf;

    private LocalDateTime dataAgendamento;

    private String casoTipo;

    private List<String> responsaveis;
}
