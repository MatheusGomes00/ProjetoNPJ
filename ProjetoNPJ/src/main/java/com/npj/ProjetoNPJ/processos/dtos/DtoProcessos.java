package com.npj.ProjetoNPJ.processos.dtos;

import lombok.*;
import org.springframework.data.annotation.Id;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DtoProcessos {

    @Id
    private String id;

    private Situacao situação;

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
