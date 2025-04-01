package com.npj.ProjetoNPJ.processos.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "cadastradoProcessos")
public class Processos {

    @Id
    private String id;

    private String situação;

    private String numeroProcesso;

    private String pasta;

    private String tipoAcaoClasse;

    private String requerente;

    private String representanteLegal;

    private String requerido;

    private String npjRepresentando;

    private String vara;

    private String valorCausa;
}
