package com.npj.ProjetoNPJ.triagem.entitie;

import org.springframework.data.annotation.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cadastro")
public class Cadastro implements Serializable {

    @Id
    private String id;
    private Boolean status;
    private Cliente cliente;
    private Representante representante;
    private ParteContraria parteContraria;
    private DadosProcessuais dadosProcessuais;
    private Natureza natureza;
    private Responsaveis responsaveis;

}
