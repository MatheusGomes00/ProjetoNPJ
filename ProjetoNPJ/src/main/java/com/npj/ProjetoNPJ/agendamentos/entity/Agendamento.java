package com.npj.ProjetoNPJ.agenda.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "agendamento")
public class Agendamento {

    @Id
    private String id;

    private String nome;

    private String cpf;

    private String dataAgendamento;

    private String casoTipo;

    private List<String> responsaveisId;
}
