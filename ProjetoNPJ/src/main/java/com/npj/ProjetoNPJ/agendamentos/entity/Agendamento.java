package com.npj.ProjetoNPJ.agendamentos.entity;

import com.npj.ProjetoNPJ.agenda.dto.ResponsavelDto;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
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

    private Instant start;

    private Instant end;

    private String casoTipo;

    private List<ResponsavelDto> responsaveis;


}
