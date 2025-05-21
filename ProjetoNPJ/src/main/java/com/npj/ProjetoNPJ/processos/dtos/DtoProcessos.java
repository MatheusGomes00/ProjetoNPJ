package com.npj.ProjetoNPJ.processos.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DtoProcessos {

    @Id
    private String id;

    private Situacao situacao;

    private String numeroProcesso;

    private String pasta;

    private String tipoAcaoClasse;

    private String requerente;

    private String representanteLegal;

    private String requerido;

    private String npjRepresentando;

    private String vara;

    private String valorCausa;

    private List<ComentariosDto> comentarios;

    @NotEmpty
    private List<String> responsaveisId;

    @NotEmpty
    private List<String> responsaveisNome;

    @NotEmpty
    private List<String> clienteId;

    @NotEmpty
    private List<String> clienteNome;
}
