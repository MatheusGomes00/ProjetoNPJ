package com.npj.ProjetoNPJ.agendamentos.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ResponseAgendamentoDto {

    private String id;

    private String nome;

    private String cpf;

    private String dataAgendamento;

    private String casoTipo;

    private List<String> responsaveisId;
}
