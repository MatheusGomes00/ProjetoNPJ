package com.npj.ProjetoNPJ.agenda.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "agendamento")
public class Agendamento {

    private String id;

    private String nome;

    private String cpf;

    private LocalDateTime dataAgendamento;

    private String casoTipo;
}
