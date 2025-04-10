package com.npj.ProjetoNPJ.agendamentos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.util.List;

@Getter
@Setter
public class AgendamentoDto {

    @Id
    private String id;

    @NotBlank
    private String nome;

    @NotBlank
    private String cpf;

    @NotBlank
    private String dataAgendamento;

    @NotBlank
    private String casoTipo;

    @NotNull
    private List<String> responsaveisId;
}
