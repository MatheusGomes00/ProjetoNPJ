package com.npj.ProjetoNPJ.processos.entity;

import com.npj.ProjetoNPJ.clientes.entitie.Cliente;
import com.npj.ProjetoNPJ.processos.dtos.Situacao;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "cadastradoProcessos")
public class Processos {

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

    private Cliente cliente;

    private List<String> advogadosResponsaveis;
}
