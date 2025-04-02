package com.npj.ProjetoNPJ.agenda.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ResponseAgendamentoDto {

    @Id
    private String id;

    private String nome;

    private String cpf;

    private String dataAgendamento;

    private String casoTipo;

    private List<String> responsaveis;
}
